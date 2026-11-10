(() => {
  "use strict";
  const percent = (value, precision = 2) => Number.isFinite(value) ? (value * 100).toFixed(precision) + "%" : "—";
  const points = value => Number.isFinite(value) ? (value * 100).toFixed(3) + " pp" : "—";
  const inputValue = value => Number.isFinite(value) ? (value * 100).toFixed(2) : "";
  const money = value => "$" + value.toFixed(2);
  // Pure presentation helpers are also checked without a browser.
  globalThis.DemoPresentation = Object.freeze({ percent, points, inputValue, money });
  if (typeof document === "undefined") return;

  const model = globalThis.DemoModel;
  const byId = id => document.getElementById(id);
  const keys = Object.keys(model.DEFAULTS);
  let inputs = { ...model.DEFAULTS };
  let baseline = { ...model.DEFAULTS };
  let latest = null;
  let helpTrigger = null;
  let highlightTimer = null;
  let pointerEditing = false;
  let keyEditing = false;
  const setText = (id, text) => { byId(id).textContent = text; };
  const HELP = {
    assetReturn: {
      title: "Return on assets · r_a",
      body: "The assets must support the returns required by the people financing them. Following the course notation, r_a here is the weighted return before the interest tax adjustment. It is a required return, not accounting ROA or a promised realized return. This lab holds debt and equity rates fixed; it does not estimate a separate, leverage-invariant unlevered business-risk rate with corporate taxes.",
      formula: "r_a = (E/V)r_e + (D/V)r_d"
    },
    weights: {
      title: "Debt share · D/V",
      body: "D is the market value of financing debt and E is market equity. Total financing value V = D + E. Debt share is D/V; equity takes the rest, E/V. The two weights always sum to 100%. The diagram normalizes V to $100. Use the debt and equity info buttons below the diagram for help estimating those values.",
      formula: "Debt share = D/V; equity share = E/V; V = D + E"
    },
    debtValue: {
      title: "Financing debt · D",
      body: "Include interest-bearing loans, notes and bonds: short-term borrowings, current maturities and remaining long-term debt, counting each amount once. Ordinary trade payables and accrued operating expenses are not D; they belong in operating working capital. Use market value. Book debt can approximate market value when the two are close, but rate changes or distress can make that shortcut poor. Treat leases and debt-like claims consistently with the cash flows. This two-source model omits preferred shares and hybrids and uses gross debt, without subtracting excess cash.",
      formula: "D = short-term borrowing + current maturities + remaining long-term financing debt"
    },
    equityValue: {
      title: "Market equity · E",
      body: "For a public company, multiply common shares outstanding by their current market price. Value each share class separately and add them if needed. Use shares outstanding, not only freely traded float. This is market capitalization—not book shareholders’ equity, paid-in capital or retained earnings. For a private company, market equity must be estimated using a valuation method; book equity is not automatically a market-value estimate.",
      formula: "E = shares outstanding × current market price per share"
    },
    balance: {
      title: "The market-value picture",
      body: "The left side represents business assets, net of operating liabilities; the right side shows debt and equity financing them. Both sides are normalized to $100. This is a conceptual market-value diagram, not a book-value balance sheet. It omits excess cash and other financing claims. Changing the debt share changes the proportions, not the diagram’s total value.",
      formula: "A = V = D + E, under the simplified two-source assumptions"
    },
    equityRate: {
      title: "Cost of equity · r_e",
      body: "The annual return shareholders require for ownership risk. It is an opportunity cost, not a promised dividend. In this model it is held fixed when the financing mix changes. Its contribution to the asset return and WACC is weighted by the equity share. Input rates use two decimal places; calculated rates use three.",
      formula: "Equity contribution = (E/V)r_e"
    },
    debtRate: {
      title: "Cost of debt · r_d",
      body: "The annual borrowing rate lenders require, entered before the corporate interest tax adjustment. WACC uses the after-tax rate r_d(1 − T), assuming the deduction is usable. Lenders still require the original borrowing rate. A real company’s borrowing cost can rise with leverage; this teaching model holds it fixed.",
      formula: "After-tax cost of debt = r_d(1 − T)"
    },
    taxRate: {
      title: "Corporate tax rate · T",
      body: "The marginal corporate tax rate applied to a usable interest deduction. A higher T lowers debt’s after-tax contribution. The calculation assumes the deduction is fully usable; it does not model tax-loss or deduction limits. With no debt, changing T has no effect on WACC. The 0–100% range includes mathematical endpoints, not suggested tax assumptions.",
      formula: "WACC tax adjustment = (D/V)r_d T"
    },
    taxBenefit: {
      title: "The interest tax shield",
      body: "pp means percentage points: the difference between two percentage rates. Going from 10% to 9% is a drop of 1 pp; the relative decrease is 10%. Here, the interest tax shield lowers r_a to WACC by (D/V)r_d T, assuming the interest deduction can be used. It does not increase the operating return of the assets. When discounting unlevered operating cash flow with WACC, do not also subtract financing interest in that cash flow.",
      formula: "WACC = r_a − (D/V)r_d T"
    },
    wacc: {
      title: "Weighted average cost of capital",
      body: "WACC combines the required equity return and the after-tax debt cost using market-value weights. Use it with unlevered operating free cash flows of matching risk and periods. The expanded equation is the same calculation as subtracting the interest tax adjustment from r_a. It is a required discount rate, not a guaranteed actual return or an annual cash payment to all investors.",
      formula: "WACC = (E/V)r_e + (D/V)r_d(1 − T)"
    },
    comparison: {
      title: "Saved comparison",
      body: "Save comparison keeps the current assumptions as a baseline. Presets and input changes then compare with that baseline. Reset restores both the original inputs and original comparison. pp means percentage points: 10% minus 9% is 1 pp. If several assumptions change, their combined effect is reported rather than assigning the whole change to one input.",
      formula: ""
    },
    curve: {
      title: "Changing the debt share",
      body: "The chart varies only D/V while keeping your current debt rate, equity rate and tax rate fixed. This makes the line straight. In a real company, changing leverage can change investor risk and both component rates. This plot is not an optimization model and its all-debt endpoint is not a recommendation.",
      formula: ""
    },
    model: {
      title: "Fixed-rate teaching model",
      body: "All rates are annual, and all financing weights use market values. The model has debt and common equity only, holds their required rates fixed as weights change, and assumes a fully usable interest tax deduction. It omits distress costs, financing fees, preferred stock and tax-loss limits. All presets are illustrative. The return on assets notation follows the course model and is distinct from accounting ROA. Downloaded copies reopen with the starting example.",
      formula: "V = D + E"
    },
    challenge: {
      title: "Does tax matter with no debt?",
      body: "Choose All equity. Predict what will happen, then change the corporate tax rate. The debt weight is zero, so the debt term and its tax adjustment are both zero. WACC and r_a both equal the cost of equity under these assumptions.",
      formula: "If D = 0, WACC = r_a = r_e"
    }
  };

  function notation(target, text) {
    target.replaceChildren();
    let last = 0;
    for (const match of text.matchAll(/r_([ade])\b/g)) {
      target.appendChild(document.createTextNode(text.slice(last, match.index) + "r"));
      const sub = document.createElement("sub");
      sub.textContent = match[1];
      target.appendChild(sub);
      last = match.index + match[0].length;
    }
    target.appendChild(document.createTextNode(text.slice(last)));
  }

  function syncRange(key) {
    if (!Number.isFinite(inputs[key]) || inputs[key] < 0 || inputs[key] > 1) return;
    const range = byId(key + "-range");
    if (key === "equityRate" || key === "debtRate") range.max = Math.max(30, Math.ceil(inputs[key] * 100));
    range.value = inputs[key] * 100;
  }
  function syncControls() {
    for (const key of keys) {
      byId(key + "-number").value = inputValue(inputs[key]);
      syncRange(key);
    }
  }
  function releaseHighlight() {
    window.clearTimeout(highlightTimer);
    document.querySelectorAll(".eq-token.is-editing").forEach(el => el.classList.remove("is-editing"));
  }
  function markEditing(changedKeys) {
    window.clearTimeout(highlightTimer);
    document.querySelectorAll(".eq-token[data-vars]").forEach(el => {
      el.classList.toggle("is-editing", changedKeys.some(key => el.dataset.vars.split(" ").includes(key)));
    });
  }
  function scheduleRelease() {
    window.clearTimeout(highlightTimer);
    highlightTimer = window.setTimeout(releaseHighlight, 900);
  }
  function showHelp(button) {
    const help = HELP[button.dataset.help];
    helpTrigger = button;
    notation(byId("help-title"), help.title);
    notation(byId("help-body"), help.body);
    notation(byId("help-formula"), help.formula);
    byId("help-formula").hidden = !help.formula;
    if (button.dataset.help === "comparison") {
      byId("help-body").appendChild(document.createTextNode(" Saved inputs: " + keys.map(key => model.LABELS[key] + " " + percent(baseline[key])).join("; ") + "."));
    }
    byId("help-dialog").showModal();
  }
  document.querySelectorAll("[data-help]").forEach(button => button.addEventListener("click", () => showHelp(button)));
  byId("close-help").addEventListener("click", () => byId("help-dialog").close());
  byId("help-dialog").addEventListener("close", () => { if (helpTrigger) helpTrigger.focus(); });
  byId("help-dialog").addEventListener("click", event => {
    if (event.target !== byId("help-dialog")) return;
    const box = event.target.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) event.target.close();
  });

  function explain(comparison) {
    const { current, changed, delta } = comparison;
    if (!changed.length) return "No change from the saved comparison.";
    const result = Math.abs(delta) < 1e-12 ? "WACC is unchanged." : "WACC is " + points(Math.abs(delta)) + (delta < 0 ? " lower." : " higher.");
    if (changed.length > 1) return changed.length + " assumptions changed. " + result;
    if (changed[0] === "taxRate" && !current.inputs.debtWeight) return "With no debt, changing the tax rate leaves WACC unchanged.";
    const cause = {
      debtWeight: "The financing weights changed. ", equityRate: "The equity contribution changed. ",
      debtRate: "The debt contribution changed. ", taxRate: "The interest tax adjustment changed. "
    };
    return cause[changed[0]] + result;
  }

  function drawCurve(result) {
    const svg = byId("curve");
    const width = Math.max(280, svg.getBoundingClientRect().width);
    const left = 48, right = width - 18, top = 30, bottom = 188;
    const maxRate = Math.max(0.05, Math.ceil(Math.max(result.inputs.equityRate, result.afterTaxDebtRate) * 100 / 5) * 5 / 100);
    const x = value => left + value * (right - left);
    const y = value => bottom - value / maxRate * (bottom - top);
    svg.setAttribute("viewBox", "0 0 " + width + " 230");
    svg.replaceChildren();
    const add = (tag, attrs, text) => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
      for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
      if (text !== undefined) el.textContent = text;
      svg.appendChild(el);
    };
    add("title", { id: "curve-title" }, "WACC versus debt share");
    add("desc", { id: "curve-description" }, "Current rates held fixed. Current mix: " + percent(result.inputs.debtWeight) + " debt; WACC " + percent(result.wacc, 3) + ".");
    add("text", { x: left, y: 14, fill: "#50616f", "font-size": 11 }, "WACC (% / year)");
    for (const value of [0, maxRate / 2, maxRate]) {
      add("line", { x1: left, x2: right, y1: y(value), y2: y(value), stroke: "#e0e6ec" });
      add("text", { x: left - 9, y: y(value) + 4, fill: "#50616f", "text-anchor": "end", "font-size": 11 }, (value * 100).toFixed(1));
    }
    for (const value of [0, 0.25, 0.5, 0.75, 1]) add("text", { x: x(value), y: 207, fill: "#50616f", "text-anchor": "middle", "font-size": 11 }, (value * 100).toFixed(0));
    add("text", { x: (left + right) / 2, y: 226, fill: "#50616f", "text-anchor": "middle", "font-size": 11 }, "Debt share D/V (%)");
    const coords = result.curve.map(p => x(p.debtWeight) + "," + y(p.wacc)).join(" ");
    add("polygon", { points: left + "," + bottom + " " + coords + " " + right + "," + bottom, fill: "#edf3fb" });
    add("polyline", { points: coords, fill: "none", stroke: "#1452a1", "stroke-width": 2.5 });
    add("line", { x1: x(result.inputs.debtWeight), x2: x(result.inputs.debtWeight), y1: y(result.wacc), y2: bottom, stroke: "#1452a1", "stroke-dasharray": "4 4" });
    add("circle", { cx: x(result.inputs.debtWeight), cy: y(result.wacc), r: 5.5, fill: "white", stroke: "#1452a1", "stroke-width": 2.5 });
    const end = result.inputs.debtWeight > 0.8;
    add("text", { x: x(result.inputs.debtWeight) + (end ? -10 : 10), y: Math.max(25, y(result.wacc) - 12), fill: "#1452a1", "font-size": 12, "font-weight": 700, "text-anchor": end ? "end" : "start" }, percent(result.wacc, 3));
  }

  function render() {
    const checked = model.validateInputs(inputs);
    for (const key of keys) byId(key + "-number").setAttribute("aria-invalid", checked.errors[key] ? "true" : "false");
    byId("input-error").hidden = checked.ok;
    byId("valid-results").hidden = !checked.ok;
    byId("save-baseline").disabled = !checked.ok;
    document.querySelectorAll(".live-values").forEach(el => { el.hidden = !checked.ok; });
    document.querySelectorAll("[data-preset]").forEach(button => {
      const p = model.PRESETS.find(preset => preset.id === button.dataset.preset);
      const active = keys.every(key => Math.abs(p.inputs[key] - inputs[key]) < 1e-12);
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (!checked.ok) {
      latest = null;
      setText("input-error", Object.values(checked.errors).join(" "));
      byId("curve").replaceChildren();
      setText("curve-summary", "Enter valid assumptions to display the chart.");
      setText("explanation", "Enter valid assumptions to compare results.");
      return;
    }
    const result = model.calculateModel(inputs);
    latest = result;
    const values = { ...result.inputs, ...result };
    document.querySelectorAll("[data-value]").forEach(el => {
      el.textContent = el.dataset.normalized ? (values[el.dataset.value]*100).toFixed(2) : percent(values[el.dataset.value], Number(el.dataset.precision || 2));
    });
    byId("debt-block").style.height = percent(inputs.debtWeight, 6);
    byId("equity-block").style.height = percent(result.equityWeight, 6);
    for (const [id, weight] of [["debt-block", inputs.debtWeight], ["equity-block", result.equityWeight]]) {
      Array.from(byId(id).children).forEach(el => { el.hidden = weight < 0.25; });
    }
    setText("debt-amount", money(inputs.debtWeight * 100));
    setText("equity-amount", money(result.equityWeight * 100));
    document.querySelector("#debt-diagram-rate span").textContent = percent(inputs.debtRate);
    document.querySelector("#equity-diagram-rate span").textContent = percent(inputs.equityRate);
    byId("capital-mix").setAttribute("aria-label", percent(inputs.debtWeight) + " debt above " + percent(result.equityWeight) + " equity; 100 dollars total market-value financing.");
    setText("debt-share-label", percent(inputs.debtWeight));
    setText("equity-share-label", percent(result.equityWeight));
    setText("asset-return", percent(result.assetReturn, 3));
    setText("wacc", percent(result.wacc, 3));
    setText("tax-benefit", points(result.taxBenefit));
    setText("explanation", explain(model.compareScenarios(inputs, baseline)));
    setText("curve-summary", "At current rates, all-equity WACC is " + percent(inputs.equityRate, 3) + "; all-debt WACC is " + percent(result.afterTaxDebtRate, 3) + ".");
    if (byId("curve-details").open) drawCurve(result);
  }

  for (const key of keys) {
    const number = byId(key + "-number"), range = byId(key + "-range");
    number.addEventListener("input", event => {
      inputs[key] = event.target.valueAsNumber / 100;
      syncRange(key);
      markEditing([key]);
      render();
      scheduleRelease();
    });
    number.addEventListener("blur", () => {
      if (!model.validateInputs(inputs).errors[key]) {
        inputs[key] = Number(inputValue(inputs[key])) / 100;
        number.value = inputValue(inputs[key]);
        syncRange(key);
        render();
      }
      releaseHighlight();
    });
    range.addEventListener("pointerdown", () => { pointerEditing = true; markEditing([key]); });
    range.addEventListener("keydown", event => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(event.key)) {
        keyEditing = true;
        markEditing([key]);
      }
    });
    range.addEventListener("keyup", () => { keyEditing = false; releaseHighlight(); });
    range.addEventListener("input", event => {
      inputs[key] = event.target.valueAsNumber / 100;
      number.value = inputValue(inputs[key]);
      markEditing([key]);
      render();
      if (!pointerEditing && !keyEditing) scheduleRelease();
    });
    range.addEventListener("blur", () => { keyEditing = false; pointerEditing = false; releaseHighlight(); });
  }
  for (const event of ["pointerup", "pointercancel"]) window.addEventListener(event, () => {
    if (!pointerEditing) return;
    pointerEditing = false;
    releaseHighlight();
  });
  window.addEventListener("blur", () => { pointerEditing = false; keyEditing = false; releaseHighlight(); });
  document.querySelectorAll("[data-preset]").forEach(button => button.addEventListener("click", () => {
    const next = model.PRESETS.find(preset => preset.id === button.dataset.preset).inputs;
    const changed = keys.filter(key => inputs[key] !== next[key]);
    inputs = { ...next };
    syncControls(); render(); markEditing(changed); scheduleRelease();
  }));
  byId("reset").addEventListener("click", () => {
    inputs = { ...model.DEFAULTS }; baseline = { ...model.DEFAULTS };
    pointerEditing = false; keyEditing = false;
    releaseHighlight(); syncControls(); render();
  });
  byId("save-baseline").addEventListener("click", () => {
    if (!model.validateInputs(inputs).ok) return;
    baseline = { ...inputs }; render(); setText("explanation", "Comparison saved.");
  });
  byId("curve-details").addEventListener("toggle", () => { if (latest && byId("curve-details").open) drawCurve(latest); });
  window.addEventListener("resize", () => { if (latest && byId("curve-details").open) drawCurve(latest); });
  byId("download-file").addEventListener("click", () => {
    const snapshot = document.documentElement.cloneNode(true);
    snapshot.querySelectorAll(".is-editing").forEach(el => el.classList.remove("is-editing"));
    snapshot.querySelector("#download-status").textContent = "";
    const file = new Blob(["<!doctype html>\n", snapshot.outerHTML], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a"); link.href = url; link.download = "wacc.html";
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setText("download-status", "Downloaded wacc.html");
  });

  const wSymbol=(body,key='')=>`<span class="eq-token" ${key?`data-vars="${key}"`:''}>${["E/V","D/V"].includes(body)?`<span class="eq-fraction"><span>${body.split("/")[0]}</span><span>${body.split("/")[1]}</span></span>`:body}</span>`;
  const wValue=(value,key='',precision=2)=>["equityWeight","debtWeight"].includes(value)?`<span class="eq-fraction"><span class="eq-token" data-value="${value}" data-normalized="true" data-vars="${key}"></span><span>100.00</span></span>`:`<span class="eq-token" data-value="${value}" data-precision="${precision}" ${key?`data-vars="${key}"`:''}></span>`;
  EquationLayout.render('asset-worked',[wSymbol('r<sub>a</sub>'),'=',wSymbol('E/V','debtWeight'),'×',wSymbol('r<sub>e</sub>','equityRate'),'+',wSymbol('D/V','debtWeight'),'×',wSymbol('r<sub>d</sub>','debtRate')],[[wValue('assetReturn','',3),'=',wValue('equityWeight','debtWeight'),'×',wValue('equityRate','equityRate'),'+',wValue('debtWeight','debtWeight'),'×',wValue('debtRate','debtRate')]]);
  EquationLayout.render('shield-worked',['WACC','=',wSymbol('r<sub>a</sub>'),'−',wSymbol('D/V','debtWeight'),'×',wSymbol('r<sub>d</sub>','debtRate'),'×',wSymbol('T','taxRate')],[[wValue('wacc','',3),'=',wValue('assetReturn','',3),'−',wValue('debtWeight','debtWeight'),'×',wValue('debtRate','debtRate'),'×',wValue('taxRate','taxRate')]]);
  EquationLayout.render('main-worked-equation',['WACC','=',wSymbol('E/V','debtWeight'),'×',wSymbol('r<sub>e</sub>','equityRate'),'+',wSymbol('D/V','debtWeight'),'×',wSymbol('r<sub>d</sub>','debtRate'),'×','(1 −',wSymbol('T','taxRate'),')'],[[wValue('wacc','',3),'=',wValue('equityWeight','debtWeight'),'×',wValue('equityRate','equityRate'),'+',wValue('debtWeight','debtWeight'),'×',wValue('debtRate','debtRate'),'×','(1 −',wValue('taxRate','taxRate'),')']]);
  syncControls(); render();
})();

// Fixed-asset-return teaching view. All rates and chart points come from the pure model.
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const M = DemoModel, $ = id => document.getElementById(id);
  const pct = x => (x * 100).toFixed(3) + '%';
  const fields = {
    debtWeight: ['Debt share', 'D/V', 90, 100, '%'],
    assetRate: ['Fixed asset return', 'r<sub>a</sub>', 30, 100, '%/yr'],
    riskFreeRate: ['Risk-free rate', 'r<sub>f</sub>', 30, 100, '%/yr'],
    taxRate: ['Corporate tax rate', 'T', 100, 100, '%'],
    sensitivity: ['Debt risk sensitivity', 'λ', 1, 1, '']
  };
  let state = { ...M.LEVERAGE_DEFAULTS };
  const control = key => {
    const [label, symbol, max, scale, unit] = fields[key];
    return `<div class="control-group"><div class="control-label"><label for="lev-${key}-number">${label} <span class="notation">${symbol}</span></label></div><div class="number-row"><input id="lev-${key}-number" type="number" min="0" max="${max}" step="0.01" value="${(state[key]*scale).toFixed(2)}"><span>${unit}</span></div><input id="lev-${key}-range" type="range" min="0" max="${max}" step="0.01" aria-label="${label} slider${unit ? ', '+unit : ''}"></div>`;
  };
  $('leverage-controls').innerHTML = Object.keys(fields).filter(k => k !== 'sensitivity').map(control).join('');
  $('leverage-advanced-control').innerHTML = control('sensitivity');
  const series = [['equityRate','Equity r<sub>e</sub>','#2458a8',''],['debtRate','Debt r<sub>d</sub>','#176d65',''],['assetReturn','Assets r<sub>a</sub>','#586777','7 5'],['wacc','WACC','#ad5b00','3 3']];
  $('leverage-legend').innerHTML = series.map(([,label,color,dash]) => `<span><svg width="26" height="12" aria-hidden="true"><line x1="0" x2="26" y1="6" y2="6" stroke="${color}" stroke-width="3" stroke-dasharray="${dash}"></line></svg>${label}</span>`).join('');
  function draw(r) {
    const svg = $('leverage-chart'), width = Math.max(280, svg.getBoundingClientRect().width), height = 330;
    const left = 58, right = width-16, top = 18, bottom = height-50;
    const max = Math.max(.05, Math.ceil(Math.max(...r.curve.map(p => p.equityRate))/.05)*.05);
    const x = d => left+d/.9*(right-left), y = v => bottom-v/max*(bottom-top);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const parts = [`<title id="leverage-chart-title">Investor returns and WACC versus debt share</title><desc id="leverage-chart-desc">${$('leverage-summary').textContent} Debt share varies from 0 to 90 percent.</desc>`];
    for (let i=0;i<=4;i++) {
      const v=max*i/4;
      parts.push(`<line x1="${left}" x2="${right}" y1="${y(v)}" y2="${y(v)}" stroke="#e0e6ec"/><text x="${left-8}" y="${y(v)+4}" text-anchor="end">${(v*100).toFixed(1)}</text>`);
    }
    for (const d of [0,.3,.6,.9]) parts.push(`<text x="${x(d)}" y="${bottom+22}" text-anchor="middle">${(d*100).toFixed(0)}</text>`);
    parts.push(`<text x="${(left+right)/2}" y="${height-5}" text-anchor="middle">Debt share D/V (%)</text><text transform="translate(15 ${(top+bottom)/2}) rotate(-90)" text-anchor="middle">Required return (%/year)</text>`);
    parts.push(`<line x1="${x(state.debtWeight)}" x2="${x(state.debtWeight)}" y1="${top}" y2="${bottom}" stroke="#8293a1" stroke-dasharray="3 4"/>`);
    for (const [key,,color,dash] of series) parts.push(`<polyline points="${r.curve.map(p => `${x(p.debtWeight)},${y(p[key])}`).join(' ')}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="${dash}"/><circle cx="${x(state.debtWeight)}" cy="${y(r[key])}" r="4" fill="white" stroke="${color}" stroke-width="2"/>`);
    svg.innerHTML=parts.join('');
  }
  const token = (html,key) => `<span class="eq-token" data-lev-vars="${key}">${html}</span>`;
  function equations(r) {
    const symbols = {d:'d',a:'r<sub>a</sub>',f:'r<sub>f</sub>',l:'λ',rd:'r<sub>d</sub>',re:'r<sub>e</sub>',t:'T',w:'WACC',e:'(1 − d)'};
    const values = {d:(state.debtWeight).toFixed(4),a:pct(state.assetRate),f:pct(state.riskFreeRate),l:state.sensitivity.toFixed(2),rd:pct(r.debtRate),re:pct(r.equityRate),t:state.taxRate.toFixed(4),w:pct(r.wacc),e:r.equityWeight.toFixed(4)};
    const bindings = {d:'debtWeight',a:'assetRate',f:'riskFreeRate',l:'sensitivity',rd:'debtWeight assetRate riskFreeRate sensitivity',re:'debtWeight assetRate riskFreeRate sensitivity',t:'taxRate',w:'debtWeight assetRate riskFreeRate sensitivity taxRate',e:'debtWeight'};
    function pair(id,parts) {
      EquationLayout.render(id, parts.map(p => p in symbols ? token(symbols[p],bindings[p]) : p), [parts.map(p => p in values ? token(values[p],bindings[p]) : p)]);
    }
    pair('leverage-debt-worked',['rd','=','f','+','l','×','d','×','(','a','−','f',')']);
    pair('leverage-equity-worked',['re','=','(','a','−','d','×','rd',')','/','e']);
    pair('leverage-asset-worked',['a','=','e','×','re','+','d','×','rd']);
    pair('leverage-wacc-worked',['w','=','a','−','d','×','rd','×','t']);
  }
  function render(edited) {
    const checked = M.validateLeverage(state);
    $('leverage-error').hidden = checked.ok;
    $('leverage-error').textContent = Object.values(checked.errors).join(' ');
    for (const key of Object.keys(fields)) $(`lev-${key}-number`).setAttribute('aria-invalid',String(!!checked.errors[key]));
    for (const el of document.querySelectorAll('#leverage-panel .live-values')) el.hidden = !checked.ok;
    if (!checked.ok) {
      $('leverage-results').replaceChildren(); $('leverage-chart').replaceChildren();
      $('leverage-summary').textContent = 'Enter valid assumptions to show returns.';
      return;
    }
    const r = M.calculateLeverage(state);
    $('leverage-results').innerHTML = series.map(([key,label])=>`<div><span>${label}</span><output>${pct(r[key])}</output></div>`).join('');
    $('leverage-summary').textContent = `At ${(state.debtWeight*100).toFixed(2)}% debt, asset return stays ${pct(r.assetReturn)}; the tax adjustment is ${(r.taxBenefit*100).toFixed(3)} percentage points. ${(state.taxRate===0 || (state.riskFreeRate===0 && state.sensitivity*(state.assetRate-state.riskFreeRate)===0))?'With no interest tax benefit, WACC stays equal to the asset return.':'With a usable tax shield, WACC falls as debt share rises in this model.'}`;
    equations(r); draw(r);
    if (edited) document.querySelectorAll('[data-lev-vars]').forEach(el=>el.classList.toggle('is-editing',el.dataset.levVars.split(' ').includes(edited)));
    document.querySelectorAll('[data-leverage-preset]').forEach(b=>b.setAttribute('aria-pressed',String(Object.keys(state).every(k=>state[k]===preset(b.dataset.leveragePreset)[k]))));
  }
  function sync() {
    for (const [key,[,,,scale]] of Object.entries(fields)) {
      $(`lev-${key}-number`).value=(state[key]*scale).toFixed(2);
      $(`lev-${key}-range`).value=state[key]*scale;
    }
  }
  let timer;
  for (const [key,[,,,scale]] of Object.entries(fields)) {
    for (const kind of ['number','range']) {
      const el=$(`lev-${key}-${kind}`);
      el.addEventListener('input',()=>{
        state[key]=el.valueAsNumber/scale;
        const other=$(`lev-${key}-${kind==='number'?'range':'number'}`);
        if (kind==='range') other.value=(state[key]*scale).toFixed(2);
        else if(Number.isFinite(state[key])) other.value=el.value;
        render(key); clearTimeout(timer);
        timer=setTimeout(()=>document.querySelectorAll('#leverage-panel .is-editing').forEach(n=>n.classList.remove('is-editing')),900);
      });
      el.addEventListener('blur',()=>{
        if(Number.isFinite(state[key])) {state[key]=Number((state[key]*scale).toFixed(2))/scale;el.value=(state[key]*scale).toFixed(2);render();}
      });
    }
  }
  function preset(id) {return {...M.LEVERAGE_DEFAULTS,...({'all-equity':{debtWeight:0},'more-debt':{debtWeight:.6},'no-tax':{taxRate:0}}[id]||{})};}
  document.querySelectorAll('[data-leverage-preset]').forEach(b=>b.addEventListener('click',()=>{state=preset(b.dataset.leveragePreset);sync();render();}));
  $('leverage-reset').addEventListener('click',()=>{state={...M.LEVERAGE_DEFAULTS};sync();render();});
  const tabs = [$('fixed-tab'),$('leverage-tab')];
  function selectTab(index, focus=false) {
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;$(tab.getAttribute('aria-controls')).hidden=i!==index;});
    document.querySelector('.skip').setAttribute('href',index===1?'#leverage-controls':'#controls');
    document.querySelector('.lab-footer > div').hidden=index===1;
    if(focus) tabs[index].focus();
    if(index===1)render();
    else window.dispatchEvent(new Event('resize'));
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectTab(index));
    tab.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();selectTab(e.key==='Home'?0:e.key==='End'?1:1-index,true);}});
  });
  window.addEventListener('resize',()=>{if(!$('leverage-panel').hidden)render();});
  sync();render();selectTab(0);
})();
