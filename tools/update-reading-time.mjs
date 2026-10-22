// Thai word segmentation, 180 words/minute, plus authored activity allowances.
// Estimates include static worked examples/glossary/summary, excluding assessments/sources.
import {readFileSync,writeFileSync} from 'node:fs';
const segmenter=new Intl.Segmenter('th',{granularity:'word'});
for(const [chapter,activityMinutes] of [['06',12],['07',10],['08',10]]) {
 const file=new URL(`../subjects/itds241/chapter-${chapter}.html`,import.meta.url);
 let html=readFileSync(file,'utf8');
 const lesson=html.slice(html.indexOf('<article class="lesson-content">'),html.indexOf('<section class="lesson-section" id="flashcards">'));
 const text=lesson.replace(/<[^>]*>/g,' ').replace(/&(?:[a-z]+|#\d+);/g,' ');
 const words=[...segmenter.segment(text)].filter(part=>part.isWordLike).length;
 const minutes=Math.ceil(words/180)+activityMinutes;
 html=html.replace(/เวลาอ่านโดยประมาณ [^<]+/,`เวลาอ่านและทดลองประมาณ ${minutes}–${minutes+10} นาที`)
  .replace(/เวลาอ่านและทดลองประมาณ \d+–\d+ นาที/,`เวลาอ่านและทดลองประมาณ ${minutes}–${minutes+10} นาที`);
 writeFileSync(file,html);
 console.log(`${chapter}: ${words} segmented words / 180 + ${activityMinutes} activity minutes = ${minutes}–${minutes+10} minutes`);
}
