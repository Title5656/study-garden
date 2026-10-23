// Idempotent local navigation update for the new Part I chapter.
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const write=(p,text)=>writeFileSync(new URL(p,root),text);
let index=read('subjects/itds241/index.html');
if(!index.includes('data-exam-folder=')) {
const folders=[...index.matchAll(/<article class="folder-card[\s\S]*?<\/article>/g)].map(m=>m[0]);
const last=folders.find(c=>c.includes('data-chapter-status="08"'));
const card=last.replaceAll('chapter-08','chapter-09').replaceAll('="08"','="09"').replaceAll('ITDS241 / 08','ITDS241 / 09').replaceAll('บท 8','บท 9').replaceAll('บทที่ 8','บทที่ 9').replaceAll('Modern JavaScript','Node.js Part I').replaceAll('ECMAScript · Promise · Async / Await','Node.js · Module · File System · HTTP').replaceAll('ECMAScript','Node.js').replaceAll('Promise','Module').replaceAll('Async / Await','HTTP').replaceAll('>12<','>14<').replaceAll('<small>12</small>','<small>14</small>').replaceAll('12 cards','14 cards');
const prior=folders.find(c=>c.includes('data-chapter-status="09"'));
index=prior?index.replace(prior,card):index.replace(last,last+'\n'+card);
index=index.replace('บทเรียนทั้งหมด <span>3</span>','บทเรียนทั้งหมด <span>4</span>').replace('/ 3</span>','/ 4</span>').replace('3 บทเรียน','4 บทเรียน').replaceAll('บท 6–8','บท 6–9');
write('subjects/itds241/index.html',index);
}
let previous=read('subjects/itds241/chapter-08.html');
previous=previous.replace('<a class="btn primary" href="index.html">กลับไปดูความคืบหน้า →</a>','<a class="btn primary" href="chapter-09.html">บทถัดไป · Node.js →</a>');
write('subjects/itds241/chapter-08.html',previous);
let home=read('index.html');
const context={window:{}};vm.createContext(context);vm.runInContext(read('assets/content.js'),context);
const chapters=Object.values(context.window.StudyContent.itds241);
const cardCount=chapters.reduce((n,c)=>n+c.cards.length,0),quizCount=chapters.reduce((n,c)=>n+c.quiz.length,0);
home=home.replace(/<article class="folder-card[^>]*data-search-text="ITDS241[\s\S]*?<\/article>/,course=>course
 .replace(/(<span>Flashcards<\/span><b>)\d+(<\/b>)/,`$1${cardCount}$2`)
 .replace(/(<span>Quiz<\/span><b>)\d+(<\/b>)/,`$1${quizCount}$2`)
 .replace(/เทคโนโลยีเว็บ JavaScript DOM ECMAScript(?: Node\.js Module HTTP)*/,'เทคโนโลยีเว็บ JavaScript DOM ECMAScript Node.js Module HTTP')
 .replace('JavaScript · DOM · ECMAScript</p>','JavaScript · DOM · ECMAScript · Node.js</p>'));
home=home.replace('ITDS241 Web Technologies and Applications 3 บทเรียน','ITDS241 Web Technologies and Applications 4 บทเรียน').replace('3 บทเรียน · บทที่ 6–8','4 บทเรียน · บทที่ 6–9').replace('data-course-read-count="itds241">0</span> / 3 บท','data-course-read-count="itds241">0</span> / 4 บท');
// Course totals are derived by app.js; the displayed denominator is authored HTML.
home=home.replace('/ 34 บท','/ 35 บท').replace('4 วิชา · 34 บทเรียน','4 วิชา · 35 บทเรียน').replace('25 บทเรียน</span>','26 บทเรียน</span>');
write('index.html',home);
await import('./organize-itds241-exams.mjs');
console.log('Connected Node.js Part I to the course index, previous chapter and home.');
