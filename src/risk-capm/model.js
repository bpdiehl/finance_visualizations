(() => {
'use strict';
const defaults=Object.freeze({mode:'capm',rf:3,expectedMarket:9,sM:20,sE:30,beta:1,n:5,y:100,alpha:0,seed:42});
const examples=[
 {name:'Market exposure',...defaults},
 {name:'High beta',...defaults,beta:1.5},
 {name:'Low beta',...defaults,beta:.5},
 {name:'Negative beta',...defaults,beta:-.5},
 {name:'Fully invested',...defaults,mode:'cal'},
 {name:'Some cash held',...defaults,mode:'cal',y:60},
 {name:'Borrow to invest',...defaults,mode:'cal',y:150},
 {name:'No company-specific risk',...defaults,mode:'cal',sE:0},
 {name:'Diversifying stocks',...defaults,mode:'diversification',n:10},
 {name:'More market exposure',...defaults,mode:'diversification',beta:1.5,n:10},
 {name:'More company-specific risk',...defaults,mode:'diversification',sE:60,n:10},
 {name:'No market exposure',...defaults,mode:'diversification',beta:0,n:10},
 {name:'Market beta',...defaults,mode:'beta',sE:12},
 {name:'High beta',...defaults,mode:'beta',sE:12,beta:1.5},
 {name:'Low beta',...defaults,mode:'beta',sE:12,beta:.5},
 {name:'Negative beta',...defaults,mode:'beta',sE:12,beta:-.5}
];
function observations({seed,sM,sE,beta,rf,premium,alpha}) {
 // Fixed-seed normal draws, centered/scaled and orthogonalized to give the
 // requested sample slope and residual variance exactly. Not historical data.
 let rngState=seed>>>0;
 const uniform=()=>{rngState=(Math.imul(1664525,rngState)+1013904223)>>>0;return(rngState+.5)/4294967296;};
 const normal=()=>Math.sqrt(-2*Math.log(uniform()))*Math.cos(2*Math.PI*uniform());
 const standardize=xs=>{const mean=xs.reduce((a,b)=>a+b,0)/xs.length;const centered=xs.map(x=>x-mean),sd=Math.sqrt(centered.reduce((a,b)=>a+b*b,0)/xs.length);return centered.map(x=>x/sd);};
 const x=standardize(Array.from({length:50},normal));let z=standardize(Array.from({length:50},normal));
 const projection=x.reduce((a,b,i)=>a+b*z[i],0)/x.length;
 z=standardize(z.map((v,i)=>v-projection*x[i]));
 return x.map((v,i)=>{const market=rf+premium+sM*v,residual=sE*z[i];return{period:i+1,market,asset:rf+alpha+beta*(market-rf)+residual,residual};});
}
function calculate(s){
 if(!['capm','cal','diversification','beta'].includes(s.mode))throw Error('Choose CAPM, CAL, Diversification or Beta.');
 if(s.mode==='capm'){
  for(const k of ['rf','expectedMarket','beta'])if(typeof s[k]!=='number'||!Number.isFinite(s[k]))throw Error('Enter a finite number in each assumption.');
  if(s.rf<0||s.rf>20||s.expectedMarket< -20||s.expectedMarket>40||s.beta< -2||s.beta>3)throw Error('Use a risk-free rate from 0% to 20%, market return from −20% to 40%, and beta from −2 to 3.');
  const rf=s.rf/100,premium=(s.expectedMarket-s.rf)/100,beta=s.beta,requiredAt=b=>rf+b*premium;
  return{mode:s.mode,rf,premium,beta,marketExpected:s.expectedMarket/100,required:requiredAt(beta),riskPremium:beta*premium,requiredAt,line:Array.from({length:101},(_,i)=>{const beta=-2+i*.05;return{beta,required:requiredAt(beta)};})};
 }
 for(const k of ['rf','expectedMarket','sM','sE','beta','n','y','alpha','seed'])if(typeof s[k]!=='number'||!Number.isFinite(s[k]))throw Error('Enter a finite number in each assumption.');
 if(s.rf<0||s.rf>20||s.expectedMarket< -20||s.expectedMarket>40||s.sM<1||s.sM>60||s.sE<0||s.sE>80||s.beta< -2||s.beta>3||s.n<1||s.n>200||!Number.isInteger(s.n)||s.y<0||s.y>200||Math.abs(s.alpha)>10||s.seed<1||s.seed>999999||!Number.isInteger(s.seed))throw Error('Use the displayed input bounds; stock count and seed must be whole numbers.');
 const rf=s.rf/100,premium=(s.expectedMarket-s.rf)/100,sM=s.sM/100,sE=s.sE/100,y=s.y/100,alpha=s.alpha/100,beta=s.beta;
 const systematicVariance=beta**2*sM**2,systematic=Math.abs(beta)*sM;
 const portfolio=n=>{const residualVariance=sE**2/n;return{n,variance:systematicVariance+residualVariance,volatility:Math.sqrt(systematicVariance+residualVariance),residualVariance,residualVol:sE/Math.sqrt(n)};};
 const selected=portfolio(s.n),riskyExcess=beta*premium,calRisk=y*selected.volatility,calExcess=y*riskyExcess;
 const common={mode:s.mode,rf,premium,marketExpected:s.expectedMarket/100,sM,sE,beta,n:s.n,y,alpha,systematicVariance,systematic,...selected,portfolio,curve:Array.from({length:200},(_,i)=>portfolio(i+1)),riskyExcess,required:rf+riskyExcess,calRisk,calExcess,calReturn:rf+calExcess,sharpe:selected.volatility>0?riskyExcess/selected.volatility:null,marketSharpe:premium/sM};
 if(s.mode!=='beta')return common;
 const samples=observations({...common,seed:s.seed}),meanMarket=samples.reduce((a,b)=>a+b.market,0)/samples.length,meanAsset=samples.reduce((a,b)=>a+b.asset,0)/samples.length;
 const marketVariance=samples.reduce((a,b)=>a+(b.market-meanMarket)**2,0)/samples.length,covariance=samples.reduce((a,b)=>a+(b.market-meanMarket)*(b.asset-meanAsset),0)/samples.length;
 const estimatedBeta=covariance/marketVariance,intercept=meanAsset-estimatedBeta*meanMarket;
 return{...common,samples,meanMarket,meanAsset,marketVariance,covariance,estimatedBeta,intercept,fit:market=>intercept+estimatedBeta*market,seed:s.seed};
}
globalThis.DemoModel=Object.freeze({defaults,calculate,examples:()=>examples.map(x=>({...x}))});
})();
