const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/dcf/model.js'), 'utf8'), ctx);
const M = ctx.DemoModel;
const calc = (changes = {}) => M.calculateModel({ ...M.DEFAULTS, ...changes });
const close = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) <= tolerance, `${a} vs ${b}, tolerance ${tolerance}`);
const plain = x => JSON.parse(JSON.stringify(x));

test('default forecast matches independent Decimal calculations', () => {
  const m = calc();
  const expected = [
    [1060, 143.1, 9, 112.9, 102.63636363636364],
    [1123.6, 151.686, 9.54, 119.674, 98.90413223140496],
    [1191.016, 160.78716, 10.1124, 126.85444, 95.30761833208114],
    [1262.47696, 170.4343896, 10.719144, 134.4657064, 91.8418867563691],
    [1338.2255776, 180.660452976, 11.36229264, 142.533648784, 88.50218178341022]
  ];
  close(m.forecast[0].operatingCosts, 837.4); close(m.forecast[0].taxes, 47.7);
  expected.forEach(([r, np, wc, cf, pv], i) => {
    const f = m.forecast[i]; close(f.revenue, r); close(f.nopat, np); close(f.deltaNwc, wc); close(f.fcf, cf); close(f.pv, pv);
  });
});
test('terminal next-year growth and reinvestment match independent example', () => {
  const m = calc(); close(m.terminalNopat, 184.27366203552); close(m.reinvestmentRate, 1 / 6);
  close(m.terminalNext, 153.5613850296); close(m.terminalValue, 1919.51731287);
  close(m.terminalPv, 1191.8692295421947); close(m.forecastPv, 477.1921827396291);
  close(m.operatingValue, 1669.0614122818238); close(m.equity, 1419.0614122818238); close(m.price, 14.190614122818238);
});
test('100 at t=1 growing 2% forever is 1250 at a 10% rate', () => {
  for (const years of [1, 5, 10]) {
    const flows = Array.from({ length: years }, (_, i) => 100 * 1.02 ** i);
    const m = M.valueCashFlows(flows, 100 * 1.02 ** years, .10, .02);
    close(m.operatingValue, 1250);
  }
});
test('terminal is discounted exactly N periods, not N+1', () => {
  const m = M.valueCashFlows([0, 0, 0, 0, 0], 100, .10, .02);
  close(m.terminalValue, 1250); close(m.terminalPv, 776.1516538239436);
  assert.ok(Math.abs(m.terminalPv - 705.5924125672214) > 70);
});
test('zero-growth stable operating model is horizon invariant', () => {
  for (const years of [1, 3, 10]) {
    const m = calc({ revenue: 1000, salesGrowth: 0, margin: .2, tax: 0, depreciation: 0, capex: 0, workingCapital: 0, terminalGrowth: 0, years });
    close(m.operatingValue, 2000);
  }
});
test('consistent forecast and terminal reinvestment make a growing business horizon invariant', () => {
  for (const years of [1, 3, 10]) {
    const m = calc({ revenue: 1000, salesGrowth: .02, margin: .12, tax: 0, depreciation: 0, capex: .02, workingCapital: 0, terminalGrowth: .02, terminalReturn: .12, years });
    close(m.operatingValue, 1275);
  }
});
test('base working capital is present before year 1; subtract only its change', () => {
  const m = calc(); close(m.forecast[0].nwc, 159); close(m.forecast[0].deltaNwc, 9);
  const shrink = calc({ salesGrowth: -.10 }); close(shrink.forecast[0].deltaNwc, -15);
});
test('working-capital-heavy growth can lower first-year FCF', () => {
  const p = { margin: .10, tax: .25, depreciation: .03, capex: .07, workingCapital: .80 };
  close(calc({ ...p, salesGrowth: 0 }).forecast[0].fcf, 35);
  close(calc({ ...p, salesGrowth: .20 }).forecast[0].fcf, -118);
});
test('debt changes equity dollar for dollar; operating value and forecast do not change', () => {
  const a = calc(), b = calc({ debt: 400 });
  close(b.equity, a.equity - 100); close(b.price, a.price - 1); close(b.operatingValue, a.operatingValue);
  assert.deepEqual(plain(a.forecast), plain(b.forecast));
});
test('excess cash belongs in equity, never operating FCF', () => {
  const a = calc(), b = calc({ cash: 150 });
  close(b.equity, a.equity + 100); close(b.price, a.price + 1); close(b.operatingValue, a.operatingValue);
  assert.deepEqual(plain(a.forecast), plain(b.forecast));
});
test('shares dilute per-share value, not aggregate equity or operations', () => {
  const a = calc(), b = calc({ shares: 200 }); close(b.price, a.price / 2); close(b.equity, a.equity); close(b.operatingValue, a.operatingValue);
});
test('r <= g suppresses perpetuity and equity values while retaining forecast PV', () => {
  for (const discountRate of [.02, .01]) {
    const m = calc({ discountRate }); assert.match(m.issue, /greater/);
    for (const k of ['terminalValue','terminalPv','operatingValue','equity','price']) assert.equal(m[k], null);
    assert.ok(Number.isFinite(m.forecastPv)); assert.equal(m.forecast.length, 5);
  }
});
test('one-basis-point positive spread remains finite and is not silently clamped', () => {
  const m = calc({ discountRate: .0201 }); assert.equal(m.issue, null); assert.ok(m.operatingValue > 1000000);
});
test('nonpositive stable profit is unsupported, but negative forecast cash flow is visible', () => {
  const m = calc({ margin: -.1 }); assert.match(m.issue, /positive/); assert.equal(m.operatingValue, null);
  assert.ok(m.forecast.every(f => f.fcf < 0)); assert.ok(m.warnings.length > 0);
});
test('cash-consuming terminal reinvestment is signed and warned, not silently set to zero', () => {
  const m = calc({ terminalReturn: .01 }); assert.ok(m.terminalNext < 0); assert.ok(m.terminalValue < 0);
  assert.equal(m.issue, null); assert.ok(m.warnings.some(x => /reinvestment/.test(x)));
});
test('negative equity is reported as a shortfall, without a negative share-price estimate', () => {
  const m = calc({ debt: 10000 }); assert.ok(m.equity < 0); assert.equal(m.price, null);
  assert.ok(m.warnings.some(x => /shortfall/.test(x))); close(m.bridge.at(-1).end, m.equity);
});
test('invalid inputs, including zero shares and non-integer years, are rejected', () => {
  for (const [key, v] of [['shares',0],['shares',-1],['revenue',NaN],['margin',Infinity],['discountRate',0],['terminalGrowth',-.06],['years',1.5],['tax',.61],['debt',-1],['salesGrowth','0.06']])
    assert.throws(() => calc({ [key]: v }), /must be/);
});
test('sensitivity center and every valid cell use the same valuation as main inputs', () => {
  const m = calc(); close(m.sensitivity[2][2].operatingValue, m.operatingValue);
  for (const row of m.sensitivity) for (const cell of row) {
    const independent = calc({ discountRate: cell.rate, terminalGrowth: cell.growth });
    if (independent.operatingValue === null) assert.equal(cell.operatingValue, null); else close(cell.operatingValue, independent.operatingValue);
  }
});
test('sensitivity masks invalid r/g and out-of-range cells instead of inventing values', () => {
  const m = calc({ discountRate: .001, terminalGrowth: 0 });
  assert.ok(m.sensitivity.flat().some(c => /Outside/.test(c.issue || '')));
  assert.ok(m.sensitivity.flat().some(c => /greater/.test(c.issue || '')));
  assert.ok(m.sensitivity.flat().filter(c => c.issue).every(c => c.operatingValue === null));
});
test('raising WACC lowers a positive-cash-flow business value', () => {
  assert.ok(calc({ discountRate: .11 }).operatingValue < calc({ discountRate: .09 }).operatingValue);
});
test('growth can reduce value when terminal reinvestment earns a low return', () => {
  assert.ok(calc({ terminalReturn: .05, terminalGrowth: .02 }).operatingValue < calc({ terminalReturn: .05, terminalGrowth: .01 }).operatingValue);
});
test('currency scaling preserves price if amounts and share counts scale together', () => {
  const a = calc(), b = calc({ revenue: 2000, cash: 100, debt: 600, shares: 200 });
  close(b.operatingValue, 2 * a.operatingValue); close(b.equity, 2 * a.equity); close(b.price, a.price);
});
test('terminal contribution decomposition and signed bridge conserve value', () => {
  for (const preset of M.PRESETS) {
    const m = M.calculateModel(preset.inputs);
    close(m.forecastPv + m.terminalPv, m.operatingValue);
    close(m.terminalShare, m.terminalPv / m.operatingValue);
    close(m.bridge[0].end + m.bridge[1].amount + m.bridge[2].amount, m.bridge[3].end);
  }
});
test('direct cash-flow helper validates inputs and preserves signed cash flows', () => {
  close(M.valueCashFlows([-100, 110], 0, .1, 0).forecastPv, 0);
  for (const args of [[[],100,.1,.02],[[1,NaN],100,.1,.02],[[1],100,-1,.02],[[1],Infinity,.1,.02]])
    assert.throws(() => M.valueCashFlows(...args));
});
