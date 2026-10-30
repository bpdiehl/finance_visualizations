# F7 — Financial Performance & DuPont

Status: planned. Catalog slug: performance. Recommended build wave: 3.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## F7 — Financial Performance, DuPont & Leverage

**One-sentence promise:** “Separate the reasons a company earns a high return on equity: margin, asset productivity and leverage.”

**Class anchors:** 10.8 Evaluating Firm Performance lecture notes: income statement, balance sheet, ROE, ROA and highlighted DuPont-style product of net margin, asset turnover and leverage. 10.6 financial statement notes offer adjacent balance sheet context.

**Learning outcomes:** Distinguish profit in dollars from return on a capital base; calculate margin, turnover, ROA and ROE consistently; understand why leverage can raise ROE *and* financial risk; understand that attractive accounting ratios do not automatically show cash-flow value creation.

**Primary view:** Clickable three-factor **DuPont tree** with a large ROE number at the top. Each component has a small driver gauge, and clicking reveals numerator/denominator relationships. A second view has a stylized balance sheet, showing assets supported by debt and equity.

**Controls:** Revenue, net income (or net profit margin), average assets, average equity (or debt/assets under consistent accounting assumptions), optional simple financing cost/interest in an extension. Do not allow a leverage slider to change denominator only and imply that net income always remains fixed without labeling the simplification.

**Core formulas:**

```
Net profit margin = Net income / Sales
Asset turnover = Sales / Average assets
Equity multiplier = Average assets / Average common equity
ROA (simple) = Net income / Average assets
ROE = Net income / Average common equity
ROE = Net profit margin × Asset turnover × Equity multiplier
```

The three-factor identity is exact if numerators/denominators use the same definitions and periods. Explain that other ROA definitions (e.g., NOPAT/assets) exist; this simple mode uses net-income ROA. Equity and assets should be measured consistently (averages preferred for flows over periods), and dividends or recapitalizations cannot be ignored in an advanced balance-sheet simulation.

**Tooltips:**
- **ROE:** “Net income earned relative to owners' invested accounting equity during the period. A high ROE can reflect strong operating results, high leverage, or both.”
- **Net profit margin:** “Net income for each dollar of sales. It measures how much accounting profit remains from revenue.”
- **Asset turnover:** “Sales generated for each dollar of assets. Higher turnover means the business is using its asset base more intensively to generate revenue.”
- **Equity multiplier:** “Assets relative to common shareholders' equity. It measures the accounting leverage contribution to ROE.”
- **ROA:** “Accounting income relative to the assets used by the company. A return ratio needs a clearly specified numerator, asset measure and time period.”

**Presets:** High margin/low turnover, low margin/high turnover, same ROA with different leverage, low earnings with artificially high leverage.

**Tests:** Net income=10, sales=100, average assets=50, average equity=25 → net margin=.10, turnover=2, multiplier=2, ROE=.40, ROA=.20. The three factors multiplied must always equal direct ROE (within floating-point tolerance). Handle zero equity/assets denominator with “undefined” rather than divide-by-zero artifacts.

**Out of scope:** Full IFRS/GAAP accounting engine, bank-specific regulatory ratios, causal claims about ROE without income/leverage risk modeling.
