# F1 — Time Value of Money

Status: planned. Catalog slug: time-value. Recommended build wave: 2.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## F1 — Time Value of Money, Perpetuities & Bond Pricing

**One-sentence promise:** “See how the same dollars at different times and risks have different values today.”

**Class anchors:** 9.8 TVM notes emphasize a time line and present/future value; 9.15 discount rates covers perpetuities/growing perpetuities; 9.22 bond notes include coupon payments, yield, market pricing and maturity; the finance schedule includes the pricing of stocks and bonds.

**Learning outcomes:** Move cash flows across time consistently; understand compounding and discounting; understand why a perpetuity/growing perpetuity has finite present value under the stated conditions; understand coupon-bond price/yield inverse relation.

**Primary view:** A horizontally scrolling **cash-flow timeline** from t=0 to t=N. Each cash-flow bar's present-value contribution is shown underneath. A toggle changes between cash flow amount and present value. An optional shaded tail beyond N represents a perpetuity.

**Modes:** Single payment/finite irregular cash flows; annuity/perpetuity/growing perpetuity; coupon bond. Bond calculations must use cash-flow frequency correctly and keep market yield distinct from coupon rate.

**Controls:** Cash flow amount(s), timing, discount/required return, growth `g`, number of periods, coupon/par/maturity/frequency/yield in bond mode. Input fields permit exact values; sliders are for realistic ranges.

**Core mathematics:** `FV = PV(1+r)^n`, `PV = FV/(1+r)^n`, `PV = Σ CF_t/(1+r)^t`; level perpetuity `PV=C1/r` for first payment at t=1 and r>0; growing perpetuity `PV=C1/(r-g)` with r>g and consistent periods; ordinary annuity `PV=C × [1−(1+r)^(-N)]/r` for r≠0; coupon bond = PV(coupons) + PV(principal). For r=0 annuity PV=N×C; invalid perpetuity assumptions require a helpful warning rather than infinite bars.

**Tooltips:**
- **Discount rate:** “The opportunity cost of investing funds for this period and risk. It tells us how heavily to discount future dollars into current value.”
- **Present value:** “The amount of money today economically equivalent to a future amount, given the specified return. Farther-away money generally contributes less present value.”
- **Perpetuity:** “A level payment expected to continue indefinitely, starting next period. It can have finite present value because increasingly distant payments are discounted.”
- **Growing perpetuity:** “Payments grow by the same percentage each period forever, starting with next period's cash flow. This simple formula requires discount rate above growth rate.”
- **Bond yield:** “The market return implied by the price and promised bond payments under the stated assumptions. A higher required yield makes the present value of fixed payments lower.”
- **Coupon versus yield:** “Coupon rate determines the promised coupon dollars, while yield reflects the current market discount rate. They need not be the same.”

**Presets:** $100 one year from now at 10%; perpetuity of $100/year at 5%; growing perpetuity with g near r (sensitivity); coupon bond with equal coupon rate and YTM (at par) versus YTM rise (discount).

**Tests:** $110 in one year at 10% → PV=$100. $100/year perpetuity at r=.05 → PV=$2,000. Growing perpetuity C1=$100, r=.08, g=.03 → PV=$2,000. Bond with coupon rate=yield and matching frequency priced at par (ignoring accrued interest and under conventional timing). Invalid r≤g gives warning and no numeric perpetuity PV.

**Out of scope:** Complex floating-rate instruments, default-adjusted bond valuation, market yield curve bootstrapping.
