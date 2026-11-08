import React, { useRef, useState } from 'react';
import SimCanvas from './core/SimCanvas';
import { Toolbar, Toggle, Readouts, Explanation, useReadouts, f } from './core/ui';
import { COLORS, Trail, Sparks, arrow, glowDot, text } from './core/draw';

// Simulación orbital: el jugador arrastra el planeta para lanzarlo y ve la trayectoria prevista.
// El movimiento se integra en tiempo real (leapfrog) -> trayectorias suaves y energéticamente estables.
const W = 400;
const H = 260;
const SUN = { x: 200, y: 130 };
const START = { x: 310, y: 130 };
const K = 9000; // intensidad de la atracción (unidades ilustrativas)
const DRAG_SCALE = 0.06; // velocidad que aporta cada píxel de arrastre
const MAX_DRAG = 220;
const TIME_SCALE = 15; // tiempo simulado por segundo real
const STEP = 0.05;
const STARS = [[40, 30], [90, 210], [160, 40], [330, 60], [370, 200], [60, 120], [280, 230], [350, 110], [120, 240], [240, 28], [20, 190], [310, 15], [190, 245], [385, 140]];
const PRESETS = [
  { id: 'circ', label: 'Órbita circular', v: { x: 0, y: -9.05 } },
  { id: 'elip', label: 'Órbita elíptica', v: { x: 0, y: -6.2 } },
  { id: 'rapido', label: 'Lanzamiento rápido', v: { x: 0, y: -13 } },
  { id: 'reposo', label: 'Soltar desde reposo', v: { x: 0, y: 0 } }
];

function accel(p, gravity) {
  if (!gravity) return { x: 0, y: 0 };
  const dx = SUN.x - p.x;
  const dy = SUN.y - p.y;
  const r2 = dx * dx + dy * dy;
  const k = K / (r2 * Math.sqrt(r2));
  return { x: dx * k, y: dy * k };
}

function stepOnce(s, gravity, dt) {
  let a = accel(s.p, gravity);
  s.v.x += (a.x * dt) / 2;
  s.v.y += (a.y * dt) / 2;
  s.p.x += s.v.x * dt;
  s.p.y += s.v.y * dt;
  a = accel(s.p, gravity);
  s.v.x += (a.x * dt) / 2;
  s.v.y += (a.y * dt) / 2;
}

function classify(p) {
  const r = Math.hypot(p.x - SUN.x, p.y - SUN.y);
  if (r < 17) return 'sol';
  if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) return 'escape';
  return null;
}

function simulatePreview(v0, gravity, steps = 2400) {
  const s = { p: { ...START }, v: { ...v0 } };
  const pts = [{ ...s.p }];
  for (let i = 0; i < steps; i++) {
    stepOnce(s, gravity, STEP);
    if (i % 6 === 0) pts.push({ ...s.p });
    if (classify(s.p)) break;
  }
  return pts;
}

function velocityFromDrag(pt) {
  let dx = pt.x - START.x;
  let dy = pt.y - START.y;
  const len = Math.hypot(dx, dy);
  if (len > MAX_DRAG) {
    dx *= MAX_DRAG / len;
    dy *= MAX_DRAG / len;
  }
  return { x: dx * DRAG_SCALE, y: dy * DRAG_SCALE };
}

const freshState = () => ({ p: { ...START }, v: { x: 0, y: 0 }, launched: false, status: null });

export default function OrbitSimulation() {
  const [gravity, setGravity] = useState(true);
  const [running, setRunning] = useState(true);
  const [msg, setMsg] = useState('Arrastra el planeta para lanzarlo. La flecha muestra la dirección y la rapidez de la velocidad inicial.');
  const [read, pushRead] = useReadouts({ r: 0, v: 0, e: null, kind: '—' });

  const S = useRef(freshState());
  const trail = useRef(new Trail(500));
  const sparks = useRef(new Sparks());
  const aim = useRef(null);
  const preview = useRef(null);
  const P = useRef({});
  P.current = { gravity, running };
  const lastMsg = useRef('');

  const say = (m) => {
    if (m !== lastMsg.current) {
      lastMsg.current = m;
      setMsg(m);
    }
  };

  const launch = (v) => {
    aim.current = null;
    preview.current = null;
    trail.current.clear();
    S.current = { p: { ...START }, v: { ...v }, launched: true, status: null };
    setRunning(true);
    say('Recorrido en curso…');
  };

  const reset = () => {
    aim.current = null;
    preview.current = null;
    trail.current.clear();
    S.current = freshState();
    say('Arrastra el planeta para lanzarlo. La flecha muestra la dirección y la rapidez de la velocidad inicial.');
    pushRead({ r: 0, v: 0, e: null, kind: '—' }, true);
  };

  const toggleGravity = () => {
    setGravity((g) => !g);
    reset();
  };

  const updatePreview = (pt) => {
    aim.current = pt;
    preview.current = simulatePreview(velocityFromDrag(pt), P.current.gravity);
  };

  const frame = (ctx, dt, t) => {
    const { gravity: g, running: run } = P.current;
    const s = S.current;

    if (s.launched && !s.status && run) {
      let remaining = dt * TIME_SCALE;
      while (remaining > 1e-9 && !s.status) {
        const h = Math.min(STEP, remaining);
        stepOnce(s, g, h);
        remaining -= h;
        s.status = classify(s.p);
      }
      trail.current.push(s.p.x, s.p.y);
      if (s.status === 'sol') {
        sparks.current.burst(s.p.x, s.p.y, 28, COLORS.gold, 70);
        say('Colisión con el Sol: la atracción gravitatoria venció a la velocidad lateral.');
      } else if (s.status === 'escape') {
        say(
          g
            ? 'Escapó del campo gravitatorio: la velocidad superó la necesaria para quedar ligado al Sol.'
            : 'Se alejó en línea recta: sin fuerza neta, mantiene su movimiento (1.ª ley de Newton).'
        );
      }
    }
    sparks.current.update(dt);

    // ----- dibujo -----
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);
    STARS.forEach(([x, y], i) => {
      ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t * (0.8 + (i % 4) * 0.3) + i);
      ctx.fillStyle = COLORS.star;
      ctx.beginPath();
      ctx.arc(x, y, i % 3 === 0 ? 1.4 : 0.9, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (g) {
      ctx.strokeStyle = 'rgba(77,238,234,0.28)';
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.arc(SUN.x, SUN.y, 110, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const pulse = 1 + Math.sin(t * 2) * 0.05;
    const glow = ctx.createRadialGradient(SUN.x, SUN.y, 0, SUN.x, SUN.y, 62 * pulse);
    glow.addColorStop(0, 'rgba(255,209,102,0.6)');
    glow.addColorStop(1, 'rgba(255,209,102,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(SUN.x, SUN.y, 62 * pulse, 0, Math.PI * 2);
    ctx.fill();
    glowDot(ctx, SUN.x, SUN.y, 14, COLORS.gold, 20);
    text(ctx, 'SOL', SUN.x, SUN.y + 34, { color: COLORS.gold, size: 10, align: 'center' });

    if (preview.current) {
      ctx.strokeStyle = 'rgba(255,209,102,0.6)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      preview.current.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    trail.current.draw(ctx, COLORS.violet, 2);

    if (aim.current) {
      const a = aim.current;
      arrow(ctx, START.x, START.y, a.x, a.y, COLORS.gold, 2, 9);
    }

    sparks.current.draw(ctx);

    if (s.status !== 'sol') {
      glowDot(ctx, s.p.x, s.p.y, 6, COLORS.violet, 14);
      if (s.launched && !s.status) {
        arrow(ctx, s.p.x, s.p.y, s.p.x + s.v.x * 5, s.p.y + s.v.y * 5, COLORS.cyan, 1.5, 6);
      }
    }

    // lecturas
    if (s.launched) {
      const rx = s.p.x - SUN.x;
      const ry = s.p.y - SUN.y;
      const r = Math.hypot(rx, ry);
      const v = Math.hypot(s.v.x, s.v.y);
      let e = null;
      let kind = g ? 'ligada' : 'recta';
      if (g) {
        const E = (v * v) / 2 - K / r;
        const h = rx * s.v.y - ry * s.v.x;
        e = Math.sqrt(Math.max(0, 1 + (2 * E * h * h) / (K * K)));
        kind = s.status === 'sol' ? 'impacto' : E >= 0 ? 'escape' : e < 0.08 ? 'circular' : 'elíptica';
        if (!s.status && run) say(E >= 0 ? 'Trayectoria abierta: la velocidad supera la de escape.' : 'Órbita sostenida: la gravedad curva la trayectoria sin frenar ni detener el planeta.');
      } else if (v < 0.01 && !s.status) {
        kind = 'reposo';
        say('Sin fuerza ni velocidad lateral: el planeta permanece en reposo.');
      }
      pushRead({ r, v, e, kind });
    }
  };

  const onDown = (pt) => {
    trail.current.clear();
    S.current = freshState();
    updatePreview(pt);
    say('Suelta para lanzar. La línea punteada es la trayectoria prevista.');
  };
  const onMove = (pt) => {
    if (aim.current) updatePreview(pt);
  };
  const onUp = (pt) => {
    if (!aim.current) return;
    const v = velocityFromDrag(pt);
    if (Math.hypot(v.x, v.y) < 0.5) {
      aim.current = null;
      preview.current = null;
      reset();
      return;
    }
    launch(v);
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <SimCanvas
        width={W}
        height={H}
        onFrame={frame}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        cursor="crosshair"
        className="border border-[#9B72CF]/30"
        label="Simulación de un planeta alrededor del Sol. Arrastra el planeta para lanzarlo."
      />

      <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-[#CBD5E1]">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#FFD166] inline-block" /> Velocidad inicial (arrastre)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#9B72CF] inline-block" /> Trayectoria real
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 border-t border-dashed border-[#FFD166] inline-block" /> Predicción
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#4DEEEA] inline-block" /> Velocidad instantánea
        </span>
      </div>

      <Readouts
        items={[
          { label: 'Distancia al Sol', value: f(read.r, 0), unit: 'u' },
          { label: 'Rapidez', value: f(read.v, 1), unit: 'u/t' },
          { label: 'Excentricidad', value: read.e == null ? '—' : f(read.e, 2) },
          { label: 'Tipo', value: read.kind }
        ]}
      />

      <p
        role="status"
        aria-live="polite"
        className="font-mono text-xs sm:text-sm text-[#FFD166] bg-[#07111F]/80 border border-[#FFD166]/30 rounded-lg px-3.5 py-2.5 min-h-[44px]"
      >
        {msg}
      </p>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((pr) => (
          <button
            key={pr.id}
            onClick={() => launch(pr.v)}
            className="px-3 py-2 rounded-lg bg-[#102A43] border border-[#F2F5F7]/15 hover:border-[#4DEEEA] text-[#F2F5F7] font-display font-semibold text-xs sm:text-sm"
          >
            {pr.label}
          </button>
        ))}
      </div>

      <Toolbar running={running} onToggle={() => setRunning(!running)} onReset={reset}>
        <Toggle active={gravity} accent="#9B72CF" onClick={toggleGravity}>
          {gravity ? 'Desactivar gravedad' : 'Restaurar gravedad'}
        </Toggle>
      </Toolbar>

      <p className="font-mono text-xs text-[#94A3B8] leading-relaxed bg-[#07111F]/60 p-3.5 rounded-xl border border-[#F2F5F7]/10">
        <strong className="text-[#9B72CF]">NOTA DE MODELO:</strong> Las distancias y velocidades son ilustrativas. La inercia mantiene el avance; la gravedad curva la trayectoria.
      </p>

      <Explanation title="¿Qué pasaría si...?" accent="#9B72CF">
        La pregunta parte de una intuición comprensible: solemos asociar el movimiento con alguien que empuja. Sin embargo, la física distingue entre mantener un movimiento y cambiarlo. Según la{' '}
        <strong className="text-[#FFD166]">primera ley de Newton</strong>, un cuerpo no necesita una fuerza neta para continuar moviéndose con velocidad constante. Las fuerzas producen cambios en su velocidad o dirección: si la gravedad desapareciera, el planeta saldría disparado en línea recta tangencial.
        <span className="block mt-3 text-[#CBD5E1]">
          Prueba a lanzar el planeta con distintas velocidades y compara: ¿qué ocurre si la velocidad es menor, mayor o nula?
        </span>
      </Explanation>
    </div>
  );
}
