# Editorial notes

## 2026-10-30 — Setup

The owner's latest instruction selects two public distribution repositories and one private intake workspace. This replaces the original specification's proposed combined repository. docs/downloads/ replaces its generic dist/ path; docs/index.html is each subject's catalog.

The input files are planning documents. Their internal statement that prior notes were reviewed describes an earlier planning pass, not a review performed in this setup. No original lecture-note PDFs, case readings or finance schedule screenshots were supplied here. Exact course-number verification remains pending.

F6's inherited tests include the contradictory sentence “No negative initial investment is allowed as data” alongside negative-initial-investment examples. The working F6 brief corrects this to permit signed cash flows including a negative initial investment; unusual patterns must be labeled. Its approximately 15% IRR example must be independently recomputed and tested with a stated tolerance rather than rounded to an exact identity.

No completed demos are included in this setup. All catalog statuses start planned. This records organization and engineering conventions, not a numerical validation of fourteen domain models.


## 2026-11-02 — DCF owner-review draft

The draft uses a declared steady-state terminal reinvestment model, FCF_(N+1)=NOPAT_(N+1)(1−g/q), with terminal NOPAT derived from R_N(1+g), current margin and tax. q is the assumed stable return on capital. This prevents terminal growth from being introduced without an investment assumption, but does not claim a full capital-balance reconciliation. The inherited FCF_1=100, r=10%, g=2% example is tested with a direct-cash-flow helper (value 1250), independently of this driver model's default case.

The course deck has two numbered slides per physical PDF page: slides 27–28 are on physical page 14, slides 31–32 on page 16, and slide 33 on page 17. Its firm-value terminology includes excess assets; the public tool instead labels PV of operations separately before adding excess cash and subtracting claims. Private source annotations/figures remain outside Git.
