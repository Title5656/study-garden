const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '../assets/nodejs-core.js');
assert.ok(fs.existsSync(file), 'Node.js activities must have a working simulation engine');
const core = require(file);
for (const name of ['/a/b/c.txt', '.env', '/a/.env', 'file', 'file.', 'C:\\demo\\hello.js']) {
  const api = name.includes('\\') ? path.win32 : path.posix;
  assert.deepEqual(core.parsePath(name), api.parse(name), `path fields: ${name}`);
}
assert.equal(core.route('/bbq').status, 200);
assert.equal(core.route('/bbq').type, 'text/html');
assert.equal(core.route('/BBQ').status, 404);
assert.equal(core.route('/bbq/').status, 404);
assert.equal(core.route('/bbq?a=1').status, 404, 'req.url comparison includes query string');
assert.deepEqual(core.requestSteps('static'), [1,2,5,6]);
assert.deepEqual(core.requestSteps('dynamic'), [1,2,3,4,5,6]);
assert.deepEqual(core.asyncTimeline([300,50,100], 'parallel').map(x=>x.id), [2,3,1]);
assert.deepEqual(core.asyncTimeline([300,50,100], 'sync').map(x=>x.id), [1,2,3]);
assert.deepEqual(core.asyncTimeline([300,50,100], 'nested').map(x=>x.end), [300,350,450]);
const files = {
 'hello.js': 'function sayHello(){ console.log("Hello"); }\nmodule.exports.sayHi = sayHello;',
 'msg.js': 'module.exports = "Hello World!";',
 'ictgreet.js': 'let message = "Hello ICT";\nmodule.exports.greetICT = message;',
 'greet.js': 'const eng = require("./hello");\nconst msg = require("./msg");\nconst ictgreet = require("./ictgreet");\neng.sayHi();\nconsole.log(`${msg}`);\nconsole.log(`${ictgreet.greetICT}`);'
};
assert.deepEqual(core.runModules(files), ['Hello', 'Hello World!', 'Hello ICT']);
assert.deepEqual(core.runModules({...files,'msg.js':'module.exports = "Changed";'}), ['Hello','Changed','Hello ICT']);
assert.throws(()=>core.runModules({...files,'hello.js':files['hello.js'].replace('exports.sayHi','exports.other')}), /sayHi is not a function/);
assert.throws(()=>core.runModules({...files,'msg.js':'module.exports = window.location;'}), /รองรับ/);
assert.throws(()=>core.runModules({...files,'msg.js':'while(true) {}'}), /รองรับ/);
console.log('PASS: path, exact routing, request steps, async order and editable module simulation.');
