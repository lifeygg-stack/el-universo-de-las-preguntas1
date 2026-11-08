import React, { useRef, useState } from 'react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Readouts, Explanation, useReadouts, f } from './core/ui';
import { COLORS, Sparks, arrow, fillBackground, text } from './core/draw';

const W = 800;
const H = 450;
const TRACK_Y = 300;
const X_PX = 44; // px por metro
const X_ORG = 40;
const X1_0 = 3;
const X2_0 = 11;

const halfW = (m) => (20 + Math.cbrt(m) * 14) / X_PX; // semiancho (m)

const fresh = (p) => ({
  x1: X1_0,
  x2: X2_0,
  v1: p.v1,
  v2: p.v2,
  hit: false,
  hold: 0,
  sinceHit: 0,
  shake: 0,
  marks: [],
  tm: 0,
  sparks: new Sparks(),
  before: { p: p.m1 * p.v1 + p.m2 * p.v2, ke: 0.5 * p.m1 * p.v1 ** 2 + 0.5 * p.m2 * p.v2 ** 2 },
  after: null
});

export default function CollisionSimulation() {
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(2);
  const [v1, setV1] = useState(5);
  const [v2, setV2] = useState(-1);
  const [e, setE] = useState(1);
  const [running, setRunning] = useState(true);
  const [read, pushRead] = useReadouts({ pb: 0, pa: null, kb: 0, ka: null });

  const P = useRef({});
  P.current = { m1, m2, v1, v2, e, running };
  const S = useRef(fresh(P.current));

  const restart = () => {
    S.current = fresh(P.current);
  };
  const change = (setter) => (v) => {
    setter(v);
    setTimeout(restart, 0);
  };

  const frame = (ctx, dt) => {
    const p = P.current;
    const s = S.current;

    if (p.running) {
      if (s.hold > 0) {
        s.hold -= dt;
        if (s.hold <= 0) restart();
      } else {
        const n = 6;
        const h = dt / n;
        for (let i = 0; i < n; i++) {
          s.x1 += s.v1 * h;
          s.x2 += s.v2 * h;
          s.tm += h;
          const gap = s.x2 - halfW(p.m2) - (s.x1 + halfW(p.m1));
          if (gap <= 0 && s.v1 > s.v2) {
            const M = p.m1 + p.m2;
            const nv1 = ((p.m1 - p.e * p.m2) * s.v1 + (1 + p.e) * p.m2 * s.v2) / M;
            const nv2 = ((p.m2 - p.e * p.m1) * s.v2 + (1 + p.e) * p.m1 * s.v1) / M;
            s.v1 = nv1;
            s.v2 = nv2;
            s.hit = true;
            s.shake = 0.35;
            s.sparks.burst(X_ORG + (s.x1 + halfW(p.m1)) * X_PX, TRACK_Y - 26, 26, COLORS.gold, 130);
            s.after = { p: p.m1 * s.v1 + p.m2 * s.v2, ke: 0.5 * p.m1 * s.v1 ** 2 + 0.5 * p.m2 * s.v2 ** 2 };
          }
        }
        if (s.hit) s.sinceHit += dt;
        const off = (x) => x < -3 || x > 19;
        if ((s.hit && s.sinceHit > 3.2) || (off(s.x1) && off(s.x2)) || s.tm > 14) s.hold = 0.6;
      }
      if (Math.floor(s.tm * 4) > s.marks.length && s.marks.length < 80) s.marks.push({ x1: s.x1, x2: s.x2 });
    }
    s.sparks.update(dt);
    s.shake = Math.max(0, s.shake - dt);

    fillBackground(ctx, W, H);
    ctx.save();
    if (s.shake > 0) ctx.translate((Math.random() - 0.5) * s.shake * 10, (Math.random() - 0.5) * s.shake * 6);

    // riel
    ctx.fillStyle = '#0B1D30';
    ctx.fillRect(0, TRACK_Y, W, H - TRACK_Y);
    ctx.fillStyle = 'rgba(77,238,234,0.45)';
    ctx.fillRect(0, TRACK_Y, W, 2);
    for (let m = 0; m <= 17; m += 1) {
      const x = X_ORG + m * X_PX;
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(x, TRACK_Y, 1, m % 5 === 0 ? 10 : 5);
      if (m % 5 === 0) text(ctx, `${m} m`, x, TRACK_Y + 26, { size: 10, align: 'center' });
    }

    // marcas estroboscópicas
    ctx.fillStyle = 'rgba(155,114,207,0.35)';
    s.marks.forEach((q) => {
      ctx.fillRect(X_ORG + q.x1 * X_PX - 1, TRACK_Y - 5, 2, 5);
      ctx.fillStyle = 'rgba(77,238,234,0.35)';
      ctx.fillRect(X_ORG + q.x2 * X_PX - 1, TRACK_Y - 5, 2, 5);
      ctx.fillStyle = 'rgba(155,114,207,0.35)';
    });

    const block = (x, m, v, c1, c2, label) => {
      const hw = halfW(m) * X_PX;
      const hh = hw * 1.15;
      const cx = X_ORG + x * X_PX;
      const g = ctx.createLinearGradient(0, TRACK_Y - hh * 2, 0, TRACK_Y);
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      ctx.fillStyle = g;
      ctx.shadowColor = c1;
      ctx.shadowBlur = 12;
      ctx.fillRect(cx - hw, TRACK_Y - hh * 2, hw * 2, hh * 2);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.strokeRect(cx - hw, TRACK_Y - hh * 2, hw * 2, hh * 2);
      text(ctx, `${label}  ${m} kg`, cx, TRACK_Y - hh, { color: '#fff', size: 11, align: 'center', weight: 700 });
      if (Math.abs(v) > 0.05) arrow(ctx, cx, TRACK_Y - hh * 2 - 16, cx + v * 9, TRACK_Y - hh * 2 - 16, c1, 3, 9);
      text(ctx, `${f(v, 2)} m/s`, cx, TRACK_Y - hh * 2 - 28, { color: c1, size: 11, align: 'center' });
    };
    block(s.x1, p.m1, s.v1, '#b794f6', '#6d49b5', 'A');
    block(s.x2, p.m2, s.v2, '#5ee3df', '#1b8e8b', 'B');
    s.sparks.draw(ctx);
    ctx.restore();

    // panel de momentos
    const pNow = p.m1 * s.v1 + p.m2 * s.v2;
    const kNow = 0.5 * p.m1 * s.v1 ** 2 + 0.5 * p.m2 * s.v2 ** 2;
    text(ctx, `p total = ${f(pNow, 2)} kg·m/s`, 28, 36, { color: COLORS.gold, size: 13, weight: 700 });
    text(ctx, `Ec total = ${f(kNow, 2)} J`, 28, 58, { color: COLORS.cyan, size: 13, weight: 700 });
    text(ctx, s.hit ? 'Después del choque' : 'Antes del choque', 28, 80, { size: 11 });

    pushRead({ pb: s.before.p, pa: s.after?.p ?? null, kb: s.before.ke, ka: s.after?.ke ?? null });
  };

  return (
    <div className="flex flex-col gap-4">
      <SimCanvas width={W} height={H} onFrame={frame} label="Choque unidimensional entre dos bloques" />
      <Readouts
        items={[
          { label: 'p antes', value: f(read.pb, 2), unit: 'kg·m/s' },
          { label: 'p después', value: read.pa == null ? '—' : f(read.pa, 2), unit: 'kg·m/s' },
          { label: 'Ec antes', value: f(read.kb, 1), unit: 'J' },
          { label: 'Ec después', value: read.ka == null ? '—' : f(read.ka, 1), unit: 'J' }
        ]}
      />
      <Toolbar running={running} onToggle={() => setRunning(!running)} onReset={restart}>
        <button onClick={() => change(setE)(1)} className="px-3 py-2 rounded-lg bg-[#102A43] border border-[#F2F5F7]/15 hover:border-[#4DEEEA] text-xs font-display font-semibold">
          Elástico (e = 1)
        </button>
        <button onClick={() => change(setE)(0)} className="px-3 py-2 rounded-lg bg-[#102A43] border border-[#F2F5F7]/15 hover:border-[#4DEEEA] text-xs font-display font-semibold">
          Perfectamente inelástico (e = 0)
        </button>
      </Toolbar>
      <div className="grid sm:grid-cols-2 gap-3">
        <Slider label="Masa A" unit="kg" value={m1} min={1} max={10} onChange={change(setM1)} color="#9B72CF" />
        <Slider label="Masa B" unit="kg" value={m2} min={1} max={10} onChange={change(setM2)} color="#4DEEEA" />
        <Slider label="Velocidad inicial A" unit="m/s" value={v1} min={-8} max={8} step={0.5} onChange={change(setV1)} color="#9B72CF" />
        <Slider label="Velocidad inicial B" unit="m/s" value={v2} min={-8} max={8} step={0.5} onChange={change(setV2)} color="#4DEEEA" />
        <Slider label="Coeficiente de restitución e" value={e} min={0} max={1} step={0.05} onChange={change(setE)} />
      </div>
      <Explanation>
        <p>
          En cualquier choque sin fuerzas externas se conserva la <strong className="text-[#FFD166]">cantidad de movimiento</strong>: <span className="font-mono">m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'</span>.
          La energía cinética solo se conserva si el choque es <strong className="text-[#4DEEEA]">elástico</strong> (e = 1). En uno inelástico, parte se convierte en calor y deformación.
        </p>
        <p className="font-mono text-[11px] text-[#FFD166]">Prueba: masas iguales y e = 1 ⇒ los cuerpos intercambian velocidades.</p>
      </Explanation>
    </div>
  );
}
