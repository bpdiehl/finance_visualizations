# F2 Risk, Diversification & CAPM v0.4.1

Owner-approved v0.4 release, November 9, 2026. Owner accepted the draft and authorized commit/push; the catalog and standalone download are prepared for publication. Earlier draft entries below are historical. Source: src/risk-capm/. Standalone download risk-capm.html SHA-256 `5d3009ff22f626e5be70959a51ace4e8496ef55371569464882856c3c1d56aad`. Release source based on Finance main9793dbe; committed with this record. Desktop macOS in-app browser; engine/version not exposed. No mobile testing requested.

## Scope and source alignment

Owner selected CAL, diversification versus stock count, and beta scatterplot after complete visual inspection of the two supplied September 15/17 note pages. Graph structures/axes were checked; original artwork, handwriting and course examples remain private. Original illustrative figures, not case replications.

CAL uses excess return versus total volatility, with risk-free/risky allocation and market reference. Diversification uses an explicit equal-weight, identical-beta factor model with independent residuals. Company-specific variance falls as 1/n; systematic risk remains. Beta scatter uses total annual asset and market returns, fitted slope, optional CAPM alpha and selectable residual observation. Alpha differs from the raw total-return intercept. All return periods annual; displayed percentages convert to decimals in equations. Risk-free borrowing and lending share a rate. Seeded synthetic samples are normalized and orthogonalized to match specified moments exactly; no historical data or sampling-error claims. Idealized return model is unbounded.

## v0.2 automated evidence

Build, preview generation, check, both JS syntax checks and diff whitespace checks exited 0. `python3 scripts/manage.py check`: 85 Node tests plus 10 Python packaging tests = 95 passing checks. Nine replacement model tests cover:

- CAL reference variance 0.058; 100% risky weight gives 24.083189% risk, 6% excess and 9% total return. Cash weight 60% gives 3.6% excess, 6.6% total. Borrowed allocation 150% gives 9% excess, 12% total.
- Changing risk-free rate shifts total return while leaving CAL excess return and volatility unchanged.
- Diversification: one-stock variance 0.13; 100 stocks variance 0.0409; systematic floor always 20% with beta1/market20%. Company-specific volatility at n100 is 3%.
- Residual zero, beta zero/negative, zero-risk Sharpe Undefined, monotone curves bounded by the systematic floor.
- Synthetic beta sample: beta1.5/alpha2%/market20%/residual12% gives covariance0.06, market variance0.04, mean market9%, mean asset14%, raw intercept0.5%, CAPM required12%. Residual mean/covariance zero and residual variance0.0144 checked.
- Seed reproducibility, resampling invariants, slope recovery for negative/zero/high beta, zero-noise fitted line, independence of single-asset observations from portfolio stock count, invalid bounds/types and input/preset isolation. All 12 examples model-tested.

## Browser evidence

Local HTTP risk-capm.html preview, port8778:

- All three tabs and their matching axes inspected. CAL default6.00% excess/24.08% risk, with separate market and risky-portfolio rays. Borrow-to-invest example9.00%/36.12%, borrowing50%, total12%. Symbolic excess-return multiplication explicitly grouped with parentheses; fractions and full radical overbars visually inspected.
- Diversification default n10 gives22.14% total/floor20.00%. Keyboard End reaches n200, total20.11%/floor20.00%; slider and graph end at200. No-market-exposure example gives9.49%/floor0%, expected return3%. Fractional n1.5 shows validation, retains the entered invalid value after losing focus, suppresses worked numbers/results/plot, and Reset recovers.
- Beta default fitted1.00/required9.00%; high beta1.50/12.00%; new sample changes seed42→43 and observations while retaining beta1.50/required12%. Negative-beta example−0.50/required0%. Floating negative zero formatting corrected and rechecked: sample mean shows0.00%.
- Keyboard End reaches beta3/required21%; main plot text/axis values identical before and after changing beta1→3, and screenshot confirms rotating slope rather than auto-rescaling.
- Clicking first observation changes worked equation title to observation1. Reset returns observation24. Optional time-path disclosure expands. Pinned beta highlights all six symbolic/numeric occurrences (DOM class inspection). Final warning/error log read: empty.
- Desktop screenshots inspected. Final preview left on CAL, baseline inputs. Core equations visible; nested key and return assumptions collapsed. Info-dialog content for new modes, all help items and full keyboard traversal were not exhaustively browser-tested in v0.2.

## Limits and release decision

The earlier v0.1 download completed and was isolated, but the browser URL policy blocked file:// execution. v0.2 download not repeated; network-blocked offline execution remains unverified. Catalog has no draft download link. No complete network trace, cross-browser, mobile or reduced-motion audit. Not every preset/input extreme was browser-tested. Owner review next; keep draft. Commit/push/deployment require owner acceptance and authorization, followed by catalog/download and live Pages verification.

## CAL aspect-ratio refinement

Owner requested a taller, square CAL plot. Set only CAL viewBox to800×784, making its plotting area700×700; other modes retain their existing dimensions. Reloaded the HTTP preview, confirmed viewBox and visually inspected square plot, axis labels, market/risky lines and aligned controls. Build/check95 pass; diff whitespace passes. No commit/push.

## Beta equal-axis refinement

Owner requested a square Beta plot and identical axis ticks. Beta now has a700×700 plotting area (viewBox800×784); x/y share symmetric bounds and the same outward-rounded tick array. The common range fits current observations, superseding the earlier independent fixed-axis design. Equal physical units preserve the correct slope angle even when the common range changes. Fitted line endpoints intersect the square boundary to contain steep/negative lines.

Reloaded HTTP preview and inspected desktop screenshot. Default beta1 fitted line is45°, both axes read −60.0,−40.0,−20.0,0.0,20.0,40.0,60.0. DOM inspection confirmed identical tick arrays and viewBox800×784. All95 checks, build, JS syntax and diff whitespace pass. No commit/push; earlier release limitations remain.

## v0.3 dedicated CAPM and default view

Owner requested a separate CAPM view and designated it the main view. Added CAPM as the first, initially selected tab; CAL/Diversification/Beta remain available. Three relevant controls: beta, risk-free rate, expected market premium. Expanded r_i = r_f + beta_i × (E[r_m] − r_f) and aligned decimal values. Expected market return derives from the entered premium plus risk-free rate. Square security market line has beta on x, required return on y, labeled beta0 risk-free and beta1 market points. Only the three CAPM inputs are validated/used in this mode; portfolio/sampling inputs do not affect its required return.

Final build/check:86 Node plus10 Python tests,96 passing. A tenth risk/CAPM test adds independent12% reference at3%/6%/beta1.5, zero/one/negative beta points, zero-premium flat line, risk-free shift, independence from other risk inputs, invalid rates/beta and initial-mode contract. All16 examples are model-tested. JS syntax and diff whitespace pass.

Browser reload confirmed first tab CAPM selected with default9.00%, beta1, rf3%, premium6%. High-beta preset1.5 gave12.00%; premium0 gave3.00% and flat line. Invalid rf25 cleared output with validation; Reset restored9.00%. Switched through all four modes and checked titles/results/viewBoxes: CAL6%/24.08% square; diversification22.14%/20% wide; Beta1/9% square; CAPM1/9% square. CAPM help explained its distinct axes/intercept/slope; Escape restored trigger focus. Final screenshot inspected and warning/error log empty. Preview left on CAPM baseline. v0.3 download/offline/cross-browser coverage remains unverified; not committed or pushed.

## v0.4 selected review refinements

Owner selected suggestions1,3,4,5: view-state persistence, expected-market-return control, narrower Beta focus and CAL saving/borrowing labels. Header/general equation compaction was not requested. Beta/rf/expected market return now share across views. Other inputs, seed and selected observation are saved per tab within this page session. Presets/Reset intentionally apply the active baseline and its shared assumptions; reload returns to default CAPM. No local storage or network persistence.

Expected market return is canonical in every mode; market premium = expected market return − risk-free rate. Model permits expected return−20% to40%, rf0% to20% and beta−2 to3, including negative premiums. CAPM y bounds cover both beta endpoints; CAL bounds include both rays when premium is negative. Beta replaces required-return headline with company-specific volatility and removes the repeated CAPM equation. Saving/Borrowing labels lie on their respective parts of the chosen risky portfolio’s CAL.

Final build/check:87 Node plus10 Python tests,97 passing. Eleven risk/CAPM tests now include fixed expected-market-return behavior when rf changes, cash-mix return, negative-premium reference, beta0/1 endpoint grid and new input validation. Syntax and diff whitespace pass.

Browser evidence in macOS in-app HTTP preview:
- CAPM beta1.5, rf4%, expected market9% gives required11.50%, premium5.00%. Switching Beta/CAL/CAPM retains all three shared inputs and11.50% required return.
- Beta company-specific volatility18%, seed43 and selected observation1 persist after leaving and returning. Headline shows beta1.50 and company-specific volatility18%; CAPM-required heading count0.
- CAL allocation150% persists, gives excess11.25%, risk49.30%, total15.25% under the shared4%/9%/beta1.5 inputs. Both Saving/Borrowing labels inspected in screenshot and DOM.
- Diversification stock count100 persists across another-tab Reset. Reset restores sharedbeta1/rf3%/market9% but keeps the other tab’s local count100; risk20.22%/floor20.00%.
- CAPM rf3%/market2%/beta1.5 gives premium−1.00%, required1.50% and inverted line. Market50% triggers validation and clears output; Reset recovers.
- Final reload default CAPM9.00%/beta1 with direct expected-market-return9% control. Desktop screenshot inspected; final warning/error log empty. Source/preview synchronized.

v0.4 download/offline/cross-browser and exhaustive help/keyboard/extreme rendering checks remain unverified. Earlier limits still apply. Local owner-review draft, no commit/push.

## Owner release authorization

Owner accepted v0.4 and requested commit/push on November9. Catalog marked ready, README updated, standalone download generated from accepted source. Previous browser-policy block on file:// and latest-download/cross-browser limitations remain explicit; no offline browser coverage is inferred from packaging checks. Deployment/live-byte verification follows the push and is recorded in the private coordination handoff to avoid a metadata-only redeployment.

## Final symbol-glow audit before publication

Owner flagged notation glows during release preparation. Browser audit of all37 notation buttons found10 with no counterpart. Added exact symbol/value links on controls and headlines, nested r_f links within excess-return expressions, r_i/r_m links inside covariance/variance, and the numeric residual-volatility exponent. Selecting a symbol whose only control is collapsed reveals that control’s disclosure. It does not add or change equations.

Fresh browser audit:37 buttons checked across all4modes; every button had a visible non-key target and all exact matching targets glowed. No missing links. CAL nested r_f inspected in screenshot; browser warn/error log empty. Input/highlight styling retains inline subscript placement. Final97 automated checks and build/diff/private-pattern review pass. Existing offline/cross-browser limits remain.

## v0.4.1 strict equation-only audit

Owner clarified that some CAL glows still did not work and some key variables were absent from equations. The previous37-button audit counted control-only targets and was insufficient for that requirement. Replaced manually maintained key lists with keys generated from symbolic equation markup. Removed control-only notation entries; input labels/units/help remain. Expanded CAL’s numeric substitution from a collapsed excess-return value into explicit combined/risky expected return minus risk-free rate. Keys now define those expected-return symbols individually.

Strict browser retest across all4tabs:28 entries (CAPM5, CAL9, Diversification6, Beta8). Every key exactly matches the unique symbols in that tab’s displayed formula. Every entry has at least one symbolic target and one numeric target inside the equation panel; all exact matching symbolic/numeric targets highlight. Zero missing/orphaned entries. This test explicitly excludes inputs, outputs and key buttons.

CAL borrowed allocation150% inspected:0.1200−0.0300=1.5000×(0.0900−0.0300). Selecting r_f lights all four actual0.0300 numerical occurrences and their symbolic counterparts. Subscripts/fractions and desktop layout inspected in screenshot. Warning/error log empty. Build/check97, syntax and diff whitespace pass. Formula/model values are unchanged. No new claim of offline or cross-browser coverage.


## Local presentation review

See [Finance refinement evidence](finance-review-refinements.md) for the current uncommitted equation/layout/scale changes and browser coverage.


## November 10, 2026 — Local feedback revision

See [feedback implementation evidence](finance-feedback.md) for the current model/terminology changes, numerical and browser checks, and remaining coverage limits. Local review only; earlier public-release records remain historical.
