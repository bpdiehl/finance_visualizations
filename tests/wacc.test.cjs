const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const context = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../src/wacc/model.js"), "utf8"), context);
const M = context.DemoModel;
const near = (actual, expected, tolerance = 1e-12) => assert.ok(Math.abs(actual - expected) <= tolerance, actual + " != " + expected);

test("independently worked starting example: equity 8.4 pp + debt 1.125 pp", () => {
  const r = M.calculateModel(M.DEFAULTS);
  near(r.wacc, 0.09525);
  near(r.equityContribution, 0.084);
  near(r.grossDebtContribution, 0.015);
  near(r.debtContribution, 0.01125);
  near(r.afterTaxDebtRate, 0.0375);
  near(r.taxBenefit, 0.00375);
  near(r.pretaxBlend, 0.099);
  near(r.assetReturn, 0.099);
});

test("all-equity result is independent of borrowing rate and tax", () => {
  for (const debtRate of [0, 0.05, 1]) for (const taxRate of [0, 0.25, 1]) {
    const r = M.calculateModel({ ...M.DEFAULTS, debtWeight: 0, debtRate, taxRate });
    near(r.wacc, 0.12);
    near(r.taxBenefit, 0);
  }
});

test("all-debt endpoint has no equity contribution or division by zero", () => {
  const r = M.calculateModel({ ...M.DEFAULTS, debtWeight: 1 });
  near(r.wacc, 0.0375);
  near(r.equityContribution, 0);
});

test("zero-tax example equals the pretax blend", () => {
  const r = M.calculateModel({ ...M.DEFAULTS, taxRate: 0 });
  near(r.wacc, 0.099);
  near(r.wacc, r.pretaxBlend);
  near(r.taxBenefit, 0);
});

test("60% debt example is 7.05%, not an unweighted average", () => {
  near(M.calculateModel({ ...M.DEFAULTS, debtWeight: 0.6 }).wacc, 0.0705);
});

test("equal component rates create a flat relationship", () => {
  // Debt at 8%, with 25% tax, gives 6% after tax, equal to equity at 6%.
  const r = M.calculateModel({ debtWeight: 0.4, debtRate: 0.08, taxRate: 0.25, equityRate: 0.06 });
  for (const point of r.curve) near(point.wacc, 0.06);
});

test("costly debt can increase WACC as debt share rises", () => {
  const inputs = { debtWeight: 0.2, equityRate: 0.05, debtRate: 0.12, taxRate: 0 };
  near(M.calculateModel(inputs).wacc, 0.064);
  near(M.calculateModel({ ...inputs, debtWeight: 0.6 }).wacc, 0.092);
});

test("mathematical zero/full-tax boundaries remain finite", () => {
  near(M.calculateModel({ ...M.DEFAULTS, equityRate: 0, debtRate: 0 }).wacc, 0);
  near(M.calculateModel({ ...M.DEFAULTS, taxRate: 1 }).wacc, 0.084);
  near(M.calculateModel({ debtWeight: 1, equityRate: 1, debtRate: 1, taxRate: 1 }).wacc, 0);
});

test("invariants across a grid of inputs", () => {
  for (const debtWeight of [0, 0.001, 0.3, 0.6, 0.999, 1]) {
    for (const taxRate of [0, 0.25, 0.9, 1]) {
      const r = M.calculateModel({ ...M.DEFAULTS, debtWeight, taxRate });
      near(r.equityWeight + debtWeight, 1);
      near(r.equityContribution + r.debtContribution, r.wacc);
      near(r.pretaxBlend - r.taxBenefit, r.wacc);
      near(r.assetReturn - r.taxBenefit, r.wacc);
      assert.ok(r.wacc >= Math.min(0.12, r.afterTaxDebtRate) - 1e-12);
      assert.ok(r.wacc <= Math.max(0.12, r.afterTaxDebtRate) + 1e-12);
      assert.ok(r.curve.every(p => Number.isFinite(p.wacc)));
      for (const point of r.curve) {
        near(point.wacc, M.calculateModel({ ...r.inputs, debtWeight: point.debtWeight }).wacc);
      }
    }
  }
});

test("invalid inputs are rejected rather than silently clamped", () => {
  for (const key of Object.keys(M.DEFAULTS)) {
    for (const invalid of [NaN, Infinity, -Infinity, -0.01, 1.01, "", "0.3", null, undefined]) {
      const inputs = { ...M.DEFAULTS, [key]: invalid };
      assert.equal(M.validateInputs(inputs).ok, false);
      assert.ok(M.validateInputs(inputs).errors[key]);
      assert.throws(() => M.calculateModel(inputs), { name: "RangeError" });
    }
  }
  assert.equal(M.validateInputs(null).ok, false);
});

test("saved comparisons name every changed input and do not mutate inputs", () => {
  const a = { ...M.DEFAULTS };
  const b = { ...M.DEFAULTS, debtWeight: 0.6, taxRate: 0 };
  const beforeA = JSON.stringify(a), beforeB = JSON.stringify(b);
  const c = M.compareScenarios(b, a);
  assert.equal(Array.from(c.changed).sort().join(","), "debtWeight,taxRate");
  near(c.delta, -0.01725); // 7.8% versus 9.525%.
  assert.equal(JSON.stringify(a), beforeA);
  assert.equal(JSON.stringify(b), beforeB);
  assert.equal(Object.isFrozen(M.DEFAULTS), true);
});

test("all four presets are valid, distinct and use the same model", () => {
  assert.equal(new Set(M.PRESETS.map(p => p.id)).size, 4);
  const expected = [0.09525, 0.12, 0.099, 0.0705];
  M.PRESETS.forEach((p, i) => near(M.calculateModel(p.inputs).wacc, expected[i]));
});

test("course r_A is the pretax blend; tax changes the adjustment, not that blend", () => {
  const noTax = M.calculateModel({ ...M.DEFAULTS, taxRate: 0 });
  const taxed = M.calculateModel({ ...M.DEFAULTS, taxRate: 0.4 });
  near(noTax.assetReturn, 0.099);
  near(taxed.assetReturn, 0.099);
  near(taxed.taxBenefit, 0.006);
  near(taxed.wacc, 0.093);
  near(noTax.wacc, noTax.assetReturn);
});

test("pretax asset blend follows the weights in this fixed-component-rate lab", () => {
  near(M.calculateModel({ ...M.DEFAULTS, debtWeight: 0 }).assetReturn, 0.12);
  near(M.calculateModel({ ...M.DEFAULTS, debtWeight: 0.6 }).assetReturn, 0.078);
  near(M.calculateModel({ ...M.DEFAULTS, debtWeight: 1 }).assetReturn, 0.05);
});
