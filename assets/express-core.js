(function(root){
 'use strict';
 function route(method,input,catchFirst=false){
  let pathname;try{pathname=new URL(input,'http://localhost:3000').pathname.toLowerCase().replace(/\/$/,'')||'/';}catch{return {status:400,body:'Invalid URL'};}
  const routes={'/':'Hello World from Root!','/shabu':'html/shabu.html','/bbq':'html/bbq.html','/product':'Module for product - Root','/product/add':'Module for product - Add','/user':'Module for user - Root','/user/add':'Module for user - Add'};
  return !catchFirst&&method==='GET'&&Object.hasOwn(routes,pathname)?{status:200,body:routes[pathname]}:{status:404,body:'Invalid Path'};
 }
 function staticFile(input,mount='/'){
  let p;try{p=new URL(input,'http://localhost').pathname;}catch{return null;}
  const prefix=mount==='/'?'':mount.replace(/\/$/,'');
  if(prefix&&!p.startsWith(prefix+'/'))return null;
  p=p.slice(prefix.length);
  return ['/mystyle.css','/images/sample.png'].includes(p)?'public'+p:null;
 }
 function form(method,fname,lname,parser=true,type='urlencoded'){
  const params=new URLSearchParams({fname,lname}),url=method==='GET'?'/form-get?'+params:'/form-post';
  const payload=method==='GET'?'':type==='json'?JSON.stringify({fname,lname}):params.toString();
  if(method==='POST'&&!parser)return {status:400,url,payload,data:null,message:'req.body ยังไม่ถูก parse — วาง middleware ให้ตรง Content-Type ก่อน handler'};
  const data={fname,lname};
  if(!fname.trim()||!lname.trim()||fname.length>100||lname.length>100)return {status:400,url,payload,data,message:'กรอกชื่อและนามสกุล ความยาวไม่เกิน 100 ตัวอักษร'};
  return {status:200,url,payload,data,message:`Form submitted by ${fname} ${lname} with ${method}`};
 }
 const api={route,staticFile,form};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ExpressLessonCore=api;
})(typeof window==='undefined'?globalThis:window);
