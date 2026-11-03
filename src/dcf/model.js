/* Deterministic unlevered DCF. Money: USD millions; rates: fractions/year. */
(() => {
  "use strict";
  const DEFAULTS = Object.freeze({
    revenue: 1000, salesGrowth: .06, margin: .18, tax: .25,
    depreciation: .03, capex: .05, workingCapital: .15,
    discountRate: .10, terminalGrowth: .02, terminalReturn: .12,
    years: 5, cash: 50, debt: 300, shares: 100
  });
  const PRESETS = Object.freeze([
    Object.freeze({ name: "Stable business", inputs: DEFAULTS }),
    Object.freeze({ name: "Faster growth", inputs: Object.freeze({ ...DEFAULTS, salesGrowth: .12, margin: .22, capex: .08, workingCapital: .20, discountRate: .12, terminalGrowth: .03, terminalReturn: .15 }) }),
    Object.freeze({ name: "Working-capital heavy", inputs: Object.freeze({ ...DEFAULTS, salesGrowth: .12, margin: .12, capex: .07, workingCapital: .40 }) }),
    Object.freeze({ name: "Near r = g", inputs: Object.freeze({ ...DEFAULTS, discountRate: .06, terminalGrowth: .05 }) })
  ]);
  const RULES = Object.freeze({
    revenue: [.01, 100000, "Base revenue R₀", "$ million"],
    salesGrowth: [-.20, .30, "Sales growth s", "per year"],
    margin: [-.20, .50, "Operating margin m", "of revenue"],
    tax: [0, .60, "Tax rate T", "of operating profit"],
    depreciation: [0, .20, "Depreciation d", "of revenue"],
    capex: [0, .40, "Capital expenditures c", "of revenue"],
    workingCapital: [0, .80, "Operating working capital w", "of revenue"],
    discountRate: [.001, .30, "WACC r", "per year"],
    terminalGrowth: [-.05, .10, "Terminal growth g", "per year"],
    terminalReturn: [.01, .50, "Terminal ROIC q", "per year"],
    years: [1, 10, "Forecast length N", "whole years"],
    cash: [0, 100000, "Excess cash C", "$ million"],
    debt: [0, 100000, "Debt and other claims D", "$ million"],
    shares: [.01, 100000, "Diluted shares S", "million shares"]
  });
  const RATE_KEYS = Object.freeze(Object.keys(DEFAULTS).filter(k => !["revenue", "years", "cash", "debt", "shares"].includes(k)));
  function validateInputs(raw) {
    const inputs = {}, errors = {};
    for (const [key, [lo, hi, label, units]] of Object.entries(RULES)) {
      const v = raw && raw[key], rate = RATE_KEYS.includes(key);
      if (typeof v !== "number" || !Number.isFinite(v) || v < lo || v > hi || (key === "years" && !Number.isInteger(v)))
        errors[key] = `${label} must be ${rate ? (lo * 100).toFixed(2) + "%–" + (hi * 100).toFixed(2) + "%" : lo + "–" + hi} ${units}.`;
      else inputs[key] = v;
    }
    return { ok: !Object.keys(errors).length, inputs, errors };
  }
  function project(inputs) {
    const forecast = [];
    let revenue = inputs.revenue, nwc = revenue * inputs.workingCapital;
    for (let year = 1; year <= inputs.years; year++) {
      revenue *= 1 + inputs.salesGrowth;
      const ebit = revenue * inputs.margin;
      // Illustrative immediate symmetric tax treatment; losses get the same
      // modeled tax benefit. This is disclosed, not a tax-loss schedule.
      const nopat = ebit * (1 - inputs.tax), depreciation = revenue * inputs.depreciation;
      const capex = revenue * inputs.capex, nextNwc = revenue * inputs.workingCapital;
      const deltaNwc = nextNwc - nwc, fcf = nopat + depreciation - capex - deltaNwc;
      // Statement presentation: costs are implied by the forecast EBIT margin.
      const operatingCosts = revenue - ebit - depreciation, taxes = ebit - nopat;
      forecast.push({ year, revenue, operatingCosts, ebit, taxes, nopat, depreciation, capex, nwc: nextNwc, deltaNwc, fcf });
      nwc = nextNwc;
    }
    return forecast;
  }
  function valueCashFlows(cashFlows, terminalNext, rate, growth) {
    if (!Array.isArray(cashFlows) || !cashFlows.length || cashFlows.length > 50 || cashFlows.some(x => typeof x !== "number" || !Number.isFinite(x)) || !Number.isFinite(terminalNext) || !Number.isFinite(rate) || rate <= -1 || !Number.isFinite(growth) || growth <= -1)
      throw new RangeError("Use finite annual cash flows, rate > −100%, and growth > −100%.");
    const presentValues = cashFlows.map((cf, i) => cf / (1 + rate) ** (i + 1));
    const forecastPv = presentValues.reduce((s, v) => s + v, 0);
    const terminalValue = rate > growth ? terminalNext / (rate - growth) : null;
    const terminalPv = terminalValue === null ? null : terminalValue / (1 + rate) ** cashFlows.length;
    return { presentValues, forecastPv, terminalValue, terminalPv, operatingValue: terminalPv === null ? null : forecastPv + terminalPv };
  }
  function value(inputs, forecast) {
    const last = forecast.at(-1), terminalRevenue = last.revenue * (1 + inputs.terminalGrowth);
    const terminalNopat = terminalRevenue * inputs.margin * (1 - inputs.tax);
    const reinvestmentRate = inputs.terminalGrowth / inputs.terminalReturn;
    const terminalReinvestment = terminalNopat * reinvestmentRate;
    const terminalNext = terminalNopat - terminalReinvestment;
    const priced = valueCashFlows(forecast.map(f => f.fcf), terminalNext, inputs.discountRate, inputs.terminalGrowth);
    let issue = inputs.discountRate <= inputs.terminalGrowth ? "Perpetual growth requires WACC r to be greater than terminal growth g." : null;
    if (terminalNopat <= 0) issue = "This terminal ROIC model requires positive, stable after-tax operating profit. Forecast cash flows are still shown.";
    if (issue) { priced.terminalValue = null; priced.terminalPv = null; priced.operatingValue = null; }
    const equity = priced.operatingValue === null ? null : priced.operatingValue + inputs.cash - inputs.debt;
    const price = equity === null || equity < 0 ? null : equity / inputs.shares;
    const terminalShare = priced.operatingValue > 0 && priced.forecastPv >= 0 && priced.terminalPv >= 0 ? priced.terminalPv / priced.operatingValue : null;
    const warnings = [];
    if (forecast.some(f => f.fcf < 0)) warnings.push("Some forecast cash flows are negative: operations require funding in those years.");
    if (terminalNext < 0 && terminalNopat > 0) warnings.push("Terminal reinvestment exceeds profit; the modeled perpetuity consumes cash.");
    if (equity !== null && equity < 0) warnings.push("Claims exceed the modeled asset value. The negative equity bridge is a shortfall; this model cannot estimate a share price in this case.");
    if (!issue && inputs.discountRate - inputs.terminalGrowth <= .01 + 1e-12) warnings.push("Small r − g gap: terminal value is especially sensitive to these assumptions.");
    return { ...priced, terminalRevenue, terminalNopat, reinvestmentRate, terminalReinvestment, terminalNext, equity, price, terminalShare, issue, warnings };
  }
  function calculateModel(raw) {
    const checked = validateInputs(raw);
    if (!checked.ok) throw new RangeError(Object.values(checked.errors).join(" "));
    const inputs = checked.inputs, forecast = project(inputs), result = value(inputs, forecast);
    forecast.forEach((row, i) => { row.pv = result.presentValues[i]; row.discountFactor = 1 / (1 + inputs.discountRate) ** row.year; });
    // Axes are centered on the current rates in 0.50 percentage-point steps.
    // The same valuation function prices every cell; no alternative formulas.
    const rates = Array.from({ length: 5 }, (_, i) => inputs.discountRate + (i - 2) * .005);
    const growths = Array.from({ length: 5 }, (_, i) => inputs.terminalGrowth + (i - 2) * .005);
    const sensitivity = rates.map(r => growths.map(g => {
      if (r < RULES.discountRate[0] - 1e-12 || r > RULES.discountRate[1] + 1e-12 || g < RULES.terminalGrowth[0] - 1e-12 || g > RULES.terminalGrowth[1] + 1e-12)
        return { rate: r, growth: g, operatingValue: null, issue: "Outside the model's input range." };
      const v = value({ ...inputs, discountRate: r, terminalGrowth: g }, forecast);
      return { rate: r, growth: g, operatingValue: v.operatingValue, issue: v.issue };
    }));
    const bridge = result.equity === null ? [] : [
      { label: "Operations", symbol: "Vₒₚ", start: 0, end: result.operatingValue, amount: result.operatingValue, type: "total" },
      { label: "Excess cash", symbol: "C", start: result.operatingValue, end: result.operatingValue + inputs.cash, amount: inputs.cash, type: "add" },
      { label: "Claims", symbol: "D", start: result.operatingValue + inputs.cash, end: result.equity, amount: -inputs.debt, type: "subtract" },
      { label: "Equity", symbol: "E", start: 0, end: result.equity, amount: result.equity, type: "total" }
    ];
    return { inputs, forecast, ...result, sensitivity, rates, growths, bridge };
  }
  globalThis.DemoModel = Object.freeze({ DEFAULTS, PRESETS, RULES, RATE_KEYS, validateInputs, calculateModel, valueCashFlows });
})();
