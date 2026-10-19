/* Calculations used by the educational simulators; values share one period. */
(function(root){
  'use strict';
  function funnel(impressions,ctr,cvr,spend,aov){
    const clicks=impressions*ctr/100;
    const orders=clicks*cvr/100;
    const revenue=orders*aov;
    return {clicks,orders,revenue,ctr,cvr,cpc:clicks>0?spend/clicks:null,cpa:orders>0?spend/orders:null,roas:spend>0?revenue/spend:null};
  }
  function finance(price,variable,fixed,volume){
    const margin=price-variable;
    const revenue=price*volume;
    const cost=fixed+variable*volume;
    // With no fixed costs, zero activity is already at break-even.
    const breakEven=fixed===0?0:margin>0?Math.ceil(fixed/margin):null;
    return {margin,revenue,cost,profit:revenue-cost,breakEven};
  }
  const api={funnel,finance};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else root.EcommerceCore=api;
})(typeof window==='undefined'?globalThis:window);
