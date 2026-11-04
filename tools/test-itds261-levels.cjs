const assert = require('node:assert/strict');
const {existsSync} = require('node:fs');
const path = require('node:path');
const target = path.join(__dirname, '../assets/testing-levels.js');
assert.ok(existsSync(target), 'L13 interactive calculation module must exist');
const lab = require(target);
// Catches off-by-one prices and accidental coercion of missing/decimal ages.
for (const [age,price] of [[-1,null],[0,0],[11,0],[12,100],[17,100],[18,200],[60,200],[61,100],['',null],[12.5,null]]) assert.equal(lab.parkPrice(age),price);
for (const [amount,rate] of [[0,null],[1,0],[500,0],[501,5],[999,5],[1000,10],[4999,10],[5000,20],[100000,20],[100001,null],['',null],[500.5,null]]) assert.equal(lab.discount(amount,'answer'),rate);
assert.equal(lab.discount(500,'problem'),5);
assert.equal(lab.discount(5000,'problem'),'unspecified');
assert.equal(lab.discount(0,'problem'),'unspecified');
assert.equal(lab.discount(5001,'problem'),20);
// This is the actual Python branch behavior, including its missing return.
for (const [age,price] of [[-1,null],[0,null],[1,50],[12,50],[13,100],[20,100],[21,150],[60,150],[61,100]]) assert.equal(lab.zooTrace(age).price,price);
assert.deepEqual(lab.zooTrace(0).decisions,[false,false,false,false]);
assert.deepEqual(lab.zooTrace(13).decisions,[false,true]);
assert.equal(lab.report([120,5,3,0,2]).executed,125);
assert.equal(lab.report([120,5,3,0,2]).planned,130);
assert.equal(lab.report([0,0,0,0,0]).passRate,null);
assert.equal(lab.report([1,-1,0,0,0]),null);
assert.equal(lab.report(['',0,0,0,0]),null);
assert.equal(lab.report([1.5,0,0,0,0]),null);
console.log('PASS: L13 boundaries, conflicting specifications, CFG paths, report denominators and invalid inputs');
