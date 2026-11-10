# Finance feedback implementation — November 10, 2026

Local owner-review update: WACC v0.4 and Risk/CAPM v0.4.2. No commit, push or deployment in this task. Existing ready catalog entries are retained; local generated HTML contains the new review versions.

## Scope and mathematical assumptions

Risk/CAPM labels, axis name, presets, results, notation key and help now say **Equity beta**. Existing β / β_i notation remains consistent with the equations. Help distinguishes the equity’s systematic exposure from the market portfolio’s own beta of 1. Underlying CAPM calculations are unchanged.

WACC retains fixed component rates and adds a Fixed asset return tab. Let d = D/V:

- r_d = r_f + λ d (r_a − r_f), an explicitly illustrative required-return schedule.
- r_e = (r_a − d r_d)/(1 − d), solving the pretax weighted-provider identity.
- r_a = (1 − d) r_e + d r_d, fixed by assumption.
- WACC = r_a − d r_d T, with a fully usable interest deduction.

Limits: 0 ≤ d ≤ .9; 0 ≤ r_f ≤ r_a ≤ .3; 0 ≤ λ,T ≤ 1. These keep the equity denominator positive, debt return at/below asset return and both required investor returns nondecreasing across d. With a positive asset risk premium and λ > 0, both rise. At λ = 0 debt return is flat; with zero asset premium both investor rates are flat. With T = 0 or zero debt return, WACC is flat. No universal capital structure optimum, empirical debt schedule or complete corporate-tax valuation equilibrium is asserted. Required debt return is distinguished from promised bond yield. The scope disclosure names distress, deduction limits and valuation feedback omissions.

Independent examples (r_a=10%, r_f=4%, λ=.5, T=25%): d=40% gives r_d=5.2%, r_e=13.2%, WACC=9.480%; d=60% gives 5.8%, 16.3%, 9.130%. At zero debt, r_e=WACC=r_a=10%; debt return is hypothetical. No-tax WACC stays 10% at every debt share.

Concept references reviewed in this task: [Damodaran on equity beta and business versus equity risk](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/littlebook/discountrates.htm), [capital structure and costs of financing](https://people.stern.nyu.edu/adamodar/pdfiles/acf2E/Chap8.pdf). The λ schedule is original teaching content, not a formula attributed to those references. Fixed r_a plus the displayed tax bridge is a conditional teaching illustration, not a substitute for their full valuation models.

Both affected demos show governing equations and live substitutions directly in the page. This supersedes their earlier collapsed-equation presentation notes for this revision.

## Fresh verification

- `python3 scripts/manage.py build`: succeeds; deterministic standalone outputs regenerated.
- `python3 scripts/manage.py check`: succeeds, 90 Node tests + 10 Python tests. Three new domain tests cover independent reference examples, conservation/ordered curves/tax boundaries and invalid inputs/immutability. Existing finance regression tests pass.
- Source/generated scan: no remaining “market beta” labels.
- Browser: Codex in-app browser on macOS, local HTTP. Engine/version not captured.
- WACC: starting, more debt, all-equity, no-tax and Reset observed. Live numbers match independent examples. Existing fixed-rate default remains 9.525%; its more-debt preset remains 7.050%.
- Tab selection and ArrowLeft keyboard switching observed. λ=0 produces r_d=4%, r_e=14%, WACC=9.6% at d=40%; at d=90%, r_e=64%, WACC=9.1%. A risk-free rate above asset return displays an error; a 100% debt entry clears results/chart and hides numerical substitutions while retaining symbolic equations. Reset recovers.
- WACC desktop and 360px screenshots inspected. At 360px document width is 360px; long equations scroll within their own groups. Result labels, graph legend, axes and units are readable. Full screenshot inspected; review image retained outside the repository.
- Risk: all four views inspected; old label absent. Equity-beta help opens and Escape closes with focus restored. Desktop widths tested; all four modes have document width 360px at a 360px viewport after responsive fixes. Phone Beta screenshot inspected.
- Captured warning/error logs empty for both demos.

## Coverage limits

No new catalog download-event test, detached file:// execution with network blocked, other browser engines, full keyboard audit or reduced-motion preference-switch test was performed. Single-file packaging checks pass; they do not establish offline runtime coverage. Those release limits remain explicit and owner review is next.


## Owner correction — November 10, 2026

Equations use a native, initially collapsed Equations disclosure. This supersedes the visible-equation presentation described above. WACC places equations above the workspace in both modes, and its mode selector follows the rounded segmented style used in Time Value and Risk/CAPM. Live substitutions, aligned notation and mathematical models are preserved.

Owner-correction verification: final build/check and whitespace checks pass (100 checks). Browser observed both WACC Equations disclosures initially closed, expanded live results (9.525% fixed-rates and 9.480% fixed-asset-return WACC), and collapse with click/Space. Fixed-asset-return Equations precedes the chart (top 281px versus chart 389px at the inspected desktop size). The mode group uses the reference 9px rounded container, muted gray-blue fill and white selected segment. Document width remains 360px at a 360px viewport; captured warning/error logs empty. Screenshot inspected. Model unchanged.
