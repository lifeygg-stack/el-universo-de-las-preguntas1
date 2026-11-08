import React, { useRef, useState } from 'react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Readouts, Explanation, GravityPresets, useReadouts, f } from './core/ui';
import { COLORS, Sparks, arrow, damp, fillBackground, glowDot, text } from './core/draw';

const W = 800;
const H = 450;
const GY = H - 56; // y del suelo
const X0 = 70;

const fresh = () => ({ t: 0, landed: false, started: false, sc: 6, sparks: new Sparks() });

function niceStep(maxM) {
  for (const s of [1, 2, 5, 10, 20, 50, 100, 200, 500]) if (maxM / s <= 9) return s;
  return 1000;
}

export default function ProjectileSimulation() {
  const [v0, setV0] = useState(28);
  const [angle, setAngle] = useState(45);
  const [g, setG] = useState(9.81);
  const [h0, setH0] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [read, pushRead] = useReadouts({ t: 0, x: 0, y: 0, v: 0 });

  const P = useRef({});
  P.current = { v0, angle, g, h0, speed, running };
  const S = useRef(fresh());

  const rewind = () => {
    const s = S.current;
    s.t = 0;
    s.landed = false;
    s.started = false;
    setRunning(false);
  };
  const change = (setter) => (v) => {
    setter(v);
    rewind();
  };
  const launch = () => {
    const s = S.current;
    s.t = 0;
    s.landed = false;
    s.started = true;
    setRunning(true);
  };

  const frame = (ctx, dt) => {
    const p = P.current;
    const s = S.current;
    const th = (p.angle * Math.PI) / 180;
    const vx = p.v0 * Math.cos(th);
    const vy = p.v0 * Math.sin(th);
    const tf = (vy + Math.sqrt(vy * vy + 2 * p.g * p.h0)) / p.g;
    const R = vx * tf;
    const hmax = p.h0 + (vy * vy) / (2 * p.g);

    const targetSc = Math.max(0.4, Math.min((W - X0 - 50) / Math.max(R, 5), (GY - 50) / Math.max(hmax, 5)));
    s.sc = damp(s.sc, targetSc, 6, dt);
    const sc = s.sc;
    const X = (m) => X0 + m * sc;
    const Y = (m) => GY - m * sc;
    const pos = (t) => ({ x: vx * t, y: p.h0 + vy * t - 0.5 * p.g * t * t });

    if (p.running && s.started && !s.landed) {
      s.t += dt * p.speed;
      if (s.t >= tf) {
        s.t = tf;
        s.landed = true;
        s.sparks.burst(X(R), GY, 22, COLORS.gold, 80);
        setRunning(false);
      }
    }
    s.sparks.update(dt);

    fillBackground(ctx, W, H);

    // regla del suelo
    const step = niceStep(Math.max(R, hmax, 10));
    ctx.strokeStyle = 'rgba(77,238,234,0.07)';
    ctx.lineWidth = 1;
    for (let m = 0; X(m) < W; m += step) {
      ctx.beginPath();
      ctx.moveTo(X(m), 0);
      ctx.lineTo(X(m), GY);
      ctx.stroke();
      text(ctx, `${m} m`, X(m), GY + 22, { size: 11, align: 'center' });
    }
    for (let m = 0; Y(m) > 10; m += step) {
      ctx.beginPath();
      ctx.moveTo(X0, Y(m));
      ctx.lineTo(W, Y(m));
      ctx.stroke();
      if (m > 0) text(ctx, `${m}`, X0 - 8, Y(m) + 4, { size: 10, align: 'right' });
    }
    ctx.fillStyle = '#0B1D30';
    ctx.fillRect(0, GY, W, H - GY);
    ctx.fillStyle = 'rgba(77,238,234,0.4)';
    ctx.fillRect(0, GY, W, 2);

    // plataforma
    if (p.h0 > 0) {
      ctx.fillStyle = '#16365a';
      ctx.fillRect(X0 - 46, Y(p.h0), 46, GY - Y(p.h0));
      ctx.fillStyle = 'rgba(77,238,234,0.5)';
      ctx.fillRect(X0 - 46, Y(p.h0), 46, 2);
    }

    // trayectoria prevista
    ctx.strokeStyle = 'rgba(255,209,102,0.45)';
    ctx.setLineDash([5, 6]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const N = 80;
    for (let i = 0; i <= N; i++) {
      const q = pos((tf * i) / N);
      i ? ctx.lineTo(X(q.x), Y(Math.max(0, q.y))) : ctx.moveTo(X(q.x), Y(q.y));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // marcas estroboscópicas cada 0.5 s (muestran que x avanza a ritmo constante)
    for (let k = 0.5; k < tf; k += 0.5) {
      const q = pos(k);
      ctx.fillStyle = k <= s.t ? 'rgba(77,238,234,0.8)' : 'rgba(77,238,234,0.25)';
      ctx.beginPath();
      ctx.arc(X(q.x), Y(q.y), 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // recorrido ya hecho
    if (s.started || s.t > 0) {
      ctx.strokeStyle = COLORS.violet;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const M = Math.max(2, Math.ceil(s.t * 40));
      for (let i = 0; i <= M; i++) {
        const q = pos((s.t * i) / M);
        i ? ctx.lineTo(X(q.x), Y(q.y)) : ctx.moveTo(X(q.x), Y(q.y));
      }
      ctx.stroke();
    }

    const cur = pos(s.t);
    const cvx = vx;
    const cvy = vy - p.g * s.t;
    const bx = X(cur.x);
    const by = Y(Math.max(0, cur.y));

    // vectores de velocidad
    const va = 2.2;
    arrow(ctx, bx, by, bx + cvx * va, by, COLORS.cyan, 2, 7);
    arrow(ctx, bx, by, bx, by - cvy * va, COLORS.gold, 2, 7);
    arrow(ctx, bx, by, bx + cvx * va, by - cvy * va, '#ffffff', 2, 8);
    glowDot(ctx, bx, by, 8, COLORS.violet, 18);
    s.sparks.draw(ctx);

    // máxima altura y alcance
    const apexT = vy / p.g;
    if (apexT > 0) {
      const a = pos(apexT);
      text(ctx, `h máx ${f(hmax, 1)} m`, X(a.x), Y(a.y) - 12, { size: 11, align: 'center', color: COLORS.gold });
    }
    text(ctx, `alcance ${f(R, 1)} m`, X(R), GY - 10, { size: 11, align: 'center', color: COLORS.gold });

    text(ctx, 'vx', W - 120, 28, { color: COLORS.cyan, size: 11 });
    text(ctx, 'vy', W - 90, 28, { color: COLORS.gold, size: 11 });
    text(ctx, 'v', W - 60, 28, { color: '#fff', size: 11 });

    pushRead({ t: s.t, x: cur.x, y: Math.max(0, cur.y), v: Math.hypot(cvx, cvy), tf, R, hmax });
  };

  return (
    <div className="flex flex-col gap-4">
      <SimCanvas width={W} height={H} onFrame={frame} label="Simulación de tiro parabólico" />
      <Readouts
        items={[
          { label: 'Tiempo', value: f(read.t, 2), unit: 's' },
          { label: 'Posición x', value: f(read.x, 1), unit: 'm' },
          { label: 'Altura y', value: f(read.y, 1), unit: 'm' },
          { label: 'Rapidez', value: f(read.v, 1), unit: 'm/s' },
          { label: 'Tiempo de vuelo', value: f(read.tf, 2), unit: 's' },
          { label: 'Alcance', value: f(read.R, 1), unit: 'm' },
          { label: 'Altura máx.', value: f(read.hmax, 1), unit: 'm' },
          { label: 'Ángulo', value: angle, unit: '°' }
        ]}
      />
      <Toolbar
        running={running}
        onToggle={() => {
          const s = S.current;
          if (running) setRunning(false);
          else if (s.started && !s.landed) setRunning(true);
          else launch();
        }}
        onReset={rewind}
        playLabel="Lanzar"
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <Slider label="Rapidez inicial" unit="m/s" value={v0} min={5} max={60} onChange={change(setV0)} />
        <Slider label="Ángulo de lanzamiento" unit="°" value={angle} min={5} max={85} onChange={change(setAngle)} color="#4DEEEA" />
        <Slider label="Altura inicial" unit="m" value={h0} min={0} max={40} onChange={change(setH0)} color="#9B72CF" />
        <Slider label="Cámara lenta" unit="×" value={speed} min={0.2} max={2} step={0.1} onChange={setSpeed} color="#94A3B8" />
      </div>
      <GravityPresets g={g} onChange={change(setG)} />
      <Explanation>
        <p>
          El movimiento se descompone en dos independientes: en <strong className="text-[#4DEEEA]">horizontal</strong> no hay fuerza, así que{' '}
          <span className="font-mono">vₓ = v₀cosθ</span> es constante (los puntos estroboscópicos están igualmente espaciados). En{' '}
          <strong className="text-[#FFD166]">vertical</strong> actúa la gravedad: <span className="font-mono">y = h₀ + v₀senθ·t − ½gt²</span>.
        </p>
        <p className="font-mono text-[11px] text-[#FFD166]">
          Reto: sin altura inicial, ¿qué dos ángulos dan el mismo alcance? ¿Cuál da el máximo?
        </p>
      </Explanation>
    </div>
  );
}
