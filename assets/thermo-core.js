/* Pure formulas for interactive teaching. Units and domains documented by callers. */
(function(root){'use strict';
 const Rbar=0.08314462618; // L bar /(mol K)
 const RkPa=8.314462618; // L kPa /(mol K)
 const thermo={
  piston:(litres,kelvin=300,moles=1)=>moles*RkPa*kelvin/litres,
  energy:(heat,workOut)=>heat-workOut,
  virial:(pressureBar,kelvin=400,B=-0.12)=>1+B*pressureBar/(Rbar*kelvin), // two-term P-series approximation
  sensible:(finalC,initialC=20,massKg=2,cp=4.18)=>massKg*cp*(finalC-initialC),
  carnot:(hotK,coldK=300)=>1-coldK/hotK,
  qualityH:(x,hf=419.1,hg=2676)=>hf+x*(hg-hf),
  nozzle:(dhKJkg,inletMS=50)=>Math.sqrt(inletMS**2+2000*dhKJkg),
  rankine:(turbineKJkg,pumpKJkg=20,heatKJkg=3000)=>(turbineKJkg-pumpKJkg)/heatKJkg,
  fridgeCOP:(coldK,hotK=300)=>coldK/(hotK-coldK),
 };
 if(typeof module!=='undefined'&&module.exports)module.exports=thermo;
 else root.ThermoCore=thermo;
})(typeof window==='undefined'?globalThis:window);
