// Expectations are hand-derived examples, independent of implementation.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const file=path.join(__dirname,'../assets/itds211-core.js');
test('ITDS211 calculation engine is present',()=>assert.ok(fs.existsSync(file),'ITDS211 calculation engine is not implemented'));
const core=fs.existsSync(file)?require(file):{};
test('CPU time converts GHz to cycles per second',()=>{
  assert.equal(core.cpuTime({instructions:1e9,cpi:2,ghz:2}).seconds,1);
  assert.equal(core.cpuTime({instructions:2e8,cpi:1.5,ghz:3}).seconds,0.1);
  assert.throws(()=>core.cpuTime({instructions:10,cpi:2,ghz:0}));
  assert.throws(()=>core.cpuTime({instructions:1.5,cpi:2,ghz:2}),'instruction count is an integer; average CPI may be fractional');
  assert.throws(()=>core.cpuTime({instructions:10,cpi:2,ghz:1e-320}),'unrepresentable CPU time must be explained, not returned as Infinity');
});
test('8-bit two complement keeps carry trace and signed bounds',()=>{
  assert.equal(core.representInteger(-5,8).bits,'11111011');
  assert.equal(core.representInteger(127,8).bits,'01111111');
  assert.equal(core.representInteger(-128,8).bits,'10000000');
  assert.equal(core.representInteger(0,8).bits,'00000000');
  assert.ok(core.representInteger(-5,8).steps.length>=4);
  assert.throws(()=>core.representInteger(128,8));
  assert.throws(()=>core.representInteger(-129,8));
  assert.throws(()=>core.representInteger(1.5,8));
});
test('IEEE 754 field split handles sign, zero and subnormal',()=>{
  const a=core.float32(10.25);assert.equal(a.sign,'0');assert.equal(a.exponent,'10000010');assert.equal(a.fraction,'01001000000000000000000');
  assert.equal(core.float32(-0).sign,'1');
  assert.equal(core.float32(0).classification,'zero');
  assert.equal(core.float32(0).unbiasedExponent,null,'zero has no unique real exponent');
  assert.equal(core.float32(1e40).unbiasedExponent,null,'overflow is a special code, not exponent 128');
  assert.equal(core.float32(2**-149).classification,'subnormal');
  assert.throws(()=>core.float32(Infinity));
});
test('direct cache mapping distinguishes spatial hits and conflict misses',()=>{
  const a=core.cacheTrace([0,3,4,0,16,0],{lines:4,blockBytes:4,ways:1});
  assert.deepEqual(a.trace.map(x=>x.hit),[false,true,false,true,false,false]);
  assert.equal(a.hits,2);assert.equal(a.misses,4);
  assert.equal(a.trace[1].offset,3);assert.equal(a.trace[4].index,0);assert.equal(a.trace[4].tag,1);
  assert.throws(()=>core.cacheTrace([0],{lines:3,blockBytes:4,ways:1}));
  assert.throws(()=>core.cacheTrace([-1],{lines:4,blockBytes:4,ways:1}));
});
test('set-associative cache evicts least recently used way',()=>{
  const a=core.cacheTrace([0,8,0,16,8],{lines:4,blockBytes:4,ways:2});
  assert.deepEqual(a.trace.map(x=>x.hit),[false,false,true,false,false]);
  assert.equal(a.trace[3].evictedBlock,2);
});
test('address translation preserves offset and reports missing pages',()=>{
  const table=[{vpn:1,pfn:5,present:true},{vpn:2,pfn:0,present:false}];
  assert.deepEqual(core.translateAddress({virtualAddress:4099,pageBytes:4096,table}),{vpn:1,offset:3,pageFault:false,physicalAddress:20483,pfn:5});
  assert.equal(core.translateAddress({virtualAddress:8192,pageBytes:4096,table}).pageFault,true);
  assert.equal(core.translateAddress({virtualAddress:0,pageBytes:4096,table}).pageFault,true);
  assert.throws(()=>core.translateAddress({virtualAddress:1,pageBytes:2**30,table:[{vpn:0,pfn:2**30,present:true}]}),'a physical address must preserve its offset exactly');
});
test('disk latency uses average half rotation and decimal MB',()=>{
  const a=core.diskTime({rpm:15000,seekMs:4,bytes:512,megabytesPerSecond:100,overheadMs:0.2});
  assert.equal(a.rotationMs,2);assert.equal(a.transferMs,0.00512);assert.ok(Math.abs(a.totalMs-6.20512)<1e-9);
  assert.throws(()=>core.diskTime({rpm:0,seekMs:4,bytes:512,megabytesPerSecond:100,overheadMs:0}));
  assert.throws(()=>core.diskTime({rpm:7200,seekMs:4,bytes:512,megabytesPerSecond:1e-320}),'unrepresentable transfer time must not return Infinity');
});
const dependent=[{text:'add x1,x2,x3',dest:'x1',src:['x2','x3'],type:'alu'},{text:'sub x4,x1,x5',dest:'x4',src:['x1','x5'],type:'alu'}];
test('pipeline forwarding removes ALU waits while load-use still stalls',()=>{
  assert.equal(core.pipelineTrace(dependent,{forwarding:true}).cycles,6);
  assert.equal(core.pipelineTrace(dependent,{forwarding:false}).cycles,8);
  const load=[{text:'ld x1,0(x2)',dest:'x1',src:['x2'],type:'load'},dependent[1]];
  assert.equal(core.pipelineTrace(load,{forwarding:true}).cycles,7);
  assert.equal(core.pipelineTrace(load,{forwarding:true}).stalls,1);
});
const jobs=[{id:'A',arrival:0,burst:5,priority:2},{id:'B',arrival:1,burst:2,priority:1},{id:'C',arrival:2,burst:1,priority:3}];
test('FCFS waiting, turnaround and response use arrivals',()=>{
  const a=core.schedule(jobs,'FCFS',2);
  assert.deepEqual(a.segments.map(x=>[x.id,x.start,x.end]),[['A',0,5],['B',5,7],['C',7,8]]);
  assert.deepEqual(a.metrics.map(x=>x.waiting),[0,4,5]);
  assert.deepEqual(a.metrics.map(x=>x.turnaround),[5,6,6]);
  assert.equal(core.schedule(jobs,'FCFS',NaN).elapsed,8,'a Round Robin-only quantum must not block FCFS');
  assert.throws(()=>core.schedule(jobs,'RR',NaN));
});
test('SJF is nonpreemptive, STCF can preempt on a late shorter arrival',()=>{
  assert.deepEqual(core.schedule(jobs,'SJF',2).segments.map(x=>[x.id,x.start,x.end]),[['A',0,5],['C',5,6],['B',6,8]]);
  const a=core.schedule(jobs,'STCF',2);
  assert.deepEqual(a.segments.map(x=>[x.id,x.start,x.end]),[['A',0,1],['B',1,3],['C',3,4],['A',4,8]]);
  assert.deepEqual(a.metrics.map(x=>x.waiting),[3,0,1]);
});
test('RR enqueues arrivals at the quantum boundary before requeueing current',()=>{
  const a=core.schedule([{id:'P1',arrival:0,burst:3},{id:'P2',arrival:1,burst:2}],'RR',1);
  assert.deepEqual(a.segments.map(x=>[x.id,x.start,x.end]),[['P1',0,1],['P2',1,2],['P1',2,3],['P2',3,4],['P1',4,5]]);
  // P2 runs at 1–2 and 3–4; its only wait after arrival is 2–3.
  assert.deepEqual(a.metrics.map(x=>x.response),[0,0]);assert.deepEqual(a.metrics.map(x=>x.waiting),[2,1]);
});
test('scheduling handles idle time and stable arrival ties',()=>{
  const a=core.schedule([{id:'P1',arrival:3,burst:1},{id:'P2',arrival:3,burst:1}],'SJF',2);
  assert.deepEqual(a.segments.map(x=>[x.id,x.start,x.end]),[['idle',0,3],['P1',3,4],['P2',4,5]]);
  assert.deepEqual(a.metrics.map(x=>x.response),[0,1]);
  assert.throws(()=>core.schedule([{id:'A',arrival:0,burst:0}],'RR',0));
  assert.throws(()=>core.schedule([{id:'A',arrival:0,burst:1},{id:'A',arrival:1,burst:1}],'FCFS',2));
});
test('priority example uses lower numeric priority first without preemption',()=>{
  assert.deepEqual(core.schedule(jobs,'PRIORITY',2).segments.map(x=>x.id),['A','B','C']);
});
test('process state transitions reject running blocked jobs directly',()=>{
  assert.equal(core.processTransition('ready','dispatch'),'running');
  assert.equal(core.processTransition('running','io'),'blocked');
  assert.equal(core.processTransition('blocked','complete'),'ready');
  assert.equal(core.processTransition('running','timeout'),'ready');
  assert.equal(core.processTransition('running','exit'),'terminated');
  assert.throws(()=>core.processTransition('blocked','dispatch'));
});
