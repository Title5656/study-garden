import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';
const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({channel:'chrome', headless:true});
const errors = [];
try {
  const page = await useLocalFiles(await browser.newPage({viewport:{width:375,height:900}, reducedMotion:'reduce'}), root);
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('https://study-garden.test/subjects/itds261/chapter-03.html#requirement-types');
  assert.equal(await page.locator('#w-requirements').count(), 1, 'Requirement classification exercise exists');
  const cases = [['booking','fr'], ['speed','nfr'], ['security','fr'], ['platform','nfr']];
  for (const [scenario, answer] of cases) {
    await page.locator('#req-scenario').selectOption(scenario);
    assert.match(await page.locator('#req-feedback').innerText(), /เลือกประเภท/);
    await page.locator(`[data-req-answer="${answer === 'fr' ? 'nfr' : 'fr'}"]`).click();
    assert.match(await page.locator('#req-feedback').innerText(), /ลองทบทวน/);
    await page.locator(`[data-req-answer="${answer}"]`).focus();
    await page.keyboard.press('Space');
    assert.match(await page.locator('#req-feedback').innerText(), /ถูกต้อง/);
    assert.equal(await page.locator(`[data-req-answer="${answer}"]`).getAttribute('aria-pressed'), 'true');
  }
  assert.equal(await page.locator('#req-feedback').getAttribute('aria-live'), 'polite');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.close();
  const plain = await useLocalFiles(await browser.newPage({javaScriptEnabled:false}), root);
  await plain.goto('https://study-garden.test/subjects/itds261/chapter-03.html');
  assert.equal(await plain.locator('#req-controls:visible').count(), 0, 'Inert exercise controls are hidden without JS');
  await plain.locator('#req-answer-guide summary').click();
  assert.match(await plain.locator('#req-answer-guide').innerText(), /พฤติกรรม/);
  assert.match(await plain.locator('#req-answer-guide').innerText(), /ข้อจำกัด/);
  assert.deepEqual(errors, []);
  console.log('PASS: four classification cases, wrong/correct feedback, keyboard, mobile and no-JS answers.');
} finally { await browser.close(); }
