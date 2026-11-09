(() => {
'use strict';
const defaults=Object.freeze({sales:100,income:10,assets:50,equity:25});
const presets=[{name:'Starting example',...defaults},{name:'High margin / low turnover',sales:500,income:50,assets:1000,equity:500},{name:'Low margin / high turnover',sales:2000,income:50,assets:1000,equity:500},{name:'Same ROA, more leverage',sales:500,income:50,assets:1000,equity:250},{name:'Thin equity base',sales:500,income:5,assets:1000,equity:50}];
function calculate(s){for(const k of ['sales','income','assets','equity'])if(typeof s[k]!=='number'||!Number.isFinite(s[k]))throw Error('Enter a number in each assumption.');if(s.sales<0||s.assets<0||s.equity<0||s.equity>s.assets||Math.max(s.sales,s.assets,s.equity,Math.abs(s.income))>100000)throw Error('Use nonnegative sales, assets and equity, with equity no greater than assets. Amounts are limited to 100,000 million in magnitude.');const ratio=(n,d)=>d===0?null:n/d,margin=ratio(s.income,s.sales),turnover=ratio(s.sales,s.assets),multiplier=ratio(s.assets,s.equity),roa=ratio(s.income,s.assets),roe=ratio(s.income,s.equity),product=[margin,turnover,multiplier].some(v=>v===null)?null:margin*turnover*multiplier;
return{...s,margin,turnover,multiplier,roa,roe,product,otherClaims:s.assets-s.equity,equityShare:ratio(s.equity,s.assets)};}
globalThis.DemoModel=Object.freeze({defaults,calculate,presets:()=>presets.map(s=>({...s}))});
})();
