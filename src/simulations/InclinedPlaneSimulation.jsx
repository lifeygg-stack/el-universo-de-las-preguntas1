import React, { useRef, useState } from 'react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Toggle, Readouts, Explanation, useReadouts, f } from './core/ui';
import { COLORS, arrow, fillBackground, text } from './core/draw';

const W = 800;
const H = 450;
const BASE = { x: 720, y: 380 }; // vértice inferior de la rampa
const LEN = 420; // longitud de la rampa en px
const PX_PER_M = 70;
const G = 9.81;

export default function InclinedPlaneSimulation() {
  const [angle, setAngle] = useState(30);
  const [mu, setMu] = useState(0.2);
  const [mass, setMass] = useState(4);
  const [showForces, setShowForces] = useState(true);
  const [running, setRunning] = useState(true);
  const [read, pushRead] = useReadouts({ a: 0, N: 0, fr: 0, v: 0, state: '—' });

  const P = useRef({});
  P.current = { angle, mu, mass, showForces, running };
  const S = useRef({ d: 0, v: 0, hold: 0 });

  const restart = () => {
    S.current = { d: 0, v: 0, hold: 0 };
  };
  const change = (setter) => (v) => {
    setter(v);
    restart();
  };

  const frame = (ctx, dt) => {
    const p = P.current;
    const s = S.current;
    const th = (p.angle * Math.PI) / 180;
    const sin = Math.sin(th);
    const cos = Math.cos(th);
    const size = 36 + p.mass * 2.6;
    const tan = Math.tan(th);
    const slides = tan > p.mu + 1e-6;
    const a = slides ? G * (sin - p.mu * cos) : 0;
    const travel = LEN - size; // recorrido disponible (px)

    if (p.running) {
      if (s.hold > 0) {
        s.hold -= dt;
        if (s.hold <= 0) restart();
      } else if (slides) {
        const n = 4;
        for (let i = 0; i < n; i++) {
          s.v += (a * PX_PER_M * dt) / n;
          s.d += (s.v * dt) / n;
        }
        if (s.d >= travel) {
          s.d = travel;
          s.hold = 1;
        }
      }
    }

    const top = { x: BASE.x - LEN * cos, y: BASE.y - LEN * sin };
    const u = { x: cos, y: sin }; // bajando por la rampa
    const n = { x: sin, y: -cos }; // normal saliente
    fillBackground(ctx, W, H);

    // rampa
    const grad = ctx.createLinearGradient(top.x, top.y, BASE.x, BASE.y);
    grad.addColorStop(0, '#1c4a78');
    grad.addColorStop(1, '#0f2d4d');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(BASE.x, BASE.y);
    ctx.lineTo(top.x, BASE.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(BASE.x, BASE.y);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(top.x - 40, BASE.y);
    ctx.lineTo(BASE.x + 60, BASE.y);
    ctx.stroke();

    // marcas de distancia sobre la rampa
    for (let m = 1; m * PX_PER_M < LEN; m++) {
      const q = { x: top.x + u.x * m * PX_PER_M, y: top.y + u.y * m * PX_PER_M };
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.moveTo(q.x, q.y);
      ctx.lineTo(q.x - n.x * 7, q.y - n.y * 7);
      ctx.stroke();
    }

    // arco del ángulo
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(BASE.x, BASE.y, 62, Math.PI, Math.PI + th);
    ctx.stroke();
    text(ctx, `${p.angle}°`, BASE.x - 96, BASE.y - 8 - sin * 20, { color: COLORS.gold, size: 13, weight: 700 });

    // bloque
    const c = {
      x: top.x + u.x * (s.d + size / 2) + n.x * (size / 2),
      y: top.y + u.y * (s.d + size / 2) + n.y * (size / 2)
    };
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(th);
    const bg = ctx.createLinearGradient(0, -size / 2, 0, size / 2);
    bg.addColorStop(0, '#b794f6');
    bg.addColorStop(1, '#6d49b5');
    ctx.fillStyle = bg;
    ctx.shadowColor = COLORS.violet;
    ctx.shadowBlur = 14;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.restore();
    text(ctx, `${p.mass} kg`, c.x, c.y + 4, { color: '#fff', size: 12, align: 'center', weight: 700 });

    // fuerzas
    const Wf = p.mass * G;
    const N = Wf * cos;
    const fr = slides ? p.mu * N : Wf * sin;
    if (p.showForces) {
      const k = 0.85;
      arrow(ctx, c.x, c.y, c.x, c.y + Wf * k, COLORS.red, 2.5, 9); // peso
      arrow(ctx, c.x, c.y, c.x + n.x * N * k, c.y + n.y * N * k, COLORS.cyan, 2.5, 9); // normal
      if (fr > 0.05) arrow(ctx, c.x, c.y, c.x - u.x * fr * k, c.y - u.y * fr * k, COLORS.gold, 2.5, 9); // rozamiento
      text(ctx, 'P = mg', c.x + 8, c.y + Wf * k + 14, { color: COLORS.red, size: 11 });
      text(ctx, 'N', c.x + n.x * N * k + 8, c.y + n.y * N * k - 4, { color: COLORS.cyan, size: 11 });
      if (fr > 0.05) text(ctx, 'fᵣ', c.x - u.x * fr * k - 16, c.y - u.y * fr * k - 6, { color: COLORS.gold, size: 11 });
    }

    text(
      ctx,
      slides ? 'El bloque DESLIZA (tanθ > μ)' : 'El bloque PERMANECE EN REPOSO (tanθ ≤ μ)',
      28,
      34,
      { color: slides ? COLORS.green : COLORS.red, size: 13, weight: 700 }
    );
    text(ctx, `a = g(senθ − μ·cosθ)`, 28, 56, { size: 11 });

    pushRead({ a, N, fr, v: s.v / PX_PER_M, state: slides ? 'desliza' : 'reposo' });
  };

  return (
    <div className="flex flex-col gap-4">
      <SimCanvas width={W} height={H} onFrame={frame} label="Bloque sobre un plano inclinado con rozamiento" />
      <Readouts
        items={[
          { label: 'Aceleración', value: f(read.a, 2), unit: 'm/s²' },
          { label: 'Normal N', value: f(read.N, 1), unit: 'N' },
          { label: 'Rozamiento', value: f(read.fr, 1), unit: 'N' },
          { label: 'Velocidad', value: f(read.v, 2), unit: 'm/s' }
        ]}
      />
      <Toolbar running={running} onToggle={() => setRunning(!running)} onReset={restart}>
        <Toggle active={showForces} onClick={() => setShowForces(!showForces)}>
          Diagrama de fuerzas
        </Toggle>
      </Toolbar>
      <div className="grid sm:grid-cols-3 gap-3">
        <Slider label="Ángulo" unit="°" value={angle} min={0} max={60} onChange={change(setAngle)} color="#4DEEEA" />
        <Slider label="Coef. de rozamiento μ" value={mu} min={0} max={1} step={0.01} onChange={change(setMu)} />
        <Slider label="Masa" unit="kg" value={mass} min={1} max={10} onChange={change(setMass)} color="#9B72CF" />
      </div>
      <Explanation>
        <p>
          El peso se descompone en una componente <strong className="text-[#4DEEEA]">perpendicular</strong> (<span className="font-mono">mg·cosθ</span>, equilibrada por la normal) y una{' '}
          <strong className="text-[#FFD166]">paralela</strong> (<span className="font-mono">mg·senθ</span>) que empuja el bloque rampa abajo. El rozamiento se opone con{' '}
          <span className="font-mono">fᵣ = μN</span>. Resultado: <span className="font-mono">a = g(senθ − μ cosθ)</span>, ¡independiente de la masa!
        </p>
        <p className="font-mono text-[11px] text-[#FFD166]">Prueba: cambia la masa y observa que la aceleración no cambia. ¿Cuál es el ángulo crítico para μ = 0,5?</p>
      </Explanation>
    </div>
  );
}
