# Finance — MBA Interactive Learning Lab

Interactive browser visualizations for MBA classmates. The goal is intuition: change an assumption, see the effect, and understand why.

**The collection is being built. No visualizations are available yet.** The topics below are planned. No GitHub account will be needed to use finished downloads.

## For classmates

Once available, choose a topic in the [visualization catalog](docs/index.html), select Download HTML, find the .html file in Downloads, and double-click it to open in your browser. Each download will work by itself offline. No coding, software installation or ZIP extraction is needed. A laptop is recommended.

GitHub displays HTML source rather than running the catalog. The intended class link will be the GitHub Pages address after the owner enables and verifies it. Until then, a tested HTML file can be shared directly. If a file opens in an editor, right-click → Open With → your browser.

## Planned topics

| Code | Topic / build brief | Build wave | Status |
| --- | --- | --- | --- |
| F1 | [Time Value of Money](specs/time-value.md) | 2 | Planned |
| F2 | [Risk, Diversification & CAPM](specs/risk-capm.md) | 3 | Planned |
| F3 | [WACC & Capital Structure](specs/wacc.md) | 1 | Planned |
| F4 | [Accounting to Free Cash Flow](specs/free-cash-flow.md) | 2 | Planned |
| F5 | [Forecasting & DCF Valuation](specs/dcf.md) | 1 | Planned |
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
