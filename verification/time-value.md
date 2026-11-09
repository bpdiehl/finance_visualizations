# Time Value of Money v0.1 — local review draft

November 9, 2026. Owner authorized commit and push November 9, 2026; catalog ready. All examples are original illustrations. Local preview: time-value.html.

## Delivered scope

Four modes: single payment; ordinary/due annuity; level/growing perpetuity; fixed coupon bond. All values come from one pure model. Rate conventions and payment timing are explicit in info controls and symbols. Perpetuity total includes the exact tail beyond 12 plotted payments. Bonds assume valuation on coupon date and equal periods, nominal annual yield compounded at coupon frequency, no default/accrued interest/taxes/fees. Negative annual rates down to −10% are supported when perpetuity convergence holds. Desktop target at owner's direction.

## Automated evidence

Build and repository check passed: 70 Node tests plus 10 Python packaging tests (80 total). Eight new independent model tests cover 110→100, discounting/compounding reversal, annuity/due timing and zero rates, exact perpetuity values and tail accounting, coupon-frequency/par/zero-coupon pricing, yield response, scaling, negative rates and invalid input. Source syntax and diff whitespace checked. Draft does not produce a public downloadable artifact.

## Browser evidence — macOS in-app browser

- Default 110 in year 1 at 10% displayed PV100, with inverse FV110 equation and textbook fraction; numerical terms align with symbols. Desktop screenshots inspected.
- Five annual payments of100 at10% displayed379.08; first payment today switched to416.99 and period0 calculation100=100/(1.10)^0.
- Level perpetuity100 at5% displayed2000, first12 PV886.33 plus tail1113.67. Setting g=5% suppressed values with an r>g validation message. Growth-near-return preset r8%/g7% showed10000, plotted PV1056.24 and remaining8943.76.
- Semiannual bond at par displayed1000, coupons25, 20 periods and2.50% periodic yield. Yield8% preset showed796.15, coupons25, 20 periods and4.00% periodic yield. Bond maturity input uses Y years, separate from period count N.
- Reset restored single-payment defaults, PV100 and comparison on. Information dialog opened and Escape closed it, returning focus to its trigger.
- Initial preview server startup required the environment's local socket permission; after permission the HTTP preview loaded normally.

## Limits

Offline file:// execution, download completion, cross-browser coverage, reduced-motion emulation, all keyboard/chart-selection paths, frequency-menu changes and all numeric extremes have not been browser-tested. Console/network diagnostics were not audited. No mobile testing or optimization intended. Offline file behavior remains unverified.


## Owner refinement — payment types and value notation

Payment types now come first as the primary selection. Examples below are filtered to that type, with an active-example indicator. Choosing a type loads its own baseline; Reset restores the selected type's baseline instead of changing type. Manual assumption edits update the example indicator. V₀ denotes value today and Vₜ payment-date value; these replace PV/FV/CF in equations, input labels, results and the relevant-only symbol key. Single payment timing uses t. C remains the repeated payment, with C₁ for first perpetuity payment.

Rebuilt/rechecked:80 automated checks pass. Browser confirmed single-payment V₀/Vₜ equations and labels; perpetuity shows only its two examples; selecting Growth near return and Reset preserves Perpetuity and restores2000; Coupon bond shows only its two examples and1000 baseline; Annuity shows Five payments and379.08. Expanded desktop screenshot inspected. Owner then requested release.

Owner follow-up: discount rate is labeled directly; equation substitutions show the decimal (10% input appears as0.10, bond periodic yield is likewise decimal), while controls remain %/year.
