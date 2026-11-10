# Local review — November 10, 2026

- WACC v0.4 adds a Fixed asset return tab with adjustable illustrative debt risk, solved equity returns, four curves, live equations, presets and input validation.
- Risk/CAPM v0.4.2 replaces Market beta with Equity beta across its interface and explains the market portfolio benchmark. Governing equations use initially collapsed disclosures in both affected demos; Risk/CAPM layout now adapts to phone widths.
- WACC equations sit above the workspace in both modes; its mode selector matches the collection’s rounded segmented style.
- 100 automated checks pass. Browser evidence, mathematical assumptions and remaining coverage limits: verification/finance-feedback.md. Local review only; no publication.

# Change log

## November 9, 2026 — Finance presentation release

- Released owner-approved collapsible equations, Time Value scales/year labels/switch, and revised Risk/CAPM graph sizing and typography.
- Diversification fills its section with matching text sizing; Beta uses50 simulated annual return pairs.
- All97automated checks pass; prior local-review entries describe the refinement history.

## Local review — Diversification width and sample count

- Full-width Diversification graph with text matching the other risk graphs on screen.
- Beta uses50 simulated annual return pairs with matching legend, help and period range.

## Local review follow-up — Graph labels

- Time Value labels every whole year in the displayed range, including years1–5.
- Enlarged Risk/CAPM graph ticks, annotations and axis titles while keeping the smaller graph size.

## Local review follow-up — Finance sizing and toggle

- Time Value Fit view has a five-year minimum; Show value today uses an accessible switch.
- Risk/CAPM plots capped at500px with a560px assumptions column.

## Local review — Finance presentation refinements

- Collapsible equations in Time Value, Risk/CAPM, WACC, Free Cash Flow and NPV/IRR.
- Time Value equations moved above the workspace; persistent comparison scales with highlighted expansion and Fit view.
- Wider Risk/CAPM assumptions column and smaller chart.
- Owner review pending; no Finance commit/push.

## November 9, 2026 — Catalog navigation

- Made the upper-right Finance label link to the public Finance catalog in every visualization, including downloaded HTML files.

## 2026-11-09 — Risk/CAPM v0.4.1 notation correction

- Generated each notation key from its displayed equations, removing entries used only by controls.
- Expanded CAL numerical substitutions to expose the actual risk-free-rate subtraction and separate combined/risky expected returns.
- Verified all28 key entries have matching symbolic and numerical glows; supersedes the earlier audit that counted input-only links.

## 2026-11-09 — Risk, Diversification & CAPM v0.4 release

- Owner accepted and authorized publication of the four-tab visualization, with CAPM as the default.
- Added catalog Open/Download links and standalone HTML; all seven Finance topics are now available.
- Completed all37 notation glow links, including controls, headline values and nested symbols.
- Numerical/browser evidence and remaining offline/cross-browser coverage limits are recorded in verification/risk-capm.md.

## Local draft — Risk, Diversification & CAPM v0.4, November 9, 2026

- Preserved per-tab inputs, seeds and observations; shared beta and return assumptions across views.
- Made expected market return a direct input and derived the premium, including flat/inverted lines.
- Focused Beta on fitted slope and company-specific volatility; labeled Saving/Borrowing on CAL.
- All97 checks pass; browser state-continuity and revised-return evidence recorded. No commit/push.

## Local draft — Risk, Diversification & CAPM v0.3, November 9, 2026

- Added a dedicated CAPM security market line tab and made it the initial view, ahead of CAL, Diversification and Beta.
- Added three relevant controls, expanded decimal CAPM equation and risk-free/market reference points.
- All96 checks pass, including standalone CAPM numerical/independence/default tests; browser evidence recorded. No commit or push.

## Local draft — Risk, Diversification & CAPM v0.2, November 9, 2026

- Replaced the initial views with owner-selected CAL, Diversification and Beta tabs after inspecting the supplied notes.
- CAL uses excess return versus total risk; diversification uses stock count with a persistent systematic-risk floor; beta uses asset versus market returns.
- Added a visible seed, selectable beta observations, optional time paths and matching square Beta axes.
- Made CAL and Beta plotting areas square at owner request; Beta axes share identical ranges and tick values.
- Replaced obsolete pilot tests with nine model tests. All 95 checks pass; browser evidence and remaining offline/release limits recorded. Not committed or pushed.

## Local draft — Risk, Diversification & CAPM v0.1, November 9, 2026

- Added two-asset allocation/correlation curves and a linked return/risk plot with minimum-risk allocation.
- Added CAPM security market line, beta control and required-return components.
- Included visible aligned decimal equations, textbook radical, nested symbol key, type-specific examples and shared amber interaction feedback.
- Eight new model tests; 94 automated checks pass. Desktop browser and successful download evidence recorded; local file execution remains blocked by the testing browser policy. No commit, push or release.

## 2026-11-09 — Pages publishing recovery

- Replaced the built-in branch publisher after repeated GitHub internal errors with an explicit static Pages workflow publishing the same committed docs folder and public URLs.
- Added a manual retry trigger and documented deployment evidence. Visualization code and download contents are unchanged.

## 2026-11-09 — Financial Performance & DuPont v0.1

- Released ROA/ROE driver diagram with aligned decimal equations, average book balance-sheet proportions and return comparison chart.
- Added five examples, linked driver inputs, collapsed equations with nested symbols, and exact fields/sliders.
- Moved the fixed-income financing assumption into help; removed its main-view banner. Added catalog Open/Download links and standalone HTML. Verification scope and remaining offline/browser limitations are documented.

## Local draft — DuPont & Financial Performance v0.1, November 9, 2026

- Added linked margin/turnover/equity-multiplier diagram, four accounting inputs, balance-sheet proportions and return comparison chart.
- Added five illustrative presets, decimal worked equations/fractions, zero-denominator handling, loss support and explicit fixed-income leverage convention.
- Six model tests and desktop browser evidence recorded. Catalog stays draft pending owner review.

## 2026-11-09 — Time Value of Money v0.1

- Released the desktop Time Value of Money tool with single payment, annuity, perpetuity and coupon bond modes.
- Added type-specific examples, selectable cash flow/value-today timeline, V₀/Vₜ equations with decimal rates and clear coupon-frequency conventions.
- Added standalone download and Finance catalog listing. Offline and cross-browser verification limits remain documented.

## Local draft — Time Value of Money v0.1, November 9, 2026

- Added desktop cash-flow/PV timeline with single payment, annuity/due, perpetuity and coupon bond modes.
- Added six illustrative presets, aligned live fraction equations, a collapsed interactive symbol key, sliders with exact inputs, and matching help and units.
- Model tests cover independent reference values, zero-rate/timing boundaries, perpetuity convergence and bond coupon frequency. Draft stays out of public downloads pending owner review.

## 2026-11-06 — Equation and interaction consistency release

- WACC v0.3.2, DCF v0.5, NPV & IRR v0.1.2 and Free Cash Flow v0.3.
- Aligned symbolic and numeric terms/results; rendered divisions as textbook fractions in both rows.
- Standardized soft amber editing/symbol feedback and notation buttons; coordinated graph legend typography while preserving series colors and markers.
- FCF defaults to To net income, with an NI to FCF toggle, shorter collapsible input groups and linked plot/statement highlights.
- DCF adds a distinct terminal N+1 column and bar, terminal PV in the value composition and a collapsible PV of operations section; no terminal double counting.
- Owner authorized commit/push. Evidence and coverage limits: verification/equation-layout-review.md and individual records.

## 2026-11-06 — Free Cash Flow v0.2.1

- Made the main operating assumptions independently collapsible; interest and working-capital details stay accessible below.


## 2026-11-06 — Accounting to Free Cash Flow v0.2 release

- Extended the waterfall from NI through all adjustments and subtotals to FCF; expanded the plot width with internal scrolling on narrow screens.
- Retained the NI + I + T EBIT reconciliation, individually paired equations/substitutions and explicit operating tax assumptions.
- Owner approved publication; added Finance catalog Open/Download links and standalone HTML. Scope and offline test limits are in verification/free-cash-flow.md.


## 2026-11-06 — EBIT from net income

- Reconciled EBIT from NI, interest and reported taxes; distinguished tax expense T from rate τ.
- Placed each EBIT/NOPAT worked calculation immediately below its symbolic equation.


## 2026-11-06 — Accounting to Free Cash Flow draft v0.1

- Added a modified operating statement, live NOPAT-to-FCF waterfall, linked equations/key and separate operating NWC balances.
- Included working-capital, CapEx and depreciation examples with explicit tax-loss assumptions. Local draft awaiting owner review.


## 2026-11-06 — NPV & IRR v0.1.1 release

- Owner approved publication; added catalog Open/Download actions and standalone HTML.
- Added years repeat the last cash flow; retained the native project-length dropdown after review.
- Offline execution limitations remain recorded in verification/npv-irr.md.


## 2026-11-06 — Extend cash-flow assumptions

- Added project years repeat the last existing year’s cash flow as an editable starting value. Timing help explains the behavior.


## 2026-11-04 — NPV & IRR owner-review draft v0.1

- Added editable annual cash-flow timeline, present-value contributions, NPV curve and linked equations/key.
- Added conventional, break-even, multiple-IRR and no-IRR examples; isolate repeated roots and disclose every-rate/all-zero cases.
- Preserved precise decimals, aligned controls, slider/exact entry, native disclosures and concise accessible help. Draft awaits owner review.


## 2026-11-03 — DCF v0.4.2 release

- Owner accepted the DCF visualization and authorized commit/push after reviewing the statement, notation interactions and control alignment.
- Added the standalone DCF HTML to the public catalog and downloads alongside WACC.
- Retained source, independent model tests, notation regression checks and browser evidence. Offline/browser coverage limits remain explicit in verification/dcf.md.

## 2026-11-03 — DCF input alignment v0.4.2

- Aligned detailed labels, info buttons, fields and units in fixed grid columns. Numeric fields and the horizon selector share the same width.
- Kept units beside their fields, including million shares. Narrow/sidebar layouts use consistent label and input rows.
- Aligned the mobile main-assumption controls when their labels wrap. Verified desktop, sidebar, phone, keyboard help and all 50 checks.

## 2026-11-03 — DCF notation corrections and input placement v0.4.1

- Fixed every t/N subscript and superscript target, including N+1 and the numerical discount exponent.
- Split all grouped key entries into one symbol per row. Replaced ratio-to-cash-amount aliases with explicit ratio equations and matching percentages.
- Render worked-value symbol tags directly, avoiding positional reassignment. Added three regression checks for omitted indices, grouped entries and incorrect ratio targets.
- Moved the entire Forecast & ownership inputs disclosure directly below Main assumptions. The inputs adapt to the sidebar or full width when the forecast is collapsed.
- All 50 checks pass; model calculations remain unchanged. No commit/push.

## 2026-11-03 — DCF linked notation and cash-flow reminder v0.4

- Removed equation-card and notation subgroup subtitles. Key symbols now preview matching equation terms on hover/focus; selecting pins the highlight and brings the term into view. Escape clears it.
- Added a compact, expandable profit-to-free-cash-flow reminder and a worked change-in-NWC relation.
- Renamed the final statement row NWC balance (reference only), removed the Memo prefix and gave it a muted background and separate divider.
- Kept model calculations and valuation results unchanged. Draft remains uncommitted and unpushed.

## 2026-11-03 — DCF forecast disclosure v0.3.1

- Made Operating forecast independently collapsible, expanded by default. Equations/key remains collapsed by default.
- Both views retain live values while hidden; exported copies start with the forecast expanded. Verified keyboard toggling and all 47 checks.

## 2026-11-02 — DCF statement layout v0.3

- Made the annual forecast the main view, styled as an operating income statement extended to free cash flow, with parentheses for deductions and distinct subtotals.
- Combined equations and notation into a single disclosure, collapsed on startup and export per the owner’s request.
- Moved the plots below the statement; year buttons and the year picker link statement columns to worked equations. Editing highlights also identify affected statement rows.
- Added implied operating costs and operating taxes to model output, with independent reference assertions; valuation results remain unchanged. Draft remains uncommitted and unpushed.

## 2026-11-02 — DCF notation key v0.2

- Added a collapsible notation key above the equations, defining year subscripts, symbols, units and acronyms.
- Kept the existing notation and calculations following owner feedback; R₁ means revenue in year 1.
- Verified keyboard toggling, narrow-screen layout and all 47 automated checks. Draft remains uncommitted and unpushed.

## 2026-11-02 — DCF owner-review draft v0.1

- Added driver-based annual DCF, visible worked equations above controls, and a terminal growth/reinvestment assumption.
- Added selectable FCF/PV bars, responsive WACC/g sensitivity, signed operating-to-equity waterfall, and detailed forecast/ownership controls.
- Carried forward consistent decimals, equation highlights, rotated vertical-axis titles, concise help, and explicit invalid/shortfall states.
- Added independent numerical references and model tests; catalog remains draft with no new public download, commit or push.

## 2026-10-30 — Local scaffold

- Added seven planned demo briefs, common standards and AI working agreement.
- Added a generated catalog, standalone packaging tool and packaging regression tests.
- Prepared docs/ for branch-based GitHub Pages; publication is pending.
- No completed visualizations or numerical-model test coverage yet.


## 2026-10-30 — WACC pilot in user review

- Added the F3 fixed-rate WACC model and interactive single-file pilot, four presets, saved comparison, accessible help, SVG chart, worked math and offline-copy download.
- Added 12 pure model tests and recorded browser checks; local file execution and user acceptance are pending. Kept catalog status draft.
- Corrected the packaging check to distinguish CSS url() references from JavaScript ObjectURL() calls. Added regression coverage and synchronized the small tool fix to the Operations repository.


## 2026-10-30 — Equation visibility standard

- Require visible core equations, current numerical substitutions and symbols beside variable names in all Finance and Operations demos. Keep derivations optional, not the core equation.
- Revised WACC pilot v0.2 with the main equation, asset-side/vertical financing diagram, course r_A-to-WACC bridge and debt/equity estimation guidance. Added two model tests; user review remains pending.


## 2026-10-30 — WACC v0.3 review

- Ordered the equations as r_a, WACC from r_a, and expanded WACC; labeled return on assets with a lowercase subscript.
- Stabilized percentage precision and equation value widths. Added a soft edit highlight with a fade on release and reduced-motion support.
- Condensed the main page and moved definitions/assumptions to info dialogs. Added three display-formatting tests; user review remains in progress.


## 2026-10-30 — WACC v0.3.1

- Added a plain-language percentage-points (pp) definition and example to the tax-shield and saved-comparison help.
- Owner accepted the visualization and authorized commit/push. Added the standalone WACC HTML to the public catalog and downloads.
- Updated public sharing instructions. Offline local-file browser coverage remains limited as recorded in verification/wacc.md.
