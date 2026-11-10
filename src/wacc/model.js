/* Pure calculations. Inputs are decimal fractions; no DOM or display rounding. */
(() => {
  "use strict";
  const DEFAULTS = Object.freeze({
    debtWeight: 0.30, equityRate: 0.12, debtRate: 0.05, taxRate: 0.25
  });
  const LABELS = Object.freeze({
    debtWeight: "Debt share", equityRate: "Cost of equity",
    debtRate: "Cost of debt", taxRate: "Corporate tax rate"
  });
  const PRESETS = Object.freeze([
    Object.freeze({ id: "baseline", name: "Starting example", inputs: DEFAULTS }),
    Object.freeze({ id: "all-equity", name: "All equity", inputs: Object.freeze({ ...DEFAULTS, debtWeight: 0 }) }),
    Object.freeze({ id: "no-tax", name: "No tax shield", inputs: Object.freeze({ ...DEFAULTS, taxRate: 0 }) }),
    Object.freeze({ id: "more-debt", name: "More debt, same rates", inputs: Object.freeze({ ...DEFAULTS, debtWeight: 0.60 }) })
  ]);

  function validateInputs(raw) {
    const inputs = {}, errors = {};
    for (const key of Object.keys(DEFAULTS)) {
      const value = raw && raw[key];
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
        errors[key] = LABELS[key] + " must be a number from 0% to 100%.";
      } else inputs[key] = value;
    }
    return { ok: Object.keys(errors).length === 0, inputs, errors };
  }

  function metrics(inputs) {
    const { debtWeight, equityRate, debtRate, taxRate } = inputs;
    const equityWeight = 1 - debtWeight;
    const afterTaxDebtRate = debtRate * (1 - taxRate);
    const equityContribution = equityWeight * equityRate;
    const debtContribution = debtWeight * afterTaxDebtRate;
    const grossDebtContribution = debtWeight * debtRate;
    const taxBenefit = grossDebtContribution * taxRate;
    // Course notation: the pretax weighted-provider return, not an estimate
    // of a leverage-invariant unlevered business cost of capital.
    const assetReturn = equityContribution + grossDebtContribution;
    return {
      equityWeight, afterTaxDebtRate, equityContribution, debtContribution,
      grossDebtContribution, taxBenefit,
      assetReturn, pretaxBlend: assetReturn,
      wacc: equityContribution + debtContribution
    };
  }

  function calculateModel(raw) {
    const checked = validateInputs(raw);
    if (!checked.ok) throw new RangeError(Object.values(checked.errors).join(" "));
    const inputs = checked.inputs;
    return {
      inputs, ...metrics(inputs),
      // Every plotted point uses the same calculation as the main result.
      curve: Array.from({ length: 21 }, (_, index) => {
        const debtWeight = index / 20;
        return { debtWeight, wacc: metrics({ ...inputs, debtWeight }).wacc };
      })
    };
  }

  function compareScenarios(currentRaw, baselineRaw) {
    const current = calculateModel(currentRaw);
    const baseline = calculateModel(baselineRaw);
    return {
      delta: current.wacc - baseline.wacc,
      changed: Object.keys(DEFAULTS).filter(key => current.inputs[key] !== baseline.inputs[key]),
      current, baseline
    };
  }

  // An explicit illustrative risk-allocation schedule, not an empirical estimate
  // or a corporate-tax capital-structure equilibrium model.
  const LEVERAGE_DEFAULTS = Object.freeze({ debtWeight: .4, assetRate: .10,
    riskFreeRate: .04, taxRate: .25, sensitivity: .5 });
  function validateLeverage(raw) {
    const limits = { debtWeight: .9, assetRate: .3, riskFreeRate: .3, taxRate: 1, sensitivity: 1 };
    const errors = {};
    for (const [key, max] of Object.entries(limits)) {
      if (!raw || typeof raw[key] !== 'number' || !Number.isFinite(raw[key]) || raw[key] < 0 || raw[key] > max)
        errors[key] = ({ debtWeight: 'Debt share must be between 0% and 90%.', assetRate: 'Fixed asset return must be between 0% and 30% per year.', riskFreeRate: 'Risk-free rate must be between 0% and 30% per year.', taxRate: 'Corporate tax rate must be between 0% and 100%.', sensitivity: 'Debt risk sensitivity λ must be between 0 and 1.' })[key];
    }
    if (raw && raw.riskFreeRate > raw.assetRate) errors.riskFreeRate = 'Risk-free rate must not exceed the fixed asset return.';
    return { ok: !Object.keys(errors).length, errors };
  }
  function leveragePoint(raw, debtWeight) {
    const { assetRate, riskFreeRate, sensitivity, taxRate } = raw;
    const debtRate = riskFreeRate + sensitivity * debtWeight * (assetRate - riskFreeRate);
    const equityRate = (assetRate - debtWeight * debtRate) / (1 - debtWeight);
    return { debtWeight, equityWeight: 1-debtWeight, debtRate, equityRate,
      assetReturn: assetRate, taxBenefit: debtWeight * debtRate * taxRate,
      wacc: assetRate - debtWeight * debtRate * taxRate };
  }
  function calculateLeverage(raw) {
    const checked = validateLeverage(raw);
    if (!checked.ok) throw new RangeError(Object.values(checked.errors).join(' '));
    return { inputs: { ...raw }, ...leveragePoint(raw, raw.debtWeight),
      curve: Array.from({ length: 91 }, (_, i) => leveragePoint(raw, i / 100)) };
  }

  globalThis.DemoModel = Object.freeze({
    DEFAULTS, LABELS, PRESETS, validateInputs, calculateModel, compareScenarios,
    LEVERAGE_DEFAULTS, validateLeverage, calculateLeverage
  });
})();
