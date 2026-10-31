/*
 * Study Garden / Halftone Wordmark Footer drop-in integration.
 * Based on an independently authored Canvas effect in the prior Reverse Engineering Kit.
 * Inspiration: Kedhareswer Naidu, https://github.com/Kedhareswer/21stdev-my-components
 * Enhances the lower Garden wordmark on subject landing and chapter pages.
 * No React, npm, external CSS or network requests required.
 */
(() => {
'use strict';
/**
 * Independent recreation of the Halftone Wordmark Footer particle system.
 * Inspired by Kedhareswer Naidu's publicly available component (Oct 2026).
 * The original implementation is available at:
 * https://github.com/Kedhareswer/21stdev-my-components/tree/main/components/halftone-wordmark-footer
 * This module is independently authored; it is not a copy of the original TSX.
 */

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function dotRadius(coverage, gap) {
  return Math.sqrt(clamp(coverage, 0, 1)) * gap * 0.56;
}
function stepParticle(x, y, vx, vy, homeX, homeY, pointerX, pointerY, radius) {
  const dx = x - pointerX, dy = y - pointerY;
  const dSq = dx * dx + dy * dy;
  if (radius > 0 && dSq < radius * radius) {
    const dist = Math.sqrt(dSq) + 0.001;
    const influence = (1 - dist / radius) * 2.6;
    vx += dx / dist * influence;
    vy += dy / dist * influence;
  }
  vx = (vx + (homeX - x) * 0.05) * 0.84;
  vy = (vy + (homeY - y) * 0.05) * 0.84;
  return [x + vx, y + vy, vx, vy];
}
function warmthAt(x, y, homeX, homeY, span = 28) {
  return span > 0 ? clamp(Math.hypot(x - homeX, y - homeY) / span, 0, 1) : 0;
}
function fitFontSize(measuredAt100, width) {
  return measuredAt100 > 0 ? width / measuredAt100 * 100 : 0;
}

class HalftoneCanvas {
  constructor(root, canvas, options = {}) {
    this.root = root;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) throw new Error('Canvas 2D is unavailable');
    this.footer = root.closest('.motion-footer');
    this.options = {};
    this.points = new Float32Array(0); // each particle: x, y, vx, vy, homeX, homeY, radius
    this.count = 0;
    this.width = 1;
    this.height = 1;
    this.dpr = 1;
    this.pointer = { x: -100000, y: -100000 };
    this.burst = { x: 0, y: 0, time: -100000 };
    this.visible = false;
    this.intersecting = false;
    this.frame = 0;
    this.needsFrame = false;
    this.disposed = false;
    this.sprites = null;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.onMotionPreference = (event) => { this.reduced = event.matches; this.layout(); };
    this.motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.motionMedia.addEventListener?.('change', this.onMotionPreference);

    this.onPointerMove = (event) => {
      if (!this.options.interactive || this.reduced || event.pointerType === 'touch') return;
      const bounds = root.getBoundingClientRect();
      this.pointer.x = event.clientX - bounds.left;
      this.pointer.y = event.clientY - bounds.top;
      this.wake();
    };
    this.onPointerLeave = () => { this.pointer.x = -100000; this.pointer.y = -100000; this.wake(); };
    this.onPointerDown = (event) => {
      if (!this.options.interactive || this.reduced || event.target.closest('a,button,input,select')) return;
      const bounds = root.getBoundingClientRect();
      this.burst.x = event.clientX - bounds.left;
      this.burst.y = event.clientY - bounds.top;
      this.burst.time = performance.now();
      this.wake();
    };
    root.addEventListener('pointermove', this.onPointerMove);
    root.addEventListener('pointerleave', this.onPointerLeave);
    root.addEventListener('pointerdown', this.onPointerDown);

    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(root);
    this.io = new IntersectionObserver(([entry]) => {
      this.intersecting = entry?.isIntersecting ?? false;
      this.syncActivity();
    }, { threshold: 0.01 });
    this.io.observe(root);
    this.onActivity = () => this.syncActivity();
    this.footer.addEventListener('footer-motion-change', this.onActivity);
    document.addEventListener('visibilitychange', this.onActivity);
    this.themeObserver = new MutationObserver(() => this.layout());
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.apply(options);
    document.fonts?.ready?.then(() => { if (!this.disposed) this.layout(); });
  }
  apply(patch = {}) {
    const before = JSON.stringify({ ...this.options, interactive: undefined });
    this.options = {
      wordmark: 'Garden', dotGap: 6,
      radius: 80, grain: 0.5, interactive: true, wordmarkLift: 0.02,
      fontFamily: '"Inter Tight", "Inter Variable", "Inter", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 800, ...this.options, ...patch,
    };
    if (JSON.stringify({ ...this.options, interactive: undefined }) !== before) this.layout();
    else this.wake();
  }
  layout() {
    if (this.disposed || !this.ctx) return;
    const rect = this.root.getBoundingClientRect();
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);

    const mask = document.createElement('canvas');
    mask.width = this.width;
    mask.height = this.height;
    const m = mask.getContext('2d', { willReadFrequently: true });
    if (!m) return;
    const o = this.options;
    const word = String(o.wordmark || ' ');
    const fam = o.fontFamily;
    m.font = `${o.fontWeight} 100px ${fam}`;
    const at100 = m.measureText(word);
    const lift = clamp(this.width * o.wordmarkLift, 12, 26);
    const fontSize = Math.min(fitFontSize(at100.width, this.width * 0.96),
      (this.height - lift - 8) / ((at100.actualBoundingBoxAscent + at100.actualBoundingBoxDescent) / 100 || 0.8));
    m.font = `${o.fontWeight} ${fontSize}px ${fam}`;
    m.fillStyle = '#000';
    m.textBaseline = 'alphabetic';
    const measure = m.measureText(word);
    // Fit the full word and lift its baseline, rather than cropping the lower letters.
    m.fillText(word, (this.width - measure.width) / 2,
      this.height - lift - (measure.actualBoundingBoxDescent || 0));
    const img = m.getImageData(0, 0, this.width, this.height).data;
    const gap = Math.max(3, Number(o.dotGap) || 6);
    const packed = [];
    for (let row = 0; row < Math.ceil(this.height / gap); row++) {
      for (let col = 0; col < Math.ceil(this.width / gap); col++) {
        let coverage = 0;
        for (let yy = 0; yy < 3; yy++) {
          for (let xx = 0; xx < 3; xx++) {
            const ix = Math.min(this.width - 1, Math.floor((col + (xx + 0.5) / 3) * gap));
            const iy = Math.min(this.height - 1, Math.floor((row + (yy + 0.5) / 3) * gap));
            coverage += img[(iy * this.width + ix) * 4 + 3];
          }
        }
        coverage /= 9 * 255;
        if (coverage < 0.06) continue;
        const hx = (col + 0.5) * gap, hy = (row + 0.5) * gap;
        packed.push(hx, hy, 0, 0, hx, hy, dotRadius(coverage, gap));
      }
    }
    this.points = new Float32Array(packed);
    this.count = packed.length / 7;
    const style = getComputedStyle(this.root);
    this.colors = { ink: style.color, warm: style.getPropertyValue('--garden-warm').trim() || '#8b8fc4' };
    this.inkRGB = this.colorRGB(this.colors.ink);
    this.warmRGB = this.colorRGB(this.colors.warm);
    this.prepareGrain();
    this.needsFrame = this.paint(performance.now());
    this.root.classList.toggle('garden-wordmark-ready', this.count > 0);
    this.syncActivity();
  }
  prepareGrain() {
    const tile = document.createElement('canvas');
    tile.width = tile.height = 256;
    const gc = tile.getContext('2d');
    if (!gc) return;
    const pixels = gc.createImageData(256, 256);
    // Deterministic print grain for reproducible screenshots.
    let random = 0x9e3779b9;
    for (let i = 0; i < pixels.data.length; i += 4) {
      random ^= random << 13; random ^= random >>> 17; random ^= random << 5;
      const v = (random >>> 0) & 255;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = v;
      pixels.data[i + 3] = random & 1 ? 230 : 0;
    }
    gc.putImageData(pixels, 0, 0);
    this.sprites = tile;
  }
  paint(now) {
    if (!this.ctx || this.disposed) return false;
    const c = this.ctx, o = this.options;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, this.width, this.height);
    const radius = o.interactive && !this.reduced ? Math.max(0, o.radius) : 0;
    const ringAge = now - this.burst.time;
    const ringRadius = ringAge * 0.9;
    const ringActive = !this.reduced && ringAge >= 0 && ringAge < 900;
    let moving = false;
    for (let i = 0; i < this.count; i++) {
      const j = i * 7, homeX = this.points[j + 4], homeY = this.points[j + 5];
      let x = this.points[j], y = this.points[j + 1], vx = this.points[j + 2], vy = this.points[j + 3];
      if (!this.reduced) {
        if (ringActive) {
          const dx = homeX - this.burst.x, dy = homeY - this.burst.y;
          const dist = Math.hypot(dx, dy) + 0.001;
          const band = Math.max(0, 1 - Math.abs(dist - ringRadius) / 26);
          if (band > 0) {
            const force = band * 3.2 * (1 - ringAge / 900);
            vx += dx / dist * force;
            vy += dy / dist * force;
          }
        }
        [x, y, vx, vy] = stepParticle(x, y, vx, vy, homeX, homeY, this.pointer.x, this.pointer.y, radius);
        const drift = Math.hypot(x - homeX, y - homeY);
        if (Math.abs(vx) + Math.abs(vy) > 0.02 || drift > 0.05) moving = true;
        else { x = homeX; y = homeY; vx = vy = 0; }
        this.points[j] = x; this.points[j + 1] = y; this.points[j + 2] = vx; this.points[j + 3] = vy;
      }
      const heat = warmthAt(x, y, homeX, homeY);
      if (heat > 0.02) {
        const rgb = this.inkRGB.map((v, q) => Math.round(v + (this.warmRGB[q] - v) * heat));
        c.fillStyle = `rgb(${rgb.join(',')})`;
      } else c.fillStyle = this.colors.ink;
      c.beginPath();
      c.arc(x, y, this.points[j + 6], 0, 2 * Math.PI);
      c.fill();
    }
    if (this.sprites && o.grain > 0) {
      c.globalAlpha = clamp(o.grain, 0, 1) * 0.09;
      c.globalCompositeOperation = 'source-atop';
      c.fillStyle = c.createPattern(this.sprites, 'repeat');
      c.fillRect(0, 0, this.width, this.height);
      c.globalAlpha = 1;
      c.globalCompositeOperation = 'source-over';
    }
    // Settle to a still image; pointer movement wakes only this small canvas.
    return moving || ringActive;
  }
  wake() {
    this.needsFrame = true;
    if (this.disposed || !this.visible || this.frame) return;
    const tick = now => {
      this.frame = 0;
      if (this.disposed || !this.visible) return;
      this.needsFrame = this.paint(now);
      if (this.needsFrame) this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }
  colorRGB(color) {
    const swatch = document.createElement('canvas').getContext('2d');
    swatch.fillStyle = color;
    swatch.fillRect(0, 0, 1, 1);
    return [...swatch.getImageData(0, 0, 1, 1).data].slice(0, 3);
  }
  syncActivity() {
      if (!this.intersecting || document.hidden || !this.footer.classList.contains('is-motion-active')) {
        this.visible = false;
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        return;
      }
    const reveal = this.footer.closest('.footer-reveal');
    const coveredTop = reveal.classList.contains('reveal-enabled')
      ? Math.max(0, reveal.querySelector('.footer-curtain').getBoundingClientRect().bottom) : 0;
    const bounds = this.root.getBoundingClientRect();
    this.visible = this.intersecting && !document.hidden &&
      this.footer.classList.contains('is-motion-active') &&
      bounds.bottom > coveredTop && bounds.top < innerHeight && bounds.bottom > 0;
    // Scrolling changes visibility, not the pixels of a settled wordmark.
    // Keep pending interaction frames so a paused/covered canvas can resume.
    if (this.visible && !this.reduced) { if (this.needsFrame) this.wake(); }
    else { cancelAnimationFrame(this.frame); this.frame = 0; }
  }
  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.ro?.disconnect(); this.io?.disconnect(); this.themeObserver?.disconnect();
    this.footer.removeEventListener('footer-motion-change', this.onActivity);
    document.removeEventListener('visibilitychange', this.onActivity);
    this.motionMedia?.removeEventListener?.('change', this.onMotionPreference);
    this.root.removeEventListener('pointermove', this.onPointerMove);
    this.root.removeEventListener('pointerleave', this.onPointerLeave);
    this.root.removeEventListener('pointerdown', this.onPointerDown);
  }
}



  const footer = document.querySelector('body:not([data-all-courses]) .garden-footer');
  const root = footer?.querySelector('.footer-wordmark');
  if (!root) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'garden-wordmark-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  root.append(canvas);
  try {
    const instance = new HalftoneCanvas(root, canvas);
    window.addEventListener('pagehide', event => { if (!event.persisted) instance.destroy(); });
  } catch (error) {
    canvas.remove();
    root.classList.remove('garden-wordmark-ready');
    console.warn('[Study Garden] Using the static Garden wordmark', error);
  }
})();
