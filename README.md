# Finance — MBA Interactive Learning Lab

Interactive browser visualizations for MBA classmates. The goal is intuition: change an assumption, see the effect, and understand why.

**WACC & Capital Structure and Forecasting & DCF Valuation are available.** Other topics are planned. No GitHub account is needed to use the visualization.

## For classmates

Choose a topic in the [visualization catalog](https://bpdiehl.github.io/finance_visualizations/), select Download HTML, find the .html file in Downloads, and double-click it to open in your browser. Each download will work by itself offline. No coding, software installation or ZIP extraction is needed. A laptop is recommended.

[Open WACC](https://bpdiehl.github.io/finance_visualizations/downloads/wacc.html) or use the catalog’s Download HTML button. If a downloaded file opens in an editor, right-click → Open With → your browser. You can also [open DCF Valuation](https://bpdiehl.github.io/finance_visualizations/downloads/dcf.html). See verification/wacc.md and verification/dcf.md for tested coverage and limits.

## Topics

| Code | Topic / build brief | Build wave | Status |
| --- | --- | --- | --- |
| F1 | [Time Value of Money](specs/time-value.md) | 2 | Planned |
| F2 | [Risk, Diversification & CAPM](specs/risk-capm.md) | 3 | Planned |
| F3 | [WACC & Capital Structure](specs/wacc.md) | 1 | Available |
| F4 | [Accounting to Free Cash Flow](specs/free-cash-flow.md) | 2 | Planned |
| F5 | [Forecasting & DCF Valuation](specs/dcf.md) | 1 | Available |
| F6 | [Investment Decisions: NPV & IRR](specs/npv-irr.md) | 2 | Planned |
| F7 | [Financial Performance & DuPont](specs/performance.md) | 3 | Planned |

Build waves are priorities, not availability promises. See the [operations collection](https://github.com/bpdiehl/ops_visualizations) for the other seven topics.

## For maintainers and AI assistants

Read [AGENTS.md](AGENTS.md), [CONTRIBUTING.md](CONTRIBUTING.md), [shared requirements](specs/SHARED_REQUIREMENTS.md), and [DESIGN.md](DESIGN.md). Classmates do not need these tools:

~~~sh
python3 scripts/manage.py build
python3 scripts/manage.py check
~~~

| Location | Purpose |
| --- | --- |
| catalog.json | Topic IDs, titles, slugs, status and priority |
| specs/ | Working briefs, shared requirements and editorial corrections |
| src/<slug>/ | Editable model, UI, styles and page template |
| src/shared/ | Local reusable styles and glossary |
| tests/ | Packaging checks and future mathematical model tests |
| verification/ | Human-readable browser/model release evidence |
| docs/index.html | Generated class-facing catalog |
| docs/downloads/ | Generated ready single-file HTML downloads |
| templates/ | Maintainer page and verification starting points |
| scripts/ | Dependency-free Python packaging/check tool |

Ready downloads and the catalog are checked in. [Publishing instructions](PUBLISHING.md) use main → /docs for GitHub Pages. Original lecture files and the private source dump belong outside this repository.

[Rights and provenance](RIGHTS.md): a public reuse license has not been selected. The briefs derive from a supplied planning specification; referenced original course notes were not supplied or verified in this setup.

For local WACC development, run python3 scripts/manage.py preview wacc, then serve .preview/ with a local HTTP server. The preview is one self-contained HTML file. See verification/wacc.md for evidence and remaining checks.


DCF v0.4.2 includes a modified income statement extended to free cash flow, collapsible equations and linked notation, terminal reinvestment, sensitivity and an equity bridge. The approved standalone file is in `docs/downloads/dcf.html`. Run `python3 scripts/manage.py preview dcf` for local editing. See verification/dcf.md for evidence and remaining offline/download checks.
