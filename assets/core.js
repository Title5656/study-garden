/* ตรรกะที่ไม่ผูกกับหน้าเว็บ แยกไว้เพื่ออ่านและทดสอบได้ง่าย */
(function (root) {
  "use strict";
  function gradeQuiz(questions, answers) {
    return {
      score: questions.filter(
        (q, i) => Number.isInteger(answers[i]) && answers[i] === q.answer,
      ).length,
      total: questions.length,
      unanswered: questions.filter((q, i) => !Number.isInteger(answers[i]))
        .length,
    };
  }
  function loopTrace(limit) {
    const steps = [
      { phase: "init", i: 1, sum: 0, message: "เริ่มต้น i = 1 และ sum = 0" },
    ];
    let sum = 0;
    for (let i = 1; i <= limit; i++) {
      steps.push({
        phase: "check",
        i,
        sum,
        message: `${i} <= ${limit} เป็น true → เข้าสู่รอบนี้`,
      });
      sum += i;
      steps.push({
        phase: "add",
        i,
        sum,
        message: `sum += ${i} → ผลรวมตอนนี้คือ ${sum}`,
      });
      steps.push({
        phase: "increment",
        i: i + 1,
        sum,
        message: `i++ → i กลายเป็น ${i + 1} แล้วกลับไปตรวจเงื่อนไข`,
      });
    }
    steps.push({
      phase: "done",
      i: limit + 1,
      sum,
      message: `${limit + 1} <= ${limit} เป็น false → จบ loop`,
    });
    return steps;
  }
  function boardResult(board) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[b] === board[c])
        return board[a];
    }
    return board.every(Boolean) ? "draw" : null;
  }
  const api = { gradeQuiz, loopTrace, boardResult };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.StudyCore = api;
})(typeof window === "undefined" ? globalThis : window);
