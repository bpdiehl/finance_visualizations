# F6 — Investment Decisions: NPV & IRR

Status: owner-approved release v0.1.2, November 6, 2026. Catalog slug: npv-irr. Recommended build wave: 2.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## F6 — NPV, IRR & Project Investment Decisions

**One-sentence promise:** “Move a project's cash flows through time and see whether it creates value at the required return.”

**Class anchors:** `14-Discounted Cash Flows.pdf` slides 34–41 show the investment-evaluation sequence, a hot-dog-cart NPV worked example, IRR as the rate where NPV is zero and the NPV-versus-rate graph; slide 42 covers payback and profitability-index/ratio limitations. Class schedule: Oct. 27 NPV and IRR.

**Learning outcomes:** Treat NPV as dollar value created relative to required return; understand IRR as a root of the NPV function; explain when IRR and NPV agree and why scale/timing can reverse rankings between projects; distinguish accounting profit and discounted cash flows; identify unconventional cash-flow and reinvestment limitations.

**Main view:** User-edited **year-by-year cash-flow timeline** paired with an NPV curve plotted versus the discount rate. Draw current discount rate as a vertical line and NPV at that rate as a marked point. Show all IRR crossings, if multiple, with explicit warnings. Alternative comparison tab shows Projects A/B on the same graph.

**Controls:** CF0 and CF1…CFN, cost of capital, project A/B selector, preset cash-flow profiles, optional year units; optional payback horizon. Permit negative as well as positive periods and preserve exact t=0 timing.

**Outputs:** NPV, IRR(s) when mathematically found, decision vs required return for independently acceptable projects, undiscounted payback (and optionally discounted payback), PV of inflows/outflows, NPV per initial dollar if defined and labeled carefully, comparison of value created for mutually exclusive projects.

**Core rules:**

```
NPV(r) = sum_(t=0..N) CF_t / (1+r)^t
IRR = value(s) of r > −1 where NPV(r)=0
```

For conventional outflow followed by positive inflows, the usual IRR decision rule applies: accept if IRR exceeds cost of capital, given standard assumptions. For nonconventional cash-flow sequences, **multiple, no, or misleading IRRs** may appear; prioritize NPV. For two mutually exclusive projects, compare NPV at the correct common cost of capital rather than automatically choosing the higher IRR. Do not conflate firm valuation with *incremental project* NPV.

**Tooltips:**
- **NPV:** “The present value of all incremental project cash flows, including the money invested now. A positive NPV means the project is expected to create value above the required return.”
- **IRR:** “The discount rate that makes the project's NPV exactly zero. It is a break-even return measure, but unusual cash-flow patterns can give multiple or no valid IRRs.”
- **Cost of capital:** “The required return for a project of this risk. It is the hurdle used to decide whether the expected cash flows are sufficiently valuable.”
- **Payback:** “How long until undiscounted cash inflows recover the initial investment. Easy to explain, but basic payback ignores the time value of money and what happens after the cutoff.”
- **Incremental CF:** “Count cash flows that change if the project is undertaken. Remember investment, operating effects, working capital and eventual salvage.”
- **Mutually exclusive projects:** “When only one project can be chosen, compare the total *value added* by each, not simply the percentage return.”

**Presets:** (1) exact lecture illustration CF0=−187, CF1=110, CF2=121 at 10% → NPV=13; (2) initial investment −200 with same inflows → NPV=0 at 10%; (3) scale conflict between small/high-IRR and large/high-NPV projects; (4) multiple sign changes showing potential multiple IRRs.

**Tests:** CF=[−187,110,121], r=.10 gives NPV=13; IRR≈15%. CF=[−200,110,121], r=.10 → 0. Changing discount rate for conventional positive-inflow project decreases NPV monotonically. `CF=[−100,230,−132]` has two IRR roots at 10% and 20%; must flag ambiguity. Signed cash flows, including a negative initial investment, are allowed as data; the UI should label unusual patterns clearly. (Editorial correction; see EDITORIAL_NOTES.md.) For multiple/none, don't display a single unqualified IRR.

**Out of scope:** Real options, full project-risk Monte Carlo, complex MIRR and optimizing investment portfolios.


## Implemented pilot — November 4, 2026

One independent project, 1–8 future annual periods, year-zero cash flow, annual required return 0–50%. Signed cash flows bounded at ±10,000 dollars. Exact fields/sliders, per-year PVs, visible NPV/IRR equations, collapsed interactive key and curve over 0–50%. All finite real IRRs above −100% are isolated through positive roots of the discount-factor polynomial, including repeated roots; all-zero flows are a separate every-rate case. Roots outside the plotted range are listed in results. Original illustrative examples; no exact lecture replication claim.

Deferred: A/B mutually exclusive comparison, payback, profitability index and alternate period units. Owner approved publication on November 6, 2026. See verification/npv-irr.md for numerical and browser evidence.

## November 6, 2026 — v0.1.2 release

Owner authorized the reviewed changes for commit and publication. Includes aligned symbolic/numerical equations, textbook fractions, matching amber editing/selection feedback and consistent notation/graph legend styling. Prior draft restrictions above are historical. See verification/npv-irr.md and verification/equation-layout-review.md for evidence and limits.
