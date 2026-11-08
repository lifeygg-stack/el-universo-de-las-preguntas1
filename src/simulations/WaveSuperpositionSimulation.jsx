import React, { useRef, useState } from 'react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Toggle, Readouts, Explanation, useReadouts, f } from './core/ui';
import { COLORS, fillBackground, text } from './core/draw';

const W = 800;
const H = 450;
const C = 130; // velocidad de la onda en px/s
const CY = [95, 225, 355];
const AMP_MAX = 55;

export default function WaveSuperpositionSimulation() {
  const [a1, setA1] = useState(35);
  const [f1, setF1] = useState(0.8);
  const [a2, setA2] = useState(35);
  const [f2, setF2] = useState(1);
  const [phase, setPhase] = useState(0);
  const [opposite, setOpposite] = useState(false);
  const [running, setRunning] = useState(true);
  const [read, pushRead] = useReadouts({});

  const P = useRef({});
  P.current = { a1, f1, a2, f2, phase, opposite, running };
  const S = useRef({ t: 0 });

  const frame = (ctx, dt) => {
    const p = P.current;
    const s = S.current;
    if (p.running) s.t += dt;
    const t = s.t;
    const k1 = (2 * Math.PI * p.f1) / C;
    const k2 = (2 * Math.PI * p.f2) / C;
    const w1 = 2 * Math.PI * p.f1;
    const w2 = 2 * Math.PI * p.f2;
    const ph = (p.phase * Math.PI) / 180;
    const y1 = (x) => p.a1 * Math.sin(k1 * x - w1 * t);
    // onda 2: avanza hacia la derecha (sin(kx - wt + φ)) o hacia la izquierda (sin(kx + wt + φ))
    const wave2 = (x) => p.a2 * Math.sin(k2 * x + (p.opposite ? w2 * t : -w2 * t) + ph);

    fillBackground(ctx, W, H);
    const labels = ['Onda 1', 'Onda 2', 'Suma (superposición)'];
    CY.forEach((cy, i) => {
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();
      text(ctx, labels[i], 14, cy - AMP_MAX - 6 + (i === 2 ? -6 : 0), { size: 11, color: [COLORS.cyan, COLORS.violet, COLORS.gold][i], weight: 700 });
    });

    const draw = (fn, cy, color, width) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineJoin = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = cy - fn(x);
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    draw(y1, CY[0], COLORS.cyan, 2.5);
    draw(wave2, CY[1], COLORS.violet, 2.5);
    draw((x) => y1(x) + wave2(x), CY[2], COLORS.gold, 3.2);

    // partículas del medio sobre la onda suma
    ctx.fillStyle = '#fff';
    for (let x = 20; x < W; x += 28) {
      ctx.beginPath();
      ctx.arc(x, CY[2] - (y1(x) + wave2(x)), 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // longitud de onda
    const l1 = C / p.f1;
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W - 40 - l1, CY[0] + AMP_MAX + 14);
    ctx.lineTo(W - 40, CY[0] + AMP_MAX + 14);
    ctx.stroke();
    text(ctx, `λ₁ = ${f(l1 / 100, 2)} u`, W - 40, CY[0] + AMP_MAX + 28, { color: COLORS.cyan, size: 11, align: 'right' });

    const same = Math.abs(p.f1 - p.f2) < 0.001;
    let kind = 'Pulsaciones / batido';
    if (same && !p.opposite) {
      const d = Math.cos(ph / 2);
      kind = Math.abs(d) > 0.9 ? 'Interferencia constructiva' : Math.abs(d) < 0.15 ? 'Interferencia destructiva' : 'Interferencia parcial';
    } else if (same && p.opposite) kind = 'Onda estacionaria (nodos fijos)';
    pushRead({ l1: l1 / 100, l2: C / p.f2 / 100, beat: Math.abs(p.f1 - p.f2), kind });
  };

  return (
    <div className="flex flex-col gap-4">
      <SimCanvas width={W} height={H} onFrame={frame} label="Superposición de dos ondas" />
      <Readouts
        items={[
          { label: 'λ onda 1', value: f(read.l1, 2), unit: 'u' },
          { label: 'λ onda 2', value: f(read.l2, 2), unit: 'u' },
          { label: 'Frec. de pulsación', value: f(read.beat, 2), unit: 'Hz' },
          { label: 'Fenómeno', value: read.kind }
        ]}
      />
      <Toolbar running={running} onToggle={() => setRunning(!running)}>
        <Toggle active={opposite} accent="#9B72CF" onClick={() => setOpposite(!opposite)}>
          Onda 2 en sentido contrario
        </Toggle>
        <button
          onClick={() => {
            setF2(f1);
            setA2(a1);
          }}
          className="px-3 py-2 rounded-lg bg-[#102A43] border border-[#F2F5F7]/15 hover:border-[#4DEEEA] text-xs font-display font-semibold"
        >
          Igualar onda 2 a onda 1
        </button>
      </Toolbar>
      <div className="grid sm:grid-cols-2 gap-3">
        <Slider label="Amplitud onda 1" unit="px" value={a1} min={0} max={55} onChange={setA1} color="#4DEEEA" />
        <Slider label="Frecuencia onda 1" unit="Hz" value={f1} min={0.2} max={2.5} step={0.05} onChange={setF1} color="#4DEEEA" />
        <Slider label="Amplitud onda 2" unit="px" value={a2} min={0} max={55} onChange={setA2} color="#9B72CF" />
        <Slider label="Frecuencia onda 2" unit="Hz" value={f2} min={0.2} max={2.5} step={0.05} onChange={setF2} color="#9B72CF" />
        <Slider label="Desfase de la onda 2" unit="°" value={phase} min={0} max={360} step={5} onChange={setPhase} color="#FFD166" />
      </div>
      <Explanation>
        <p>
          Cuando dos ondas coinciden en un medio, sus desplazamientos <strong className="text-[#FFD166]">se suman</strong> (principio de superposición). Con el mismo desfase se refuerzan (<em>constructiva</em>);
          en oposición de fase se cancelan (<em>destructiva</em>). Si las frecuencias son distintas se oyen <em>pulsaciones</em> de frecuencia |f₁ − f₂|.
        </p>
        <p>Dos ondas iguales que viajan en sentidos opuestos forman una <strong className="text-[#4DEEEA]">onda estacionaria</strong>, con nodos que no se mueven.</p>
      </Explanation>
    </div>
  );
}
