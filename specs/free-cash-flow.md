# F4 — Accounting to Free Cash Flow

Status: owner-approved release v0.2. Catalog slug: free-cash-flow. Recommended build wave: 2.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## F4 — Accounting to Free Cash Flow

**One-sentence promise:** “Follow reported operating profit through the adjustments required to estimate cash that investors can actually receive.”

**Class anchors:** `14-Discounted Cash Flows.pdf`: lecture slides 5–8 explain profit vs cash and the FCF reconciliation; slides 12–20 emphasize depreciation, CapEx, book value/salvage and operating working capital; slides 21–26 emphasize interest, incremental cash flows, sunk costs/opportunity costs and overhead; 10.6 financial statement notes introduce WACC/financial statement context. This demo intentionally focuses on the substance of those slides rather than a generic accounting trivia quiz.

**Learning outcomes:** Connect EBIT to NOPAT and FCF; understand why depreciation is added back but changes taxes; subtract CapEx and changes in *operating* working capital; handle incremental versus sunk costs, opportunity costs and after-tax salvage; avoid double-counting the interest tax shield.

**Primary view:** An expandable **operating income → free cash flow waterfall** with an adjacent real cash-event timeline. Highlight when accounting depreciation appears versus when equipment is purchased/sold. An alternate view is a small 3–5-year project table where all cells are calculated from assumptions.

**Inputs:** Sales, cash operating expenses, depreciation, corporate tax rate, CapEx, accounts receivable, inventory, required operating cash, accounts payable and accrued operating liabilities (or direct `ΔNWC`); initial project investment, expected salvage price and book value at sale, time; optional incremental revenue/cannibalization and opportunity-cost toggles.

**Core rules:**

```
EBIT = Revenue − cash operating costs − depreciation
NOPAT = EBIT × (1 − tax_rate)                  [simplified tax assumption]
Unlevered FCF = NOPAT + depreciation − CapEx − increase in operating NWC
Increase in operating NWC = NWC_t − NWC_(t−1)
After-tax salvage = sale proceeds − tax_rate × (sale proceeds − tax book value)
Incremental CF = cash flows WITH project − cash flows WITHOUT project
```

Clarify the tax treatment when EBIT is negative: simple mode may use immediate use of tax losses; if not, avoid computing a phantom refund and disclose the treatment. Omit interest from unlevered FCF. If using excess cash, nonoperating financial assets and debt, keep these as separate valuation adjustments in F5.

**Tooltips:**
- **EBIT:** “Operating earnings before financing interest and taxes. Starting here helps us evaluate operations before deciding how the company is funded.”
- **Depreciation:** “An accounting expense allocating an earlier asset purchase across years. It reduces taxable income but isn't itself a current cash payment; add it back after computing after-tax operating earnings.”
- **Capital expenditure (CapEx):** “Cash spent on fixed assets. It reduces free cash flow in the period money is spent even if accounting depreciation occurs in later periods.”
- **Operating net working capital:** “Operating current assets tied up in the business minus operating current liabilities. More receivables or inventory generally ties up cash; more operating payables generally release cash. Separate excess cash and interest-bearing debt.”
- **Tax shield:** “A deduction reduces taxable income. In this unlevered FCF method, operating taxes exclude interest deductions because the standard WACC handles the financing tax shield.”
- **After-tax salvage:** “Cash received from selling an asset after taxes on the difference between sale price and remaining tax book value; tax relief on a loss depends on whether it can be used.”
- **Sunk versus incremental:** “A cost already incurred and unchanged by the decision is sunk. Include cash flows that would actually change *because* the project goes ahead, including side effects and foregone alternatives.”

**Presets:** Equipment purchase/depreciation versus actual cash flow; inventory growth reducing FCF; capex-heavy growth despite positive operating income; sale above/below book value; one project with cannibalization and sunk cost toggle.

**Tests:** EBIT=100, T=.25, depreciation=20, CapEx=30, ΔNWC=10 → FCF=55. Sell for $400 with book value $200 and T=.20 → after-tax salvage $360; sell for $100 with same BV/T, under immediate loss-shield assumption → $120. A pure depreciation change, holding other assumptions constant, affects FCF through taxes rather than appearing as an out-of-pocket cash expense. Historical sunk expense that does not change across project alternatives produces zero incremental FCF.

**Out of scope:** Full GAAP financial statement restatement, detailed deferred-tax schedules, tax-loss carryforwards and complex working-capital forecasts.


## Implemented pilot — November 6, 2026

Single-period modified operating statement and NI-to-FCF waterfall. Original defaults: revenue300, cash operating costs180, D&A20, τ25%, CapEx30, opening operating NWC100, closing110 → EBIT100, NOPAT75, FCF55. Immediate use of operating tax losses is an explicit simplification, shown when losses occur. Main assumptions have exact fields/sliders; NWC balances are in a disclosure below them and visually separated in the statement. Linked key and governing equations remain visible.

Deferred: component-level NWC, cash-event/multiyear timeline, salvage, incremental/sunk/opportunity-cost cases. Owner approved publication on November 6, 2026. See verification/free-cash-flow.md.

Owner refinement: primary EBIT equation and statement start from NI + I + T, with reported tax expense T distinct from operating rate τ. NI/reported taxes are derived from the existing operating inputs and editable interest expense (Income statement detail). NOPAT uses pre-interest operating taxes; interest changes NI but not unlevered FCF. Each symbolic equation has its numerical substitution immediately below it.

The final waterfall includes NI, interest, reported tax, EBIT, operating tax, NOPAT, D&A, CapEx, ΔNWC and FCF. Totals are visually distinct from adjustments; a full-width plot preserves readable labels and scrolls within its panel on narrow screens.
