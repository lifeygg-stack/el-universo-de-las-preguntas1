import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, Play, Pause, Thermometer, Wind, X, Save, Edit3,
  Image as ImageIcon, ChevronRight, Zap, Droplets, RotateCcw, Sparkles, Compass,
  Atom, Eye, HelpCircle, FlaskConical, MessageSquareQuote, Download
} from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import EditorialPullQuote from '../components/EditorialPullQuote';
import FAQItem from '../components/FAQItem';
import InteractivePoint from '../components/InteractivePoint';

export default function Chapter4() {
  const [selectedVision, setSelectedVision] = useState(null);

  const visions = [
    {
      id: 'pos',
      code: 'ENFOQUE A',
      name: 'Visión positivista',
      color: '#4DEEEA',
      cx: '23%',
      cy: '24%',
      keyword: 'Observación · Evidencia · Medición',
      def: 'El conocimiento científico se apoya en la observación, la medición, la evidencia empírica y la búsqueda de regularidades.',
      ej: 'Medir la temperatura del agua y registrar cómo cambia durante el calentamiento.',
      matiz:
        'La ciencia contemporánea no se reduce a acumular observaciones; también utiliza modelos, teorías e interpretaciones.',
      charco: 'Mide cuánto desciende el nivel del charco cada hora y registra la temperatura ambiental.'
    },
    {
      id: 'rac',
      code: 'ENFOQUE B',
      name: 'Visión racionalista',
      color: '#FFD166',
      cx: '77%',
      cy: '24%',
      keyword: 'Razón · Lógica · Modelos',
      def: 'El razonamiento, la lógica, las hipótesis y la construcción de modelos son fundamentales para producir y evaluar conocimiento científico.',
      ej: 'Construir un modelo matemático para explicar el movimiento de los planetas y contrastar sus predicciones.',
      matiz:
        'El razonamiento científico necesita dialogar con la evidencia y no se limita a deducir conclusiones sin contrastarlas.',
      charco: 'Formula un modelo cinético-molecular que relacione la energía media de las partículas con su escape al aire.'
    },
    {
      id: 'con',
      code: 'ENFOQUE C',
      name: 'Visión constructivista',
      color: '#9B72CF',
      cx: '23%',
      cy: '76%',
      keyword: 'Ideas previas · Reorganización',
      def: 'El conocimiento se construye mediante la actividad del sujeto, la interpretación de la experiencia y la reorganización de sus ideas previas.',
      ej: 'Reorganizar la idea inicial de que el agua "desaparece" al comprender el cambio de estado por evaporación.',
      matiz:
        'Construir conocimiento no significa que cualquier explicación sea igualmente válida; las ideas deben contrastarse y justificarse.',
      charco: 'Cuestiona la intuición de que el agua "se esfumó de la nada" y transforma ese esquema mental.'
    },
    {
      id: 'soc',
      code: 'ENFOQUE D',
      name: 'Visión constructivista social',
      color: '#F2F5F7',
      cx: '77%',
      cy: '76%',
      keyword: 'Comunidad · Diálogo · Contexto',
      def: 'El conocimiento se construye y transforma también mediante la interacción social, el lenguaje, la argumentación y las prácticas compartidas.',
      ej: 'Un grupo universitario debate qué mueve los planetas, contrasta explicaciones y construye consenso fundamentado.',
      matiz:
        'El consenso social por sí solo no garantiza que una afirmación sea verdadera; se requieren evidencias y métodos.',
      charco: 'Contrasta en grupo distintas hipótesis sobre adónde fue el agua (infiltración vs. evaporación) argumentando con pruebas.'
    }
  ];

  return (
    <section
      id="cap4"
      className="py-28 px-4 sm:px-6 max-w-7xl mx-auto"
      style={{
        background:
          'radial-gradient(ellipse at top, rgba(16,42,67,0.38) 0%, rgba(7,17,31,0) 70%)'
      }}
    >
      <SectionTitle
        chapter="IV"
        domain="Epistemología de la Ciencia"
        title="Las visiones de la ciencia"
        subtitle="¿La ciencia descubre, construye o transforma nuestra manera de entender el mundo?"
      />

      <div className="grid lg:grid-cols-12 gap-8 mt-14 items-stretch">
        {/* Mapa Conceptual Simétrico sin colisiones */}
        <div className="lg:col-span-7 simulation-frame relative h-[460px] sm:h-[520px] overflow-hidden p-4">
          <div className="absolute top-4 left-5 z-20 flex items-center justify-between right-5">
            <span className="type-label text-[#94A3B8] text-[10px]">
              FIG 4.1 · RED EPISTEMOLÓGICA INTERACTIVA
            </span>
            {selectedVision && (
              <button
                onClick={() => setSelectedVision(null)}
                className="font-mono text-xs text-[#4DEEEA] hover:underline flex items-center gap-1"
              >
                <RotateCcw size={12} /> Restablecer mapa
              </button>
            )}
          </div>

          {/* Líneas conectoras SVG exactas al centro de cada nodo */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {visions.map((v) => {
              const isSelected = selectedVision?.id === v.id;
              return (
                <line
                  key={`line-${v.id}`}
                  x1="50%"
                  y1="50%"
                  x2={v.cx}
                  y2={v.cy}
                  stroke={isSelected ? v.color : 'rgba(242, 245, 247, 0.18)'}
                  strokeWidth={isSelected ? '3' : '1.5'}
                  strokeDasharray={isSelected ? 'none' : '6,6'}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Nodo Central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#102A43] border-2 border-[#F2F5F7] w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center text-center z-10 shadow-[0_0_40px_rgba(7,17,31,0.9)] p-3">
            <span className="font-mono text-[10px] text-[#4DEEEA] uppercase tracking-widest mb-1">
              Eje Central
            </span>
            <span className="font-display font-bold text-sm sm:text-base text-[#F2F5F7] leading-tight">
              Visiones de la Ciencia
            </span>
          </div>

          {/* Nodos Periféricos Centrados en (cx, cy) */}
          {visions.map((v) => {
            const isSelected = selectedVision?.id === v.id;
            return (
              <motion.button
                key={v.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedVision(v)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-[40%] max-w-[215px] rounded-xl border-2 p-3 sm:p-4 text-left z-10 transition-all backdrop-blur-md ${
                  isSelected
                    ? 'bg-[#07111F] text-white shadow-[0_0_25px_rgba(77,238,234,0.25)]'
                    : 'bg-[#07111F]/85 text-[#CBD5E1] hover:bg-[#102A43]/90'
                }`}
                style={{
                  left: v.cx,
                  top: v.cy,
                  borderColor: isSelected ? v.color : `${v.color}55`
                }}
              >
                <span className="font-mono text-[10px] block mb-0.5" style={{ color: v.color }}>
                  {v.code}
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#F2F5F7] block leading-snug">
                  {v.name}
                </span>
                <span className="font-mono text-[10px] text-[#94A3B8] mt-1 block truncate">
                  {v.keyword}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Panel Editorial de Detalles Epistemológicos */}
        <div className="lg:col-span-5 flex flex-col">
          <AnimatePresence mode="wait">
            {selectedVision ? (
              <motion.div
                key={selectedVision.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="glass-card p-6 sm:p-8 h-full flex flex-col border-t-4"
                style={{ borderTopColor: selectedVision.color }}
              >
                <div className="flex justify-between items-start mb-5 pb-4 border-b border-[#F2F5F7]/10">
                  <div>
                    <span
                      className="type-label block mb-1"
                      style={{ color: selectedVision.color }}
                    >
                      {selectedVision.code} · {selectedVision.keyword}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F2F5F7]">
                      {selectedVision.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedVision(null)}
                    className="text-[#94A3B8] hover:text-white p-1"
                    aria-label="Cerrar visión"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="type-body text-[#F2F5F7] mb-6">{selectedVision.def}</p>

                <div
                  className="bg-[#07111F]/80 p-4 rounded-xl mb-5 border-l-4"
                  style={{ borderLeftColor: selectedVision.color }}
                >
                  <span className="type-label text-[10px] text-[#94A3B8] block mb-1">
                    Ejemplo en Práctica Científica
                  </span>
                  <p className="text-sm text-[#E2E8F0] leading-relaxed">{selectedVision.ej}</p>
                </div>

                <div className="mt-auto bg-[#FFD166]/10 p-4 rounded-xl text-sm text-[#F2F5F7] border border-[#FFD166]/30">
                  <span className="type-label text-[10px] text-[#FFD166] block mb-1">
                    Matiz Epistemológico Necesario
                  </span>
                  <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                    {selectedVision.matiz}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center border border-dashed border-[#F2F5F7]/20">
                <Compass size={40} className="text-[#4DEEEA]/60 mb-4" />
                <span className="type-label text-[#4DEEEA] block mb-2">
                  Lectura Comparada
                </span>
                <h3 className="type-card-title text-[#F2F5F7] mb-2">
                  Explora los cuatro enfoques
                </h3>
                <p className="type-body text-sm max-w-sm">
                  Selecciona cualquier nodo del mapa conceptual para analizar su definición, sus palabras clave, su aplicación práctica y sus límites filosóficos.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sección Comparativa Editorial: Cuatro formas de mirar una misma pregunta */}
      <div className="mt-16 glass-card p-6 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#F2F5F7]/10 gap-4">
          <div>
            <span className="type-label text-[#FFD166] block mb-1">
              Matriz de Síntesis Aplicada
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F2F5F7]">
              Cuatro formas de mirar una misma pregunta: el charco de agua
            </h3>
          </div>
          <p className="font-mono text-xs text-[#94A3B8] max-w-md">
            Las prácticas científicas reales suelen integrar elementos de varias perspectivas simultáneamente.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visions.map((v) => (
            <div
              key={`matrix-${v.id}`}
              className="bg-[#07111F]/75 p-5 rounded-xl border border-[#F2F5F7]/10 flex flex-col justify-between"
            >
              <div>
                <span
                  className="font-mono text-[11px] font-bold block mb-2"
                  style={{ color: v.color }}
                >
                  {v.name}
                </span>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">{v.charco}</p>
              </div>
              <button
                onClick={() => setSelectedVision(v)}
                className="mt-4 font-mono text-xs text-left hover:underline"
                style={{ color: v.color }}
              >
                Ver ficha completa →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// CAPÍTULO V: LAS SALIDAS PEDAGÓGICAS
