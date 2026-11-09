const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('src/risk-capm/model.js','utf8'),context);const M=context.DemoModel;
const calc=s=>M.calculate({...M.defaults,mode:'cal',...s}),near=(a,b,tol=1e-11)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);

test('CAL independent example: variance .058, full/cash/borrowed allocation',()=>{
 const m=calc({});near(m.variance,.058);near(m.volatility,Math.sqrt(.058));near(m.calExcess,.06);near(m.calReturn,.09);near(m.sharpe,.06/Math.sqrt(.058));
 const cash=calc({y:60});near(cash.calRisk,Math.sqrt(.058)*.6);near(cash.calExcess,.036);near(cash.calReturn,.066);
 const borrow=calc({y:150});near(borrow.calRisk,Math.sqrt(.058)*1.5);near(borrow.calExcess,.09);near(borrow.calReturn,.12);
 const allCash=calc({y:0});near(allCash.calRisk,0);near(allCash.calReturn,.03);
});
test('expected market return stays fixed when risk-free rate changes',()=>{
 const a=calc({rf:2}),b=calc({rf:7});near(a.required,.09);near(b.required,.09);near(a.calRisk,b.calRisk);near(a.marketExpected,b.marketExpected);near(a.riskyExcess,.07);near(b.riskyExcess,.02);
 const cashA=calc({rf:2,y:60}),cashB=calc({rf:7,y:60});near(cashB.calReturn-cashA.calReturn,.02);
});
test('diversification reference: n1 .13 variance; n100 .0409; shared market floor .2',()=>{
 const one=calc({mode:'diversification',n:1}),many=calc({mode:'diversification',n:100});near(one.variance,.13);near(many.variance,.0409);near(one.systematic,.2);near(many.systematic,.2);near(many.residualVol,.03);near(one.required,many.required);near(one.required,.09);
 assert.ok(many.volatility>many.systematic);assert.ok(many.volatility<one.volatility);
});
test('boundary decompositions: residual zero, beta zero, negative beta',()=>{
 const clean=calc({sE:0});near(clean.volatility,.2);near(clean.sharpe,clean.marketSharpe);
 const noMarket=calc({beta:0,n:100});near(noMarket.systematic,0);near(noMarket.volatility,.03);near(noMarket.required,.03);
 const negative=calc({beta:-1,n:100});near(negative.systematic,.2);near(negative.volatility,Math.sqrt(.0409));near(negative.required,-.03);
 const zero=calc({sE:0,beta:0});near(zero.volatility,0);near(zero.calExcess,0);assert.equal(zero.sharpe,null);
});
test('risk curves: monotone, at/above systematic floor, n invariant market variance',()=>{
 for(const beta of [-2,0,.5,1,3])for(const sE of [0,12,80]){
  const m=calc({mode:'diversification',beta,sE});let previous=Infinity;
  for(const p of m.curve){assert.ok(p.volatility<=previous+1e-14);assert.ok(p.volatility>=m.systematic-1e-14);near(p.variance-p.residualVariance,m.systematicVariance);previous=p.volatility;}
 }
});
test('beta sample OLS: slope1.5, covariance .06, market variance .04, alpha2%',()=>{
 const m=calc({mode:'beta',beta:1.5,alpha:2,sE:12});near(m.estimatedBeta,1.5);near(m.covariance,.06);near(m.marketVariance,.04);near(m.meanMarket,.09);near(m.meanAsset,.14);near(m.intercept,.005);near(m.required,.12);
 const n=m.samples.length;near(m.samples.reduce((a,p)=>a+p.residual,0)/n,0);near(m.samples.reduce((a,p)=>a+p.residual*p.residual,0)/n,.0144);
 near(m.samples.reduce((a,p)=>a+(p.market-m.meanMarket)*p.residual,0)/n,0);
 for(const p of m.samples)near(p.asset-m.fit(p.market),p.residual);
});
test('synthetic observations reproducible by seed; resampling preserves moment targets',()=>{
 const a=calc({mode:'beta',seed:42}),again=calc({mode:'beta',seed:42}),b=calc({mode:'beta',seed:43});assert.equal(JSON.stringify(a.samples),JSON.stringify(again.samples));assert.notEqual(JSON.stringify(a.samples),JSON.stringify(b.samples));near(a.estimatedBeta,b.estimatedBeta);near(a.meanAsset,b.meanAsset);near(a.marketVariance,b.marketVariance);
 for(const beta of [-2,0,.5,3])near(calc({mode:'beta',beta}).estimatedBeta,beta);
 const noNoise=calc({mode:'beta',sE:0});for(const p of noNoise.samples)near(p.asset,noNoise.fit(p.market));
});
test('beta uses single-asset residual risk; adding holdings only changes portfolio tabs',()=>{
 const a=calc({mode:'beta',n:1}),b=calc({mode:'beta',n:200});assert.equal(JSON.stringify(a.samples),JSON.stringify(b.samples));near(a.required,b.required);
});
test('validation, preset isolation and input immutability',()=>{
 for(const invalid of [{mode:'portfolio'},{n:0},{n:1.1},{n:201},{sM:0},{sE:-1},{sE:81},{beta:-2.01},{beta:3.01},{rf:21},{expectedMarket:-21},{y:201},{y:-1},{alpha:11},{seed:0},{seed:2.5},{n:'5'},{beta:NaN},{rf:Infinity}])assert.throws(()=>calc(invalid));
 const input={...M.defaults};const before=JSON.stringify(input);M.calculate(input);assert.equal(JSON.stringify(input),before);
 const presets=M.examples();assert.equal(presets.length,16);for(const p of presets)assert.doesNotThrow(()=>M.calculate(p));presets[0].rf=999;assert.notEqual(M.examples()[0].rf,999);assert.equal(M.defaults.rf,3);
});


test('dedicated CAPM: 3% + 1.5×6% =12%; intercept, market point and unrelated-risk invariance',()=>{
 const m=M.calculate({mode:'capm',rf:3,expectedMarket:9,beta:1.5});near(m.required,.12);near(m.marketExpected,.09);near(m.riskPremium,.09);near(m.requiredAt(0),.03);near(m.requiredAt(1),.09);near(m.requiredAt(-.5),0);
 const other=calc({mode:'capm',beta:1.5,n:200,sE:80,sM:60,alpha:10});near(other.required,m.required);
 const flat=calc({mode:'capm',expectedMarket:3,beta:-2});near(flat.required,.03);for(const p of flat.line)near(p.required,.03);
 const shifted=calc({mode:'capm',rf:8,beta:1.5});near(shifted.required,.095);near(shifted.marketExpected,m.marketExpected);
 for(const invalid of [{rf:21},{expectedMarket:-21},{beta:3.1},{beta:NaN}])assert.throws(()=>calc({mode:'capm',...invalid}));
 assert.equal(M.defaults.mode,'capm');assert.equal(M.examples()[0].mode,'capm');
});


test('derived premiums support flat/inverted lines and preserve market point',()=>{
 const negative=calc({mode:'capm',rf:3,expectedMarket:2,beta:1.5});near(negative.premium,-.01);near(negative.required,.015);near(negative.requiredAt(1),.02);near(negative.requiredAt(-2),.05);near(negative.requiredAt(3),0);
 const portfolio=calc({mode:'cal',rf:3,expectedMarket:2,beta:1,y:150});near(portfolio.riskyExcess,-.01);near(portfolio.calExcess,-.015);near(portfolio.calReturn,.015);near(portfolio.marketSharpe,-.05);
 for(const expectedMarket of [-20,0,3,9,40])for(const rf of [0,3,20]){
  const m=calc({mode:'capm',expectedMarket,rf});near(m.requiredAt(0),rf/100);near(m.requiredAt(1),expectedMarket/100);
 }
 for(const invalid of [{expectedMarket:41},{expectedMarket:-21},{expectedMarket:NaN},{expectedMarket:'9'}])assert.throws(()=>calc({mode:'capm',...invalid}));
});
