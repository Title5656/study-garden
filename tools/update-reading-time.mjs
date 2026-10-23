// Thai word segmentation, 180 words/minute, plus authored activity allowances.
// Estimates include static worked examples/glossary/summary, excluding assessments/sources.
import {readFileSync,writeFileSync} from 'node:fs';
const segmenter=new Intl.Segmenter('th',{granularity:'word'});
const lessons=[
 ...[['06',12],['07',10],['08',10]].map(([chapter,activityMinutes])=>['itds241',chapter,activityMinutes]),
 ...Array.from({length:10},(_,i)=>['itds294',String(i+1).padStart(2,'0'),i>=7?15:10]),
];
for(const [course,chapter,activityMinutes] of lessons) {
 const file=new URL(`../subjects/${course}/chapter-${chapter}.html`,import.meta.url);
 let html=readFileSync(file,'utf8');
 const articleStart=html.indexOf('<article class="lesson-content">');
 const assessmentStart=html.search(/<section\b[^>]*id="flashcards"/);
 if(articleStart<0||assessmentStart<articleStart) throw new Error(`Missing lesson boundary: ${course}/${chapter}`);
 const lesson=html.slice(articleStart,assessmentStart);
 const text=lesson.replace(/<[^>]*>/g,' ').replace(/&(?:[a-z]+|#\d+);/g,' ');
 const words=[...segmenter.segment(text)].filter(part=>part.isWordLike).length;
 const minutes=Math.ceil(words/180)+activityMinutes;
 html=html.replace(/เวลาอ่านโดยประมาณ [^<]+/,`เวลาอ่านและทดลองประมาณ ${minutes}–${minutes+10} นาที`)
  .replace(/เวลาอ่านและทำกิจกรรม \d+–\d+ นาที/,`เวลาอ่านและทดลองประมาณ ${minutes}–${minutes+10} นาที`)
  .replace(/เวลาอ่านและทดลองประมาณ \d+–\d+ นาที/,`เวลาอ่านและทดลองประมาณ ${minutes}–${minutes+10} นาที`);
 writeFileSync(file,html);
 console.log(`${course}/${chapter}: ${words} segmented words / 180 + ${activityMinutes} activity minutes = ${minutes}–${minutes+10} minutes`);
}
