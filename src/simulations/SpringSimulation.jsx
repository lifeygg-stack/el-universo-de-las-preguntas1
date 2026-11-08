import React, { useRef, useState } from 'react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Readouts, Explanation, useReadouts, f } from './core/ui';
import { COLORS, fillBackground, text } from './core/draw';

const W = 800;
const H = 450;
const WALL = 60;
const REST = 330; // x de equilibrio de la cara izquierda de la masa
const Y = 140;
const PX_M = 90;
const HIST = 8;

export default function SpringSimulation() {
  const [k, setK] = useState(30);
  const [m, setM] = useState(1);
  const [c, setC] = useState(0.2);
  const [x0, setX0] = useState(1);
  const [running, setRunning] = useState(true);
  const [read, pushRead] = useReadouts({ w: 0, T: 0, fr: 0, x: 0 });

  const P = useRef({});
  P.current = { k, m, c, running };
  const S = useRef({ x: 1, v: 0, t: 0, hist: [], drag: false, Emax: 1 });

  const release = (x) => {
    const s = S.current;
    s.x = x;
    s.v = 0;
    s.t = 0;
    s.hist = [];
    s.Emax = Math.max(0.1, 0.5 * P.current.k * x * x);
  };
  const changeX0 = (v) => {
    setX0(v);
    release(v);
  };

  const frame = (ctx, dt) => {
    const p = P.current;
    const s = S.current;
    if (p.running && !s.drag) {
      const n = Math.max(1, Math.ceil(dt / (1 / 480)));
      const h = dt / n;
      for (let i = 0; i < n; i++) {
        const a = (-p.k * s.x - p.c * s.v) / p.m;
        s.v += a * h;
        s.x += s.v * h;
        s.t += h;
      }
    }
    if (p.running || s.drag) s.hist.push({ t: s.t, x: s.x });
    while (s.hist.length && s.t - s.hist[0].t > HIST) s.hist.shift();

    const size = 38 + p.m * 7;
    const mx = REST + s.x * PX_M; // cara izquierda de la masa
    fillBackground(ctx, W, H);

    // pared y riel
    ctx.fillStyle = '#16365a';
    ctx.fillRect(WALL - 18, Y - 70, 18, 140);
    ctx.fillStyle = 'rgba(77,238,234,0.35)';
    ctx.fillRect(WALL, Y + size / 2 + 4, W - WALL - 20, 3);
    // posición de equilibrio
    ctx.strokeStyle = 'rgba(255,209,102,0.5)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(REST + size / 2, Y - 80);
    ctx.lineTo(REST + size / 2, Y + 90);
    ctx.stroke();
    ctx.setLineDash([]);
    text(ctx, 'x = 0', REST + size / 2, Y - 88, { color: COLORS.gold, size: 11, align: 'center' });

    // resorte en zigzag (más estirado => más delgado)
    const coils = 14;
    const sx0 = WALL;
    const sx1 = mx;
    const amp = Math.max(6, 20 - Math.max(0, (sx1 - sx0 - 270) / 14));
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(sx0, Y);
    ctx.lineTo(sx0 + 14, Y);
    for (let i = 0; i < coils * 2; i++) {
      const tx = sx0 + 14 + ((sx1 - sx0 - 28) * (i + 0.5)) / (coils * 2);
      ctx.lineTo(tx, Y + (i % 2 ? amp : -amp));
    }
    ctx.lineTo(sx1 - 14, Y);
    ctx.lineTo(sx1, Y);
    ctx.stroke();

    // masa
    const grad = ctx.createLinearGradient(0, Y - size / 2, 0, Y + size / 2);
    grad.addColorStop(0, '#b794f6');
    grad.addColorStop(1, '#6d49b5');
    ctx.fillStyle = grad;
    ctx.shadowColor = COLORS.violet;
    ctx.shadowBlur = s.drag ? 24 : 12;
    ctx.fillRect(mx, Y - size / 2, size, size);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.strokeRect(mx, Y - size / 2, size, size);
    text(ctx, `${f(p.m, 1)} kg`, mx + size / 2, Y + 4, { color: '#fff', size: 11, align: 'center', weight: 700 });
    text(ctx, 'Arrastra la masa', 28, Y + 100, { size: 11 });

    // fuerza elástica
    const Fe = -p.k * s.x;
    const ax1 = mx + size / 2;
    const ax2 = ax1 + Fe * 1.6;
    if (Math.abs(Fe) > 0.8) {
      ctx.strokeStyle = COLORS.gold;
      ctx.fillStyle = COLORS.gold;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ax1, Y - size / 2 - 14);
      ctx.lineTo(ax2, Y - size / 2 - 14);
      ctx.stroke();
      const dir = Math.sign(ax2 - ax1);
      ctx.beginPath();
      ctx.moveTo(ax2, Y - size / 2 - 14);
      ctx.lineTo(ax2 - dir * 9, Y - size / 2 - 20);
      ctx.lineTo(ax2 - dir * 9, Y - size / 2 - 8);
      ctx.closePath();
      ctx.fill();
      text(ctx, 'F = −kx', ax1, Y - size / 2 - 24, { color: COLORS.gold, size: 11, align: 'center' });
    }

    // gráfica x(t)
    const gx = 60;
    const gy = 260;
    const gw = 700;
    const gh = 160;
    ctx.fillStyle = 'rgba(7,17,31,0.8)';
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeStyle = 'rgba(77,238,234,0.25)';
    ctx.strokeRect(gx, gy, gw, gh);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh / 2);
    ctx.lineTo(gx + gw, gy + gh / 2);
    ctx.stroke();
    text(ctx, 'x(t)', gx + 8, gy + 16, { color: COLORS.cyan, size: 11 });
    text(ctx, '+1,5 m', gx + gw - 6, gy + 14, { size: 10, align: 'right' });
    text(ctx, '−1,5 m', gx + gw - 6, gy + gh - 6, { size: 10, align: 'right' });
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    s.hist.forEach((q, i) => {
      const px = gx + gw - ((s.t - q.t) / HIST) * gw;
      const py = gy + gh / 2 - (q.x / 1.5) * (gh / 2 - 6);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    });
    ctx.stroke();

    // energías
    const ke = 0.5 * p.m * s.v * s.v;
    const pe = 0.5 * p.k * s.x * s.x;
    const bx = 470;
    const by = 36;
    const bw = 290;
    text(ctx, 'ENERGÍA', bx, by - 8, { size: 11 });
    const bar = (label, val, y, col) => {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(bx, y, bw, 15);
      ctx.fillStyle = col;
      ctx.fillRect(bx, y, Math.min(bw, (val / s.Emax) * bw), 15);
      text(ctx, label, bx + 5, y + 11, { size: 10, color: '#07111F', weight: 700 });
    };
    bar('cinética', ke, by, COLORS.cyan);
    bar('elástica', pe, by + 22, COLORS.violet);
    bar('total', ke + pe, by + 44, COLORS.gold);

    const w = Math.sqrt(p.k / p.m);
    pushRead({ w, T: (2 * Math.PI) / w, fr: w / (2 * Math.PI), x: s.x });
  };

  const onDown = (pt) => {
    const s = S.current;
    s.drag = true;
    s.v = 0;
    s.t = 0;
    s.hist = [];
    s.x = Math.max(-1.5, Math.min(1.5, (pt.x - REST - 20) / PX_M));
  };
  const onMove = (pt) => {
    const s = S.current;
    if (s.drag) s.x = Math.max(-1.5, Math.min(1.5, (pt.x - REST - 20) / PX_M));
  };
  const onUp = () => {
    const s = S.current;
    if (!s.drag) return;
    s.drag = false;
    s.Emax = Math.max(0.1, 0.5 * P.current.k * s.x * s.x);
  };

  return (
    <div className="flex flex-col gap-4">
      <SimCanvas
        width={W}
        height={H}
        onFrame={frame}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        cursor="ew-resize"
        label="Sistema masa-resorte arrastrable"
      />
      <Readouts
        items={[
          { label: 'Frecuencia angular ω', value: f(read.w, 2), unit: 'rad/s' },
          { label: 'Periodo T', value: f(read.T, 2), unit: 's' },
          { label: 'Frecuencia f', value: f(read.fr, 2), unit: 'Hz' },
          { label: 'Elongación x', value: f(read.x, 2), unit: 'm' }
        ]}
      />
      <Toolbar running={running} onToggle={() => setRunning(!running)} onReset={() => release(x0)} />
      <div className="grid sm:grid-cols-2 gap-3">
        <Slider label="Constante del resorte k" unit="N/m" value={k} min={5} max={100} onChange={setK} />
        <Slider label="Masa" unit="kg" value={m} min={0.2} max={5} step={0.1} onChange={setM} color="#9B72CF" />
        <Slider label="Amortiguamiento" unit="N·s/m" value={c} min={0} max={3} step={0.05} onChange={setC} color="#4DEEEA" />
        <Slider label="Desplazamiento inicial" unit="m" value={x0} min={-1.5} max={1.5} step={0.1} onChange={changeX0} color="#94A3B8" />
      </div>
      <Explanation>
        <p>
          La fuerza del resorte es proporcional a la elongación (<strong className="text-[#FFD166]">ley de Hooke</strong>, <span className="font-mono">F = −kx</span>) y siempre apunta al equilibrio. Eso produce un
          movimiento armónico simple con <span className="font-mono">T = 2π√(m/k)</span>: más masa ⇒ más lento; resorte más rígido ⇒ más rápido.
        </p>
        <p>La amplitud no cambia el periodo. Con amortiguamiento, la energía se disipa y la oscilación se apaga.</p>
      </Explanation>
    </div>
  );
}
