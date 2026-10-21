(function () {
  'use strict';
  const diagram = document.querySelector('#zoo-l2');
  const status = document.querySelector('#dfd-step-status');
  const buttons = [...document.querySelectorAll('[data-dfd-select]')];
  if (!diagram || !status || !buttons.length) return;
  const descriptions = {
    '1': '1.1 รับและตรวจคำสั่งซื้อ · อ่านสิทธิ์ D3 · ส่งรายการที่ผ่านตรวจให้ 1.2 หรือคืนข้อความผิดพลาด',
    '2': '1.2 ตรวจรอบและคำนวณราคา · อ่าน D2 · คืนราคา และส่งรายการพร้อมชำระให้ 1.3',
    '3': '1.3 รับชำระและตรวจผล · บันทึกธุรกรรม D4 · ส่งผลสำเร็จให้ 1.4 หรือคืนผลชำระไม่สำเร็จ',
    '4': '1.4 ออกและบันทึกตั๋ว · เขียน D1 · ส่ง Booking ID/QR หลังยืนยันชำระสำเร็จ',
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    const step = button.dataset.dfdSelect;
    buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    diagram.querySelectorAll('[data-dfd-step]').forEach(group => {
      group.classList.toggle('se-dfd-active', group.dataset.dfdStep === step);
    });
    status.textContent = descriptions[step];
  }));
})();
