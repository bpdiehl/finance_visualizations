# Finance local owner-review refinements — November 9, 2026

No Finance commit/push in this refinement task. The preceding Operations refinement was committed/pushed separately as e3b5b18.

Time Value of Money: moved Equations above the main workspace, made it initially closed, retained nested symbols. Added persistent per-payment-type frames: single5years/$200, annuity10years/$200, perpetuity12years/$300, bond10years/$1500. Frames expand only to fit shown cash/PV amounts and payment dates; never shrink automatically. Expanded range readout has amber styling. Fit view deliberately refits; Reset restores comparison frames. Frame endpoint is labeled when beyond the last payment. Show value today cannot silently shrink the frame.

Risk/CAPM: initially closed equation disclosure; assumptions column460px instead of365px, reducing chart width. WACC: all three r_a/WACC equations grouped inside an initially closed disclosure. Free cash flow and NPV/IRR: initially closed disclosures with internal equation grids retained. Accounting ROA/performance already has a collapsed equation panel; checked its toggle without changing its implementation.

Browser: single-payment preset pair retained5years/$200, values100/91.67. Raising amount1000 and year20 expanded to20years/$2000; returning110/year1 retained frame. Fit view reduced to1year/$200; Reset restored baseline. All other payment-type preset pairs retained their own comparison frames. Expanded main equation showed100=110/(1+.10)^1; panel precedes graph. CAPM column measured460px/chart692px in current desktop viewport; open equation retained9% substitution. WACC3, FCF3 and NPV2 aligned equation groups expand/collapse without document overflow. Performance2groups expand/collapse. Desktop screenshots inspected. Captured warnings/errors empty.

Build/check/diff and time-value JS syntax checks passed;97automated checks (87Node+10Python). Mathematical models unchanged. No new detached-file/offline/cross-browser/full-keyboard claims. Existing limits remain.


## Follow-up owner refinement

Time Value Fit view now has a five-year minimum, with annuity's initial comparison frame also five years. Single-payment Fit view was verified at today–5years. Replaced Show value today checkbox appearance with a labeled native-input switch; clicking the label removes gold bars and Space toggles them back. Focus outline is visible; reduced-motion shared rules remain applicable.

Risk/CAPM assumptions column now560px and primary/secondary SVG plots capped at500px. Browser checked CAPM/CAL/Diversification/Beta: each primary graph500px, column560px, no document overflow in desktop viewport. Screenshot inspected, logs empty. This supersedes the earlier460px/692px measurements. No commit/push;97checks continue passing.


## Year ticks and risk-graph typography follow-up

Time Value draws a labeled tick for every whole year in the current frame, including1–5 even when only year1 has a payment. Payment bars retain fractional-period labels for coupons without duplicating integer-year labels; Today appears once. Browser confirmed initial1–5 and1–8 after extending the payment date to8, then Reset restored1–5.

Risk graph SVG ticks enlarged to22units and axis titles24units (about13.75/15screen pixels at500px SVG width), annotations20units, with wider left/bottom margins. Square CAPM/CAL/Beta plotting regions remain square. Browser inspected CAPM, CAL, Beta and Diversification; text remains within SVG width and desktop screenshots were inspected. During the batch click audit a Diversification click left CAL selected; a direct follow-up selected Diversification successfully and its larger labels were confirmed. No application error logs captured. Source and generated files remain uncommitted for review.97checks pass.


## Diversification full width and50 annual observations

Owner requested the Diversification graph use the panel's full content width, then requested matching on-screen graph text size. Only Diversification removes the500px cap. Text sizes compensate for the SVG expansion on draw and resize. Browser measured500px/22-unit ticks on CAPM and734px/14.9864-unit ticks on Diversification, yielding the same13.75px rendered size. Panel width780px minus44px padding and2px borders equals734px. Screenshot inspected. Other tabs retain their500px cap.

Owner selected a round50 simulated annual return pairs for Beta. Generator, legend, secondary-period range and help now use50; this remains synthetic annual data. Browser verified50 clickable dots and selected observation50 successfully. Existing moment/reproducibility checks pass with the changed sample size;97total checks. Captured warning/error logs empty. Source/generated changes uncommitted for review.


## Owner-authorized release

Owner accepted the refinements and requested commit/push November9,2026. Final build,97automated checks and diff whitespace checks pass. Source and generated files included. Earlier uncommitted/review-only statements are historical. Previous detached-file/offline/cross-browser coverage limits remain. Deployment is verified after push.
