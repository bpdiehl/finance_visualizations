'use strict';
(() => {
 const DEFAULTS=Object.freeze({revenue:300,costs:180,dep:20,interest:20,tax:25,capex:30,opening:100,closing:110});
 const PRESETS=Object.freeze([
  {id:'base',label:'Profit to cash',values:DEFAULTS},
  {id:'stock',label:'Working-capital build',values:{...DEFAULTS,closing:170}},
  {id:'capex',label:'Heavy investment',values:{...DEFAULTS,capex:120}},
  {id:'dep',label:'More depreciation',values:{...DEFAULTS,dep:40}}
 ].map(p=>Object.freeze({...p,values:Object.freeze(p.values)})));
 function validate(s){return !!s&&Object.keys(DEFAULTS).every(k=>typeof s[k]==='number'&&Number.isFinite(s[k])&&s[k]>=0&&s[k]<=(k==='tax'?100:1000));}
 function buildBridge(rows){let cumulative=0;return rows.map(row=>{const start=row.total?0:cumulative,end=row.total?row.value:cumulative+row.value;cumulative=end;return {...row,start,end};});}
 function calculate(s){if(!validate(s))throw new RangeError('Enter nonnegative amounts up to 1,000 and a tax rate between 0% and 100%.');const operatingProfit=s.revenue-s.costs-s.dep,earningsBeforeTax=operatingProfit-s.interest,incomeTaxes=earningsBeforeTax*s.tax/100,netIncome=earningsBeforeTax-incomeTaxes,ebit=netIncome+s.interest+incomeTaxes,taxes=ebit*s.tax/100,nopat=ebit-taxes,change=s.closing-s.opening,fcf=nopat+s.dep-s.capex-change;
 const changes=[{name:'NI',value:netIncome,total:true},{name:'+ Interest',value:s.interest},{name:'+ Reported tax',value:incomeTaxes},{name:'EBIT',value:ebit,total:true},{name:'− Operating tax',value:-taxes},{name:'NOPAT',value:nopat,total:true},{name:'+ D&A',value:s.dep},{name:'− CapEx',value:-s.capex},{name:'− ΔNWC',value:-change},{name:'FCF',value:fcf,total:true}];const bridge=buildBridge(changes),incomeBridge=buildBridge([{name:'Revenue',value:s.revenue,total:true},{name:'− Cash costs',value:-s.costs},{name:'− D&A',value:-s.dep},{name:'EBIT',value:ebit,total:true},{name:'− Interest',value:-s.interest},{name:'EBT',value:earningsBeforeTax,total:true},{name:'− Reported tax',value:-incomeTaxes},{name:'NI',value:netIncome,total:true}]);
 return {ebit,netIncome,incomeTaxes,earningsBeforeTax,taxes,nopat,change,fcf,bridge,incomeBridge};}
 globalThis.DemoModel=Object.freeze({DEFAULTS,PRESETS,validate,calculate});
})();
