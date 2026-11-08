import React, { useRef, useState } from 'react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Readouts, Explanation, useReadouts, f } from './core/ui';
import { COLORS, glowDot, text } from './core/draw';

const W = 800;
const H = 450;
const O = { x: 400, y: 225 };
const R = 300;

const MEDIA = [
  { label: 'Aire', n: 1.0 },
  { label: 'Agua', n: 1.33 },
  { label: 'Vidrio', n: 1.5 },
  { label: 'Diamante', n: 2.42 }
];

export default function RefractionSimulation() {
  const [n1, setN1] = useState(1);
  const [n2, setN2] = useState(1.5);
  const [ang, setAng] = useState(40);
  const [running, setRunning] = useState(true);
  const [read, pushRead] = useReadouts({});

  const P = useRef({});
  P.current = { n1, n2, ang, running };
  const S = useRef({ t: 0, drag: false });

  const frame = (ctx, dt) => {
    const p = P.current;
    const s = S.current;
    if (p.running) s.t += dt;
    const th1 = (p.ang * Math.PI) / 180;
    const sin2 = (p.n1 * Math.sin(th1)) / p.n2;
    const tir = sin2 > 1;
    const th2 = tir ? null : Math.asin(sin2);

    // Fresnel (luz no polarizada)
    let Rf = 1;
    if (!tir) {
      const c1 = Math.cos(th1);
      const c2 = Math.cos(th2);
      const rs = ((p.n1 * c1 - p.n2 * c2) / (p.n1 * c1 + p.n2 * c2)) ** 2;
      const rp = ((p.n1 * c2 - p.n2 * c1) / (p.n1 * c2 + p.n2 * c1)) ** 2;
      Rf = (rs + rp) / 2;
    }

    // medios
    const tint = (n, base) => `rgba(${base[0]},${base[1]},${base[2]},${0.05 + (n - 1) * 0.18})`;
    ctx.fillStyle = '#07111F';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = tint(p.n1, [120, 180, 255]);
    ctx.fillRect(0, 0, W, O.y);
    ctx.fillStyle = tint(p.n2, [77, 238, 234]);
    ctx.fillRect(0, O.y, W, H - O.y);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, O.y);
    ctx.lineTo(W, O.y);
    ctx.stroke();
    text(ctx, `Medio 1 · n = ${f(p.n1, 2)}`, 16, 28, { color: '#cbd5e1', size: 12, weight: 700 });
    text(ctx, `Medio 2 · n = ${f(p.n2, 2)}`, 16, H - 16, { color: '#cbd5e1', size: 12, weight: 700 });

    // normal
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.setLineDash([5, 6]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(O.x, O.y - R);
    ctx.lineTo(O.x, O.y + R * 0.8);
    ctx.stroke();
    ctx.setLineDash([]);
    text(ctx, 'normal', O.x + 6, O.y - R + 12, { size: 10 });

    const inc = { x: O.x - R * Math.sin(th1), y: O.y - R * Math.cos(th1) };
    const refl = { x: O.x + R * Math.sin(th1), y: O.y - R * Math.cos(th1) };
    const refr = tir ? null : { x: O.x + R * Math.sin(th2), y: O.y + R * Math.cos(th2) };

    const ray = (a, b, alpha, color) => {
      ctx.strokeStyle = color;
      ctx.globalAlpha = Math.max(0.12, alpha);
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };
    ray(inc, O, 1, COLORS.gold);
    ray(O, refl, tir ? 1 : Rf * 4 + 0.15, '#ffe8a6');
    if (refr) ray(O, refr, 1 - Rf, COLORS.cyan);

    // fotones: más lentos en el medio más denso (v = c/n)
    const spd = (n) => 200 / n;
    const photon = (a, b, offset, color, alpha = 1) => {
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const d = ((offset % len) + len) % len;
      const x = a.x + ((b.x - a.x) * d) / len;
      const y = a.y + ((b.y - a.y) * d) / len;
      ctx.globalAlpha = alpha;
      glowDot(ctx, x, y, 4.5, color, 14);
      ctx.globalAlpha = 1;
    };
    for (let i = 0; i < 4; i++) {
      photon(inc, O, s.t * spd(p.n1) + i * 75, '#fff');
      photon(O, refl, s.t * spd(p.n1) + i * 75, '#fff', tir ? 1 : 0.4 + Rf * 3);
      if (refr) photon(O, refr, s.t * spd(p.n2) + i * 75 * (p.n1 / p.n2), '#fff', 1 - Rf);
    }

    // arcos y etiquetas
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = COLORS.gold;
    ctx.beginPath();
    ctx.arc(O.x, O.y, 70, -Math.PI / 2 - th1, -Math.PI / 2);
    ctx.stroke();
    text(ctx, `θ₁ ${f(p.ang, 0)}°`, O.x - 100 - Math.sin(th1) * 10, O.y - 90, { color: COLORS.gold, size: 12, weight: 700 });
    if (refr) {
      ctx.strokeStyle = COLORS.cyan;
      ctx.beginPath();
      ctx.arc(O.x, O.y, 90, Math.PI / 2 - th2, Math.PI / 2);
      ctx.stroke();
      text(ctx, `θ₂ ${f((th2 * 180) / Math.PI, 1)}°`, O.x + 24 + Math.sin(th2) * 70, O.y + 130, { color: COLORS.cyan, size: 12, weight: 700 });
    } else {
      text(ctx, 'REFLEXIÓN TOTAL INTERNA', O.x + 40, O.y + 70, { color: COLORS.red, size: 14, weight: 700 });
    }

    // asa de arrastre
    glowDot(ctx, inc.x, inc.y, 9, s.drag ? '#fff' : COLORS.gold, 14);
    text(ctx, 'arrastra', inc.x, inc.y - 16, { size: 10, align: 'center' });

    const crit = p.n1 > p.n2 ? (Math.asin(p.n2 / p.n1) * 180) / Math.PI : null;
    pushRead({ th2: th2 == null ? null : (th2 * 180) / Math.PI, crit, Rf, tir });
  };

  const setFromPointer = (pt) => {
    const dx = O.x - pt.x;
    const dy = O.y - pt.y;
    const a = (Math.atan2(dx, Math.max(dy, 1)) * 180) / Math.PI;
    setAng(Math.max(0, Math.min(89, Math.round(a))));
  };
  const onDown = (pt) => {
    S.current.drag = true;
    setFromPointer(pt);
  };
  const onMove = (pt) => {
    if (S.current.drag) setFromPointer(pt);
  };
  const onUp = () => {
    S.current.drag = false;
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
        label="Refracción y reflexión de un rayo de luz entre dos medios"
      />
      <Readouts
        items={[
          { label: 'Ángulo incidente θ₁', value: ang, unit: '°' },
          { label: 'Ángulo refractado θ₂', value: read.th2 == null ? 'TIR' : f(read.th2, 1), unit: read.th2 == null ? '' : '°' },
          { label: 'Ángulo crítico', value: read.crit == null ? '—' : f(read.crit, 1), unit: read.crit == null ? '' : '°' },
          { label: 'Luz reflejada', value: f((read.Rf ?? 0) * 100, 1), unit: '%' }
        ]}
      />
      <Toolbar running={running} onToggle={() => setRunning(!running)} />
      <div className="grid sm:grid-cols-3 gap-3">
        <Slider label="Índice del medio 1 (n₁)" value={n1} min={1} max={2.5} step={0.01} onChange={setN1} color="#FFD166" />
        <Slider label="Índice del medio 2 (n₂)" value={n2} min={1} max={2.5} step={0.01} onChange={setN2} color="#4DEEEA" />
        <Slider label="Ángulo de incidencia" unit="°" value={ang} min={0} max={89} onChange={setAng} color="#FFD166" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#94A3B8]">Medio 2:</span>
        {MEDIA.map((m) => (
          <button
            key={m.label}
            onClick={() => setN2(m.n)}
            className="px-2.5 py-1.5 rounded-md border border-[#F2F5F7]/15 bg-[#102A43]/60 hover:border-[#4DEEEA] font-mono text-[11px] text-[#CBD5E1]"
          >
            {m.label} · {m.n}
          </button>
        ))}
        <button
          onClick={() => {
            setN1(1.5);
            setN2(1);
            setAng(50);
          }}
          className="px-2.5 py-1.5 rounded-md border border-[#9B72CF]/60 bg-[#9B72CF]/15 font-mono text-[11px] text-[#F2F5F7]"
        >
          Probar reflexión total (vidrio → aire)
        </button>
      </div>
      <Explanation>
        <p>
          La luz cambia de dirección al pasar de un medio a otro porque su velocidad cambia (<span className="font-mono">v = c/n</span>). La <strong className="text-[#FFD166]">ley de Snell</strong> lo describe:{' '}
          <span className="font-mono">n₁ senθ₁ = n₂ senθ₂</span>. Al entrar en un medio más denso el rayo se acerca a la normal.
        </p>
        <p>
          Si la luz va de un medio denso a otro menos denso y supera el <strong className="text-[#4DEEEA]">ángulo crítico</strong>, no hay rayo refractado: toda la luz se refleja (<em>reflexión total interna</em>), principio de la fibra óptica.
        </p>
      </Explanation>
    </div>
  );
}
