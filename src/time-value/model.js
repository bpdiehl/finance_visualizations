(() => {
'use strict';
const DEFAULTS=Object.freeze({mode:'single',amount:110,rate:10,years:1,growth:3,par:1000,coupon:5,frequency:2,due:false});
function calculate(s){
 if(!['single','annuity','perpetuity','bond'].includes(s.mode))throw Error('Choose a payment mode.');
 for(const k of ['amount','rate','years','growth','par','coupon','frequency'])if(typeof s[k]!=='number'||!Number.isFinite(s[k]))throw Error('Enter a number in every assumption.');
 if(s.amount<0||s.amount>1000000||s.rate< -10||s.rate>30||!Number.isInteger(s.years)||s.years<1||s.years>40||s.growth< -10||s.growth>30||s.par<=0||s.par>1000000||s.coupon<0||s.coupon>30||![1,2,4,12].includes(s.frequency))throw Error('Keep assumptions within the displayed ranges.');
 const bond=s.mode==='bond',f=bond?s.frequency:1,r=s.rate/100/f,g=s.growth/100,N=s.years*f;
 if(s.mode==='perpetuity'&&r<=g)throw Error('A growing perpetuity requires r > g. Increase the required return or reduce growth.');
 const payment=bond?s.par*s.coupon/100/f:s.amount;
 const count=s.mode==='perpetuity'?12:N,flows=[];
 if(s.mode==='single')flows.push({t:N,year:s.years,cash:s.amount,pv:s.amount/(1+r)**N});
 else for(let i=1;i<=count;i++){const t=s.mode==='annuity'&&s.due?i-1:i,cash=s.mode==='perpetuity'?payment*(1+g)**(i-1):payment+(bond&&i===N?s.par:0);flows.push({t,year:t/f,cash,pv:cash/(1+r)**t});}
 const shown=flows.reduce((a,x)=>a+x.pv,0),value=s.mode==='perpetuity'?payment/(r-g):shown;
 const couponPV=bond?flows.reduce((a,x)=>a+payment/(1+r)**x.t,0):0;
 return {flows,value,shown,tail:s.mode==='perpetuity'?Math.max(0,value-shown):0,r,g,N,f,payment,couponPV,principalPV:bond?s.par/(1+r)**N:0,future:s.amount*(1+r)**N};
}
globalThis.DemoModel=Object.freeze({DEFAULTS,calculate});
})();
