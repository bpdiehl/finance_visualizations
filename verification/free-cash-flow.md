# F4 — Accounting to Free Cash Flow v0.2

November 6, 2026. Owner-approved release; known testing limits are retained below.

## Scope and assumptions

One period, signed FCF derived from nonnegative revenue/cost/depreciation/CapEx and opening/closing operating NWC. Dollar inputs0–1,000; tax0–100%. Immediate use of all operating tax losses is assumed and a visible note appears when EBIT is negative. No interest or financing cash flows. Original illustrative amounts. Component-level NWC, salvage, multiyear cash-event timeline and incremental/sunk-cost cases are deferred.

## Numerical and packaging checks

Build/check and diff whitespace pass. Finance57 Node checks (7 new F4) and9 Python packaging checks pass. Independent examples verify EBIT100, operating tax25, NOPAT75, FCF55; an extra20 depreciation increases FCF by5; zero-tax depreciation invariance; changes versus levels of NWC; release of working capital; heavy investment despite positive profit; negative-EBIT immediate loss relief; waterfall reconciliation across a grid; validation and input isolation.

## Browser evidence

Supported in-app browser on macOS (engine version not reported), local HTTP8777.

- Four presets: base55; working-capital build−5; heavy investment−35; more depreciation60. Reset restores base.
- Exact depreciation40 sets the slider40 and FCF60. Keyboard Right on slider updates exact value41.00. Opening/closing controls are in a native disclosure; closing90 against opening100 displays change−10.00.
- Revenue100 triggers the explicit operating-loss tax-benefit note. Tax101 displays validation, clears calculated outputs and disables download. Reset recovers.
- Free cash-flow help opens; Escape closes and restores focus. All4 D&A equation occurrences highlight when its key entry is selected.
- Laptop and full360px screenshots inspected. Narrow page scroll width360 equals viewport360. Equation/number fields fit, statement wraps labels, NWC balances remain gray and separated by a rule. Temporary viewport reset. Captured warning/error logs empty.

## Limits

No actual F4 download/save, file:// execution, network-blocked offline test, cross-browser/device test or live reduced-motion emulation. Static packaging has no runtime external assets. Catalog remains draft; public download unavailable pending owner review. This pilot shows a period reconciliation; it does not value an investment or automatically infer when asset spending occurred.

## EBIT reconciliation refinement

Primary equation EBIT=NI+I+T, with separate NOPAT equation and numerical lines immediately under their symbolic counterparts. Added interest expense in Income statement detail; NI and reported taxes computed consistently with the immediate loss-use assumption. τ is the rate; T is reported tax expense. Browser verified interest60 gives NI30, tax10, EBIT100, NOPAT75 and FCF55; Reset restores NI60, interest20, taxes20. Screenshot inspected and DOM confirmed each symbolic equation is immediately followed by its worked line.58 Node checks (8 F4) and9 Python checks pass. Earlier revenue-first statement evidence describes the superseded layout.

## Full bridge and release approval

Owner approved publication after asking for the complete NI-to-FCF plot. The full-width waterfall now has10 bars: NI, interest, reported taxes, EBIT, operating taxes, NOPAT, D&A, CapEx, ΔNWC and FCF. Blue bars are totals; adjustments use signed colors and labels. Operating statement and assumptions sit below the chart. All four browser presets retain10 bars with FCF−5,−35,60,55 respectively.

Full desktop/mobile screenshots inspected. At360px the document width is360 and the chart alone has850px internal scroll content inside a298px region. A scroll affordance appears; chart-region keyboard ArrowRight was attempted but no positive scroll offset was observed, so keyboard horizontal scrolling is not claimed verified. Temporary viewport restored. The final demo Download button saved free-cash-flow.html successfully. User review inputs were restored after checks.

59 Node checks (9 F4),9 Python checks, build/syntax/artifact sync and staged whitespace checks pass. Public catalog includes Open/Download links. Prior draft-only/download-unchecked notes describe earlier revisions. Isolated file execution/network-blocked offline testing remain unverified due browser protocol policy; this was disclosed at owner approval.
