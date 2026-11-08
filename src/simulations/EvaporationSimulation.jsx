import React, { useRef, useState } from 'react';
import { Wind, Eye, Thermometer } from 'lucide-react';
import SimCanvas from './core/SimCanvas';
import { Slider, Toolbar, Toggle, Readouts, Explanation, useReadouts, f } from './core/ui';
import { COLORS, clamp, damp, fillBackground, text } from './core/draw';

const W = 640;
const H = 360;
const GROUND = 300;
const CX = 330;

const newState = () => ({
  level: 1,
  time: 0,
  acc: 0,
  parts: [],
  streaks: Array.from({ length: 5 }, (_, i) => ({ x: Math.random() * W, y: 70 + i * 48, speed: 140 + Math.random() * 90 })),
  sunR: 30,
  wind: 0
});

function drawWaterMolecule(ctx, x, y, rot, size, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#9fdcff';
  const hx = Math.sin((104.5 / 2) * (Math.PI / 180)) * size * 1.5;
  const hy = Math.cos((104.5 / 2) * (Math.PI / 180)) * size * 1.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-hx, hy);
  ctx.moveTo(0, 0);
  ctx.lineTo(hx, hy);
  ctx.stroke();
  ctx.fillStyle = COLORS.cyan;
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-hx, hy, size * 0.55, 0, Math.PI * 2);
  ctx.arc(hx, hy, size * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export default function EvaporationSimulation() {
  const [running, setRunning] = useState(true);
  const [temp, setTemp] = useState(50);
  const [wind, setWind] = useState(false);
  const [molecular, setMolecular] = useState(false);
  const [humidity, setHumidity] = useState(30);
  const [read, pushRead] = useReadouts({ level: 100, rate: 0, time: 0 });

  const P = useRef({});
  P.current = { running, temp, wind, molecular, humidity };
  const S = useRef(newState());

  const reset = () => {
    S.current = newState();
    pushRead({ level: 100, rate: 0, time: 0 }, true);
  };

  const frame = (ctx, dt, t) => {
    const p = P.current;
    const s = S.current;
    const windTarget = p.wind ? 1 : 0;
    s.wind = damp(s.wind, windTarget, 3, dt);
    s.sunR = damp(s.sunR, 20 + p.temp * 0.32, 4, dt);

    const rate = Math.pow(p.temp / 100, 1.5) * 30 * (1 + 0.6 * s.wind) * (1 - p.humidity / 110);

    if (p.running && s.level > 0) {
      s.time += dt;
      s.acc += rate * dt;
      const rx = 50 + 190 * Math.sqrt(s.level);
      while (s.acc >= 1) {
        s.acc -= 1;
        s.level = Math.max(0, s.level - 0.0024);
        const a = Math.random() * Math.PI * 2;
        s.parts.push({
          x: CX + Math.cos(a) * Math.random() * rx * 0.85,
          y: GROUND - 6 + Math.sin(a) * 4,
          vx: (Math.random() - 0.5) * 24,
          vy: -(28 + Math.random() * 42) * (0.55 + p.temp / 110),
          life: 0,
          max: 2.6 + Math.random() * 1.8,
          r: 2 + Math.random() * 2.5,
          rot: Math.random() * 6,
          spin: (Math.random() - 0.5) * 3,
          phase: Math.random() * 6
        });
      }
      if (s.level === 0) s.parts.length += 0;
    }

    // Partículas de vapor: ascenso continuo con deriva lateral suave (viento) y desvanecimiento.
    for (const q of s.parts) {
      q.life += dt;
      q.vx = damp(q.vx, s.wind * 85 + Math.sin(t * 1.5 + q.phase) * 10, 1.4, dt);
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.vy *= 1 - 0.18 * dt;
      q.rot += q.spin * dt;
    }
    s.parts = s.parts.filter((q) => q.life < q.max && q.x < W + 20);

    // ----- dibujo -----
    fillBackground(ctx, W, H, '#0E2A47', '#07111F');

    // sol
    const sx = 70;
    const sy = 62;
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.sunR * 3.2);
    glow.addColorStop(0, 'rgba(255,209,102,0.55)');
    glow.addColorStop(1, 'rgba(255,209,102,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 260, 220);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(t * 0.25);
    ctx.strokeStyle = 'rgba(255,209,102,0.55)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      ctx.rotate(Math.PI / 6);
      ctx.beginPath();
      ctx.moveTo(s.sunR + 4, 0);
      ctx.lineTo(s.sunR + 8 + (p.temp / 100) * 12 + Math.sin(t * 3 + i) * 2, 0);
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = COLORS.gold;
    ctx.beginPath();
    ctx.arc(sx, sy, s.sunR, 0, Math.PI * 2);
    ctx.fill();

    // viento
    if (s.wind > 0.02) {
      ctx.save();
      ctx.lineCap = 'round';
      for (const k of s.streaks) {
        k.x += k.speed * dt * (0.4 + s.wind);
        if (k.x > W + 80) k.x = -80;
        ctx.globalAlpha = 0.45 * s.wind;
        const g = ctx.createLinearGradient(k.x - 70, 0, k.x, 0);
        g.addColorStop(0, 'rgba(77,238,234,0)');
        g.addColorStop(1, 'rgba(77,238,234,0.9)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(k.x - 70, k.y + Math.sin(t * 2 + k.y) * 3);
        ctx.lineTo(k.x, k.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // suelo
    ctx.fillStyle = '#0B1D30';
    ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = 'rgba(77,238,234,0.08)';
    ctx.fillRect(0, GROUND, W, 2);

    // charco
    const rx = 50 + 190 * Math.sqrt(s.level);
    const ry = 8 + 26 * Math.sqrt(s.level);
    if (s.level > 0.002) {
      const wg = ctx.createLinearGradient(CX - rx, 0, CX + rx, 0);
      wg.addColorStop(0, 'rgba(77,238,234,0.35)');
      wg.addColorStop(0.5, 'rgba(77,238,234,0.85)');
      wg.addColorStop(1, 'rgba(77,238,234,0.35)');
      ctx.fillStyle = wg;
      ctx.beginPath();
      ctx.ellipse(CX, GROUND + 18, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      // ondulaciones
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.5 + i / 3) % 1;
        ctx.globalAlpha = 1 - ph;
        ctx.beginPath();
        ctx.ellipse(CX + Math.sin(i * 2.4) * rx * 0.3, GROUND + 18, rx * 0.5 * ph + 6, ry * 0.5 * ph + 1, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (p.molecular) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(CX, GROUND + 18, rx, ry, 0, 0, Math.PI * 2);
        ctx.clip();
        for (let i = 0; i < 26; i++) {
          const a = i * 2.399;
          const rr = Math.sqrt((i + 0.5) / 26);
          const mx = CX + Math.cos(a) * rx * 0.85 * rr + Math.sin(t * (2 + (i % 3)) + i) * (1 + p.temp / 40);
          const my = GROUND + 18 + Math.sin(a) * ry * 0.8 * rr + Math.cos(t * (2.4 + (i % 4)) + i) * (0.6 + p.temp / 70);
          drawWaterMolecule(ctx, mx, my, t * 0.5 + i, 2.6, 0.9);
        }
        ctx.restore();
      }
    } else {
      ctx.strokeStyle = 'rgba(148,163,184,0.35)';
      ctx.beginPath();
      ctx.ellipse(CX, GROUND + 18, 38, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
      text(ctx, 'charco seco', CX, GROUND + 46, { align: 'center', size: 11 });
    }

    // vapor
    for (const q of s.parts) {
      const k = q.life / q.max;
      const alpha = Math.min(1, q.life * 3) * (1 - k) * 0.9;
      if (p.molecular) {
        drawWaterMolecule(ctx, q.x, q.y, q.rot, 3.4, alpha);
      } else {
        const rr = q.r * (1 + k * 2.2);
        const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, rr * 2.4);
        g.addColorStop(0, `rgba(190,245,255,${alpha * 0.7})`);
        g.addColorStop(1, 'rgba(190,245,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(q.x, q.y, rr * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    text(ctx, `VOL ${Math.round(s.level * 100)}%  ·  T ${p.temp}°C${p.wind ? '  ·  VIENTO' : ''}`, W - 14, 24, {
      align: 'right',
      color: '#CBD5E1',
      size: 12
    });

    pushRead({ level: Math.round(s.level * 100), rate: p.running && s.level > 0 ? rate : 0, time: s.time });
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <SimCanvas width={W} height={H} onFrame={frame} label="Charco que se evapora bajo el Sol" />
      <Readouts
        items={[
          { label: 'Volumen', value: read.level, unit: '%' },
          { label: 'Temperatura', value: temp, unit: '°C' },
          { label: 'Evaporación', value: f(read.rate, 1), unit: 'mol./s' },
          { label: 'Tiempo', value: f(read.time, 1), unit: 's' }
        ]}
      />
      <Toolbar running={running} onToggle={() => setRunning(!running)} onReset={reset}>
        <Toggle active={wind} onClick={() => setWind(!wind)}>
          <Wind size={15} /> {wind ? 'Con viento' : 'Sin viento'}
        </Toggle>
        <Toggle active={molecular} accent="#9B72CF" onClick={() => setMolecular(!molecular)}>
          <Eye size={15} /> Vista molecular
        </Toggle>
      </Toolbar>
      <div className="grid sm:grid-cols-2 gap-3">
        <Slider label="Temperatura / energía del entorno" unit="°C" value={temp} min={10} max={100} onChange={setTemp} />
        <Slider label="Humedad del aire" unit="%" value={humidity} min={0} max={90} onChange={setHumidity} color="#4DEEEA" />
      </div>
      <Explanation>
        <p>
          El agua no desaparece: una parte pasa del estado líquido al gaseoso mediante la{' '}
          <strong className="text-[#4DEEEA]">evaporación</strong>. Las moléculas de agua pueden escapar desde la superficie cuando tienen suficiente energía. La temperatura, la humedad del aire, el viento y el área expuesta influyen en la rapidez del proceso.
        </p>
        <p className="font-mono text-[11px] text-[#FFD166]">
          Para reflexionar: Si el agua se transforma en vapor y se mezcla con el aire, ¿por qué no podemos verla aunque siga formando parte de nuestro entorno?
        </p>
      </Explanation>
    </div>
  );
}
