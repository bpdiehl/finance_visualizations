# F2 — Risk, Diversification & CAPM

Status: release v0.4.1, correcting the owner-approved v0.4. Catalog slug: risk-capm. Recommended build wave: 3.

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


## Implementation — November 9, 2026, v0.4

The owner selected three supporting graph types after visual comparison with the supplied September 15/17 personal notes. Those two complete note pages were inspected in this revision; other inherited course anchors remain unverified. Source artwork, private annotations and class figures are not published.

The implemented pilot has four tabs; CAPM is first and selected on initial load:

- **CAPM:** standalone security market line, beta versus required return. Three relevant inputs: risk-free rate, expected market return and beta. Visible expanded CAPM equation with aligned decimal substitution and a market-premium definition. The market premium is derived from expected market return minus the risk-free rate; zero and negative premiums are supported. Labeled risk-free beta0 and market beta1 points; independent of company-specific risk, stock count and alpha.
- **CAL:** excess expected return versus total portfolio volatility. Selected risky portfolio and market-reference capital allocation lines, cash/borrowing weight and Sharpe ratios. Same risk-free borrowing/lending rate assumed. Market CAL reference represents the fully diversified CAPM benchmark; it is not a security market line.
- **Diversification:** portfolio standard deviation versus stock count. Equal weights, identical betas, independent company-specific residuals uncorrelated with the market. Variance is beta² times market variance plus individual residual variance divided by n. Adding holdings reduces company-specific risk; systematic risk stays at abs(beta) times market volatility.
- **Beta:** annual asset returns versus annual market returns, with covariance/variance slope, fitted line and selectable residual observation. A square plotting area with identical x/y ranges and tick values gives the slope its correct geometric angle; the common range fits the current observations. Seeded illustrative observations are centered/scaled/orthogonalized to match requested moments exactly; they are not historical observations or a demonstration of sampling estimation error. An optional disclosure shows the same observations over time. CAPM alpha is optional; raw total-return intercept is r_f(1−beta)+alpha, distinct from alpha.

Core equations and aligned decimal substitutions remain visible. Smaller Symbols & units key collapsed, one definition per row; shared amber highlights, fractions/radicals, exact fields/sliders, relevant examples and mode-specific Reset. Original annual-return illustrations; desktop focused. Zero-risk Sharpe is explicitly Undefined. Stock count is integer 1–200, with identical plot/slider bounds. Positive market volatility keeps covariance/variance beta and market Sharpe defined.

Deferred: real data and beta estimation from uploaded observations, finite-sample moment deviations, unequal holdings/correlated residuals, the original two-asset correlation/allocation view, standalone distribution demonstrations. Owner accepted v0.4 and authorized commit/push on November 9, 2026. Catalog marked ready; generated standalone download included. See ../verification/risk-capm.md.


## Owner-selected refinements — v0.4

Implemented review suggestions1,3,4,5. View changes preserve local inputs, sample seed and selected observation within the current page session. Beta, risk-free rate and expected market return are shared across all four views; local stock counts/volatilities/allocation remain independent. Presets and Reset intentionally set the active view’s baseline including shared assumptions. Reload opens the default CAPM baseline.

Expected market return is now the canonical input everywhere (−20% to40%); premium is derived. Risk-free changes hold expected market return fixed, pivoting SML around beta1. Negative-premium SML/CAL bounds include both endpoints/rays. Beta’s duplicate CAPM equation/headline are removed; headline now pairs fitted beta with company-specific volatility. CAL labels Saving and Borrowing on its risky-portfolio line around the100% point. Overall equation/header compaction was not requested in this selection and was not implemented.


## Equation-key correction — v0.4.1

Symbols & units is generated exclusively from the displayed symbolic equations. Control-only variables are excluded. CAL defines combined and risky expected returns separately, and its numeric rows explicitly show risk-free-rate subtraction rather than substituting already-calculated excess returns. This gives every key symbol an actual symbolic and numeric equation target. Inputs retain their own visible symbols, units and info controls.


## Owner-requested presentation refinement

Core equations now use an initially closed disclosure, per the current owner request. CAPM assumptions column is wider to reduce graph size. See ../verification/finance-review-refinements.md. Local review only.


### Latest owner refinements

Diversification uses full panel width with text compensated to match the other graphs' rendered size. The other risk views remain capped at500px. Beta uses50 synthetic annual return pairs (not weekly or historical data); period range and labels match the generator.


## November 10, 2026 — v0.4.2 local review

Use Equity beta for the company/security’s systematic market exposure in controls, results, chart labels, presets and notation help. Keep existing β_i / β notation to match the model. Explain that the market portfolio itself has beta 1. Main equations and live substitutions remain visible, superseding the earlier collapsed-equation refinement for this revision. Responsive rules constrain equations and stack the workspace at phone widths. Model calculations unchanged; see verification/finance-feedback.md. No commit/push yet.


## Owner correction — November 10, 2026

Equations use a native, initially collapsed Equations disclosure. This supersedes the visible-equation presentation described above. WACC places equations above the workspace in both modes, and its mode selector follows the rounded segmented style used in Time Value and Risk/CAPM. Live substitutions, aligned notation and mathematical models are preserved.
