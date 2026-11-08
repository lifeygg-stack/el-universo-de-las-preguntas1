import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, HelpCircle } from 'lucide-react';

export function Slider({ label, unit = '', value, min, max, step = 1, onChange, color = '#FFD166', format }) {
  const shown = format ? format(value) : value;
  return (
    <div className="bg-[#07111F]/60 p-3 rounded-xl border border-[#F2F5F7]/10">
      <label className="font-mono text-xs text-[#CBD5E1] flex justify-between mb-1.5 gap-2">
        <span style={{ color }}>{label}</span>
        <span>
          {shown} {unit}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: color }}
      />
    </div>
  );
}

export function Toolbar({ running, onToggle, onReset, playLabel = 'Reproducir', children }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {onToggle && (
        <button
          onClick={onToggle}
          className="px-4 py-2.5 bg-[#4DEEEA] text-[#07111F] font-display font-bold text-xs sm:text-sm rounded-lg hover:bg-[#3bc2be] flex items-center gap-1.5"
        >
          {running ? <Pause size={15} /> : <Play size={15} />}
          {running ? 'Pausar' : playLabel}
        </button>
      )}
      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2.5 bg-[#102A43] border border-[#F2F5F7]/15 rounded-lg hover:border-[#4DEEEA] text-[#F2F5F7] font-display font-medium text-xs sm:text-sm flex items-center gap-1.5"
        >
          <RotateCcw size={15} /> Reiniciar
        </button>
      )}
      {children}
    </div>
  );
}

export function Toggle({ active, onClick, children, accent = '#4DEEEA' }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="px-3.5 py-2.5 rounded-lg border font-display font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
      style={
        active
          ? { background: `${accent}26`, borderColor: accent, color: '#F2F5F7' }
          : { background: '#102A4399', borderColor: '#F2F5F726', color: '#CBD5E1' }
      }
    >
      {children}
    </button>
  );
}

export function Readouts({ items }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {items.map((it) => (
        <div key={it.label} className="bg-[#07111F]/70 border border-[#4DEEEA]/15 rounded-lg px-3 py-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">{it.label}</div>
          <div className="font-mono text-sm sm:text-base text-[#4DEEEA] tabular-nums">
            {it.value}
            {it.unit && <span className="text-[#94A3B8] text-xs ml-1">{it.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Explanation({ title = '¿Qué está pasando?', children, accent = '#4DEEEA' }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="font-display font-semibold text-sm flex items-center gap-1.5 hover:underline"
        style={{ color: accent }}
      >
        <HelpCircle size={16} /> {open ? 'Ocultar explicación' : title}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="scientific-explanation-box p-4 mt-3 text-xs sm:text-sm text-[#E2E8F0] leading-relaxed space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Estado de lecturas (cifras en pantalla) que se actualiza como máximo ~8 veces por segundo,
 * para que el panel numérico no obligue a React a repintar en cada fotograma de la animación.
 */
export function useReadouts(initial = {}, intervalMs = 120) {
  const [values, setValues] = useState(initial);
  const lastRef = useRef(0);
  const push = (obj, force = false) => {
    const now = performance.now();
    if (force || now - lastRef.current > intervalMs) {
      lastRef.current = now;
      setValues(obj);
    }
  };
  return [values, push];
}

export const f = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '—');

export const GRAVITIES = [
  { label: 'Luna', g: 1.62 },
  { label: 'Marte', g: 3.71 },
  { label: 'Tierra', g: 9.81 },
  { label: 'Júpiter', g: 24.8 }
];

export function GravityPresets({ g, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-wider text-[#94A3B8]">Gravedad:</span>
      {GRAVITIES.map((p) => (
        <button
          key={p.label}
          onClick={() => onChange(p.g)}
          className={`px-2.5 py-1.5 rounded-md border font-mono text-[11px] transition-colors ${
            Math.abs(g - p.g) < 0.05
              ? 'bg-[#4DEEEA]/20 border-[#4DEEEA] text-[#F2F5F7]'
              : 'bg-[#102A43]/60 border-[#F2F5F7]/15 text-[#CBD5E1] hover:border-[#4DEEEA]'
          }`}
        >
          {p.label} · {p.g}
        </button>
      ))}
    </div>
  );
}
