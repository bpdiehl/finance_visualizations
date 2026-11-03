# F5 — DCF Valuation — v0.4.2 accepted release

Status: owner accepted v0.4.2 on 2026-11-03 and explicitly authorized commit/push. Published artifact is generated from reviewed source; remaining browser/offline coverage limits are recorded below.

- Release date: 2026-11-03 (America/Denver). Earlier review evidence starts 2026-11-02.
- Environment: Codex in-app browser on macOS; exact engine/version not recorded. Tested at 1280×800 and 360×800. Temporary viewport override reset at handoff.
- Source base: Finance main f8ce7aaf1b5974f01621ef961e76a02b61b8a96d, with uncommitted DCF changes.
- Artifact: `docs/downloads/dcf.html`, 90,685 bytes, SHA-256 `e9b08329bc536aedda6338d0b5f8c2453a61fc4b8a68d0866da12d208987ea60`.
- Implemented: driver forecast; selected-year worked equations; sustainable-growth terminal reinvestment assumption; annual cash-flow/PV bars; responsive sensitivity matrix; equity waterfall; forecast table; detailed inputs; comparison baseline; self-contained HTML export.
- Deferred scope and financial assumptions are documented in specs/dcf.md and the in-page help. No exact case reproduction or probabilistic forecast is claimed.

## Numerical and packaging checks

`python3 scripts/manage.py preview dcf`, `build`, and `check` passed after the final source changes. There are 24 DCF model tests, 17 existing WACC/model-formatting tests, 6 Python packaging tests and 3 notation regression checks: 50 tests total, plus JS syntax and deterministic artifact checks. `git diff --check` passes.

Independent Python Decimal calculations (32-digit precision) provided the default references:

- Year 1: revenue 1060; NOPAT 143.1; change in NWC 9; FCF 112.9; PV 102.6363636364.
- Year 5: revenue 1338.2255776; change in NWC 11.36229264; FCF 142.533648784.
- Terminal NOPAT 184.27366203552; reinvestment fraction 1/6; next cash flow 153.5613850296; terminal value at year 5 is 1919.51731287; its PV is 1191.8692295422.
- Forecast PV 477.1921827396; operating value 1669.0614122818; equity value 1419.0614122818; per share 14.1906141228.

Tests also cover the independent 1250 growing-perpetuity reference, exactly N terminal-discount periods, horizon invariance for consistent steady-state examples, base-year working capital, shrinking sales releasing working capital, growth reducing FCF under heavy investment, cash/debt/share effects, currency scaling, signed bridge conservation, invalid inputs, invalid r/g, positive tiny spreads, negative FCF, unsupported nonpositive terminal profit, shortfalls, and every sensitivity cell matching the same valuation function. Terminal cash flows use NOPAT_(N+1)(1−g/q), not FCF_N(1+g).

## Browser checks

Local preview: `http://127.0.0.1:8772/dcf.html`. The Python server serves only the ignored preview folder. HTTP 200 responses observed in its logs. It remains running for owner review and can be stopped afterward.

Observed:

- Default Vop 1669.06, per share 14.19, forecast PV 477.19, terminal PV 1191.87, terminal share 71.41%.
- All four presets: Faster growth gives Vop 1978.52 / share 17.29; Working-capital heavy gives first-year FCF 8.00; Near r=g shows the sensitivity warning and six unavailable cells in the full grid.
- Selecting year 3 updates FCF to 126.85. Chart-bar Enter selection works and restores focus to the selected bar after SVG rendering. A 10-year forecast has 10 bars and discounts terminal value by exponent 10. Reset restores five years and inspection year 1.
- Terminal help opens with Enter; Escape closes it and restores focus. Definitions distinguish operating cash flow, current-value cash/claims, terminal reinvestment, NOPAT, and dollars/millions/shares. Source links are optional.
- WACC 2%=growth 2% displays a specific invalid-perpetuity message, no operating/share value, but retains forecast PV 598.57. The current matrix cell is unavailable rather than zero.
- Excess cash 50→150 raises price 14.19→15.19 while both operating value and the heatmap are unchanged. Raising claims to 400 then gives 14.19; shares 200 give 7.10. Zero shares produce a specific error, clear charts/outputs and disable Download.
- Claims 10000 yield equity −8280.94, a shortfall warning and no price. Terminal q=1% gives signed negative terminal cash flow/value, operating value −953.05 and visible reinvestment/shortfall warnings. Negative contributions are not silently clamped.
- Saved comparison clears its difference when saved. Changing WACC 10.00→10.10 shows operations −21.32 million / per share −0.21 relative to the original case.
- Editing WACC highlighted matching symbolic/numerical terms; blur released the active state. CSS uses a 0.75-second fade and suppresses transitions under reduced motion. A forced reduced-motion media profile was not tested.
- Worked-equation token bounding boxes are identical at WACC 10.00 and 10.10 at both 1280 and 360 widths. Inputs normalize to two decimals; full model precision is retained.
- No horizontal page overflow at 360 px. Both vertical chart titles are rotated along the left and remain within the SVG bounds. Bridge category labels wrap into two lines and were visually checked without collisions.
- The matrix shows 25 cells at 1280 px and nine central cells at 360 px, with the same current value 1669.06. The wider grid was checked after closing the temporary export-test tab, ensuring the viewport override applied to the intended tab.
- The annual forecast table scrolls within its labeled region on a narrow screen; ArrowRight moved its scroll offset to 28 while page width stayed 360. It does not widen the page.
- Final warning/error logs empty. Default-state screenshot is retained outside the public checkout.

## Export bootstrap and offline limits

A rendered-DOM HTML copy initially reproduced duplicate controls/presets on reopening. Fixed startup to rebuild generated-control containers once. A serialized DOM copy was served over HTTP and reopened through two generations: each had exactly 14 controls, four presets and no duplicate IDs, restored the 14.19 starting price, and its Faster growth preset worked (17.29). This is an HTTP export-bootstrap regression check, not a file:// or network-blocked check.

The Download HTML button was clicked; its Blob/link action completed with a Save dcf.html instruction and no console errors. No matching dcf*.html appeared in the local Downloads folder, so successful saving remains unverified. The catalog has no DCF download while status is draft.

Actual detached file:// execution with network blocked remains untested. This workflow has previously rejected local-file URLs; no browser restriction was bypassed. No runtime network-blocking/capture instrumentation was available. Static checks verify one inline HTML without external runtime dependencies, which does not prove the full offline browser flow.

Other engines, physical phones, alternate reduced-motion profile, real saved-file execution and final public-catalog download remain pending. Keep the draft private to review until owner feedback/approval. The existing published WACC and Operations files were not changed.


## v0.2 notation-key verification — 2026-11-02

Added only a notation key and scoped layout styles, retaining the original symbols and calculations at the owner’s request. R₁ and R₀ are explained directly, followed by definitions of all symbols and acronyms. Default source state is collapsed, with governing equations visible. Enter opens/closes the native disclosure and leaves focus on its summary. Open key uses two columns at the normal 971-pixel viewport and one column at 360 pixels; page scroll width remains 360. Temporary viewport override reset. Browser base result remains operating value 1669.06 and per-share value 14.19, with no warning/error logs. Preview and all 47 automated checks pass. Screenshot retained outside the public checkout; review tab left with key expanded. Offline/export limitations above remain unresolved and unchanged. No commit/push.


## v0.3 statement-layout verification — 2026-11-02

Latest owner instruction makes the modified income statement/FCF table primary and allows equations to be collapsed. Equations and key share one native disclosure, default closed. This is an explicit DCF layout exception to prior equation-visibility guidance. The statement shows derived implied operating costs and taxes from the pure model; valuation mechanics are unchanged. The existing independent numerical test additionally asserts year-one costs 837.40 and tax 47.70.

Fresh preview/build/check pass after final source changes: 41 Node + 6 packaging checks. Browser observed default year-one revenue 1060.00, costs (837.40), depreciation (31.80), EBIT 190.80, tax (47.70), NOPAT 143.10, FCF 112.90 and PV 102.64. Operating value remains 1669.06 and price 14.19.

At 1280 pixels the statement and four primary sliders sit side by side. At 971 pixels the statement is above the controls. At 360 pixels the table region is 326 pixels, its content scrolls independently (ArrowRight observed scrollLeft 22.5), sticky labels remain visible and page width stays 360. A 10-year forecast shows 10 selectable year columns without widening the page. Expanded equations/key also stay within 360 pixels. The native disclosure opens/closes with Enter, and reloading while expanded returns it to closed. Enter on year 3 selects its column, retains focus on the rebuilt header button and updates the worked FCF to 126.85.

Sales growth −5% displays a positive 7.50 working-capital cash release and FCF 116.75. WACC 2%=g retains all 13 statement rows while showing the invalid-terminal warning and no operating valuation. Statement help opens, explains inferred costs and operating-only scope, and Escape closes it. Reset and final reload restore the default five-year forecast, closed equations/key and closed detailed settings. Final warning/error logs empty. Temporary viewport override reset; default-state screenshot retained outside the public checkout.

The browser adapter initially lost its connection after browser IDs changed; refreshing its inventory restored the same owner tab. Real file saving, file:// offline execution, other engines and final public-catalog download were not re-tested; prior export/offline limitations above remain. No public DCF artifact, commit or push.


## v0.3.1 forecast disclosure — 2026-11-03

Preview/build/check pass after final source edits (47 checks). Fresh browser startup shows forecast expanded and equations/key collapsed. Enter collapses the forecast to its summary (height about 62 pixels at the 971-pixel viewport) independently of the equation/key state; Enter reopens the statement with all 10 owner-selected forecast columns and live values retained. Owner input values were captured before reload and restored through UI controls; growth 9.36%, margin 4.48%, 10 years and the resulting 0.94/share remain intact. Screenshot shows both sections collapsed; final review view has forecast expanded. No new model calculation changes.

The previous localhost server was no longer running; restarted the same preview-only server on 8772, session 53879. Its HTTP HEAD returns 200. The browser adapter retained a connection-error document in the old tab, so a fresh preview tab was used (browser 2/tab 3). No security restriction bypassed. Existing offline/export coverage limits remain unchanged. No commit/push.


## v0.4 linked symbols and cash-flow reminder — 2026-11-03

Final preview/build/check pass: 41 Node + 6 packaging checks. No model changes. Browser DOM audit found 29 key buttons with at least one matching equation target each, and no visible equation/key h2/h3 subtitles. Clicking WACC selected only r symbols and 10.00% numerical slots; S selected shares and 100.00 without highlighting lowercase s. Tab to P previewed P/0.94; Escape removed all pinned/highlight states. Enter on ΔNWC at 360 pixels highlighted the corresponding symbolic terms and the owner scenario’s 14.04 worked results, without page overflow (345-pixel content plus scrollbar in a 360-pixel viewport). Click selection brings the first match into view. Hover handlers were inspected but no pointer-hover action was available in this browser adapter; actual hover was not directly exercised.

The expandable reminder has four conceptual steps and a closing FCF explanation. It stays within the narrow viewport. The NWC reference row reads NWC balance (reference only), with background rgb(241,243,245), a 10-pixel separator and a rule, separate from FCF/PV. Default NWC worked calculation observed 159.00−150.00=9.00. The owner scenario retains 9.36% growth, 4.48% margin, 10 years and price 0.94 after reload and UI restoration. WACC=g retains the correct PV symbol mapping for the remaining forecast present value. Final warning/error logs empty. Viewport override reset; screenshots retained outside the public checkout.

Static export cleanup clears symbol pin/highlight state and closes the reminder. Real download/file:// offline execution and other-engine coverage were not re-tested; prior limitations remain. No commit/push.


## v0.4.1 notation audit and input placement — 2026-11-03

Root cause reproduced: nested t/N indices lacked their own target tags, grouped key rows defined several symbols together, and d/c/w aliases selected cash amounts. Three new static regression checks failed on the old source for those exact reasons and pass after correction. Final preview/build/check pass: 41 Node + 9 Python checks = 50 total. No model calculation change.

Browser clicked all 29 key buttons and observed a selected button and corresponding equation targets for each, with no failures. N selected seven symbolic indices (subscript/superscript, including N+1) plus the numerical horizon 10. t selected 22 symbolic indices plus the numerical inspected year 1. d/c/w selected only their own letters and the current 3.00%/5.00%/15.00% ratio values; the sum link selected only ∑. There are 29 definition rows, each with exactly one button. Worked values now carry their own direct symbol annotation.

Zero shares clears the newly added profit/ratio substitutions to em dashes, avoiding stale values; restoring shares restores the owner scenario. At 360 pixels the content width was 345 plus scrollbar, with all eight N highlights and no overflow. Final screenshots retain the corrected indices and moved inputs outside the public checkout.

The entire ten-control Forecast & ownership inputs disclosure is the immediate sibling after the Main assumptions panel, appearing once. Inspected expanded layouts at normal width, 1280 and 360 pixels, with no page overflow. With forecast open, desktop uses the forecast/assumption columns (863/320 px); with it collapsed, the controls and detailed inputs use the full width. Base amount inputs are 104 pixels to retain decimal readability. Viewport override reset. Owner scenario preserved (9.36% sales growth, 4.48% margin, 10 years, 0.94/share), and warning/error logs empty. Review view focuses on the moved input section. No offline/download retest; prior limitations remain. No commit/push.


## v0.4.2 input alignment — 2026-11-03

Preview/build/check passed after final CSS edits (50 checks). The existing flexible right alignment allowed unit lengths and selector widths to move info/field positions; replaced those rows with explicit grid columns. No JS/model change.

At the normal 971-pixel viewport, all ten detailed controls share exactly the same info, input and unit x coordinates (667/705/819 in the measured page), with 104-pixel number and select widths. Desktop 1280 full-width, desktop sidebar with forecast open, and 360-pixel layouts each show zero within-group x-position spread for info/field/units and zero vertical-center spread within each input row. No page overflow: 1265/1280 and 345/360 content/viewport widths. Phone main controls also have identical info/input/slider y positions within each pair after wrapping labels.

Diluted-share help opened correctly, Escape closed it and focus returned to the trigger. All owner input values were preserved through reload. Final warning/error logs empty; viewport reset; aligned-panel screenshot retained outside the checkout. Prior offline/download coverage limits remain; no commit/push.


## Accepted release packaging — 2026-11-03

Owner explicitly requested commit/push after accepting v0.4.2. Catalog status is ready and the standalone file is included in docs/downloads/; the draft footer label was removed. The release carries the known browser/offline limits recorded here, as with the existing WACC distribution.

Final release build/check passed all 50 checks. Generated local catalog on port 8773 reports 2 of 7 available and has DCF Open/Download links. Catalog Open loads the generated artifact, showing 14.19/share, forecast expanded and equations/key collapsed. Faster growth gives 17.29; Reset restores 14.19. N selects eight indices/values. Warning/error logs empty.

A detached byte-identical copy was placed in a fresh temporary directory. The browser refused its file:// URL because the tool allows only HTTP(S); no alternate surface or restriction bypass was attempted. Catalog Download was clicked, but the browser download-event check timed out after three seconds, so successful browser saving remains unverified. These omissions do not imply an offline test passed. Static packaging checks confirm no external runtime dependencies. Classmate detached-file testing remains a follow-up.
