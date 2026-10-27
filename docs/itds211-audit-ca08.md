# CA08 / lecture09 content audit

Source: `itds-211_comp_arch_Chapter08.pdf`, 41 PDF pages. Lesson: `tools/itds211-authoring/lessons/09.json`. Lab identity: `parallel`.

## Visual inspection

Inspected all 41 pages through seven rendered contact sheets (`ca08-001-006.png` through `ca08-037-041.png`) in local `work-notes/itds211-source-audit/qa-ca08/`. Enlarged and read pages 3, 11, 14, 17, 21, 23, 25, 27, 29, 30, 34, 35. Raw PDFs/renders stay outside the public repository.

Image-only content is taught explicitly: p3 classification tree; p17 issue-slot diagram; p23 three graphics system diagrams; p25 lane/register/load-store/coalescing diagram; p27 GPU memory and grids; p30 the entire GPU terms table; p34 topology drawings; p35 crossbar/Omega/switch box.

P14 has a source-cropped lower edge and inconsistent lane labels; the visible four lane element sequences are explained and the missing caption is not invented. All source content is explained; no teaching gap is hidden by a page-only coverage claim.

## Contents and verification

- 22 source-order sections; 9 worked examples; 9 reconstructed concept figures.
- 40 glossary terms; 8 confusion comparisons; 15 recap bullets.
- 8 review questions with detailed separate answers; 28 cards; exactly 10 four-option quizzes.
- 41 coverage rows: 37 explained, 4 context (cover p1, outline p2, overview p4, Q&A p41); zero needs-review.
- P29 comparison table: all 11 source rows, exact historical numbers and Yes/No cells.
- P30 terminology table: all 12 source rows, preserving descriptive name, older term, CUDA/NVIDIA term and translated book definition.
- Source contains no separate Self-study sheet or questions; p41 Q&A is accounted for. New exercises are marked `[อธิบายเสริม]`.
- `build_course.validate` passed for identity, source filename, lab, source references, coverage, quiz/card/review counts and section IDs.
- HTML parser checked all 48 content fragments for balanced tags.
- Independently computed literal 1..64000 data and simulated source half/pair algorithm. `sum[0]` at the six levels: 33,001,000; 98,002,000; 228,004,000; 488,008,000; 1,008,016,000; 2,048,032,000. Matches direct sum.
- Also checked 8-value/5-value reductions, DAXPY [12,26,1], 514 scalar instructions, vector 16KiB, Fermi 128KiB/512 contexts by register budget, AI 1/12 and 5GFLOP/s ceiling, and supplemental Amdahl 2.5x result.
- Site renderer/browser/publication QA remains parent-owned; this audit certifies source/content checks only.

## Source ambiguities handled

1. หน้า3ขยายSMPเป็นSymmetric Multiprocessor ขณะที่หน้า19ใช้Shared Memory Multiprocessor จึงอธิบายตามบริบทและไม่สรุปว่าsharedmemoryทุกแบบเป็นUMA
2. หน้า10–11ใช้ขนาดvector32×64สมาชิกและmnemonicเป็นแบบจำลองการสอน โค้ดvectorไม่แสดงการตั้งความยาว;บทเรียนระบุสมมติฐาน64สมาชิกแทนการนำเสนอเป็นโค้ดที่รันได้กับRISC-Vทุกเครื่อง
3. หน้า11Cรับnทั่วไป แต่assemblyกำหนดช่วง512ไบต์และเลื่อน8ไบต์ จึงเป็น64double;แยกสองระดับนี้ก่อนนับ514คำสั่งเทียบ6 และไม่ตีความinstructionratioเป็นtime-speedup
4. หน้า13วางMMX/SSEคู่กับข้อความ128-bit อาจทำให้จำMMXเป็น128ผิด;แก้ว่าMMX64บิตและSSE128บิตโดยอ้างIntel Instruction Set Extensions Technology ในเนื้อหา
5. หน้า14ป้ายlaneบนภาพเป็น0,2,3,4ไม่ต่อเนื่อง แต่ข้อมูลใน4ช่องเป็น0/1/2/3mod4 และภาพส่วนล่างถูกตัด;บทเรียนยึดสมาชิกในช่อง อธิบายส่วนที่เห็น และไม่เดาคำบรรยายที่ขาด
6. หน้า21เป็นpseudocodeที่ใช้synch()และรูปdoไม่มีbracesแบบCครบ;เติมวงเล็บเพื่ออ่านกลุ่มคำสั่งแต่คงลำดับ oddcheckก่อนหารhalf และแสดงว่าhalfต้องเป็นสถานะส่วนตัวของprocessorในคำอธิบายเสริม
7. หน้า25วาด16lanes ป้ายregisterแต่ละlane1K×32 รวมเป็น16Kregisters แต่หน้า26ระบุ32K×32บิต จึงแจ้งความขัดกันอย่างชัดและใช้32Kเฉพาะโจทย์ที่อ้างข้อความหน้า26 ไม่เดาค่าจริงต่อlane
8. หน้า27/30ใช้Local Memoryเป็นชื่อเชิงสถาปัตยกรรมของพื้นที่ใกล้block/SMที่ตารางเทียบCUDA Shared Memory;CUDA local memoryหมายถึงprivateของthread จึงอ้างCUDA Programming Guide8.0เพื่อกันสับสนชื่อ
9. หน้า29เป็นตารางCPU/GPUยุคตัวอย่าง ไม่ระบุรุ่นให้ทุกช่อง เช่นdemandpaging/cachecoherentเป็นNoฝั่งGPU;คงค่าทั้ง11แถวแต่ไม่อ้างเป็นข้อจำกัดGPUปัจจุบันทุกเครื่อง
10. หน้า34ภาพติดป้าย2DMeshมีเส้นวนขอบ ถ้าเป็นlinksต่อขอบตรงข้ามจะเป็นwrappedmesh/torus จึงระบุความกำกวมและไม่นับสายด้วยสูตรopenmeshจากภาพนี้
11. หน้า39ให้ตัวแปรสำหรับmodelingแต่ไม่มีสมการrooflineหรือค่าทดสอบเครื่อง;สูตรmin(peakcompute,AI×bandwidth),DAXPYAIและตัวเลข200/60เป็นส่วนเสริมติดป้ายแยก
12. หน้า41เป็นQ&Aไม่มีSelf-studyแยกหรือโจทย์ให้แก้ ชุดreview/cards/quizในบทเป็นแบบฝึกเพิ่ม ไม่อ้างว่าเป็นข้อสอบจริง

## Primary references used only for terminology correction

- [Intel Instruction Set Extensions Technology](https://www.intel.com/content/www/us/en/support/articles/000005779/processors.html): MMX registers 64 bits; SSE registers 128 bits. Linked at the source ambiguity in the lesson.
- [CUDA 8.0 Programming Guide: Memory Hierarchy](https://docs.nvidia.com/cuda/archive/8.0/cuda-c-programming-guide/#memory-hierarchy): local memory private to a thread, shared memory visible within a block. Linked at the naming ambiguity in the lesson.

Supplemental AI ceiling, traffic counts, Amdahl example, graph counts, numerical traces and analogies are explicitly separated from source claims. No shared renderer, lab, deployment or git state was edited by this author.
