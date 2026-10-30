const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '../assets/final-learning-core.js');
assert.ok(fs.existsSync(file), 'Final learning models must exist');
const c = require(file);

// Potential impact follows reverse dependencies, terminates even with cycles.
assert.deepEqual(c.affected([['UI','Order'],['Order','Payment'],['Report','Payment']], 'Payment'), ['Payment','Order','Report','UI']);
assert.deepEqual(c.affected([['A','B'],['B','A']], 'A'), ['A','B']);
assert.deepEqual(c.affected([], 'UI'), ['UI']);
assert.deepEqual(c.architecture('direct', 'provider', false).affected, ['Provider','Checkout','Refund','Report']);
assert.deepEqual(c.architecture('adapter', 'provider', false).affected, ['Provider','Adapter']);
assert.deepEqual(c.architecture('adapter', 'provider', true).affected, ['Provider','Adapter','Checkout','Refund','Report']);

// Stated requirement: >= 1000 earns 10% off. Refactor preserves the old defect.
assert.deepEqual([999,1000,1001].map(x=>c.price(x,'original')), [999,1000,900.9]);
assert.deepEqual([999,1000,1001].map(x=>c.price(x,'refactor')), [999,1000,900.9]);
assert.deepEqual([999,1000,1001].map(x=>c.price(x,'fix')), [999,900,900.9]);
assert.throws(()=>c.price(-1,'fix'), /amount/);

// A deliberately field-based three-way merge, not a reimplementation of git merge.
assert.deepEqual(c.merge({title:'A',fee:'50'},{title:'B',fee:'50'},{title:'A',fee:'0'}), {values:{title:'B',fee:'0'},conflicts:[]});
assert.deepEqual(c.merge({fee:'50'},{fee:'0'},{fee:'20'}), {values:{},conflicts:['fee']});
assert.deepEqual(c.merge({fee:'50'},{fee:'0'},{fee:'0'}), {values:{fee:'0'},conflicts:[]});
assert.deepEqual(c.merge({fee:'50'},{fee:'50'},{fee:'0'}), {values:{fee:'0'},conflicts:[]});

// Parser type and placement are separate from the request's Content-Type.
assert.equal(c.formPipeline('POST','json','urlencoded','before','Ada','Lovelace').status,400);
assert.equal(c.formPipeline('POST','json','json','after','Ada','Lovelace').status,400);
assert.equal(c.formPipeline('POST','json','json','before','Ada','Lovelace').status,200);
assert.equal(c.formPipeline('GET','json','off','after','Ada','Lovelace').status,200);
assert.equal(c.formPipeline('POST','urlencoded','urlencoded','before','','Lovelace').status,400);
assert.equal(c.formPipeline('POST','urlencoded','urlencoded','before','Ada','Lovelace',false).status,400);
assert.deepEqual(c.sanitizeProgress(['a','a','unknown',null],['a','b']),['a']);
for(const bad of [null,{},true,'a']) assert.deepEqual(c.sanitizeProgress(bad,['a']),[]);
console.log('PASS: impact propagation, price boundaries, three-way merge, parser order/type, safe progress.');
