(() => {
'use strict';
const M=DemoModel,$=id=>document.getElementById(id),examples=M.examples();
const fmt=x=>(Math.abs(x)<.005?0:x).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),pct=x=>fmt(x*100)+'%';
const sharedFields=['rf','expectedMarket','beta'];
const savedViews=Object.fromEntries(['capm','cal','diversification','beta'].map(mode=>[mode,{inputs:baseline(mode),sample:23}]));
let state={...M.defaults},model,pinned=null,hovered=null,edited=null,timer,trigger,dragging=false,selectedSample=23;
const key={
 y:['y','Weight in risky portfolio','Decimal allocation; remainder is risk-free saving or borrowing'],
 n:['n','Stocks in portfolio','Number; equal weights'],beta:['β','Market beta','Dimensionless market exposure'],
 sM:['σ<sub>m</sub>','Market volatility','Standard deviation of annual market returns'],
 sE:['σ<sub>ε</sub>','Company-specific volatility per stock','Annual standard deviation; independent residuals'],
 sp:['σ<sub>p</sub>','Risky portfolio volatility','Annual return standard deviation'],
 sc:['σ<sub>c</sub>','Combined portfolio volatility','Annual return standard deviation after cash/borrowing'],
 systematic:['σ<sub>sys</sub>','Systematic risk floor','Annual return standard deviation'],
 rf:['r<sub>f</sub>','Risk-free rate','Annual decimal return'],
 expectedMarket:['E[r<sub>m</sub>]','Expected market return','Annual decimal expected market return'],
 premium:['EMRP','Expected market risk premium','E[rₘ] − r_f; annual decimal return'],
 riskyReturn:['E[r<sub>p</sub>]','Risky portfolio expected return','Annual decimal return before combining with risk-free saving or borrowing'],
 combinedReturn:['E[r<sub>c</sub>]','Combined portfolio expected return','Annual decimal return after combining risky and risk-free positions'],
 riskyExcess:['E[r<sub>p</sub>] − r<sub>f</sub>','Risky portfolio excess return','Annual decimal expected return above the risk-free rate'],
 calExcess:['E[r<sub>c</sub>] − r<sub>f</sub>','Combined portfolio excess return','Annual decimal expected return above the risk-free rate'],
 sharpe:['S<sub>p</sub>','Sharpe ratio','Excess expected return per unit of total volatility'],
 required:['E[r<sub>i</sub>]','CAPM required return','Annual decimal return estimate, assuming alpha zero'],
 covariance:['Cov(r<sub>i</sub>, r<sub>m</sub>)','Asset–market covariance','Squared annual decimal return; illustrative sample'],
 marketVariance:['Var(r<sub>m</sub>)','Market variance','Squared annual decimal return; illustrative sample'],
 alpha:['α','CAPM alpha','Annual decimal expected return above CAPM'],
 asset:['r<sub>i</sub>','Asset return','Annual decimal return for one observation'],
 market:['r<sub>m</sub>','Market return','Annual decimal return for the same observation'],
 residual:['ε<sub>i</sub>','Company-specific return','Annual decimal deviation from the fitted line']
};
const nested=(k,html)=>`<span class="term" data-symbol="${k}">${html}</span>`;
function symbolText(k){
 if(state.mode==='capm'&&k==='beta')return 'β<sub>i</sub>';
 if(state.mode==='capm'&&k==='required')return 'r<sub>i</sub>';
 if(k==='riskyExcess')return `${nested('riskyReturn','E[r<sub>p</sub>]')} − ${nested('rf','r<sub>f</sub>')}`;
 if(k==='calExcess')return `${nested('combinedReturn','E[r<sub>c</sub>]')} − ${nested('rf','r<sub>f</sub>')}`;
 if(k==='covariance')return `Cov(${nested('asset','r<sub>i</sub>')}, ${nested('market','r<sub>m</sub>')})`;
 if(k==='marketVariance')return `Var(${nested('market','r<sub>m</sub>')})`;
 return key[k][0];
}
const symbol=(k,v)=>`<span class="term" data-symbol="${k}">${v??symbolText(k)}</span>`;
const num=(k,x,d=4)=>{const value=x!==null&&Math.abs(x)<.5*10**(-d)?0:x;return symbol(k,value===null?'Undefined':value<0?'(−'+Math.abs(value).toFixed(d)+')':value.toFixed(d));};
const square=k=>symbol(k,key[k][0]+'<sup>2</sup>');
const frac=(a,b)=>`<span class="fraction"><span>${a}</span><span>${b}</span></span>`;
const root=c=>`<span class="eq-radical"><span class="sr-only">Square root of </span><svg viewBox="0 0 20 100" preserveAspectRatio="none" aria-hidden="true"><path d="M1 55 L5 50 L10 95 L20 0" fill="none" stroke="currentColor" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg><span class="radicand">${c}</span></span>`;
const help={
 primary:()=>state.mode==='capm'?['CAPM and the security market line','CAPM estimates the required annual return for a given beta. The horizontal axis is beta, not total volatility or a realized market return. At beta 0 the line crosses the risk-free rate; at beta 1 it gives expected market return. Expected market return is a direct input. With it held fixed, changing the risk-free rate pivots the line around the market point at beta 1. A higher expected market return steepens the line. A market return below the risk-free rate gives a negative premium and a downward line. This is a model estimate, not a guaranteed return.']:state.mode==='cal'?['Capital allocation lines','The vertical axis is expected return ABOVE the risk-free rate; horizontal is total volatility. Each ray combines a risky portfolio with risk-free saving or borrowing. Its slope is the Sharpe ratio. Company-specific risk flattens the selected portfolio’s line without increasing its expected return under CAPM. With positive beta and fully diversified company-specific risk, it reaches the market reference line.'] : state.mode==='diversification'?['What diversification removes','The horizontal axis counts equally weighted stocks. Independent company-specific shocks average out as the portfolio grows. Shared market exposure remains, so total volatility approaches the dashed systematic-risk floor. Systematic risk does not decrease merely by adding stocks with the same beta. This is an explicit stylized factor model, not a universal promise about a particular stock count.']:['Beta is the slope','Each dot pairs an illustrative annual market return with an asset return in the same period. The fitted line’s slope is beta: how much the asset’s return changes for a change in the market. Vertical deviations are company-specific returns. Both axes use identical return ranges and ticks on a square plot: beta 1 has a 45° slope. The shared range fits the observations as inputs change. These axes show returns, not beta versus required return. Click a dot to inspect its equation.'],
 secondary:()=>['Illustrative return paths','The same 50 annual observations are shown in period order. This is synthetic data, not stock-price history. The visible seed reproduces the cloud and path. The sample is centered, scaled and orthogonalized so its market volatility, company-specific volatility and fitted beta exactly match the controls. Real samples do not match population assumptions this neatly.'],
 y:()=>['Saving and borrowing','At 100%, all capital is invested in the risky portfolio. Below 100%, the remainder earns the risk-free rate. Above 100%, the extra investment is financed by borrowing at the same risk-free rate. This idealized CAL ignores borrowing limits, spreads, taxes and transaction costs.'],
 n:()=>['Number of stocks','All stocks have equal weights, the same beta and the same company-specific volatility. Their company-specific returns are mutually independent and uncorrelated with the market. Only the company-specific variance is divided by n. Adding correlated or concentrated holdings may diversify much less.'],
 beta:()=>['Market beta β','A beta of 1 means a one percentage point market move is associated with a one percentage point asset move along the fitted line. Beta 0 has no linear market exposure; negative beta reverses the direction. Beta measures systematic exposure, not total risk. In the Beta tab, the illustrative sample is engineered to recover the specified beta exactly.'],
 sM:()=>['Market volatility','Annual standard deviation of market returns. Market shocks are shared across holdings, so their effect remains after diversification. The market input is kept positive so the CAL benchmark slope and beta denominator are defined.'],
 sE:()=>['Company-specific volatility','Annual standard deviation of one stock’s residual return, separate from market exposure. Equal weights and independent residuals reduce this component to σ_ε / √n in the Diversification and CAL tabs. The Beta tab shows a single asset, so its residual volatility is not divided by n.'],
 rf:()=>['Risk-free rate','Annual return used for risk-free saving and borrowing. Expected market return is held fixed, so changing this rate changes the market premium. In CAPM, the beta-1 market point stays fixed while the intercept changes. In CAL, volatility is unchanged but excess return and the line’s slope can change.'],
 expectedMarket:()=>['Expected market return','Expected total annual return of the market, not its excess return. The model subtracts the risk-free rate to calculate the market premium. This assumption, the risk-free rate and beta are shared across all four tabs. Other inputs and selected observations are remembered within each tab.'],
 premium:()=>['Expected market risk premium','Expected annual market return above the risk-free rate, abbreviated EMRP. CAPM assigns beta × EMRP as required excess return. The premium is calculated from the expected market return minus the risk-free rate. Compensation is for market exposure; adding company-specific volatility does not add a required premium in this model.'],
 alpha:()=>['CAPM alpha and the intercept','Alpha is expected asset return above the CAPM required return. The graph uses TOTAL returns, so the fitted line’s intercept at market return zero is r_f(1−β) + α. Alpha itself is the asset’s excess over r_f when the market return equals r_f. The examples assume alpha zero; an illustrative positive alpha is not an investment forecast.'],
 assumptions:()=>['Model assumptions','Original annual-return illustrations. Diversification assumes equal weights, identical betas and independent company-specific returns uncorrelated with the market. CAL assumes risk-free borrowing and lending at the same rate; market reference is the fully diversified benchmark under CAPM. Beta uses seeded synthetic observations with exact sample moments, not estimated real data. Return distributions are idealized and unbounded. No taxes, fees, trading constraints or historical forecasts.']
};
function attention(){const k=hovered||pinned||edited;document.querySelectorAll('[data-symbol]').forEach(el=>el.classList.toggle('symbol-highlight',el.dataset.symbol===k));document.querySelectorAll('[data-key]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.key===pinned)));}
function pulse(k){edited=k;clearTimeout(timer);attention();if(!dragging)timer=setTimeout(()=>{edited=null;attention();},1100);}
function control(id,label,min,max,step,unit){const digits=id==='n'?0:2;return`<div class="control"><div class="control-head"><label for="${id}">${label} <i>${symbol(id)}</i></label><button class="info" data-help="${id}" aria-label="Explain ${label}">i</button><input id="${id}" class="term" data-symbol="${id}" data-field="${id}" type="number" min="${min}" max="${max}" step="${step}" value="${state[id].toFixed(digits)}"><span class="unit">${unit}</span></div><input data-field="${id}" type="range" aria-label="${label} slider" min="${min}" max="${max}" step="${step}" value="${state[id]}"></div>`;}
function setup(){
 const mode=state.mode;
 $('main-control').innerHTML=mode==='cal'?control('y','Risky portfolio weight',0,200,1,'%'):mode==='diversification'?control('n','Stocks in portfolio',1,200,1,'stocks'):control('beta','Market beta',-2,3,.01,'');
 if(mode==='capm'){
  $('controls').innerHTML=control('rf','Risk-free rate',0,20,.1,'%/year')+control('expectedMarket','Expected market return',-20,40,.1,'%/year');$('assets').innerHTML='';
 }else{
  $('controls').innerHTML=mode==='cal'?control('n','Stocks in risky portfolio',1,200,1,'stocks')+control('sE','Company-specific volatility',0,80,.1,'%'):control('sE','Company-specific volatility',0,80,.1,'%')+(mode==='diversification'?control('beta','Market beta',-2,3,.01,''):'');
  $('controls').innerHTML+=control('sM','Market volatility',1,60,.1,'%');
  $('assets').innerHTML=`<details class="asset-details"><summary>Return assumptions</summary>${mode==='cal'?control('beta','Market beta',-2,3,.01,''):''}${control('rf','Risk-free rate',0,20,.1,'%/year')}${control('expectedMarket','Expected market return',-20,40,.1,'%/year')}${mode==='beta'?control('alpha','CAPM alpha',-10,10,.1,'%/year'):''}</details>`;
 }
 $('sample-controls').hidden=mode!=='beta';$('secondary-panel').hidden=mode!=='beta';
 const sections=mode==='capm'?[['required','CAPM required return'],['premium','Expected market premium']]:mode==='cal'?[['excess','Excess expected return'],['risk','Portfolio risk'],['risky','Risky portfolio excess return'],['sharpe','Sharpe ratio']]:mode==='diversification'?[['risk','Total portfolio risk'],['systematic','Systematic risk floor']]:[['beta','Beta from the observations','wide'],['observation','One illustrative observation','wide']];
 $('equation-sections').innerHTML=sections.map(([id,title,c])=>`<article class="${c||''}"><h2 id="${id}-heading">${title}</h2><div class="formula"></div><div class="worked" id="${id}-worked"></div></article>`).join('');
 $('key').replaceChildren();delete $('key').dataset.symbols;
}
function renderNotation(){
 // The key is derived from symbolic equations, never from inputs or outputs.
 const keys=[...new Set([...document.querySelectorAll('#equation-sections .formula [data-symbol]')].map(el=>el.dataset.symbol))];
 const signature=keys.join('|');if($('key').dataset.symbols===signature)return;
 $('key').dataset.symbols=signature;
 $('key').innerHTML=keys.map(k=>`<div class="key-row"><button data-key="${k}" aria-pressed="false">${symbolText(k)}</button><span>${key[k][1]}<small>${key[k][2]}</small></span></div>`).join('');
}

function equations(){
 const m=model,s=symbol;
 if(state.mode==='capm'){
  EquationLayout.render('required-worked',[s('required'),'=',s('rf'),'+',s('beta'),'×',`(${s('expectedMarket')} − ${s('rf')})`],[[num('required',m.required),'=',num('rf',m.rf),'+',num('beta',m.beta),'×',`(${num('expectedMarket',m.marketExpected)} − ${num('rf',m.rf)})`]]);
  EquationLayout.render('premium-worked',[s('premium'),'=',s('expectedMarket'),'−',s('rf')],[[num('premium',m.premium),'=',num('expectedMarket',m.marketExpected),'−',num('rf',m.rf)]]);
 }else if(state.mode==='cal'){
  EquationLayout.render('excess-worked',[s('combinedReturn'),'−',s('rf'),'=',s('y'),'×',`(${s('riskyReturn')} − ${s('rf')})`],[[num('combinedReturn',m.calReturn),'−',num('rf',m.rf),'=',num('y',m.y),'×',`(${num('riskyReturn',m.required)} − ${num('rf',m.rf)})`]]);
  EquationLayout.render('risk-worked',[s('sc'),'=',s('y'),'×',s('sp')],[[num('sc',m.calRisk),'=',num('y',m.y),'×',num('sp',m.volatility)]]);
  EquationLayout.render('risky-worked',[s('riskyReturn'),'−',s('rf'),'=',s('beta'),'×',s('premium')],[[num('riskyReturn',m.required),'−',num('rf',m.rf),'=',num('beta',m.beta),'×',num('premium',m.premium)]]);
  EquationLayout.render('sharpe-worked',[s('sharpe'),'=',frac(`${s('riskyReturn')} − ${s('rf')}`,s('sp'))],[[num('sharpe',m.sharpe),'=',frac(`${num('riskyReturn',m.required)} − ${num('rf',m.rf)}`,num('sp',m.volatility))]]);
 }else if(state.mode==='diversification'){
  const rad=`(${s('beta')} × ${s('sM')})<sup>2</sup> + ${frac(square('sE'),s('n'))}`;
  const radn=`(${num('beta',m.beta)} × ${num('sM',m.sM)})<sup>2</sup> + ${frac(symbol('sE',m.sE.toFixed(4)+'<sup>2</sup>'),num('n',m.n,0))}`;
  EquationLayout.render('risk-worked',[s('sp'),'=',root(rad)],[[num('sp',m.volatility),'=',root(radn)]]);
  EquationLayout.render('systematic-worked',[s('systematic'),'=',`|${s('beta')}|`,'×',s('sM')],[[num('systematic',m.systematic),'=',`|${num('beta',m.beta)}|`,'×',num('sM',m.sM)]]);
 }else{
  EquationLayout.render('beta-worked',[s('beta'),'=',frac(s('covariance'),s('marketVariance'))],[[num('beta',m.estimatedBeta),'=',frac(num('covariance',m.covariance,6),num('marketVariance',m.marketVariance,6))]]);
  const o=m.samples[selectedSample];$('observation-heading').textContent=`Illustrative observation ${o.period}`;
  EquationLayout.render('observation-worked',[s('asset'),'=',s('rf'),'+',s('alpha'),'+',s('beta'),'×',`(${s('market')} − ${s('rf')})`,'+',s('residual')],[[num('asset',o.asset),'=',num('rf',m.rf),'+',num('alpha',m.alpha),'+',num('beta',m.estimatedBeta),'×',`(${num('market',o.market)} − ${num('rf',m.rf)})`,'+',num('residual',o.residual)]]);
 }
 renderNotation();attention();
}
const axisMath=s=>s.replace(/r_([imf])/g,(_,sub)=>`r<tspan baseline-shift="sub" font-size="14">${sub}</tspan>`);
function axes({xMin=0,xMax,yMin=0,yMax,xLabel,yLabel,integerX=false,h=390,ticks=null,yTicks=null}){
 const w=800,L=112,R=776,T=32,B=h-88,x=v=>L+(v-xMin)/(xMax-xMin)*(R-L),y=v=>B-(v-yMin)/(yMax-yMin)*(B-T);let html='';
 for(const v of yTicks||ticks||Array.from({length:5},(_,i)=>yMin+(yMax-yMin)*i/4)){html+=`<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" stroke="#e1e7ec"/><text x="${L-12}" y="${y(v)+4}" text-anchor="end" class="axis-y-tick" font-size="22" fill="#50616f">${v.toFixed(1)}</text>`;}
 for(const v of ticks||Array.from({length:6},(_,i)=>integerX?Math.round(xMin+(xMax-xMin)*i/5):xMin+(xMax-xMin)*i/5)){html+=`<text x="${x(v)}" y="${B+30}" text-anchor="middle" class="axis-x-tick" font-size="22" fill="#50616f">${integerX?Math.round(v):v.toFixed(1)}</text>`;}
 if(xMin<0&&xMax>0)html+=`<line x1="${x(0)}" x2="${x(0)}" y1="${T}" y2="${B}" stroke="#a9b7c2"/>`;
 if(yMin<0&&yMax>0)html+=`<line x1="${L}" x2="${R}" y1="${y(0)}" y2="${y(0)}" stroke="#a9b7c2"/>`;
 html+=`<text transform="translate(24 ${(T+B)/2}) rotate(-90)" text-anchor="middle" font-size="24" fill="#50616f">${axisMath(yLabel)}</text><text x="${(L+R)/2}" y="${h-15}" text-anchor="middle" font-size="24" fill="#50616f">${axisMath(xLabel)}</text>`;
 return{html,x,y,w,h,L,R,T,B,xMin,xMax,yMin,yMax};
}
function matchPrimaryText(){
 const chart=$('primary-chart');if(!chart.classList.contains('full-width'))return;
 const width=chart.getBoundingClientRect().width,factor=width>0?Math.min(1,500/width):1;
 chart.querySelectorAll('text,tspan').forEach(el=>{const size=Number(el.getAttribute('font-size'));if(size)el.style.fontSize=(size*factor)+'px';});
}
function plot(id,a,body){$(id).setAttribute('viewBox',`0 0 ${a.w} ${a.h}`);$(id).innerHTML=a.html+body;if(id==='primary-chart')matchPrimaryText();}
function legend(items){return items.map(([color,label,dashed])=>`<span><i class="swatch" style="${dashed?'background:transparent;border-top:2px dashed '+color+';height:0':'background:'+color}"></i>${label}</span>`).join('');}
function dot(a,x,y,color='#c59b3b',r=6){return`<circle cx="${a.x(x)}" cy="${a.y(y)}" r="${r}" fill="${color}"/>`;}
function path(a,values,x,y){return values.map((v,i)=>`${i?'L':'M'}${a.x(x(v))},${a.y(y(v))}`).join(' ');}
function draw(){
 $('primary-chart').classList.toggle('full-width',state.mode==='diversification');
 const m=model;
 if(state.mode==='capm'){
  const low=Math.min(0,m.requiredAt(-2)*100,m.requiredAt(3)*100),high=Math.max(0,m.requiredAt(-2)*100,m.requiredAt(3)*100),span=Math.max(1,high-low),magnitude=10**Math.floor(Math.log10(span/5));
  const step=[1,2,2.5,5,10].map(v=>v*magnitude).find(v=>v>=span/5);
  const bottom=Math.floor((low-step*.1)/step)*step,top=Math.ceil((high+step*.1)/step)*step;
  const yTicks=Array.from({length:Math.round((top-bottom)/step)+1},(_,i)=>bottom+i*step);
  const a=axes({h:784,xMin:-2,xMax:3,yMin:bottom,yMax:top,yTicks,xLabel:'Market beta β',yLabel:'CAPM required return r_i (%)'});
  let body=`<path d="${path(a,m.line,v=>v.beta,v=>v.required*100)}" fill="none" stroke="#3679ab" stroke-width="3"/><line x1="${a.x(m.beta)}" x2="${a.x(m.beta)}" y1="${a.T}" y2="${a.B}" stroke="#c59b3b" stroke-dasharray="4 3"/><line x1="${a.L}" x2="${a.x(m.beta)}" y1="${a.y(m.required*100)}" y2="${a.y(m.required*100)}" stroke="#c59b3b" stroke-dasharray="4 3"/>`;
  body+=dot(a,0,m.rf*100,'#8497a8',5)+dot(a,1,m.marketExpected*100,'#3679ab',5)+dot(a,m.beta,m.required*100);
  body+=`<text x="${a.x(0)+9}" y="${a.y(m.rf*100)+18}" font-size="20" fill="#50616f">Risk-free rate</text><text x="${a.x(1)+9}" y="${a.y(m.marketExpected*100)-10}" font-size="20" fill="#3679ab">Market · β = 1</text>`;
  plot('primary-chart',a,body);$('primary-key').innerHTML=legend([['#3679ab','Security market line'],['#8497a8','Risk-free rate · β = 0'],['#c59b3b','Selected required return']]);
 }else if(state.mode==='cal'){
  const xmax=Math.max(m.sM*2,m.volatility*2,.1)*100,marketTop=xmax*m.marketSharpe,riskyTop=m.sharpe===null?0:xmax*m.sharpe;
  const a=axes({h:784,xMax:xmax,yMin:Math.min(0,marketTop,riskyTop)*1.12,yMax:Math.max(1,marketTop,riskyTop)*1.12,xLabel:'Portfolio risk σ (%)',yLabel:'Excess expected return E[r] − r_f (%)'});
  let body=`<path d="M${a.x(0)},${a.y(0)} L${a.x(xmax)},${a.y(marketTop)}" fill="none" stroke="#3679ab" stroke-width="2.5" stroke-dasharray="6 4"/>`;
  if(m.sharpe!==null)body+=`<path d="M${a.x(0)},${a.y(0)} L${a.x(xmax)},${a.y(riskyTop)}" fill="none" stroke="#2b8776" stroke-width="3"/>`;
  body+=dot(a,m.sM*100,m.premium*100,'#3679ab',5)+dot(a,m.volatility*100,m.riskyExcess*100,'#2b8776',5)+`<line x1="${a.x(m.calRisk*100)}" x2="${a.x(m.calRisk*100)}" y1="${a.y(m.calExcess*100)}" y2="${a.B}" stroke="#c59b3b" stroke-dasharray="4 3"/>`+dot(a,m.calRisk*100,m.calExcess*100);
  body+=`<text x="${a.x(m.sM*100)+9}" y="${a.y(m.premium*100)-9}" font-size="20" fill="#3679ab">Market</text>`;if(m.volatility>0)body+=`<text x="${a.x(m.volatility*100)+9}" y="${a.y(m.riskyExcess*100)+18}" font-size="20" fill="#2b8776">100% risky portfolio</text>`;
  if(m.volatility>0)body+=`<text class="cal-region" x="${a.x(m.volatility*50)}" y="${Math.min(a.B-12,Math.max(a.T+16,a.y(m.riskyExcess*50)+24))}" text-anchor="middle" font-size="22" fill="#276d61">Saving</text><text class="cal-region" x="${a.x(m.volatility*150)}" y="${Math.min(a.B-12,Math.max(a.T+16,a.y(m.riskyExcess*150)+24))}" text-anchor="middle" font-size="22" fill="#276d61">Borrowing</text>`;
  plot('primary-chart',a,body);$('primary-key').innerHTML=legend([['#3679ab','Market CAL reference',true],['#2b8776','Risky portfolio CAL'],['#c59b3b','Chosen cash / risky mix']]);
 }else if(state.mode==='diversification'){
  const a=axes({xMin:1,xMax:200,yMax:Math.max(.01,m.curve[0].volatility)*115,xLabel:'Number of stocks in portfolio n',yLabel:'Portfolio risk σ (%)',integerX:true});
  const body=`<path d="${path(a,m.curve,v=>v.n,v=>v.volatility*100)}" fill="none" stroke="#2b8776" stroke-width="3"/><line x1="${a.L}" x2="${a.R}" y1="${a.y(m.systematic*100)}" y2="${a.y(m.systematic*100)}" stroke="#3679ab" stroke-width="2" stroke-dasharray="6 4"/><line x1="${a.x(m.n)}" x2="${a.x(m.n)}" y1="${a.T}" y2="${a.B}" stroke="#c59b3b" stroke-dasharray="4 3"/>`+dot(a,m.n,m.volatility*100);
  plot('primary-chart',a,body);$('primary-key').innerHTML=legend([['#2b8776','Total portfolio risk'],['#3679ab','Systematic risk floor',true],['#c59b3b','Selected stock count']]);
 }else{
  const xs=m.samples.map(v=>v.market*100),ys=m.samples.map(v=>v.asset*100);
  // Equal ranges on a square plotting area preserve the geometric beta slope.
  // Round outward to common readable ticks while keeping all observations visible.
  const extent=Math.max(10,...xs.map(Math.abs),...ys.map(Math.abs))*1.12;
  const magnitude=10**Math.floor(Math.log10(extent/4));
  const step=[1,2,2.5,5,10].map(v=>v*magnitude).find(v=>v>=extent/4);
  const bound=Math.ceil(extent/step)*step,intervals=Math.round(2*bound/step);
  const ticks=Array.from({length:intervals+1},(_,i)=>-bound+i*step);
  const xMin=-bound,xMax=bound,yPad=Math.max(1,bound*.05);
  const a=axes({h:784,xMin,xMax,yMin:xMin,yMax:xMax,ticks,xLabel:'Market return r_m (%)',yLabel:'Asset return r_i (%)'}),o=m.samples[selectedSample];
  // Intersect the fitted line with the square so steep/negative slopes stay inside it.
  let lineLeft=xMin,lineRight=xMax;
  if(Math.abs(m.estimatedBeta)>1e-12){
   const crossings=[xMin,xMax].map(y=>(y/100-m.intercept)/m.estimatedBeta*100);
   lineLeft=Math.max(xMin,Math.min(...crossings));lineRight=Math.min(xMax,Math.max(...crossings));
  }
  let body=m.samples.map((v,i)=>`<circle data-observation="${i}" cx="${a.x(v.market*100)}" cy="${a.y(v.asset*100)}" r="4" fill="#8497a8" opacity=".8"/>`).join('');
  body+=`<path d="M${a.x(lineLeft)},${a.y(m.fit(lineLeft/100)*100)} L${a.x(lineRight)},${a.y(m.fit(lineRight/100)*100)}" fill="none" stroke="#3679ab" stroke-width="2.5"/><line x1="${a.x(o.market*100)}" x2="${a.x(o.market*100)}" y1="${a.y(o.asset*100)}" y2="${a.y(m.fit(o.market)*100)}" stroke="#c59b3b" stroke-width="2" stroke-dasharray="3 3"/>`+dot(a,o.market*100,o.asset*100);
  plot('primary-chart',a,body);$('primary-key').innerHTML=legend([['#8497a8','50 simulated annual return pairs'],['#3679ab','Fitted line · slope β'],['#c59b3b','Selected observation / residual']]);
  const b=axes({xMin:1,xMax:50,yMin:Math.min(...xs,...ys)-yPad,yMax:Math.max(...xs,...ys)+yPad,xLabel:'Illustrative annual period',yLabel:'Annual return (%)',integerX:true,h:280});
  plot('secondary-chart',b,`<path d="${path(b,m.samples,v=>v.period,v=>v.market*100)}" fill="none" stroke="#3679ab" stroke-width="2"/><path d="${path(b,m.samples,v=>v.period,v=>v.asset*100)}" fill="none" stroke="#2b8776" stroke-width="2"/>`);$('secondary-key').innerHTML=legend([['#3679ab','Market'],['#2b8776','Asset']]);$('seed-value').textContent=m.seed;
 }
}
function render(){
 try{
  model=M.calculate(state);$('error').hidden=true;const m=model,mode=state.mode;
  $('primary-title').textContent=mode==='capm'?'CAPM · Security market line':mode==='cal'?'Excess return and portfolio risk':mode==='diversification'?'Risk as the portfolio grows':'Asset returns and market returns';
  $('secondary-title').textContent='The same observations over time';
  const results=mode==='capm'?[['CAPM required return','required',pct(m.required)],['Market beta','beta',fmt(m.beta)]]:mode==='cal'?[['Excess expected return','calExcess',pct(m.calExcess)],['Portfolio risk','sc',pct(m.calRisk)]]:mode==='diversification'?[['Total portfolio risk','sp',pct(m.volatility)],['Systematic risk floor','systematic',pct(m.systematic)]]:[['Fitted beta','beta',fmt(m.estimatedBeta)],['Company-specific volatility','sE',pct(m.sE)]];
  $('results').innerHTML=results.map(([label,k,value])=>`<div><span>${label} ${symbol(k)}</span><output class="term" data-symbol="${k}">${value}</output></div>`).join('');
  const metrics=mode==='capm'?[['Risk-free return',pct(m.rf)],['Expected market return',pct(m.marketExpected)],['Market premium',pct(m.premium)],['Required premium β × EMRP',pct(m.riskPremium)]]:mode==='cal'?[[state.y>100?'Borrowed at risk-free rate':'Held at risk-free rate',fmt(Math.abs(100-state.y))+'%'],['Expected total return',pct(m.calReturn)],['Risky portfolio Sharpe ratio',m.sharpe===null?'Undefined':fmt(m.sharpe)],['Market reference Sharpe ratio',fmt(m.marketSharpe)]]:mode==='diversification'?[['Stocks in portfolio',m.n],['Company-specific risk remaining',pct(m.residualVol)],['Expected return (CAPM)',pct(m.required)],['One-stock total risk',pct(m.curve[0].volatility)]]:[['Sample mean market return',pct(m.meanMarket)],['Sample mean asset return',pct(m.meanAsset)],['Alpha',pct(m.alpha)],['Fitted line intercept',pct(m.intercept)]];
  $('metrics').innerHTML=metrics.map(([label,value])=>`<div class="metric"><span>${label}</span><strong>${value}</strong></div>`).join('');equations();draw();
 }catch(e){model=null;$('error').hidden=false;$('error').textContent=e.message;$('results').textContent='—';['primary-chart','secondary-chart','primary-key','secondary-key','metrics'].forEach(id=>$(id).replaceChildren());document.querySelectorAll('.worked').forEach(el=>el.replaceChildren());}
}
function renderExamples(){$('presets').innerHTML=examples.flatMap((p,i)=>p.mode===state.mode?[`<button class="preset" data-example="${i}" aria-pressed="${Object.keys(p).filter(k=>k!=='name').every(k=>p[k]===state[k])}">${p.name}</button>`]:[]).join('');}
function rebuild(){setup();renderExamples();document.querySelectorAll('[data-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.mode===state.mode)));render();}
function baseline(mode){return{...examples.find(p=>p.mode===mode)};}
$('modes').addEventListener('click',e=>{const mode=e.target.dataset.mode;if(mode&&mode!==state.mode){
 savedViews[state.mode]={inputs:{...state},sample:selectedSample};
 const shared=Object.fromEntries(sharedFields.map(k=>[k,state[k]]));
 state={...savedViews[mode].inputs,...shared,mode};selectedSample=savedViews[mode].sample;
 pinned=hovered=edited=null;rebuild();
}});
$('presets').addEventListener('click',e=>{if(e.target.dataset.example!==undefined){state={...examples[Number(e.target.dataset.example)]};selectedSample=23;rebuild();}});
$('reset').addEventListener('click',()=>{state=baseline(state.mode);selectedSample=23;pinned=hovered=edited=null;rebuild();});
document.addEventListener('pointerdown',e=>{if(e.target.type==='range')dragging=true;});document.addEventListener('pointerup',()=>{if(dragging){dragging=false;pulse(edited);}});
document.addEventListener('input',e=>{const el=e.target,k=el.dataset.field;if(!k)return;state[k]=el.value===''?NaN:Number(el.value);document.querySelectorAll(`[data-field="${k}"]`).forEach(other=>{if(other!==el)other.value=Number.isFinite(state[k])?(other.type==='number'?state[k].toFixed(k==='n'?0:2):state[k]):'';});render();renderExamples();pulse(k);});
document.addEventListener('focusout',e=>{if(model&&e.target.type==='number'&&e.target.value!=='')e.target.value=Number(e.target.value).toFixed(e.target.id==='n'?0:2);});
$('resample').addEventListener('click',()=>{state.seed=state.seed===999999?1:state.seed+1;render();renderExamples();});
$('primary-chart').addEventListener('click',e=>{const observation=e.target.dataset.observation;if(state.mode==='beta'&&model&&observation!==undefined){selectedSample=Number(observation);render();}});
$('key').addEventListener('click',e=>{const b=e.target.closest('[data-key]');if(b){pinned=pinned===b.dataset.key?null:b.dataset.key;attention();}});
$('key').addEventListener('mouseover',e=>{const b=e.target.closest('[data-key]');if(b){hovered=b.dataset.key;attention();}});$('key').addEventListener('mouseleave',()=>{hovered=null;attention();});
document.addEventListener('click',e=>{const b=e.target.closest('[data-help]');if(b){trigger=b;const h=help[b.dataset.help]();$('help-title').textContent=h[0];$('help-body').textContent=h[1];$('help').showModal();}});
$('close').addEventListener('click',()=>$('help').close());$('help').addEventListener('close',()=>trigger?.focus());
$('download').addEventListener('click',()=>{const blob=new Blob(['<!doctype html>\n'+document.documentElement.outerHTML],{type:'text/html'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='risk-capm.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
rebuild();new ResizeObserver(matchPrimaryText).observe($('primary-chart'));
})();
