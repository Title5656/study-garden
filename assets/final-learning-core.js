(function (root) {
  'use strict';
  function affected(edges, changed) {
    const result = [changed];
    for (let i = 0; i < result.length; i++) {
      for (const [consumer, dependency] of edges) {
        if (dependency === result[i] && !result.includes(consumer)) result.push(consumer);
      }
    }
    return result;
  }
  function architecture(mode, change, contractChanged) {
    const clients = ['Checkout', 'Refund', 'Report'];
    const edges = mode === 'direct'
      ? clients.map(name => [name, 'Provider'])
      : [...clients.map(name => [name, 'Adapter']), ['Adapter', 'Provider']];
    const changed = change === 'ui' ? 'Checkout' : 'Provider';
    // Stable adapter contract stops *this implementation change* at the boundary.
    const propagation = mode === 'adapter' && !contractChanged
      ? edges.filter(([consumer]) => consumer === 'Adapter') : edges;
    return {edges, affected: affected(propagation, changed)};
  }
  function price(amount, variant) {
    if (!Number.isFinite(amount) || amount < 0) throw new Error('Invalid amount');
    const eligible = variant === 'fix' ? amount >= 1000 : amount > 1000;
    return Math.round(amount * (eligible ? 0.9 : 1) * 100) / 100;
  }
  function merge(base, main, feature) {
    const values = {}, conflicts = [];
    for (const key of new Set([...Object.keys(base), ...Object.keys(main), ...Object.keys(feature)])) {
      if (main[key] === feature[key]) values[key] = main[key];
      else if (main[key] === base[key]) values[key] = feature[key];
      else if (feature[key] === base[key]) values[key] = main[key];
      else conflicts.push(key);
    }
    return {values, conflicts};
  }
  function formPipeline(method, contentType, parser, placement, fname, lname, named = true) {
    const data = named ? {fname, lname} : {lname};
    const params = new URLSearchParams(data);
    const url = method === 'GET' ? '/form-get?' + params : '/form-post';
    const payload = method === 'GET' ? '' : contentType === 'json' ? JSON.stringify(data) : params.toString();
    const trace = [method + ' ' + url];
    let parsed = method === 'GET';
    if (method === 'GET') trace.push('Query → req.query (ไม่ต้องใช้ body parser)');
    else if (placement === 'after') trace.push('Handler มาก่อน parser → req.body ยังไม่มีข้อมูล');
    else if (parser === 'off') trace.push('ไม่มี parser → req.body ยังไม่มีข้อมูล');
    else if (parser !== contentType) trace.push('Parser ข้าม body เพราะ Content-Type ไม่ตรง');
    else {parsed = true; trace.push('Parser ตรง Content-Type → req.body');}
    const valid = parsed && named && fname.trim() && lname.trim() && fname.length <= 100 && lname.length <= 100;
    const status = valid ? 200 : 400;
    const message = !parsed ? 'req.body ยังไม่ถูก parse — เลือก parser ให้ตรงและวางก่อน handler'
      : !named ? 'ไม่มี key fname: ฟอร์มส่ง input ตาม name ไม่ใช่ id'
      : !valid ? 'กรอกชื่อและนามสกุล ความยาวไม่เกิน 100 ตัวอักษร'
      : `Form submitted by ${fname} ${lname} with ${method}`;
    trace.push(`Handler ตรวจข้อมูล → ${status}`, 'Response จบที่ handler');
    return {status, url, payload, data: parsed ? data : null, message, trace};
  }
  function sanitizeProgress(value, allowed) {
    return Array.isArray(value) ? [...new Set(value.filter(x => typeof x === 'string' && allowed.includes(x)))] : [];
  }
  const api = {affected, architecture, price, merge, formPipeline, sanitizeProgress};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FinalLearningCore = api;
})(typeof window === 'undefined' ? globalThis : window);
