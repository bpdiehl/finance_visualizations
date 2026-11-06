'use strict';
(() => {
 const PRESETS=Object.freeze([
  {id:'value',label:'Value created',flows:[-187,110,121],rate:10},
  {id:'zero',label:'Break-even',flows:[-200,110,121],rate:10},
  {id:'multiple',label:'Two IRRs',flows:[-100,230,-132],rate:15},
  {id:'none',label:'No IRR',flows:[-100,100,-100],rate:10}
 ].map(p=>Object.freeze({...p,flows:Object.freeze(p.flows)})));
 function validate(flows,rate){return Array.isArray(flows)&&flows.length>=2&&flows.length<=9&&flows.every(x=>typeof x==='number'&&Number.isFinite(x)&&Math.abs(x)<=10000)&&typeof rate==='number'&&Number.isFinite(rate)&&rate>=0&&rate<=50;}
 function npv(flows,r){if(!Number.isFinite(r)||r<=-1||!Array.isArray(flows)||!flows.length||!flows.every(Number.isFinite))throw new RangeError('Finite cash flows and a rate above −100% are required.');return flows.reduce((s,c,t)=>s+c/Math.pow(1+r,t),0);}
 function poly(c,x){let v=0;for(let i=c.length-1;i>=0;i--)v=v*x+c[i];return v;}
 function positiveRoots(input){
  let c=input.slice();while(c.length>1&&c.at(-1)===0)c.pop();while(c.length>1&&c[0]===0)c.shift();
  const scale=Math.max(...c.map(Math.abs));if(!scale||c.length===1)return [];
  c=c.map(v=>v/scale);const n=c.length-1;if(n===1)return -c[0]/c[1]>0?[-c[0]/c[1]]:[];
  const bound=1+Math.max(...c.slice(0,-1).map(v=>Math.abs(v/c[n])));
  const critical=positiveRoots(c.slice(1).map((v,i)=>v*(i+1))).filter(v=>v<bound);
  const points=[0,...critical,bound],roots=[];
  const near=(x)=>Math.abs(poly(c,x))<=1e-10*c.reduce((s,v,i)=>s+Math.abs(v)*Math.pow(x,i),0);
  const add=x=>{if(x>0&&!roots.some(v=>Math.abs(v-x)<=1e-7*Math.max(1,x)))roots.push(x);};
  critical.forEach(x=>{if(near(x))add(x);});
  for(let i=1;i<points.length;i++){
   let lo=points[i-1],hi=points[i],f=poly(c,lo),g=poly(c,hi);
   if((lo>0&&near(lo))||near(hi)||Math.sign(f)===Math.sign(g))continue;
   for(let j=0;j<200;j++){const mid=(lo+hi)/2,h=poly(c,mid);if(Math.sign(h)===Math.sign(f)){lo=mid;f=h;}else hi=mid;}
   add((lo+hi)/2);
  }
  return roots.sort((a,b)=>a-b);
 }
 function calculate(flows,rate){
  if(!validate(flows,rate))throw new RangeError('Use 1–8 years, cash flows from −10,000 to 10,000, and a required return from 0% to 50%.');
  const r=rate/100,pvs=flows.map((c,t)=>c/Math.pow(1+r,t)),value=pvs.reduce((a,b)=>a+b,0),allRates=flows.every(c=>c===0),irrs=positiveRoots(flows).map(x=>1/x-1).sort((a,b)=>a-b);
  const signs=flows.filter(c=>c!==0).map(Math.sign),changes=signs.slice(1).filter((s,i)=>s!==signs[i]).length;
  const conventional=flows[0]<0&&flows.slice(1).every(c=>c>=0)&&flows.slice(1).some(c=>c>0);
  const curve=Array.from({length:301},(_,i)=>{const rate=i/600;return {rate,value:npv(flows,rate)};});
  return {pvs,value,irrs,allRates,conventional,changes,curve,decision:Math.abs(value)<1e-7?'Break-even':value>0?'Creates value':'Destroys value'};
 }
 globalThis.DemoModel=Object.freeze({PRESETS,validate,npv,positiveRoots,calculate});
})();
