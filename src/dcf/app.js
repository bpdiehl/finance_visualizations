(() => {
  "use strict";
  const M = globalThis.DemoModel, $ = id => document.getElementById(id);
  const fixed = n => n === null || !Number.isFinite(n) ? "—" : Math.abs(n) >= 100000 ? n.toExponential(2) : n.toFixed(2);
  const percent = n => fixed(n * 100) + "%";
  const META = {
    revenue: ["Base-year revenue", "R<sub>0</sub>", "$ million"],
    salesGrowth: ["Sales growth", "s", "%/year"], margin: ["Operating margin", "m", "% of revenue"],
    tax: ["Operating tax rate", "T", "%"], depreciation: ["Depreciation / revenue", "d", "%"],
    capex: ["CapEx / revenue", "c", "%"], workingCapital: ["Operating NWC / revenue", "w", "%"],
    discountRate: ["WACC", "r", "%/year"], terminalGrowth: ["Terminal growth", "g", "%/year"],
    terminalReturn: ["Terminal return on capital", "q", "%/year"],
    years: ["Forecast length", "N", "years"], cash: ["Excess cash", "C", "$ million"],
    debt: ["Debt & other claims", "D", "$ million"], shares: ["Diluted shares", "S", "million shares"]
  };
  const HELP = {
    model: ["An illustrative unlevered DCF", "Forecast annual operating cash flows for debt and equity providers, then discount them at WACC. This simplified model uses constant forecast margins, tax and investment ratios, an end-of-year convention, and a distinct stable-growth terminal phase. All amounts are nominal USD millions, except dollars per share. Debt and cash do not automatically change WACC. Inputs are illustrative, not fitted to a company."],
    statement: ["From income statement to free cash flow", "Read down each year: revenue less operating costs and depreciation gives operating profit (EBIT). The margin input determines EBIT; operating costs before depreciation are the implied remainder, not a separate forecast assumption. Subtract tax to get NOPAT, then add back depreciation and subtract CapEx and the change in operating working capital. Parentheses mean a deduction or negative amount; a fall in working capital releases cash. NWC is a balance shown separately below, not another cash-flow deduction. This is an operating forecast with a cash-flow extension, not a complete accounting income statement: financing interest, net income and dividends are omitted. Discount factors are unitless; all other table amounts are USD million. The separate N+1 column uses terminal growth g and net reinvestment NOPAT × g/q. Dashes mean those individual accounting ratios are not forecast in the stable phase. Its FCF is already included in terminal value; do not add it again to forecast PV. Select an explicit forecast year to inspect its equations."],
    revenue: ["Base-year revenue R₀", "Revenue in the year immediately before the forecast. Year t revenue is R₀(1+s)^t. Initial operating working capital is wR₀, so the first forecast change in working capital includes the investment needed for first-year sales growth. Revenue is not itself cash flow."],
    salesGrowth: ["Forecast sales growth s", "The annual revenue growth rate during the explicit forecast only. More sales can bring more operating profit, but also require capital spending and working capital. Growth can reduce cash flow if those investment needs are large. Terminal growth g takes over after the last explicit forecast year."],
    margin: ["Operating margin m", "EBIT divided by revenue, after depreciation and operating costs but before financing interest and tax. The model applies the same margin to every forecast year and the stable terminal year. This is a scenario assumption, not an estimated accounting return on assets."],
    tax: ["Operating cash tax rate T", "The model taxes operating profit at T before financing interest. For simplicity it applies the same tax rate symmetrically to profits and losses, assuming any modeled tax benefits can be used immediately. A real loss-making company may need a separate tax-loss schedule. This is not a jurisdiction-specific tax calculation."],
    depreciation: ["Depreciation ratio d", "Depreciation DAₜ is d times that year's revenue. It is already included in the operating margin, so add it back after calculating after-tax operating profit: it is an accounting expense, not a current cash payment. Cash purchases of operating fixed assets are subtracted separately as CapEx."],
    capex: ["Capital expenditures c", "CapExₜ is c times revenue: cash invested in operating fixed assets, including replacement and expansion. It reduces free cash flow now. Depreciation is added back separately. Forecast ratios do not carry unchanged into the terminal phase, which instead uses a growth/return-on-capital reinvestment model."],
    workingCapital: ["Operating working capital w", "Operating NWC is w times revenue. Cash flow subtracts the CHANGE in NWC, not its entire balance each year. Use operating current assets less operating current liabilities: for example receivables plus inventory and required operating cash, less payables. Excess cash and financing debt are excluded and valued in the equity bridge."],
    discountRate: ["WACC r", "The annual required return for these unlevered operating cash flows, with consistent currency, inflation and risk assumptions. Positive cash flows have lower present values at higher discount rates. The debt input in the equity bridge does not recompute WACC; this lab isolates the assumptions. Financing interest is not subtracted again from free cash flow."],
    terminalGrowth: ["Terminal growth g", "The steady annual growth rate after the explicit forecast. A growing perpetuity requires r > g. Growth must also be supported by reinvestment: the terminal model retains g/q of after-tax operating profit, where q is terminal return on capital. Raising g changes both future profit and the investment needed to earn it; growth does not always increase value."],
    terminalReturn: ["Terminal return on capital q", "q is the assumed after-tax operating return earned on capital in stable growth. Required net reinvestment is g/q of terminal operating profit. That reinvestment covers fixed assets and operating working capital together, so neither is deducted again in terminal cash flow. This is a simplified terminal-state assumption, separate from the explicit forecast ratios; the model does not track the full invested-capital balance."],
    years: ["Forecast horizon N", "The number of explicit annual forecasts, starting at year 1. The terminal value sits at the END of year N and covers year N+1 onward. Discount it N periods to today. Extending N keeps the forecast-phase assumptions for more years before switching to the terminal phase."],
    cash: ["Excess cash C", "Cash and separately valued liquid assets not required to generate the forecast operating cash flows. Add their current value once, after valuing operations. Required operating cash belongs in operating working capital instead. This simple bridge assumes cash is fully available to owners without further tax or transaction costs."],
    debt: ["Debt and other claims D", "Current market value of interest-bearing debt and other separately valued non-common-equity claims, if applicable. Do not subtract operating payables again: they are already reflected in operating NWC. In this lab, changing D changes the residual equity value dollar for dollar while holding operating cash flow and WACC fixed."],
    shares: ["Diluted shares S", "The assumed number of common-equity shares after dilution, in millions. Divide equity value in $ millions by shares in millions to get dollars per share. This simplified single-class bridge does not separately value complex options, preferred shares, pensions or minority interests; include relevant separately valued claims in D when appropriate."],
    fcf: ["Forecast free cash flow FCFₜ", "Revenue times operating margin gives EBIT. EBIT(1−T) gives after-tax operating profit, NOPAT. Add back depreciation, subtract capital expenditures and the increase in operating NWC. No financing interest or debt repayment is deducted here. The year picker and cash-flow bars select which year's values appear in the worked equation."],
    terminal: ["Terminal cash flow and continuing value", "First calculate year N+1 revenue as Rₙ(1+g), keeping the margin and tax rate. Its after-tax operating profit is NOPATₙ₊₁. Net reinvestment is NOPATₙ₊₁ × g/q, leaving FCFₙ₊₁. Terminal value TVₙ = FCFₙ₊₁/(r−g) is a value at year N, not today. This terminal model requires positive stable operating profit. Negative g assumes capital can be released as operations shrink."],
    operations: ["Present value of operations Vop", "Discount each forecast year's free cash flow by its own year number. Separately discount terminal value from year N by exactly N periods. Add those present values to get operating enterprise value Vop. It excludes excess cash and separate financing claims. This is an operating asset valuation, not NPV after subtracting a purchase price. Displayed amounts are rounded; calculations retain full precision."],
    equity: ["From operating value to equity", "Add excess cash C to operating value Vop, then subtract debt and other claims D. The remainder E belongs to common equity under these simplified assumptions. Divide by diluted shares S for the implied value per share P. If the bridge is negative, claims exceed this modeled asset value: show the shortfall, but do not present it as a meaningful share-price estimate."],
    cashflowChart: ["Annual cash flow versus present value", "Light bars are forecast FCF at the end of each year; dark bars are the same cash flows discounted to today. Select a bar to inspect that year in the equations. The gold N+1 bar shows the first terminal-year FCF at growth g. It has no separate PV bar: the entire future stream is priced through TV at year N and shown in the terminal-PV composition. Do not add the gold cash flow again. Signed cash flows retain their signs. Axes use $ millions."],
    terminalShare: ["How much value comes from the terminal phase?", "Terminal share is the present value of continuing operations after year N divided by total operating value. A high share means much of this valuation rests on assumptions beyond the explicit forecast. The composition bar and percentage are shown only when both contributions are nonnegative and operating value is positive. Signed contributions still appear numerically otherwise."],
    sensitivity: ["WACC and growth sensitivity", "Each cell is operating value in $ millions, using the same model at the displayed WACC and terminal growth. Axes center on your inputs in 0.50 percentage-point steps; the outlined center is the current case. Phones show the central 3×3 cells of the full 5×5 grid. One percentage point is the difference from 10% to 11%. Hatched cells are unavailable. This is scenario sensitivity, not a probability distribution or confidence interval."],
    comparison: ["A saved comparison", "Save the current assumptions as a baseline, then change a control to see the difference in operating value and per-share value. Presets change assumptions; Reset restores both the original assumptions and original comparison. All rates and money inputs keep two decimal places. Very large values use scientific notation, for example 1.00e+5 means 100000.00."],
    sources: ["References and model choices", "Original illustrative examples and graphics. Governing DCF formulas and the terminal growth/reinvestment link were checked against the primary references below. The terminal reinvestment model is an explicit modeling choice; it is not an exact reproduction of a class case."]
  };
  const MAIN = ["salesGrowth", "margin", "discountRate", "terminalGrowth"];
  function makeControl(key, slider) {
    const [label, symbol, units] = META[key], rate = M.RATE_KEYS.includes(key), [lo, hi] = M.RULES[key], scale = rate ? 100 : 1;
    const wrap = document.createElement("div"); wrap.className = "control";
    const input = key === "years" ? `<select id="${key}-number">${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}</select>` : `<input id="${key}-number" type="number" min="${lo * scale}" max="${hi * scale}" step="0.01" inputmode="decimal">`;
    wrap.innerHTML = `<div class="control-name"><label for="${key}-number">${label}&nbsp;<span class="symbol">${symbol}</span></label><button type="button" class="info" data-help="${key}" aria-label="Explain ${label.toLowerCase()}">i</button></div><div class="number-row">${input}<span>${units}</span></div>${slider ? `<input type="range" id="${key}-range" min="${lo * scale}" max="${hi * scale}" step="0.01" aria-label="${label} slider">` : ""}`;
    $(slider ? "primary-controls" : ["revenue", "tax", "depreciation", "capex", "workingCapital", "years"].includes(key) ? "forecast-controls" : "ownership-controls").append(wrap);
  }
  // An in-page HTML export contains the rendered controls. Rebuild these
  // containers once so reopening that copy never duplicates controls or IDs.
  for (const id of ["primary-controls", "forecast-controls", "ownership-controls", "presets"]) $(id).replaceChildren();
  $("equation-details").open = false;
  $("forecast-details").open = true;
  $("cashflow-reminder").open = false;
  Object.keys(M.DEFAULTS).forEach(key => makeControl(key, MAIN.includes(key)));
  let current = null, inspectYear = 1, baseline = { ...M.DEFAULTS }, held = null, pulseTimer = null, helpTrigger = null, pinnedSymbol = null, previewSymbol = null;
  const token = (symbols, keys, value, cls = "") => `<span class="eq-token ${cls}" data-vars="${keys}" data-symbols="${symbols}">${value}</span>`;
  const n = (symbols, key, value, cls = "") => token(symbols, key, fixed(value), cls);
  const p = (symbols, key, value) => token(symbols, key, percent(value), "rate");
  const read = () => Object.fromEntries(Object.keys(M.DEFAULTS).map(key => [key, $(key + "-number").value.trim() === "" ? NaN : Number($(key + "-number").value) / (M.RATE_KEYS.includes(key) ? 100 : 1)]));
  function highlight(key) { document.querySelectorAll("[data-vars]").forEach(el => el.classList.toggle("is-editing", !!key && el.dataset.vars.split(" ").includes(key))); }
  function highlightSymbol() {
    const key = previewSymbol || pinnedSymbol;
    document.querySelectorAll('.equation-grid [data-symbols]').forEach(el => el.classList.toggle('is-symbol-highlight', !!key && el.dataset.symbols.split(' ').includes(key)));
    document.querySelectorAll('.symbol-link').forEach(button => {
      button.classList.toggle('is-symbol-highlight', button.dataset.symbol === key);
      button.setAttribute('aria-pressed', String(button.dataset.symbol === pinnedSymbol));
    });
    $('symbol-status').textContent = key ? `Highlighted ${document.querySelector(`.symbol-link[data-symbol="${key}"]`).textContent} in the equations.` : '';
  }
  document.querySelectorAll('.symbol-link').forEach(button => {
    const preview = () => { previewSymbol = button.dataset.symbol; highlightSymbol(); };
    const endPreview = () => { previewSymbol = null; highlightSymbol(); };
    button.addEventListener('pointerenter', preview); button.addEventListener('pointerleave', endPreview);
    button.addEventListener('focus', preview); button.addEventListener('blur', endPreview);
    button.addEventListener('click', () => {
      const key = button.dataset.symbol;
      pinnedSymbol = pinnedSymbol === key ? null : key; previewSymbol = null; highlightSymbol();
      if (pinnedSymbol) Array.from(document.querySelectorAll('.equation-grid [data-symbols]')).find(el => el.dataset.symbols.split(' ').includes(key))?.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { pinnedSymbol = null; previewSymbol = null; highlightSymbol(); } });
  function pulse(key) { clearTimeout(pulseTimer); highlight(key); if (!held) pulseTimer = setTimeout(() => highlight(null), 650); }
  function release() { held = null; clearTimeout(pulseTimer); highlight(null); }
  function setInputs(inputs) {
    for (const [key, value] of Object.entries(inputs)) $(key + "-number").value = key === "years" ? value : (value * (M.RATE_KEYS.includes(key) ? 100 : 1)).toFixed(2);
    render();
  }
  function renderEquations(m) {
    inspectYear = Math.min(inspectYear, m.inputs.years);
    if ($("inspect-year").options.length !== m.inputs.years) $("inspect-year").innerHTML = m.forecast.map(f => `<option value="${f.year}">${f.year}</option>`).join("");
    $("inspect-year").value = inspectYear;
    const f = m.forecast[inspectYear - 1], i = m.inputs, all = "revenue salesGrowth margin tax depreciation capex workingCapital discountRate terminalGrowth terminalReturn years";

    const sy=(key,body,edit='')=>`<span data-symbols="${key}"${edit?` data-vars="${edit}"`:''}>${body}</span>`,t=sy('t','t'),N=sy('N','N'),sub=(key,body,index=t,edit='')=>sy(key,`${body}<sub>${index}</sub>`,edit);
    const R=sub('R','R'),R0=sy('R0','R<sub>0</sub>','revenue'),EBIT=sub('EBIT','EBIT'),NOPAT=sub('NOPAT','NOPAT'),FCF=sub('FCF','FCF'),DA=sub('DA','DA',t,'depreciation'),CapEx=sub('CapEx','CapEx',t,'capex'),delta=sub('deltaNwc','ΔNWC',t,'workingCapital'),next=sub('FCF','FCF',N+'+1'),nextProfit=sub('NOPAT','NOPAT',N+'+1'),TV=sub('TV','TV',N),r=sy('r','r','discountRate'),g=sy('g','g','terminalGrowth'),tax=sy('T','T','tax');
    const pair=(id,symbols,values,ok=true)=>EquationLayout.render(id,symbols,ok?[values]:[]);
    pair('revenue-worked',[R,'=',R0,'×','(1 +',sy('s','s','salesGrowth'),`)<sup>${t}</sup>`],[n('R','revenue salesGrowth',f.revenue,'result'),'=',n('R0','revenue',i.revenue),'×','(1 +',p('s','salesGrowth',i.salesGrowth),`)<sup data-symbols="t">${inspectYear}</sup>`]);
    pair('margin-worked',[EBIT,'=',R,'×',sy('m','m','margin')],[n('EBIT','revenue salesGrowth margin',f.ebit,'result'),'=',n('R','revenue salesGrowth',f.revenue),'×',p('m','margin',i.margin)]);
    pair('profit-worked',[NOPAT,'=',EBIT,'×','(1 −',tax,')'],[n('NOPAT',all,f.nopat,'result'),'=',n('EBIT','revenue salesGrowth margin',f.ebit),'×','(1 −',p('T','tax',i.tax),')']);
    pair('fcf-worked',[FCF,'=',NOPAT,'+',DA,'−',CapEx,'−',delta],[n('FCF',all,f.fcf,'result'),'=',n('NOPAT',all,f.nopat),'+',n('DA','revenue salesGrowth depreciation',f.depreciation),'−',n('CapEx','revenue salesGrowth capex',f.capex),'−',n('deltaNwc','revenue salesGrowth workingCapital',f.deltaNwc)]);
    pair('nwc-worked',[delta,'=',sub('NWC','NWC'),'−',sub('NWC','NWC',t+'−1')],[n('deltaNwc',all,f.deltaNwc,'result'),'=',n('NWC','revenue salesGrowth workingCapital',f.nwc),'−',n('NWC','revenue salesGrowth workingCapital',f.nwc-f.deltaNwc)]);
    pair('next-worked',[next,'=',nextProfit,'×','(1 −',g,'/',sy('q','q','terminalReturn'),')'],[n('FCF',all,m.terminalNext,'result'),'=',n('NOPAT',all,m.terminalNopat),'×','(1 −',p('g','terminalGrowth',i.terminalGrowth),'/',p('q','terminalReturn',i.terminalReturn),')']);
    pair('terminal-worked',[TV,'=',next,'/','(',r,'−',g,')'],[n('TV',all,m.terminalValue,'result'),'=',n('FCF',all,m.terminalNext),'/','(',p('r','discountRate',i.discountRate),'−',p('g','terminalGrowth',i.terminalGrowth),')'],!m.issue);
    const forecastSymbol=`${sy('sum','∑')}<sub>${t}=1</sub><sup>${N}</sup> ${sy('PV',`<span class="eq-fraction"><span>${FCF}</span><span>(1 + ${r})<sup>${t}</sup></span></span>`)}`,terminalSymbol=sy('PV',`<span class="eq-fraction"><span>${TV}</span><span>(1 + ${r})<sup>${N}</sup></span></span>`);
    pair('operations-worked',[sy('Vop','V<sub>op</sub>'),'=',forecastSymbol,'+',terminalSymbol],[n('Vop',all,m.operatingValue,'result'),'=',n('PV',all,m.forecastPv),'+',n('PV',all,m.terminalPv)],!m.issue);
    pair('discount-worked',[sy('PV','PV(TV)'),'=',TV,'/','(1 +',r,`)<sup>${N}</sup>`],[n('PV',all,m.terminalPv,'result'),'=',n('TV',all,m.terminalValue),'/','(1 +',p('r','discountRate',i.discountRate),`)<sup data-symbols="N">${i.years}</sup>`],!m.issue);
    pair('equity-worked',[sy('E','E'),'=',sy('Vop','V<sub>op</sub>'),'+',sy('C','C','cash'),'−',sy('D','D','debt')],[n('E',all+' cash debt',m.equity,'result'),'=',n('Vop',all,m.operatingValue),'+',n('C','cash',i.cash),'−',n('D','debt',i.debt)],!m.issue);
    pair('price-worked',[sy('P','P'),'=',sy('E','E'),'/',sy('S','S','shares')],[n('P',all+' cash debt shares',m.price,'result'),'=',n('E',all+' cash debt',m.equity),'/',n('S','shares',i.shares)],!m.issue&&m.equity>=0);
    for(const[id,key,ratio,amount,label]of[['depreciation-worked','depreciation','d',f.depreciation,'DA'],['capex-worked','capex','c',f.capex,'CapEx'],['working-capital-worked','workingCapital','w',f.nwc,'NWC']])pair(id,[sub(label,label),'=',sy(ratio,ratio,key),'×',R],[n(label,`revenue salesGrowth ${key}`,amount,'result'),'=',p(ratio,key,i[key]),'×',n('R','revenue salesGrowth',f.revenue)]);
    highlightSymbol();
  }
  const line = (x1, y1, x2, y2, color = "#dfe6ed", extra = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" ${extra}/>`;
  const text = (x, y, value, anchor = "start", color = "#536574", extra = "", size = 11) => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="${size}" ${extra}>${value}</text>`;
  function nice(v) { const scale = 10 ** Math.floor(Math.log10(v || 1)); return [1, 2, 5, 10].find(x => x * scale >= v) * scale; }
  function frame(svg, height, values, bottomPadding = 42) {
    const width = Math.max(250, svg.getBoundingClientRect().width), left = 70, right = width - 18, top = 24, bottom = height - bottomPadding;
    const low = Math.min(0, ...values), high = Math.max(0, ...values);
    const min = low < 0 ? -nice(-low * 1.12) : 0, max = high > 0 ? nice(high * 1.12) : low < 0 ? 0 : 1;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    return { width, height, left, right, top, bottom, min, max, x: q => left + q * (right - left), y: v => bottom - (v - min) / (max - min) * (bottom - top) };
  }
  function yAxis(b, label) {
    const center = (b.top + b.bottom) / 2;
    let out = text(13, center, label, "middle", "#536574", `class="y-axis-label" transform="rotate(-90 13 ${center})"`);
    for (let j = 0; j <= 4; j++) { const v = b.min + (b.max - b.min) * j / 4; out += line(b.left, b.y(v), b.right, b.y(v)) + text(b.left - 8, b.y(v) + 4, Math.abs(v) >= 10000 ? v.toExponential(1) : fixed(v), "end"); }
    return out + line(b.left, b.y(0), b.right, b.y(0), "#8a9bab");
  }
  function drawCashflow(m) {
    const svg=$("cashflow-chart"),terminal=m.terminalYear,b=frame(svg,264,[...m.forecast.flatMap(f=>[f.fcf,f.pv]),...(terminal.fcf===null?[]:[terminal.fcf])],52);
    let out=yAxis(b,"Cash flow ($ million)"),step=(b.right-b.left)/(m.inputs.years+2),bar=Math.min(24,step*.32);
    out+=text(b.left,b.bottom+18,"0","middle");
    for(const f of m.forecast){const x=b.left+step*f.year;out+=`<g data-year="${f.year}" role="button" tabindex="0" aria-label="Inspect year ${f.year}"><title>Year ${f.year}: FCF ${fixed(f.fcf)}, present value ${fixed(f.pv)} ($ million)</title>`;for(const[value,bx,color]of[[f.fcf,x-bar-1,"#a6bddd"],[f.pv,x+1,"#2458a8"]])out+=`<rect x="${bx}" y="${b.y(Math.max(0,value))}" width="${bar}" height="${Math.max(.5,Math.abs(b.y(value)-b.y(0)))}" rx="1" fill="${color}" ${f.year===inspectYear?'stroke="#172838" stroke-width="1"':''}/>`;out+='</g>'+text(x,b.bottom+18,f.year,"middle");}
    const tx=b.left+step*terminal.year,split=tx-step/2;
    out+=line(split,b.top,split,b.bottom,'#ba945e','stroke-dasharray="4 4"');
    if(terminal.fcf!==null){out+=`<rect class="terminal-chart-bar" data-terminal-year="${terminal.year}" data-vars="terminalGrowth terminalReturn revenue margin tax" x="${tx-bar}" y="${b.y(Math.max(0,terminal.fcf))}" width="${bar*2}" height="${Math.max(.5,Math.abs(b.y(terminal.fcf)-b.y(0)))}" fill="#b97820" rx="2"><title>Terminal year ${terminal.year}: growth ${percent(terminal.growth)}, FCF ${fixed(terminal.fcf)}; already included in terminal value.</title></rect>`;}
    out+=text(tx,b.bottom+18,'N+1',"middle",'#88571c')+text(tx,b.bottom+34,'g '+percent(terminal.growth),"middle",'#88571c','',9);
    out+=text((b.left+b.right)/2,b.height-2,'Year t',"middle",'#536574','',10);svg.innerHTML=out;
  }
  function drawSensitivity(m) {
    const valid = m.sensitivity.flat().map(c => c.operatingValue).filter(v => v !== null), lo = Math.min(...valid), hi = Math.max(...valid);
    const indices = document.documentElement.clientWidth <= 480 ? [1, 2, 3] : [0, 1, 2, 3, 4];
    let html = `<thead><tr><th scope="col"><span class="sr-only">WACC</span></th>${indices.map(ci => `<th scope="col">${percent(m.growths[ci])}</th>`).join("")}</tr></thead><tbody>`;
    indices.forEach(ri => {
      html += `<tr><th scope="row">${percent(m.rates[ri])}</th>`;
      indices.forEach(ci => {
        const c = m.sensitivity[ri][ci];
        const label = `WACC ${percent(c.rate)}, growth ${percent(c.growth)}: ${c.issue || fixed(c.operatingValue) + ' $ million'}`;
        const shade = c.operatingValue === null ? "" : c.operatingValue < 0 ? "background:#f8e9db;color:#7a411c" : `background:hsl(213 47% ${hi === lo ? 89 : 97 - (c.operatingValue - lo) / (hi - lo) * 17}%)`;
        const displayed = c.operatingValue === null ? "—" : Math.abs(c.operatingValue) >= 10000 ? c.operatingValue.toExponential(2) : fixed(c.operatingValue);
        html += `<td class="${ri === 2 && ci === 2 ? 'current-cell ' : ''}${c.operatingValue === null ? 'invalid-cell' : ''}" style="${shade}" title="${label}" aria-label="${label}">${displayed}</td>`;
      }); html += "</tr>";
    }); $("heatmap").innerHTML = html + "</tbody>";
  }
  function drawBridge(m) {
    const svg = $("bridge-chart");
    if (m.issue) { const b = frame(svg, 250, [1], 60); svg.innerHTML = text(b.width / 2, 105, "No terminal valuation", "middle"); return; }
    const b = frame(svg, 250, m.bridge.flatMap(s => [s.start, s.end]), 60), step = (b.right - b.left) / 4, bar = Math.min(58, step * .6);
    let out = yAxis(b, "Value ($ million)");
    m.bridge.forEach((s, index) => {
      const x = b.left + step * (index + .5), high = Math.max(s.start, s.end), low = Math.min(s.start, s.end);
      const color = s.type === "add" ? "#14786d" : s.type === "subtract" || s.end < 0 ? "#b66a30" : "#2458a8";
      if(index===0&&m.forecastPv>=0&&m.terminalPv>=0){
        out+=`<rect x="${x-bar/2}" y="${b.y(m.forecastPv)}" width="${bar}" height="${Math.max(.5,b.y(0)-b.y(m.forecastPv))}" fill="#2458a8"/><rect data-terminal-component="true" x="${x-bar/2}" y="${b.y(m.operatingValue)}" width="${bar}" height="${Math.max(.5,b.y(m.forecastPv)-b.y(m.operatingValue))}" fill="#b97820"><title>Terminal PV ${fixed(m.terminalPv)} at growth ${percent(m.inputs.terminalGrowth)}; forecast PV ${fixed(m.forecastPv)}.</title></rect>`;
      }else out += `<rect x="${x - bar / 2}" y="${b.y(high)}" width="${bar}" height="${Math.max(.5, b.y(low) - b.y(high))}" fill="${color}" rx="2"/>`;
      // Signed totals retain their sign; additions/deductions show their direction.
      const label = s.type === "add" ? "+" + fixed(s.amount) : s.type === "subtract" ? "−" + fixed(-s.amount) : fixed(s.amount);
      out += text(x, Math.max(13, b.y(high) - 6), label, "middle", "#29455c");
      const labels = [["Operating", "value"], ["Excess", "cash"], ["Debt /", "claims"], ["Equity", ""]][index];
      out += text(x, b.bottom + 16, labels[0], "middle", "#536574", '', 10) + text(x, b.bottom + 28, labels[1], "middle", "#536574", '', 10) + text(x, b.height - 4, s.symbol, "middle");
      if (index < 3) out += line(x + bar / 2, b.y(s.end), x + step - bar / 2, b.y(s.end), "#96a7b7", 'stroke-dasharray="3 3"');
    }); svg.innerHTML = out;
  }
  function drawForecast(m) {
    const accounting=v=>v<-.0000001?`(${fixed(-v)})`:fixed(Math.abs(v)<.0000001?0:v);
    const rows=[
      ['Revenue growth','s → g',()=>m.inputs.salesGrowth,'salesGrowth terminalGrowth','growth-row',f=>f.growth],
      ['Revenue','R<sub>t</sub>',f=>f.revenue,'revenue salesGrowth','revenue-row',f=>f.revenue],
      ['Operating costs, before depreciation','',f=>-f.operatingCosts,'revenue salesGrowth margin depreciation','deduction',()=>null],
      ['Depreciation expense','DA<sub>t</sub>',f=>-f.depreciation,'revenue salesGrowth depreciation','deduction',()=>null],
      ['Operating profit','EBIT<sub>t</sub>',f=>f.ebit,'revenue salesGrowth margin','subtotal',f=>f.ebit],
      ['Tax on operating profit','',f=>-f.taxes,'revenue salesGrowth margin tax','deduction',f=>-f.taxes],
      ['After-tax operating profit','NOPAT<sub>t</sub>',f=>f.nopat,'revenue salesGrowth margin tax','subtotal',f=>f.nopat],
      ['Add back depreciation','DA<sub>t</sub>',f=>f.depreciation,'revenue salesGrowth depreciation','adjustment',()=>null],
      ['Capital spending','CapEx<sub>t</sub>',f=>-f.capex,'revenue salesGrowth capex','deduction',()=>null],
      ['Change in operating NWC','ΔNWC<sub>t</sub>',f=>-f.deltaNwc,'revenue salesGrowth workingCapital','deduction',()=>null],
      ['Terminal net reinvestment','NOPAT × <span class="eq-fraction"><span>g</span><span>q</span></span>',()=>null,'terminalGrowth terminalReturn','terminal-reinvestment',f=>f.netReinvestment===null?null:-f.netReinvestment],
      ['Free cash flow','FCF<sub>t</sub>',f=>f.fcf,'revenue salesGrowth margin tax depreciation capex workingCapital','total-row',f=>f.fcf],
      ['Discount factor','',f=>f.discountFactor,'discountRate','factor-row',()=>null],
      ['Present value of cash flow','PV<sub>t</sub>',f=>f.pv,'revenue salesGrowth margin tax depreciation capex workingCapital discountRate','pv-row',()=>null],
      ['NWC balance (reference only)','NWC<sub>t</sub>',f=>f.nwc,'revenue salesGrowth workingCapital','memo-row',()=>null]
    ];
    const format=(v,cls)=>v===null?'—':cls==='growth-row'?percent(v):cls==='factor-row'?v.toFixed(4):accounting(v);
    $("forecast-table").innerHTML=`<caption class="sr-only">Explicit forecast plus a distinct terminal year N+1. Terminal reinvestment uses growth and return on capital. Terminal cash flow is included in terminal value, not added again to forecast PV.</caption><thead><tr><th scope="col">Year <span class="symbol">t</span></th>${m.forecast.map(f=>`<th scope="col" class="${f.year===inspectYear?'inspected':''}"><button type="button" data-year="${f.year}" aria-label="Select forecast year ${f.year}" aria-pressed="${f.year===inspectYear}">${f.year}</button></th>`).join('')}<th scope="col" class="terminal-column" data-terminal-column="true">Terminal<br><span>N+1 · ${m.terminalYear.year}</span></th></tr></thead><tbody>${rows.map(([label,symbol,value,keys,cls,terminalValue])=>`<tr class="${cls}" data-vars="${keys}"><th scope="row"><span>${label}</span>${symbol?`<span class="row-symbol">${symbol}</span>`:''}</th>${m.forecast.map(f=>`<td class="${f.year===inspectYear?'inspected':''}">${format(value(f),cls)}</td>`).join('')}<td class="terminal-column" data-terminal-column="true" data-vars="${keys} terminalGrowth terminalReturn">${format(terminalValue(m.terminalYear),cls)}</td></tr>`).join('')}</tbody>`;
  }

  function render() {
    const raw = read(), c = M.validateInputs(raw);
    $("input-error").hidden = c.ok; $("input-error").textContent = Object.values(c.errors).join(" ");
    for (const key of Object.keys(M.DEFAULTS)) {
      const input = $(key + "-number"); input.setAttribute("aria-invalid", String(!!c.errors[key]));
      if (c.errors[key]) input.setAttribute("aria-describedby", "input-error"); else input.removeAttribute("aria-describedby");
      const slider = $(key + "-range"); if (slider && !c.errors[key]) slider.value = raw[key] * 100;
    }
    document.querySelectorAll('.preset').forEach((el, index) => { const active = c.ok && Object.keys(raw).every(k => raw[k] === M.PRESETS[index].inputs[k]); el.classList.toggle('active', active); el.setAttribute('aria-pressed', String(active)); });
    $("download").disabled = !c.ok; $("save-baseline").disabled = !c.ok; $("inspect-year").disabled = !c.ok;
    if (!c.ok) {
      current = null;
      for (const id of ["revenue-worked", "margin-worked", "profit-worked", "depreciation-worked", "capex-worked", "working-capital-worked", "fcf-worked", "nwc-worked", "next-worked", "terminal-worked", "discount-worked", "operations-worked", "equity-worked", "price-worked", "operating-value", "share-price", "forecast-pv", "terminal-pv", "terminal-share"]) $(id).textContent = "—";
      for (const id of ["cashflow-chart", "bridge-chart", "heatmap", "forecast-table"]) $(id).innerHTML = "";
      $("composition").hidden = true; $("model-warning").hidden = true; $("comparison").textContent = "Enter valid inputs to compare."; return;
    }
    current = M.calculateModel(raw); const m = current;
    $("model-warning").textContent = [m.issue, ...m.warnings].filter(Boolean).join(" "); $("model-warning").hidden = !m.issue && !m.warnings.length;
    renderEquations(m); $("operating-value").textContent = fixed(m.operatingValue); $("share-price").textContent = fixed(m.price);
    $("forecast-pv").textContent = fixed(m.forecastPv); $("terminal-pv").textContent = fixed(m.terminalPv); $("terminal-share").textContent = m.terminalShare === null ? "—" : percent(m.terminalShare);
    $("composition").hidden = false; $("forecast-bar").parentElement.hidden = m.terminalShare === null;
    $("forecast-bar").style.width = m.terminalShare === null ? "0%" : (1 - m.terminalShare) * 100 + "%"; $("terminal-bar").style.width = m.terminalShare === null ? "0%" : m.terminalShare * 100 + "%";
    drawCashflow(m); drawSensitivity(m); drawBridge(m); drawForecast(m);
    const b = M.calculateModel(baseline), same = Object.keys(raw).every(k => raw[k] === baseline[k]);
    const delta = (x, y, units) => x === null || y === null ? "unavailable" : `${x - y >= 0 ? '+' : '−'}$${fixed(Math.abs(x - y))}${units}`;
    $("comparison").textContent = same ? "" : `Compared with saved case: operations ${delta(m.operatingValue, b.operatingValue, ' million')}; per share ${delta(m.price, b.price, '')}.`;
  }
  M.PRESETS.forEach(preset => { const b = document.createElement('button'); b.type = 'button'; b.className = 'preset'; b.textContent = preset.name; b.addEventListener('click', () => { inspectYear = 1; setInputs(preset.inputs); release(); }); $('presets').append(b); });
  $("reset").addEventListener("click", () => { inspectYear = 1; baseline = { ...M.DEFAULTS }; setInputs(M.DEFAULTS); release(); });
  $("save-baseline").addEventListener("click", () => { baseline = { ...read() }; render(); });
  for (const key of Object.keys(M.DEFAULTS)) {
    const input = $(key + "-number"), slider = $(key + "-range");
    input.addEventListener(key === 'years' ? 'change' : 'input', () => { render(); pulse(key); });
    input.addEventListener('blur', () => { if (key !== 'years' && input.value.trim() !== '' && Number.isFinite(Number(input.value))) { input.value = Number(input.value).toFixed(2); render(); } release(); });
    if (slider) {
      slider.addEventListener('pointerdown', () => { held = key; highlight(key); });
      slider.addEventListener('keydown', e => { if (e.key.startsWith('Arrow') || ['Home','End','PageUp','PageDown'].includes(e.key)) { held = key; highlight(key); } });
      slider.addEventListener('keyup', release); slider.addEventListener('blur', release);
      slider.addEventListener('input', () => { input.value = fixed(Number(slider.value)); render(); pulse(key); });
    }
  }
  document.addEventListener('pointerup', release); document.addEventListener('pointercancel', release);
  function inspect(year) { if (!current) return; inspectYear = year; renderEquations(current); drawCashflow(current); drawForecast(current); }
  $("inspect-year").addEventListener('change', () => inspect(Number($("inspect-year").value)));
  $("forecast-table").addEventListener('click', e => {
    const el = e.target.closest('[data-year]');
    if (el) { const year = Number(el.dataset.year); inspect(year); $("forecast-table").querySelector(`[data-year="${year}"]`).focus(); }
  });
  $("cashflow-chart").addEventListener('click', e => { const el = e.target.closest('[data-year]'); if (el) inspect(Number(el.dataset.year)); });
  $("cashflow-chart").addEventListener('keydown', e => { const el = e.target.closest('[data-year]'); if (el && ['Enter',' '].includes(e.key)) { e.preventDefault(); const year = Number(el.dataset.year); inspect(year); $("cashflow-chart").querySelector(`[data-year="${year}"]`).focus(); } });
  document.querySelectorAll('[data-help]').forEach(button => button.addEventListener('click', () => {
    const [title, body] = HELP[button.dataset.help]; helpTrigger = button; $("help-title").textContent = title; $("help-body").replaceChildren(); const p = document.createElement('p'); p.textContent = body; $("help-body").append(p);
    const links = button.dataset.help === 'sources' ? [
      ['NYU Stern · DCF valuation framework', 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/lectures/val.html'],
      ['NYU Stern · terminal growth and reinvestment', 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/valquestions/termvalueexreturns.htm']
    ] : button.dataset.help === 'discountRate' ? [['Explore return on assets and WACC', 'https://bpdiehl.github.io/finance_visualizations/downloads/wacc.html']] : [];
    for (const [label, href] of links) { const p = document.createElement('p'), a = document.createElement('a'); a.textContent = label; a.href = href; a.target = '_blank'; a.rel = 'noopener'; p.append(a); $("help-body").append(p); }
    $("help-dialog").showModal();
  }));
  $("close-help").addEventListener('click', () => $("help-dialog").close()); $("help-dialog").addEventListener('close', () => helpTrigger?.focus());
  $("help-dialog").addEventListener('click', e => { if (e.target === $("help-dialog")) { const b = e.target.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) e.target.close(); } });
  $("download").addEventListener('click', () => {
    release(); const clone = document.documentElement.cloneNode(true); clone.querySelectorAll('.is-editing, .is-symbol-highlight').forEach(el => el.classList.remove('is-editing', 'is-symbol-highlight')); clone.querySelectorAll('.symbol-link').forEach(el => el.setAttribute('aria-pressed', 'false')); clone.querySelector('#symbol-status').textContent = ''; clone.querySelectorAll('dialog, #equation-details, #cashflow-reminder').forEach(el => el.removeAttribute('open')); clone.querySelector('#forecast-details').setAttribute('open', '');
    const url = URL.createObjectURL(new Blob(['<!doctype html>\n' + clone.outerHTML], { type: 'text/html' })); const a = document.createElement('a'); a.href = url; a.download = 'dcf.html'; a.hidden = true; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("download-status").textContent = 'Save dcf.html · opens at the starting case.';
  });
  $("pv-operations").addEventListener("toggle",()=>{if(current&&$("pv-operations").open)drawCashflow(current);});
  let resizeFrame;
  new ResizeObserver(() => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(() => { if (current) { drawCashflow(current); drawBridge(current); drawSensitivity(current); } }); }).observe($("cashflow-chart"));
  setInputs(M.DEFAULTS);
})();
