# F3 — WACC & Capital Structure — v0.1 pilot

Status: draft, awaiting owner test. The user explicitly requested testing before commit/push. No commit or push has been made for this pilot.

- Date: 2026-10-30.
- Automated/model reviewer: Codex.
- Browser: Codex in-app browser on macOS; engine/version not recorded.
- Source base: finance commit 9a0c4aa; current changes are uncommitted.
- Preview artifact: .preview/wacc.html, 46,832 bytes, SHA-256 1ad87d8826d898ae563cb46170eba3f07102c2ef47744582f06120c847d29c75.
- Browser-downloaded snapshot: wacc.html, 50,645 bytes, SHA-256 b4bb5e75693e49efc4e94b66b7630a9e4f2c3623cd8ba1c473015f8d652d3790. The snapshot also contains rendered DOM, so its bytes differ from the source build.

## Implemented scope and provenance

Introductory WACC with fixed debt/equity rates. Inputs are decimal fractions in the model and percentages in the UI. Market-value weights sum to one. The $100 funding graphic normalizes financing weights. Equity returns are opportunity costs, not guaranteed cash payments. Interest deductions are assumed fully usable. Illustrative presets; no company case data or personal-note images are embedded.

The WACC, financial-statements and Heinz personal course-note pages were visually inspected for framing. The original course notes remain private. Formula reference: [Aswath Damodaran, NYU Stern](https://pages.stern.nyu.edu/adamodar/New_Home_Page/lectures/capstr.html). Advanced leverage-risk schedules, CAPM estimation and exact case replication are deferred and not implied by this pilot.

## Numerical and packaging checks

Commands (all exited 0):

~~~sh
node --test tests/wacc.test.cjs
python3 scripts/manage.py preview wacc
python3 scripts/manage.py build
python3 scripts/manage.py check
~~~

Twelve model tests pass: default contributions and 9.525% result; all-equity independence from debt/tax assumptions; all-debt endpoint; no-tax 9.9%; 60%-debt 7.05%; equal component rates; expensive debt raising WACC; zero/full boundaries; grid invariants and chart/model consistency; invalid input rejection; comparison purity/change attribution; all four presets. Six packaging regression tests also pass. The one-line shared checker correction and its regression are also verified in Operations (six packaging tests pass).

Both the generated preview and browser-downloaded snapshot pass the offline packaging gate. Each has two embedded scripts that exactly match model.js and app.js. No owner machine path is embedded. There are no required adjacent assets, runtime modules, fonts, libraries, data fetches or backend calls.

## Browser checks — observed

Served the single preview file at localhost over HTTP; no private source folder was exposed.

- Default 9.525%; all-equity 12.000%; no-tax 9.900%; more-debt 7.050%, matching independent expectations.
- Debt 50%, equity return 12%, debt rate 5%, tax 40%: WACC 7.500%. Explanation names both changed assumptions.
- Save that comparison, then equity return 14%: WACC 8.500%, +1.000 pp versus comparison.
- Debt share 101% and a blank borrowing rate: visible validation; stale results and curve hidden. Reset restores the valid starting values and original comparison.
- Keyboard ArrowRight on debt slider: both controls 30.1%, WACC 9.517% (display rounding of 9.51675%).
- Enter opens WACC information dialog; Escape closes it and restores focus to the invoking information button.
- Download offline copy produced wacc.html; its embedded scripts and static packaging were checked. Actual local-file execution is still pending.
- Full-page rendered review at 1280 × 900 and 360 × 800. Mobile document width did not exceed viewport width. Financing shares, chart, controls and explanatory text remained readable; SVG labels resize with the chart.
- Browser warning/error log review returned no entries.

## Remaining checks and release decision

The in-app browser's known URL policy allows HTTP/HTTPS only, so detached file:// execution with network blocked is not automated. Do not claim this is already proven offline. The owner should use Download offline copy, disconnect if practical, double-click wacc.html in an ordinary browser and exercise the controls. User review should also assess whether the weighting and tax adjustment feel clear.

Ready status, public catalog download, production HTTPS behavior, a catalog-to-download flow, additional browsers and real mobile devices remain pending. After feedback, address changes, complete the remaining applicable checks, rebuild, run checks, then commit and push as the user requested.


## v0.2 revision checks — 2026-10-30

The current revision supersedes the v0.1 artifact hashes above. It is still draft and uncommitted, with the user's review/acceptance pending.

Changes: always-visible symbolic WACC equation and live substitution; variable symbols beside input names; a net asset block alongside a vertical debt/equity stack; a two-equation r_A/tax-adjustment bridge; a visible D/E estimation section. The new r_A output is the existing pretax blend under the course notation, not a separately estimated unlevered cost of operating risk. Shared equation/notation standards were applied to both repositories and private workspace instructions.

Fresh checks: Finance build/preview/check commands exit 0 with 14 model tests and six packaging tests. Operations check exits 0 with its six packaging tests. The new model tests confirm r_A = 9.9% while changing only tax from zero to 40% changes WACC from 9.9% to 9.3%; fixed-rate financing endpoints and the 60%-debt r_A of 7.8% are also checked.

Browser review: current equation substitutions, asset-return result and tax bridge match all four preset values (9.525%, 9.900%, 12.000%, 7.050% WACC respectively for starting/no-tax/all-equity/more-debt). The vertical stack's measured heights match its financing weights, including zero debt collapsing to zero height. An invalid debt share of 101 hides stale results and clears all three worked equation values while keeping the symbolic equations visible. The new asset-return help dialog opens with Enter and closes with Escape. Rendered review at 1280px and 360px shows the equation wrapping, visible symbols and two-column market-value diagram without horizontal page overflow. Browser error/warning logs were empty.

The offline-copy implementation is unchanged from the previously tested v0.1 download flow. This revision's generated HTML passes the packaging gate; a new browser download and actual file:// execution are not claimed here. Actual detached/offline execution and owner acceptance remain pending. Other browser/device and public HTTPS coverage remains as limited above.

Current generated preview: 50863 bytes; SHA-256 3f0ba85e456a7fe0eb6a26e7c8328ee7dda0f1b35a1de2ae13578026f5863f60.


## v0.3 revision checks — 2026-10-30

Current draft revision. Calculations are unchanged. The three equations are now ordered r_a, WACC from r_a, and expanded WACC. Return on assets uses a lowercase subscript a. Explanatory snippets and detailed definitions were moved to help dialogs; fixed-rate/model context remains accessible. Percentage input values use two decimals, calculated rates/pp use three, and dollar financing labels use two.

Fresh preview/build/check commands exited 0: 14 domain model tests, 3 new pure presentation tests, and 6 packaging tests pass. The presentation tests cover whole/tenth transitions (27.00% to 27.10%), fixed output precision, invalid display handling and preservation of raw model precision.

Browser observations for this revision:

- All four presets match the expected WACC outputs; the result in both WACC equations matches the displayed WACC. The r_a equation and asset-side result agree.
- Measured every numerical equation token's x/y position and width at 27.00% and 27.10%. Maximum movement was exactly 0 pixels at laptop width and at 360px width.
- Editing debt share highlighted only equation tokens bound to debt share, including the complementary equity weight. On numeric blur, the input became 27.10 and the highlight class cleared with a 0.75-second transition.
- A real pointer drag changed debt share from zero to 30.90%. After release, no active-edit classes remained; the matched value's background was still partially visible (rgba alpha 0.486) during its 0.75-second fade. No synthetic DOM input events were used.
- At 100% debt, the input displayed 100.00, r_a was 5.000%, WACC was 3.750%, and the mobile page did not overflow.
- A 101% share hid every worked numerical row and the result/diagram while retaining all three symbolic equations. Reset recovered the default scenario.
- Saved the 50%-debt/40%-tax scenario (7.500% WACC); increasing equity return to 14% gave 8.500% and a 1.000 pp comparison increase.
- Financing-debt help opens with Enter and closes with Escape. Return-on-assets help renders an actual lowercase HTML subscript a. The removed pre-tax-blend label is absent from visible page text.
- The optional debt-share chart draws correctly when expanded. Laptop and 360px screenshots were reviewed; mobile page width did not exceed the viewport. Browser warnings/errors were empty.

The CSS includes a reduced-motion override; a separate OS/browser preference-switch test was not performed. Actual detached file:// execution and a new v0.3 browser-download test are not claimed here; the known app-browser URL restriction and remaining release limitations above still apply. No commit or push was made during this review iteration.


Final precision refinement: all paired numeric/range inputs use a 0.01-percentage-point step. Numeric input commits to the displayed two-decimal value on blur, then recalculates, so the field, slider and model cannot disagree after a higher-precision entry. Browser check: entered 12.345% cost of equity; on blur the number and slider both became 12.35%, and both WACC equations/result showed 9.770%. Internal calculations retain precision after input normalization. Final source build/check still passes 17 JavaScript tests plus six packaging tests.


## v0.3.1 — sharing decision

The owner explicitly accepted the visualization and authorized commit/push after adding the pp explanation. The tax-shield and saved-comparison info now define percentage points using a 10%-to-9% example. Catalog availability is enabled so the accepted single-file demo is included in the public repository and Pages catalog.

Release exception: file:// execution with network blocked could not be automated because the app browser's URL policy forbids local-file navigation. It was not bypassed or claimed as performed. The owner accepted the UI; model tests, static single-file packaging and browser interaction checks support sharing this reversible educational demo. Actual detached/offline execution, other browser engines and real mobile devices remain unverified. The ready catalog label means available for sharing with this recorded coverage limit, not that those missing checks passed.


Final release checks: the updated tax-shield dialog visibly defines pp as percentage points with the 10%-to-9% example. The catalog lists one available demo with Open and Download HTML links. The app-browser download event watcher timed out during the final catalog download check; this final event-based download check is therefore not claimed as passed. The generated standalone file is still validated by the deterministic packaging check and model/presentation tests. Earlier browser download checks and this limitation are distinguished here rather than conflated.

Public v0.3.1 artifact: docs/downloads/wacc.html; 50932 bytes; SHA-256 fc45936e487b49d966d736086bccddeb672501ed71484e58d306efe395dff77e.

Local equation presentation update: see [equation alignment and fraction review](equation-layout-review.md) for cross-demo browser measurements and limits. Uncommitted; published release evidence above remains historical.

## November 6, 2026 — Accepted consistency release

Owner authorized commit and push of the reviewed revisions. Final equation alignment, amber glow/notation/graph-legend checks and catalog evidence are in [the shared release review](equation-layout-review.md). Prior draft-only restrictions are historical. Saved-file/offline and browser-coverage limits remain explicit there and above.
