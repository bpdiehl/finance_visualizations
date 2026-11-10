# F6 — NPV & IRR v0.1

November 4, 2026. Local owner-review draft; no commit/push or public download release in this task.

## Scope

One independent project, annual year-end cash flows after year zero, 1–8 future periods. Signed dollar amounts up to ±10,000, required return 0–50%. Main equations, exact/slider entries, per-year PV, NPV curve over 0–50%, all computed finite real IRRs above −100% and explicit all-zero handling. Multiple/no roots never reduced to a single percentage. Original illustrative examples. A/B comparison, payback and profitability index deferred.

## Model and packaging evidence

`python3 scripts/manage.py build`, `check` and `git diff --check` passed after final source edits. 50 Node model/formatting tests (9 F6) and 9 Python packaging tests pass. New cases independently check NPV13, zero at10%, roots10/20%, tangent10%, no root, every-rate zeros, negative/outside-chart roots, four roots in a higher-degree polynomial, zero time-zero coefficients, scaling, monotonicity, input isolation and validation. An initial scaling test used values above the input limit; corrected the test scale to stay inside the documented domain.

IRR isolation uses positive discount-factor roots with derivative critical points and bisection. Floating-point tolerances apply; very close roots or extremely tiny cash-flow coefficients are numerical limits, not a symbolic proof. Root labels use two decimals; the worked zero condition uses ≈ to reflect rounding.

## Browser evidence

Supported in-app browser on macOS; engine version not reported. Local HTTP preview on port8777.

- Presets: Value created → NPV13.00/IRR15.06%; Break-even →0.00/10.00%; Two IRRs →NPV0.19 at15% and IRRs10.00%/20.00%; No IRR →NPV−91.74 and No IRR. Reset restores defaults.
- Exact CF1=150 synchronized its slider; keyboard Right changed both to151. Increasing project length to4 added two zero-flow columns and retained existing flows.
- Required return51 showed the error, cleared numerical results/plot and disabled download. Reset recovered. Exact return20 synchronized its slider; with CF1=150 the NPV was22.03.
- Expanded symbol key and selected t: all9 equation occurrences, including nested cash-flow indices and powers, were highlighted. NPV help opens; Escape closes and restores focus to Explain NPV.
- Screenshots inspected at normal laptop width and360px, including the full narrow page. Document scroll width345 at360px; cash-flow columns scroll inside their panel. Vertical plot title runs along the left. Temporary viewport restored. Captured warning/error logs empty.
- Download button produced `npv-irr.html` in Downloads. Copied the file alone to a fresh temporary folder. Opening file:// was rejected by the browser's protocol policy; no bypass attempted. Actual isolated file execution and network-blocked offline operation remain unverified. Static packaging checks permit no runtime external assets.

## Limits

No cross-browser/device testing, live reduced-motion emulation or instrumented network-request audit. Catalog download flow is deferred while catalog status remains draft. The local preview is retained for owner review.

## November 6 — added-year values

New years repeat the last existing future cash flow; timing help explains the editable default. Browser verified extending2→4 years produced121.00 in both added years; editing year4 to175 then extending to5 produced175.00 in year5 and retained prior entries. Preview rebuilt; JS syntax and diff whitespace checks passed. Restarted the stopped local preview server on8777 (session89026). Earlier zero-fill evidence describes the superseded behavior.

Project length now uses a native number stepper (1–8 years), with visible up/down arrows and exact entry. Browser inspected the stepper and exercised ArrowUp/ArrowDown; timeline and valuation updated. Invalid typed lengths leave the last valid model intact and restore its length on blur. JS syntax and diff whitespace checks pass.

Owner then requested reverting the stepper. Restored the native1–8 year dropdown and removed stepper-specific handlers/style. Browser confirmed SELECT with8 options and restored the owner's current cash flows, required return and four-year horizon across refresh. Added-year cash-flow carry-forward is retained. Preview rebuild, JS syntax and diff whitespace checks pass.

## November 6 — owner-approved release

Owner requested commit/push and inclusion on the main Finance page. Catalog set ready; release v0.1.1 generates a standalone file with Open/Download actions. Existing isolated-file and offline testing limits remain disclosed above.

Deployment verification: the public Finance catalog and `downloads/npv-irr.html` exactly matched the released local files after push952c343. The live catalog showed3 available demos and NPV Open/Download links; following Open rendered NPV13.00. A click on the live catalog Download link did not produce an observed browser download event before timeout, so that specific save flow is not claimed verified. The demo's own download was verified earlier.

Local equation presentation update: see [equation alignment and fraction review](equation-layout-review.md) for cross-demo browser measurements and limits. Uncommitted; published release evidence above remains historical.

## November 6, 2026 — Accepted consistency release

Owner authorized commit and push of the reviewed revisions. Final equation alignment, amber glow/notation/graph-legend checks and catalog evidence are in [the shared release review](equation-layout-review.md). Prior draft-only restrictions are historical. Saved-file/offline and browser-coverage limits remain explicit there and above.


## Local presentation review

See [Finance refinement evidence](finance-review-refinements.md) for the current uncommitted equation/layout/scale changes and browser coverage.
