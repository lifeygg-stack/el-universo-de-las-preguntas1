import React, { useEffect, useRef, useState } from 'react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Toggle, Readouts, Explanation, useReadouts, f } from './core/ui';
import { COLORS, glowDot, text } from './core/draw';

const W = 800;
const H = 450;
const CELL = 4;
const GW = W / CELL;
const GH = H / CELL;

export default function RippleTankSimulation() {
  const [lambda, setLambda] = useState(48);
  const [freq, setFreq] = useState(1.2);
  const [dphi, setDphi] = useState(0);
  const [two, setTwo] = useState(true);
  const [running, setRunning] = useState(true);
  const [sep, setSep] = useState(160);
  const [read, pushRead] = useReadouts({ d: 160, lines: 0 });

  const P = useRef({});
  P.current = { lambda, freq, dphi, two, running };
  const S = useRef({ t: 0, s1: { x: 400 - 80, y: 225 }, s2: { x: 400 + 80, y: 225 }, drag: 0 });
  const off = useRef(null);

  useEffect(() => {
    const c = document.createElement('canvas');
    c.width = GW;
    c.height = GH;
    off.current = { c, ctx: c.getContext('2d'), img: c.getContext('2d').createImageData(GW, GH) };
  }, []);

  // la separación se controla con el control deslizante: recoloca las fuentes de forma simétrica
  const changeSep = (v) => {
    setSep(v);
    const s = S.current;
    const cx = (s.s1.x + s.s2.x) / 2;
    const cy = (s.s1.y + s.s2.y) / 2;
    s.s1 = { x: cx - v / 2, y: cy };
    s.s2 = { x: cx + v / 2, y: cy };
  };

  const frame = (ctx, dt) => {
    const p = P.current;
    const s = S.current;
    if (p.running) s.t += dt;
    const o = off.current;
    if (!o) return;
    const k = (2 * Math.PI) / p.lambda;
    const w = 2 * Math.PI * p.freq;
    const ph = (p.dphi * Math.PI) / 180;
    const data = o.img.data;
    let idx = 0;
    for (let j = 0; j < GH; j++) {
      const y = j * CELL + CELL / 2;
      for (let i = 0; i < GW; i++) {
        const x = i * CELL + CELL / 2;
        const r1 = Math.hypot(x - s.s1.x, y - s.s1.y);
        let v = Math.cos(k * r1 - w * s.t) / Math.sqrt(1 + r1 / 40);
        if (p.two) {
          const r2 = Math.hypot(x - s.s2.x, y - s.s2.y);
          v += Math.cos(k * r2 - w * s.t + ph) / Math.sqrt(1 + r2 / 40);
        }
        const q = Math.max(-1, Math.min(1, v * (p.two ? 0.9 : 1.5)));
        // paleta: valle violeta oscuro -> reposo azul noche -> cresta cian brillante
        const pos = Math.max(0, q);
        const neg = Math.max(0, -q);
        data[idx++] = 7 + pos * 70 - neg * 4 + neg * 40;
        data[idx++] = 17 + pos * 221 - neg * 8;
        data[idx++] = 31 + pos * 203 + neg * 60;
        data[idx++] = 255;
      }
    }
    o.ctx.putImageData(o.img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(o.c, 0, 0, W, H);

    glowDot(ctx, s.s1.x, s.s1.y, 7, COLORS.gold, 16);
    text(ctx, 'F₁', s.s1.x, s.s1.y - 14, { color: COLORS.gold, size: 12, align: 'center', weight: 700 });
    if (p.two) {
      glowDot(ctx, s.s2.x, s.s2.y, 7, COLORS.gold, 16);
      text(ctx, 'F₂', s.s2.x, s.s2.y - 14, { color: COLORS.gold, size: 12, align: 'center', weight: 700 });
    }
    text(ctx, 'Arrastra las fuentes', 14, H - 12, { size: 11, color: '#cbd5e1' });

    const d = Math.hypot(s.s2.x - s.s1.x, s.s2.y - s.s1.y);
    pushRead({ d, lines: 2 * Math.floor(d / p.lambda) + 1 });
  };

  const onDown = (pt) => {
    const s = S.current;
    const d1 = Math.hypot(pt.x - s.s1.x, pt.y - s.s1.y);
    const d2 = Math.hypot(pt.x - s.s2.x, pt.y - s.s2.y);
    s.drag = d1 <= d2 ? 1 : 2;
    if (!P.current.two) s.drag = 1;
    (s.drag === 1 ? (s.s1 = { ...pt }) : (s.s2 = { ...pt }));
  };
  const onMove = (pt) => {
    const s = S.current;
    if (s.drag === 1) s.s1 = { x: Math.max(10, Math.min(W - 10, pt.x)), y: Math.max(10, Math.min(H - 10, pt.y)) };
    if (s.drag === 2) s.s2 = { x: Math.max(10, Math.min(W - 10, pt.x)), y: Math.max(10, Math.min(H - 10, pt.y)) };
  };
  const onUp = () => {
    S.current.drag = 0;
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
        cursor="move"
        label="Cubeta de ondas con interferencia de dos fuentes"
      />
      <Readouts
        items={[
          { label: 'Longitud de onda λ', value: lambda, unit: 'px' },
          { label: 'Separación entre fuentes', value: f(read.d, 0), unit: 'px' },
          { label: 'Líneas antinodales (máx.)', value: two ? read.lines : '—' },
          { label: 'Frecuencia', value: freq, unit: 'Hz' }
        ]}
      />
      <Toolbar running={running} onToggle={() => setRunning(!running)}>
        <Toggle active={two} onClick={() => setTwo(!two)}>
          Dos fuentes
        </Toggle>
      </Toolbar>
      <div className="grid sm:grid-cols-2 gap-3">
        <Slider label="Longitud de onda" unit="px" value={lambda} min={20} max={90} onChange={setLambda} color="#4DEEEA" />
        <Slider label="Frecuencia" unit="Hz" value={freq} min={0.3} max={3} step={0.1} onChange={setFreq} />
        <Slider label="Separación de fuentes" unit="px" value={sep} min={40} max={380} onChange={changeSep} color="#9B72CF" />
        <Slider label="Desfase entre fuentes" unit="°" value={dphi} min={0} max={180} step={5} onChange={setDphi} color="#FFD166" />
      </div>
      <Explanation>
        <p>
          Cada fuente emite ondas circulares. En cada punto se suman los dos efectos: donde la diferencia de recorridos es un múltiplo entero de λ hay{' '}
          <strong className="text-[#4DEEEA]">interferencia constructiva</strong> (franjas brillantes); donde es un múltiplo impar de λ/2, <strong className="text-[#9B72CF]">destructiva</strong> (el agua queda quieta).
        </p>
        <p>Acerca las fuentes o aumenta λ: el número de franjas disminuye. Es el mismo patrón del experimento de Young con luz.</p>
      </Explanation>
    </div>
  );
}
