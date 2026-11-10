# Editorial notes

## 2026-10-30 — Setup

The owner's latest instruction selects two public distribution repositories and one private intake workspace. This replaces the original specification's proposed combined repository. docs/downloads/ replaces its generic dist/ path; docs/index.html is each subject's catalog.

The input files are planning documents. Their internal statement that prior notes were reviewed describes an earlier planning pass, not a review performed in this setup. No original lecture-note PDFs, case readings or finance schedule screenshots were supplied here. Exact course-number verification remains pending.

F6's inherited tests include the contradictory sentence “No negative initial investment is allowed as data” alongside negative-initial-investment examples. The working F6 brief corrects this to permit signed cash flows including a negative initial investment; unusual patterns must be labeled. Its approximately 15% IRR example must be independently recomputed and tested with a stated tolerance rather than rounded to an exact identity.

No completed demos are included in this setup. All catalog statuses start planned. This records organization and engineering conventions, not a numerical validation of fourteen domain models.


## 2026-11-02 — DCF owner-review draft

The draft uses a declared steady-state terminal reinvestment model, FCF_(N+1)=NOPAT_(N+1)(1−g/q), with terminal NOPAT derived from R_N(1+g), current margin and tax. q is the assumed stable return on capital. This prevents terminal growth from being introduced without an investment assumption, but does not claim a full capital-balance reconciliation. The inherited FCF_1=100, r=10%, g=2% example is tested with a direct-cash-flow helper (value 1250), independently of this driver model's default case.

The course deck has two numbered slides per physical PDF page: slides 27–28 are on physical page 14, slides 31–32 on page 16, and slide 33 on page 17. Its firm-value terminology includes excess assets; the public tool instead labels PV of operations separately before adding excess cash and subtracting claims. Private source annotations/figures remain outside Git.


## November 10, 2026 — Feedback interpretation

Equity beta describes the equity’s systematic exposure to market returns; the market portfolio’s own beta is 1. WACC feedback supplies one weighted-return identity but requires an additional relationship to determine both investor returns. v0.4 explicitly supplies an illustrative bounded debt-risk schedule and solves equity return from the identity. Fixed pretax r_a with the tax bridge is imposed as a teaching assumption, not presented as a full corporate-tax equilibrium. WACC falls conditionally with a usable shield and increasing d r_d; flat cases are supported. References and validation: verification/finance-feedback.md. No course quotation or exact case reproduction is asserted.
