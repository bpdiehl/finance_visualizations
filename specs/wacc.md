# F3 — WACC & Capital Structure

Status: planned. Catalog slug: wacc. Recommended build wave: 1.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

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
