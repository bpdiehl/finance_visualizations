# F3 — WACC & Capital Structure

Status: owner-approved release v0.3.2, November 6, 2026. Catalog slug: wacc. Recommended build wave: 1.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. The WACC, financial-statements and Heinz personal course-note PDFs were visually reviewed for this pilot on 2026-10-30. They support the financing-weight, tax-shield and financing-risk framing. No source images, direct faculty quotes or company case data are distributed. All pilot inputs are illustrative. See verification/wacc.md (from the repository root) for actual test results and limits.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## F3 — WACC & Capital Structure

**One-sentence promise:** “Trace how the costs of equity, debt, taxes and financing weights combine into a discount rate.”

**Class anchors:** 10.1 WACC notes illustrate the lender/shareholder funding structure and weighted return; 10.6 financial statements develops the after-tax debt term and firm financing inputs; 10.13 Heinz discusses how leverage and required returns can change. The DCF lecture clarifies why the interest tax shield is recognized through WACC when valuing unlevered cash flows.

**Learning outcomes:** Compute WACC using **market-value** proportions; distinguish the cost of debt from after-tax debt cost; understand why equity generally requires a higher return; learn that changing leverage can also change equity/debt risk and cannot be assumed to lower WACC indefinitely.

**Primary view:** Interactive capital structure rectangle divided between debt and equity by **market value**. A formula strip updates weighted contributions and a bar shows gross versus after-tax debt cost. A WACC-versus-debt-weight line is shown in advanced mode.

**Controls:** Total financing value or separate market debt/equity values; cost of debt `rd`; cost of equity `re`; marginal corporate tax rate `T`; optional beta/CAPM cost-of-equity builder; model mode (A fixed component costs, B risk-adjusted stylized leverage illustration).

**Core formula:** `WACC = (E/(D+E))re + (D/(D+E))rd(1−T)` where D and E are **market values** and the financing assumptions are consistent with the intended use. If financed by preferred shares, exclude from MVP or include as separately priced component with explicit weights.

**Two carefully labeled modes:**
1. **Introductory calculator:** Fixed component borrowing and equity returns. Changing debt percentage changes weights mechanically. State that component rates are held fixed **for teaching** and this is not an optimization recommendation.
2. **Capital structure tradeoff:** Illustrative schedules showing debt/equity rates adjusting as leverage increases, with adjustable assumptions and clear caution that the curves are hypothetical. Avoid pretending the optimum capital structure can be known from a single universal function.

**Tooltips:**
- **WACC:** “The weighted-average return required by all capital providers, after the usual corporate tax adjustment on debt. It is commonly used to discount unlevered firm cash flows of similar risk.”
- **Cost of equity:** “The return shareholders require for taking residual ownership risk. It is an opportunity cost, even though the company doesn't make a fixed coupon payment to shareholders.”
- **Cost of debt:** “The marginal rate lenders require on the company's borrowing under current risk and terms. For valuation, the tax-adjusted contribution may be lower because interest is typically deductible.”
- **Debt tax shield:** “Interest deductibility can reduce corporate taxes. In the standard unlevered-FCF/WACC method, the benefit is recognized in the after-tax debt term so it is not double-counted in operating FCF.”
- **Market-value weight:** “Debt and equity contributions should be weighted according to current market values for a market-based cost of capital. Book value can produce a different—and often less appropriate—weight.”
- **Leverage risk:** “Changing debt financing changes the risk borne by equity and potentially lenders. A larger debt weight should not automatically be interpreted as always lowering a real company's cost of capital.”

**Presets:** Debt 30%, equity 70%, rd=5%, re=12%, tax=25%; all equity; change tax rate; illustrate fixed-cost versus risk-adjusted modes with the same financing weights.

**Tests:** D=30, E=70, rd=.05, re=.12, T=.25 → WACC=.09525 = 9.525%. D=0 → WACC=re. T=0 → pretax weighted average. Weights must sum to one; no D/E division by zero; rates and percentages clearly converted.

**Out of scope:** Capital-structure optimization grounded in live security prices, APV and complex tax-loss/bankruptcy scenarios in initial release.


## Pilot implementation — v0.1

Implemented the introductory fixed-component-cost mode: four paired numeric/slider controls, normalized $100 market-value financing picture, weighted equity/debt contributions, pretax versus after-tax debt effect, WACC-versus-debt-share plot using the same calculation, four complete presets, Reset, saved comparison, causal explanations, accessible modal information controls, worked math and a prediction prompt. The standalone file includes a Download offline copy action; copies reopen with the starting scenario.

Reference expectations: starting 9.525%; all equity 12%; zero tax 9.9%; 60% debt 7.05%. Tests also cover expensive debt, a flat relationship, zero/full boundaries, signed differences, chart/result agreement and invalid-input rejection.

Deferred: CAPM builder, risk-adjusted leverage curves, arbitrary currency/financing amount entry and a full case replay. The curve is explicitly a fixed-rate illustration, never an optimal-capital-structure recommendation. Dollar amounts are normalized financing weights, not promised investor payouts.

User review and detached file:// offline execution remain pending. The app browser permits HTTP/HTTPS but not file://; a download and static packaging review were completed. Status stays draft, with no public catalog download until acceptance. No commit or push before the user's requested test.


## Owner revision — v0.2

The main symbolic WACC equation and numerical substitution are always visible. Variables D, E, V, r_D, r_E and T appear beside their names. The diagram now places a simplified net business asset block on the left and debt above equity on the right. Both sides normalize to $100 of market-value financing; this is not a book balance sheet, and operating liabilities are netted from the conceptual asset side.

The course notation r_A is explicitly the pretax weighted-provider blend used in this lab: r_A = (E/V)r_E + (D/V)r_D. WACC = r_A - (D/V)r_D T shows the usable interest-tax adjustment. This does not claim that the displayed pretax blend is a leverage-invariant unlevered business-risk cost of capital with corporate taxes; no such rate is separately estimated here. WACC is a required discount rate, not an accounting asset return or promised realized return.

A visible section defines financing debt (interest-bearing borrowings, current maturities counted once, ordinary operating payables excluded), market versus book debt estimates, equity as shares outstanding times market price, multi-class/private-company caveats, lease/claim consistency and gross debt versus excess cash. Fourteen model tests pass; two specifically cover the pretax blend and tax-adjustment relationship. The pilot remains in review before commit/push.


## Owner revision — v0.3

Reordered the three visible equations: solve return on assets r_a first; then WACC from r_a less the interest tax adjustment; then the equivalent expanded WACC formula. Product labels use Return on assets with a lowercase subscript a. Mathematical assumptions remain in accessible help; this naming change does not change the model.

Input rates/weights and their equation substitutions use exactly two decimal places. Calculated rates and percentage-point differences use exactly three. Equation values occupy fixed-width tabular slots. The edited variable and its occurrences glow softly while a slider is held, with a 750 ms fade after release. Numeric typing also highlights its corresponding terms and settles to two decimals on blur. Reduced-motion preference disables the transition.

Removed narrative snippets, repeated financing identities, separate definition panels and redundant result/formula cards from the main view. Debt/equity estimation, model assumptions, the conceptual balance-sheet scope and notation details are retained in information dialogs. The debt-share chart is optional/collapsed. Three additional pure presentation tests verify formatting and precision retention.


## v0.3.1 — owner acceptance

The owner accepted the visualization and requested a percentage-points definition before commit/push. The tax-shield and saved-comparison info explain pp with the 10% to 9% example. The public catalog now includes the standalone HTML. Advanced modes remain deferred. Browser coverage and the local-file offline test exception are recorded explicitly in verification/wacc.md; do not infer unperformed cross-browser or offline tests from catalog availability.

## November 6, 2026 — v0.3.2 release

Owner authorized the reviewed changes for commit and publication. Includes aligned symbolic/numerical equations, textbook fractions, matching amber editing/selection feedback and consistent notation/graph legend styling. Prior draft restrictions above are historical. See verification/wacc.md and verification/equation-layout-review.md for evidence and limits.
