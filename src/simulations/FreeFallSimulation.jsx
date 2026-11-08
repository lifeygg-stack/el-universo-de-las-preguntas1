import React, { useRef, useState } from 'react';
import { Wind } from 'lucide-react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Toggle, Readouts, Explanation, useReadouts, f } from './core/ui';
import { COLORS, fillBackground, text } from './core/draw';

const W = 800;
const H = 450;
const TOP = 40;
const GROUND = 410;

const OBJECTS = [
  { id: 'ball', name: 'Bola de acero', c: 0.0015, x: 240, color: '#9aa7b8' }, // c/m (1/m)
  { id: 'feather', name: 'Pluma', c: 0.35, x: 560, color: '#ffd9a0' }
];

const fresh = () => ({
  t: 0,
  started: false,
  objs: OBJECTS.map(() => ({ y: 0, v: 0, landed: null })),
  marks: OBJECTS.map(() => []),
  streak: 0
});

export default function FreeFallSimulation() {
  const [height, setHeight] = useState(60);
  const [vacuum, setVacuum] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [read, pushRead] = useReadouts({ t: 0, v: [0, 0], tl: [null, null] });

  const P = useRef({});
  P.current = { height, vacuum, speed, running };
  const S = useRef(fresh());

  const reset = () => {
    S.current = fresh();
    setRunning(false);
  };
  const drop = () => {
    S.current = fresh();
    S.current.started = true;
    setRunning(true);
  };

  const frame = (ctx, dt, tt) => {
    const p = P.current;
    const s = S.current;
    const g = 9.81;
    const pxm = (GROUND - TOP - 30) / p.height;

    if (p.running && s.started) {
      const total = dt * p.speed;
      const n = Math.max(1, Math.ceil(total / (1 / 240)));
      const h = total / n;
      for (let i = 0; i < n; i++) {
        s.t += h;
        s.objs.forEach((o, k) => {
          if (o.landed != null) return;
          const c = p.vacuum ? 0 : OBJECTS[k].c;
          const a = g - c * o.v * Math.abs(o.v);
          o.v += a * h;
          o.y += o.v * h;
          if (o.y >= p.height) {
            o.y = p.height;
            o.landed = s.t;
          }
        });
      }
      s.objs.forEach((o, k) => {
        const marks = s.marks[k];
        if (Math.floor(s.t / 0.5) > marks.length && o.landed == null) marks.push(o.y);
      });
      if (s.objs.every((o) => o.landed != null)) setRunning(false);
    }

    fillBackground(ctx, W, H);
    // suelo
    ctx.fillStyle = '#0B1D30';
    ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = 'rgba(77,238,234,0.45)';
    ctx.fillRect(0, GROUND, W, 2);
    // regla de altura
    for (let m = 0; m <= p.height; m += p.height > 80 ? 20 : 10) {
      const y = TOP + 30 + m * pxm;
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(30, y, 10, 1);
      text(ctx, `${(p.height - m).toFixed(0)} m`, 46, y + 4, { size: 10 });
    }

    // vacío: campana
    if (p.vacuum) {
      ctx.strokeStyle = 'rgba(155,114,207,0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(110, TOP - 8, W - 220, GROUND - TOP + 8, 30);
      ctx.stroke();
      ctx.fillStyle = 'rgba(155,114,207,0.06)';
      ctx.fill();
      text(ctx, 'VACÍO (sin aire)', W / 2, TOP + 6, { color: COLORS.violet, size: 12, align: 'center', weight: 700 });
    } else {
      // corrientes de aire (relativas al objeto en caída)
      s.streak += dt * 60;
      OBJECTS.forEach((o, k) => {
        const v = s.objs[k].v;
        ctx.strokeStyle = 'rgba(77,238,234,0.22)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
          const x = o.x - 60 + i * 24;
          const off = ((tt * (30 + v * pxm * 1.2) + i * 53) % (GROUND - TOP)) ;
          const y = GROUND - off;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y - 8 - Math.min(24, v * 0.6));
          ctx.stroke();
        }
      });
    }

    OBJECTS.forEach((o, k) => {
      const st = s.objs[k];
      const y = TOP + 30 + st.y * pxm;
      // marcas cada 0.5 s
      s.marks[k].forEach((my, i) => {
        const yy = TOP + 30 + my * pxm;
        ctx.strokeStyle = 'rgba(255,209,102,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(o.x + 24, yy);
        ctx.lineTo(o.x + 44, yy);
        ctx.stroke();
        text(ctx, `${((i + 1) * 0.5).toFixed(1)} s`, o.x + 48, yy + 4, { size: 9, color: COLORS.gold });
      });

      ctx.save();
      ctx.translate(o.x, y);
      if (o.id === 'ball') {
        const g2 = ctx.createRadialGradient(-5, -5, 2, 0, 0, 16);
        g2.addColorStop(0, '#f1f5f9');
        g2.addColorStop(1, '#64748b');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(0, -14, 14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const fell = st.landed == null;
        ctx.rotate(fell ? Math.sin(tt * 4 + st.y * 0.3) * 0.35 : 1.3);
        ctx.fillStyle = o.color;
        ctx.beginPath();
        ctx.ellipse(0, -14, 5, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#7a5b2a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.lineTo(0, 10);
        ctx.stroke();
      }
      ctx.restore();
      text(ctx, o.name, o.x, GROUND + 28, { color: '#cbd5e1', size: 12, align: 'center', weight: 700 });
      text(ctx, `v = ${f(st.v, 1)} m/s`, o.x, GROUND + 46, { color: COLORS.cyan, size: 11, align: 'center' });
    });

    // cronómetro
    text(ctx, `t = ${f(s.t, 2)} s`, W - 28, 32, { color: COLORS.gold, size: 15, align: 'right', weight: 700 });

    pushRead({ t: s.t, v: s.objs.map((o) => o.v), tl: s.objs.map((o) => o.landed) });
  };

  return (
    <div className="flex flex-col gap-4">
      <SimCanvas width={W} height={H} onFrame={frame} label="Caída libre de una bola y una pluma, con y sin aire" />
      <Readouts
        items={[
          { label: 'Tiempo', value: f(read.t, 2), unit: 's' },
          { label: 'Velocidad bola', value: f(read.v[0], 1), unit: 'm/s' },
          { label: 'Velocidad pluma', value: f(read.v[1], 1), unit: 'm/s' },
          { label: 'Llegada (bola / pluma)', value: `${read.tl[0] == null ? '—' : f(read.tl[0], 2)} / ${read.tl[1] == null ? '—' : f(read.tl[1], 2)}`, unit: 's' }
        ]}
      />
      <Toolbar running={running} onToggle={() => (running ? setRunning(false) : S.current.started && S.current.objs.some((o) => o.landed == null) ? setRunning(true) : drop())} onReset={reset} playLabel="Soltar">
        <Toggle active={vacuum} accent="#9B72CF" onClick={() => { setVacuum(!vacuum); reset(); }}>
          <Wind size={15} /> {vacuum ? 'En el vacío' : 'En el aire'}
        </Toggle>
      </Toolbar>
      <div className="grid sm:grid-cols-2 gap-3">
        <Slider label="Altura de caída" unit="m" value={height} min={10} max={150} step={5} onChange={(v) => { setHeight(v); reset(); }} />
        <Slider label="Cámara lenta" unit="×" value={speed} min={0.2} max={2} step={0.1} onChange={setSpeed} color="#94A3B8" />
      </div>
      <Explanation>
        <p>
          Sin aire, <strong className="text-[#9B72CF]">todos los cuerpos caen con la misma aceleración</strong> (g ≈ 9,81 m/s²) sin importar su masa: ¡llegan a la vez! En el aire aparece una fuerza de
          arrastre que crece con la velocidad (<span className="font-mono">F ∝ v²</span>); cuando iguala al peso se alcanza la <strong className="text-[#FFD166]">velocidad terminal</strong>.
        </p>
        <p className="font-mono text-[11px] text-[#FFD166]">La pluma tiene mucha más resistencia por unidad de masa que la bola, por eso se queda atrás.</p>
      </Explanation>
    </div>
  );
}
