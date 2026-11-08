import React from 'react';
import { ArrowLeft, FlaskConical } from 'lucide-react';

const CHAPTERS = [
  { href: '#cap1', code: '01', label: 'Didáctica' },
  { href: '#cap2', code: '02', label: 'Caramelo' },
  { href: '#cap3', code: '03', label: 'Preguntas' },
  { href: '#cap4', code: '04', label: 'Visiones' },
  { href: '#cap5', code: '05', label: 'Salidas' },
  { href: '#cap6', code: '06', label: 'Sin Respuesta' }
];

export default function Navbar({ route }) {
  const onSims = route === 'simuladores';
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed top-1 left-0 right-0 z-40 bg-[#07111F]/85 backdrop-blur-xl border-b border-[#F2F5F7]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between overflow-x-auto whitespace-nowrap hide-scrollbar gap-6">
        <a
          href={onSims ? '#/' : '#hero'}
          className="font-display font-bold text-sm sm:text-base tracking-tight text-[#F2F5F7] flex items-center gap-2.5 shrink-0 group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#4DEEEA] shadow-[0_0_10px_#4DEEEA] group-hover:scale-125 transition-transform" />
          <span>EL UNIVERSO DE LAS PREGUNTAS</span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          {onSims ? (
            <a
              href="#/"
              className="px-3 py-1.5 rounded-full text-[#CBD5E1] hover:text-[#4DEEEA] hover:bg-[#102A43]/60 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> <span className="font-medium">Volver a la historia</span>
            </a>
          ) : (
            CHAPTERS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-full text-[#CBD5E1] hover:text-[#4DEEEA] hover:bg-[#102A43]/60 transition-all flex items-center gap-1.5"
              >
                <span className="font-mono text-[11px] text-[#4DEEEA]/70">{item.code}</span>
                <span className="font-medium">{item.label}</span>
              </a>
            ))
          )}
          <a
            href="#/simuladores"
            aria-current={onSims ? 'page' : undefined}
            className={`px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1.5 border transition-all ${
              onSims
                ? 'bg-[#4DEEEA] text-[#07111F] border-[#4DEEEA]'
                : 'text-[#FFD166] border-[#FFD166]/40 hover:bg-[#FFD166]/10'
            }`}
          >
            <FlaskConical size={14} /> Simuladores
          </a>
        </div>
      </div>
    </nav>
  );
}