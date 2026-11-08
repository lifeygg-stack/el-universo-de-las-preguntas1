import React, { useRef, useState } from 'react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Toggle, Readouts, Explanation, useReadouts, f } from './core/ui';
import { COLORS, fillBackground, text } from './core/draw';

const W = 800;
const H = 450;
const BAT = { x: 110, y1: 185, y2: 265 };
const TOPY = 70;
const BOTY = 380;

function pathLength(pts) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return L;
}
function pointAt(pts, s) {
  let rem = s;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (rem <= seg) {
      const t = rem / seg;
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t };
    }
    rem -= seg;
  }
  return pts[pts.length - 1];
}

const SERIES_PATH = [
  { x: BAT.x, y: BAT.y1 },
  { x: BAT.x, y: TOPY },
  { x: 700, y: TOPY },
  { x: 700, y: BOTY },
  { x: BAT.x, y: BOTY },
  { x: BAT.x, y: BAT.y2 },
  { x: BAT.x, y: BAT.y1 }
];
const branch = (x) => [
  { x: BAT.x, y: BAT.y1 },
  { x: BAT.x, y: TOPY },
  { x, y: TOPY },
  { x, y: BOTY },
  { x: BAT.x, y: BOTY },
  { x: BAT.x, y: BAT.y2 },
  { x: BAT.x, y: BAT.y1 }
];
const PAR_X = [340, 560];

function resistor(ctx, x, y, vertical, heat, label, sub) {
  ctx.save();
  ctx.translate(x, y);
  if (vertical) ctx.rotate(Math.PI / 2);
  const col = `rgb(${Math.round(70 + heat * 185)},${Math.round(130 + heat * 20 - heat * 60)},${Math.round(180 - heat * 150)})`;
  ctx.shadowColor = `rgba(255,140,60,${heat})`;
  ctx.shadowBlur = 6 + heat * 26;
  ctx.fillStyle = '#0B1D30';
  ctx.strokeStyle = col;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-52, -16, 104, 32, 6);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(-40, 0);
  for (let i = 0; i < 8; i++) ctx.lineTo(-40 + 10 * (i + 0.5), i % 2 ? 9 : -9);
  ctx.lineTo(40, 0);
  ctx.stroke();
  ctx.restore();
  text(ctx, label, x + (vertical ? 62 : 0), y + (vertical ? -2 : -28), { size: 12, color: '#fff', align: vertical ? 'left' : 'center', weight: 700 });
  text(ctx, sub, x + (vertical ? 62 : 0), y + (vertical ? 14 : 38), { size: 11, color: COLORS.cyan, align: vertical ? 'left' : 'center' });
}

export default function OhmCircuitSimulation() {
  const [volt, setVolt] = useState(12);
  const [r1, setR1] = useState(20);
  const [r2, setR2] = useState(40);
  const [parallel, setParallel] = useState(false);
  const [running, setRunning] = useState(true);
  const [read, pushRead] = useReadouts({});

  const P = useRef({});
  P.current = { volt, r1, r2, parallel, running };
  const S = useRef({ off: [0, 0, 0], init: false });

  const frame = (ctx, dt) => {
    const p = P.current;
    const s = S.current;

    let currents; // corriente por cada trayecto
    let Req;
    let Itot;
    if (p.parallel) {
      const i1 = p.volt / p.r1;
      const i2 = p.volt / p.r2;
      currents = [i1, i2];
      Itot = i1 + i2;
      Req = 1 / (1 / p.r1 + 1 / p.r2);
    } else {
      Req = p.r1 + p.r2;
      Itot = p.volt / Req;
      currents = [Itot];
    }
    const paths = p.parallel ? PAR_X.map(branch) : [SERIES_PATH];

    fillBackground(ctx, W, H);

    // cables
    ctx.strokeStyle = 'rgba(203,213,225,0.55)';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (p.parallel) {
      ctx.moveTo(BAT.x, BAT.y1);
      ctx.lineTo(BAT.x, TOPY);
      ctx.lineTo(PAR_X[1], TOPY);
      ctx.moveTo(BAT.x, BAT.y2);
      ctx.lineTo(BAT.x, BOTY);
      ctx.lineTo(PAR_X[1], BOTY);
      PAR_X.forEach((x) => {
        ctx.moveTo(x, TOPY);
        ctx.lineTo(x, BOTY);
      });
    } else {
      ctx.moveTo(BAT.x, BAT.y1);
      ctx.lineTo(BAT.x, TOPY);
      ctx.lineTo(700, TOPY);
      ctx.lineTo(700, BOTY);
      ctx.lineTo(BAT.x, BOTY);
      ctx.lineTo(BAT.x, BAT.y2);
    }
    ctx.stroke();

    // resistencias
    const maxP = 30;
    if (p.parallel) {
      resistor(ctx, PAR_X[0], 225, true, Math.min(1, (p.volt * currents[0]) / maxP), 'R₁ = ' + p.r1 + ' Ω', `I = ${f(currents[0], 2)} A  ·  V = ${f(p.volt, 1)} V`);
      resistor(ctx, PAR_X[1], 225, true, Math.min(1, (p.volt * currents[1]) / maxP), 'R₂ = ' + p.r2 + ' Ω', `I = ${f(currents[1], 2)} A  ·  V = ${f(p.volt, 1)} V`);
    } else {
      resistor(ctx, 400, TOPY, false, Math.min(1, (Itot * Itot * p.r1) / maxP), 'R₁ = ' + p.r1 + ' Ω', `V = ${f(Itot * p.r1, 2)} V`);
      resistor(ctx, 400, BOTY, false, Math.min(1, (Itot * Itot * p.r2) / maxP), 'R₂ = ' + p.r2 + ' Ω', `V = ${f(Itot * p.r2, 2)} V`);
    }

    // batería
    ctx.fillStyle = '#07111F';
    ctx.fillRect(BAT.x - 22, BAT.y1 + 4, 44, BAT.y2 - BAT.y1 - 8);
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(BAT.x - 22, BAT.y1 + 22);
    ctx.lineTo(BAT.x + 22, BAT.y1 + 22);
    ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(BAT.x - 12, BAT.y2 - 22);
    ctx.lineTo(BAT.x + 12, BAT.y2 - 22);
    ctx.stroke();
    text(ctx, '+', BAT.x + 36, BAT.y1 + 24, { color: COLORS.gold, size: 16, weight: 700 });
    text(ctx, '−', BAT.x + 36, BAT.y2 - 18, { color: COLORS.gold, size: 16, weight: 700 });
    text(ctx, `${p.volt} V`, BAT.x - 40, 230, { color: COLORS.gold, size: 13, align: 'right', weight: 700 });

    // cargas en movimiento (sentido convencional: de + a −)
    paths.forEach((pts, i) => {
      const L = pathLength(pts);
      const speed = Math.max(5, Math.min(320, 70 * currents[i]));
      if (p.running) s.off[i] = (s.off[i] + speed * dt) % L;
      const n = Math.round(L / 34);
      ctx.fillStyle = COLORS.gold;
      ctx.shadowColor = COLORS.gold;
      ctx.shadowBlur = 8;
      for (let q = 0; q < n; q++) {
        const pt = pointAt(pts, (s.off[i] + (q * L) / n) % L);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    });

    text(ctx, 'Las cargas amarillas muestran la corriente convencional (+ → −); su rapidez es proporcional a I.', 14, H - 14, { size: 11 });
    pushRead({ Req, Itot, Ptot: p.volt * Itot });
  };

  return (
    <div className="flex flex-col gap-4">
      <SimCanvas width={W} height={H} onFrame={frame} label="Circuito eléctrico con dos resistencias" />
      <Readouts
        items={[
          { label: 'Resistencia equivalente', value: f(read.Req, 1), unit: 'Ω' },
          { label: 'Corriente total', value: f(read.Itot, 2), unit: 'A' },
          { label: 'Potencia total', value: f(read.Ptot, 1), unit: 'W' },
          { label: 'Conexión', value: parallel ? 'paralelo' : 'serie' }
        ]}
      />
      <Toolbar running={running} onToggle={() => setRunning(!running)}>
        <Toggle active={!parallel} onClick={() => setParallel(false)}>
          En serie
        </Toggle>
        <Toggle active={parallel} accent="#9B72CF" onClick={() => setParallel(true)}>
          En paralelo
        </Toggle>
      </Toolbar>
      <div className="grid sm:grid-cols-3 gap-3">
        <Slider label="Voltaje" unit="V" value={volt} min={1} max={24} onChange={setVolt} />
        <Slider label="Resistencia R₁" unit="Ω" value={r1} min={2} max={100} onChange={setR1} color="#4DEEEA" />
        <Slider label="Resistencia R₂" unit="Ω" value={r2} min={2} max={100} onChange={setR2} color="#9B72CF" />
      </div>
      <Explanation>
        <p>
          La <strong className="text-[#FFD166]">ley de Ohm</strong> relaciona voltaje, corriente y resistencia: <span className="font-mono">V = I·R</span>. En <strong>serie</strong>, la misma corriente atraviesa ambas
          y las resistencias se suman (<span className="font-mono">R = R₁ + R₂</span>). En <strong>paralelo</strong>, ambas reciben el mismo voltaje y las corrientes se suman
          (<span className="font-mono">1/R = 1/R₁ + 1/R₂</span>).
        </p>
        <p>El brillo naranja de cada resistencia indica la potencia que disipa en forma de calor: <span className="font-mono">P = I²R</span>.</p>
      </Explanation>
    </div>
  );
}
