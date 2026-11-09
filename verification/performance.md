# F7 Financial Performance & DuPont v0.1

Owner-approved desktop release v0.1, November 9, 2026. Commit/push authorized; standalone download generated. Illustrative examples; no course source reproduced.

## Scope

Four independent inputs: annual sales, annual common net income, average total book assets and average common book equity, all $ million. Exact three-factor DuPont identity with decimal substitutions, textbook fractions, percentage ROE headline, direct ROE and simple NI/assets ROA. Five presets, linked driver/input selection, shared notation/edit feedback, positive/negative return plot, proportional average balance sheet with residual other claims. Main assumptions collapsible; additional direct equations and symbol key closed by default. No causal financing/interest/risk model: equity changes hold net income fixed, explained in the equity and accounting-basis info dialogs. Other claims may include liabilities/preferred capital and are not labeled as interest-bearing debt. Denominators of zero produce Undefined; negative equity or equity>assets are outside scope.

## Checks

Build/check passed:76 Node plus10 Python packaging tests (86 total), including six new independent model tests. Reference10 NI/100 sales/50 assets/25 equity gives margin.1,turnover2,multiplier2,ROA.2,ROE.4. Tests cover contrasting operating examples, scale/sales cancellation, losses/zero income, zero denominators, identity grid, invalid inputs and isolation. JS syntax and diff whitespace passed.

macOS in-app desktop HTTP preview at localhost8778/performance.html:
- Default ROE40.00% and aligned .4000=.1000×2.0000×2.0000; fractions and balance-sheet values inspected in desktop screenshot.
- High-margin/low-turnover50/500/1000/500 shows10% ROE; low-margin/high-turnover50/2000/1000/500 keeps10% ROE with margin.025 and turnover2.
- Equity0 makes ROE/multiplier/product Undefined; Reset restores40% and equity25.
- NI−10 gives ROE−40% and a clear net-loss explanation. Reset restores defaults.
- Browser inspection caught equity slider snapping25 to30 with step10; changed to step1 and confirmed both field and slider25 after reload.

## Limits

Factor selection/pinning, help/Escape, all presets, invalid recovery, chart highlighting, balance-sheet extreme states and complete keyboard paths were not exhaustively browser-tested. Offline file opening, download completion, cross-browser behavior, console/network and reduced-motion diagnostics remain unverified. No mobile testing intended. Owner accepted the release with these verification limits recorded.

Owner refinement: ROA is now a prominent headline beside ROE, with ROA = PM × AT and aligned decimal substitution above the full DuPont identity. Direct NI/average-assets definition remains in optional equations/help. Default browser reload confirmed ROA20%, ROE40%, and0.2000=0.1000×2.0000. Build and86 checks pass.

Owner layout refinement: Equations moved below presets, above the main DuPont/assumptions area. Symbols & units is a nested disclosure inside it. Both start collapsed. Browser reload and expansion verified placement and nesting; preview/build and whitespace checks passed.


## Final release check

Removed the fixed-income banner at owner request; retained the explanation in equity/accounting help and zero-denominator warning when relevant. All five presets browser-checked: default ROA20%/ROE40%; contrasting margin/turnover both ROA5%/ROE10%; same-ROA leverage5%/20%; thin equity0.5%/10%. Invalid equity60 with assets50 clears outputs with validation; restoring25 recovers40% ROE. Profit-margin selection exercised, equity help verified and Escape restored trigger focus; Reset restored defaults. Final desktop screenshot inspected. Build/check pass86 tests; diff whitespace and local-path/credential-pattern scan pass. Catalog/download generated. No assertion of complete browser or offline coverage.
