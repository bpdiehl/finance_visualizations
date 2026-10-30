# F2 — Risk, Diversification & CAPM

Status: planned. Catalog slug: risk-capm. Recommended build wave: 3.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## F2 — Risk, Diversification & CAPM

**One-sentence promise:** “Discover which kinds of risk can be diversified away—and which kinds investors demand a return for bearing.”

**Class anchors:** 9.15 accounting for risk: probability, expected outcomes, diversification; 9.17 risk/CAPM: total vs systematic/idiosyncratic risk and beta; 9.22 uses CAPM concepts with debt/equity context; 9.29 WorldCom notes discuss market risk, risk premiums and debt versus equity.

**Learning outcomes:** Distinguish expected return from outcomes; see why diversification reduces idiosyncratic risk when imperfectly correlated assets are combined; understand beta as systematic risk exposure and CAPM as a *required return estimate*, not a guaranteed actual return.

**Primary view:** Linked scatter/return paths for two stylized assets, a correlation slider and a portfolio risk vs weight chart. CAPM tab shows required return line and a movable beta marker.

**Controls:** Asset expected returns, volatility, correlation (bounded −1 to +1), portfolio weights; risk-free rate, expected market return or market risk premium, beta. Use seeded illustrative returns when displaying sampled paths, and analytic covariance for exact risk calculations.

**Core formulas:** `E[Rp] = w E[Ra] + (1−w)E[Rb]`; `Var(Rp) = w²σa² + (1−w)²σb² + 2w(1−w)ρσaσb`; `beta_i = Cov(Ri,Rm) / Var(Rm)`; `required return = rf + beta × (E[Rm]−rf)`.

**Tooltips:**
- **Diversification:** “Holding different investments can reduce company-specific risk because their outcomes do not move exactly together. Market-wide risk remains.”
- **Systematic risk:** “Risk associated with broader market movements that investors cannot easily eliminate by holding many securities. CAPM represents it using beta.”
- **Idiosyncratic risk:** “Risk specific to a company or security, such as a local operational setback. A diversified portfolio can reduce its importance.”
- **Beta:** “How sensitive an asset's return tends to be to market returns, estimated from covariance. Beta describes systematic exposure, not the full spread of possible outcomes.”
- **Market risk premium:** “Expected market return minus the risk-free rate. CAPM multiplies this premium by beta to estimate required compensation for systematic risk.”

**Presets:** Perfect correlation (no diversification benefit from combination of identical direction), zero correlation, negative correlation, high-beta versus low-beta investments.

**Tests:** Two assets σ=10% each with w=.5 and correlation ρ=1 produce portfolio σ=10%; with ρ=0 portfolio σ≈7.071%; with ρ=−1 and equal σ/weights portfolio σ=0. CAPM rf=3%, market premium=6%, beta=1.5 → required 12%. Validate weights sum to 1 (unless leverage explicitly enabled).

**Out of scope:** Estimating beta from real stock APIs or implied option volatilities; asserting CAPM is empirically perfect.
