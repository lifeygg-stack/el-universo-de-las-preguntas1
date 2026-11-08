import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, ArrowLeft } from 'lucide-react';
import { CATEGORIES, SIMULATORS } from '../simulations/registry';

function SimCard({ sim, index }) {
  const { Component, icon: Icon, accent } = sim;
  return (
    <motion.article
      id={sim.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="simulation-frame p-5 sm:p-8 scroll-mt-28"
    >
      <header className="flex items-start justify-between gap-4 border-b border-[#F2F5F7]/10 pb-4 mb-5">
        <div>
          <span className="type-label block mb-1" style={{ color: accent }}>
            SIMULADOR {String(index + 1).padStart(2, '0')} · {sim.category.toUpperCase()}
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F2F5F7]">{sim.title}</h2>
        </div>
        <span className="p-2.5 rounded-xl border shrink-0" style={{ color: accent, borderColor: `${accent}55`, background: `${accent}18` }}>
          <Icon size={22} />
        </span>
      </header>
      <p className="font-mono text-xs sm:text-sm text-[#FFD166] mb-5 bg-[#07111F]/80 px-4 py-2.5 rounded-lg border border-[#FFD166]/20">
        Pregunta: {sim.question}
      </p>
      <Component />
    </motion.article>
  );
}

export default function SimulatorsPage() {
  const [category, setCategory] = useState('Todos');

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const list = useMemo(
    () => SIMULATORS.filter((s) => category === 'Todos' || s.category === category),
    [category]
  );

  return (
    <main className="relative pt-28 pb-24 px-4 sm:px-6 cosmic-grid-bg min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <a href="#/" className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#4DEEEA] mb-6">
            <ArrowLeft size={16} /> Volver a la historia
          </a>
          <span className="type-label text-[#4DEEEA] bg-[#102A43]/90 border border-[#4DEEEA]/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 mb-5">
            <FlaskConical size={13} /> Laboratorio de Física Interactivo
          </span>
          <h1 className="type-hero mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#F2F5F7] via-[#4DEEEA] to-[#9B72CF]">
            Simuladores de física
          </h1>
          <p className="type-lead">
            {SIMULATORS.length} simuladores para experimentar con la mecánica, las ondas, la luz, la electricidad y la gravedad. Mueve los controles, arrastra los objetos y comprueba tus hipótesis.
          </p>
        </header>

        <div role="tablist" aria-label="Categorías" className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full border font-display text-sm font-semibold transition-colors ${
                category === c
                  ? 'bg-[#4DEEEA] text-[#07111F] border-[#4DEEEA]'
                  : 'bg-[#102A43]/60 text-[#CBD5E1] border-[#F2F5F7]/15 hover:border-[#4DEEEA]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <nav aria-label="Índice de simuladores" className="flex flex-wrap gap-2 mb-12">
          {list.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#CBD5E1] bg-[#07111F]/70 border border-[#F2F5F7]/10 hover:text-[#4DEEEA] hover:border-[#4DEEEA]/50"
            >
              {s.title}
            </a>
          ))}
        </nav>

        <div className="grid gap-10">
          {list.map((s, i) => (
            <SimCard key={s.id} sim={s} index={SIMULATORS.indexOf(s)} />
          ))}
        </div>
      </div>
    </main>
  );
}
