import React, { useRef, useState } from 'react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Readouts, Explanation, GravityPresets, useReadouts, f } from './core/ui';
import { COLORS, Trail, fillBackground, glowDot, text } from './core/draw';

const W = 800;
const H = 450;
const PIV = { x: 250, y: 50 };
const PX_M = 100;
const HIST = 8; // s de historial en la gráfica

export default function PendulumSimulation() {
  const [len, setLen] = useState(2);
  const [theta0, setTheta0] = useState(50);
  const [g, setG] = useState(9.81);
  const [damp, setDamp] = useState(0);
  const [running, setRunning] = useState(true);
  const [read, pushRead] = useReadouts({ T0: 0, Tm: null, th: 0, w: 0 });

  const P = useRef({});
  P.current = { len, g, damp, running };
  const S = useRef({
    th: (50 * Math.PI) / 180,
    w: 0,
    t: 0,
    drag: false,
    hist: [],
    trail: new Trail(120),
    Emax: 1,
    lastCross: null,
    Tm: null
  });

  const release = (deg) => {
    const s = S.current;
    s.th = (deg * Math.PI) / 180;
    s.w = 0;
    s.t = 0;
    s.hist = [];
    s.trail.clear();
    s.lastCross = null;
    s.Tm = null;
    s.Emax = Math.max(0.05, P.current.g * P.current.len * (1 - Math.cos(s.th)));
  };
  const changeAngle = (v) => {
    setTheta0(v);
    release(v);
  };
  const changeParam = (setter) => (v) => {
    setter(v);
    setTimeout(() => release(theta0), 0);
  };

  const accel = (th, w, p) => -(p.g / p.len) * Math.sin(th) - p.damp * w;

  const frame = (ctx, dt) => {
    const p = P.current;
    const s = S.current;
    if (p.running && !s.drag) {
      const n = 12;
      const h = dt / n;
      for (let i = 0; i < n; i++) {
        // RK4
        const k1t = s.w;
        const k1w = accel(s.th, s.w, p);
        const k2t = s.w + 0.5 * h * k1w;
        const k2w = accel(s.th + 0.5 * h * k1t, k2t, p);
        const k3t = s.w + 0.5 * h * k2w;
        const k3w = accel(s.th + 0.5 * h * k2t, k3t, p);
        const k4t = s.w + h * k3w;
        const k4w = accel(s.th + h * k3t, k4t, p);
        const prev = s.th;
        s.th += (h / 6) * (k1t + 2 * k2t + 2 * k3t + k4t);
        s.w += (h / 6) * (k1w + 2 * k2w + 2 * k3w + k4w);
        s.t += h;
        if (prev < 0 && s.th >= 0) {
          if (s.lastCross != null) s.Tm = s.t - s.lastCross;
          s.lastCross = s.t;
        }
      }
    }
    if (p.running || s.drag) s.hist.push({ t: s.t, th: s.th });
    while (s.hist.length && s.t - s.hist[0].t > HIST) s.hist.shift();

    const L = p.len * PX_M;
    const bx = PIV.x + L * Math.sin(s.th);
    const by = PIV.y + L * Math.cos(s.th);
    s.trail.push(bx, by);

    fillBackground(ctx, W, H);

    // soporte
    ctx.fillStyle = '#16365a';
    ctx.fillRect(PIV.x - 90, PIV.y - 20, 180, 10);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(PIV.x, PIV.y);
    ctx.lineTo(PIV.x, PIV.y + L + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // arco de recorrido
    ctx.strokeStyle = 'rgba(155,114,207,0.25)';
    ctx.beginPath();
    ctx.arc(PIV.x, PIV.y, L, Math.PI / 2 - 1.2, Math.PI / 2 + 1.2);
    ctx.stroke();

    s.trail.draw(ctx, COLORS.violet, 3);

    // varilla y masa
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(PIV.x, PIV.y);
    ctx.lineTo(bx, by);
    ctx.stroke();
    glowDot(ctx, PIV.x, PIV.y, 5, '#cbd5e1', 6);
    glowDot(ctx, bx, by, 20, s.drag ? COLORS.gold : COLORS.violet, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(bx - 6, by - 6, 6, 0, Math.PI * 2);
    ctx.fill();

    text(ctx, `θ = ${f((s.th * 180) / Math.PI, 1)}°`, PIV.x + 14, PIV.y + 40, { color: COLORS.gold, size: 12 });
    text(ctx, 'Arrastra la masa', 28, H - 20, { size: 11 });

    // gráfica θ(t)
    const gx = 520;
    const gy = 60;
    const gw = 260;
    const gh = 170;
    ctx.fillStyle = 'rgba(7,17,31,0.8)';
    ctx.strokeStyle = 'rgba(77,238,234,0.25)';
    ctx.lineWidth = 1;
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeRect(gx, gy, gw, gh);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh / 2);
    ctx.lineTo(gx + gw, gy + gh / 2);
    ctx.stroke();
    text(ctx, 'θ(t)', gx + 6, gy + 14, { color: COLORS.cyan, size: 11 });
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    s.hist.forEach((q, i) => {
      const x = gx + gw - ((s.t - q.t) / HIST) * gw;
      const y = gy + gh / 2 - (q.th / Math.PI) * (gh / 2) * 1.8;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();

    // energía
    const pe = p.g * p.len * (1 - Math.cos(s.th));
    const ke = 0.5 * p.len * p.len * s.w * s.w;
    const ex = gx;
    const ey = 270;
    text(ctx, 'ENERGÍA (por kg)', ex, ey, { size: 11, color: COLORS.muted });
    const bar = (label, val, y, color) => {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(ex, y, gw, 16);
      ctx.fillStyle = color;
      ctx.fillRect(ex, y, Math.min(gw, (val / s.Emax) * gw), 16);
      text(ctx, label, ex + 6, y + 12, { size: 10, color: '#07111F', weight: 700 });
    };
    bar('cinética', ke, ey + 10, COLORS.cyan);
    bar('potencial', pe, ey + 32, COLORS.violet);
    bar('total', ke + pe, ey + 54, COLORS.gold);

    const T0 = 2 * Math.PI * Math.sqrt(p.len / p.g);
    pushRead({ T0, Tm: s.Tm, th: (s.th * 180) / Math.PI, w: s.w });
  };

  const pointer = (pt) => {
    const s = S.current;
    const dx = pt.x - PIV.x;
    const dy = pt.y - PIV.y;
    s.th = Math.max(-2.9, Math.min(2.9, Math.atan2(dx, Math.max(dy, 1) ))) ;
    s.w = 0;
  };
  const onDown = (pt) => {
    const s = S.current;
    s.drag = true;
    s.hist = [];
    s.t = 0;
    s.lastCross = null;
    s.Tm = null;
    s.trail.clear();
    pointer(pt);
  };
  const onMove = (pt) => {
    if (S.current.drag) pointer(pt);
  };
  const onUp = () => {
    const s = S.current;
    if (!s.drag) return;
    s.drag = false;
    s.Emax = Math.max(0.05, P.current.g * P.current.len * (1 - Math.cos(s.th)));
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
        cursor="grab"
        label="Péndulo simple arrastrable"
      />
      <Readouts
        items={[
          { label: 'Periodo teórico (pequeñas osc.)', value: f(read.T0, 2), unit: 's' },
          { label: 'Periodo medido', value: read.Tm == null ? '—' : f(read.Tm, 2), unit: 's' },
          { label: 'Ángulo', value: f(read.th, 1), unit: '°' },
          { label: 'Vel. angular', value: f(read.w, 2), unit: 'rad/s' }
        ]}
      />
      <Toolbar running={running} onToggle={() => setRunning(!running)} onReset={() => release(theta0)} />
      <div className="grid sm:grid-cols-2 gap-3">
        <Slider label="Longitud" unit="m" value={len} min={0.5} max={3.5} step={0.05} onChange={changeParam(setLen)} />
        <Slider label="Ángulo inicial" unit="°" value={theta0} min={5} max={160} onChange={changeAngle} color="#4DEEEA" />
        <Slider label="Amortiguamiento" value={damp} min={0} max={1} step={0.01} onChange={setDamp} color="#9B72CF" />
      </div>
      <GravityPresets g={g} onChange={changeParam(setG)} />
      <Explanation>
        <p>
          Para ángulos pequeños el periodo solo depende de la longitud y la gravedad: <span className="font-mono">T = 2π√(L/g)</span>. No depende de la masa ni (casi) de la amplitud.
          Con ángulos grandes el periodo medido se vuelve <strong className="text-[#FFD166]">mayor</strong> que el teórico.
        </p>
        <p>La energía se transforma continuamente entre potencial y cinética; con amortiguamiento la energía total decrece.</p>
      </Explanation>
    </div>
  );
}
