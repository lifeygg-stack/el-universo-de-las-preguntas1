// Utilidades de dibujo compartidas por todos los simuladores (coordenadas del mundo, px lógicos).

export const COLORS = {
  bg: '#07111F',
  space: '#102A43',
  cyan: '#4DEEEA',
  violet: '#9B72CF',
  gold: '#FFD166',
  star: '#F2F5F7',
  muted: '#94A3B8',
  red: '#FF6B8B',
  green: '#6EE7A8'
};

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
/** Suavizado exponencial independiente del framerate: acerca `cur` a `target`. */
export const damp = (cur, target, rate, dt) => lerp(cur, target, 1 - Math.exp(-rate * dt));

export function fillBackground(ctx, W, H, top = '#0B1D30', bottom = '#07111F') {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

export function drawGrid(ctx, W, H, step = 40, color = 'rgba(77,238,234,0.06)') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= W; x += step) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
  }
  for (let y = 0; y <= H; y += step) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
  }
  ctx.stroke();
}

export function glowDot(ctx, x, y, r, color, glow = 18) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function arrow(ctx, x1, y1, x2, y2, color = COLORS.gold, width = 2, head = 8) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 2) return;
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - Math.cos(a) * head * 0.6, y2 - Math.sin(a) * head * 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - Math.cos(a - 0.4) * head, y2 - Math.sin(a - 0.4) * head);
  ctx.lineTo(x2 - Math.cos(a + 0.4) * head, y2 - Math.sin(a + 0.4) * head);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function text(ctx, str, x, y, { color = COLORS.muted, size = 12, align = 'left', weight = 500, baseline = 'alphabetic' } = {}) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "JetBrains Mono", ui-monospace, monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(str, x, y);
  ctx.restore();
}

/** Estela con desvanecimiento: guarda puntos y los dibuja con alfa decreciente (movimiento fluido). */
export class Trail {
  constructor(max = 160) {
    this.max = max;
    this.pts = [];
  }
  push(x, y) {
    const l = this.pts[this.pts.length - 1];
    if (l && Math.abs(l.x - x) + Math.abs(l.y - y) < 0.6) return;
    this.pts.push({ x, y });
    if (this.pts.length > this.max) this.pts.shift();
  }
  clear() {
    this.pts.length = 0;
  }
  draw(ctx, color = COLORS.violet, width = 2.4) {
    const n = this.pts.length;
    if (n < 2) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    const seg = Math.max(1, Math.floor(n / 24));
    for (let i = seg; i < n; i += seg) {
      ctx.globalAlpha = (i / n) * 0.95;
      ctx.beginPath();
      ctx.moveTo(this.pts[i - seg].x, this.pts[i - seg].y);
      for (let k = i - seg + 1; k <= i; k++) ctx.lineTo(this.pts[k].x, this.pts[k].y);
      ctx.stroke();
    }
    ctx.restore();
  }
}

/** Sistema de partículas muy simple para destellos/chispas. */
export class Sparks {
  constructor() {
    this.list = [];
  }
  burst(x, y, n = 18, color = COLORS.gold, speed = 90) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.3 + Math.random());
      this.list.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color });
    }
  }
  update(dt) {
    for (const p of this.list) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 1 - 2.2 * dt;
      p.vy *= 1 - 2.2 * dt;
      p.life -= dt * 1.6;
    }
    this.list = this.list.filter((p) => p.life > 0);
  }
  draw(ctx) {
    ctx.save();
    for (const p of this.list) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2 * p.life + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
