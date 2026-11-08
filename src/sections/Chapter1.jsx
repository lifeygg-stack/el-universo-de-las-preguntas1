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

export default function Chapter1() {
  const [activeNode, setActiveNode] = useState(null);
  const [investigationStep, setInvestigationStep] = useState(0);

  const nodes = [
    {
      id: 'obs',
      code: 'FASE 01',
      title: 'Observar',
      desc: 'Notar cómo una sombra cambia de posición durante el día.',
      q: '¿A qué se debe este cambio continuo?',
      pos: { x: 0, y: -190 }
    },
    {
      id: 'pre',
      code: 'FASE 02',
      title: 'Preguntar',
      desc: 'Identificar una incógnita a partir de lo observado.',
      q: '¿Por qué cambia la longitud de la sombra?',
      pos: { x: 250, y: 0 }
    },
    {
      id: 'exp',
      code: 'FASE 03',
      title: 'Experimentar',
      desc: 'Comparar sombras en distintos momentos y registrar los resultados.',
      q: '¿Qué variables intervienen?',
      pos: { x: 0, y: 190 }
    },
    {
      id: 'expl',
      code: 'FASE 04',
      title: 'Explicar',
      desc: 'Relacionar los cambios con la posición del Sol y la geometría.',
      q: '¿Cómo construimos un modelo que lo describa?',
      pos: { x: -250, y: 0 }
    }
  ];

  const questions = [
    'El agua desapareció del charco',
    '¿El agua desapareció realmente?',
    '¿Qué ocurrió con sus moléculas?',
    '¿Qué condiciones favorecen la evaporación?',
    '¿Cómo podríamos comprobar nuestra explicación?'
  ];

  return (
    <section id="cap1" className="py-28 px-4 sm:px-6 max-w-6xl mx-auto relative">
      <SectionTitle
        chapter="I"
        domain="Epistemología y Enseñanza"
        title="Aprender a mirar científicamente"
        subtitle="De la transmisión de fórmulas a la construcción activa de sentido"
      />

      {/* Bloque Editorial Introductorio */}
      <div className="editorial-intro-card p-6 sm:p-8 md:p-10 mb-20">
        <div className="grid md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-3">
            <span className="type-label text-[#4DEEEA] block mb-1">Introducción</span>
            <p className="font-mono text-xs text-[#94A3B8]">
              Cómo, para qué y desde qué concepción de ciencia enseñamos.
            </p>
          </div>
          <div className="md:col-span-9">
            <p className="type-lead max-w-none">
              Enseñar ciencias no consiste únicamente en transmitir conceptos, fórmulas o definiciones. También implica crear situaciones en las que las personas puedan observar, preguntar, experimentar, contrastar explicaciones y construir conocimientos. La didáctica de las ciencias nos invita a pensar no solo en qué enseñamos, sino en cómo, para qué y desde qué concepción de ciencia lo hacemos.
            </p>
          </div>
        </div>
      </div>

      {/* Diagrama interactivo a ancho completo: los nodos flotan suavemente y ya no se desplazan al pasar el cursor */}
      <div className="grid lg:grid-cols-12 gap-10 items-center mb-24">
        <div className="orbit-stage lg:col-span-12 simulation-frame relative h-[500px] sm:h-[600px] overflow-hidden flex items-center justify-center">
          <div className="absolute top-5 left-6 z-10">
            <span className="type-label text-[#94A3B8] text-[10px]">
              FIG 1.1 · CICLO DE INDAGACIÓN CIENTÍFICA
            </span>
          </div>

          {/* Órbita de referencia */}
          <div
            className="absolute w-[500px] h-[380px] rounded-full border border-dashed border-[#4DEEEA]/30 pointer-events-none"
            style={{ transform: 'scale(var(--orbit-x), var(--orbit-y))' }}
          />
          <div
            className="absolute w-[220px] h-[220px] rounded-full bg-[#9B72CF]/15 blur-2xl pointer-events-none"
            style={{ transform: 'scale(var(--orbit-s))' }}
          />

          {/* Núcleo central */}
          <div className="z-10" style={{ transform: 'scale(var(--orbit-s))' }}>
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-[#102A43] border-2 border-[#9B72CF] p-4 rounded-full text-center shadow-[0_0_35px_rgba(155,114,207,0.35)] w-40 h-40 flex flex-col items-center justify-center"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#4DEEEA] mb-1">
                Núcleo
              </span>
              <span className="font-display font-bold text-sm text-[#FFD166] leading-tight">
                Construcción del conocimiento
              </span>
            </motion.div>
          </div>

          {/* Nodos periféricos: el desplazamiento vive en el contenedor; el botón solo flota y escala */}
          {nodes.map((node, i) => {
            const isSelected = activeNode?.id === node.id;
            return (
              <div
                key={node.id}
                className="absolute"
                style={{
                  transform: `translate(calc(${node.pos.x}px * var(--orbit-x)), calc(${node.pos.y}px * var(--orbit-y)))`
                }}
              >
                <motion.button
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveNode(node)}
                  aria-pressed={isSelected}
                  className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-center p-2 transition-colors border-2 ${
                    isSelected
                      ? 'bg-[#4DEEEA] text-[#07111F] border-[#F2F5F7] shadow-[0_0_25px_rgba(77,238,234,0.6)]'
                      : 'bg-[#07111F]/95 text-[#F2F5F7] border-[#4DEEEA]/50 hover:border-[#4DEEEA]'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] tracking-wider ${
                      isSelected ? 'text-[#07111F]/80 font-bold' : 'text-[#4DEEEA]'
                    }`}
                  >
                    {node.code}
                  </span>
                  <span className="font-display font-bold text-[11px] sm:text-sm mt-0.5">{node.title}</span>
                </motion.button>
              </div>
            );
          })}
        </div>

        </div>

        {/* Panel de lectura del nodo seleccionado, a ancho completo */}
        <div className="lg:col-span-12 glass-card p-8 sm:p-10 min-h-[260px] flex flex-col justify-center">
        <div className="lg:col-span-6 glass-card p-8 sm:p-10 min-h-[430px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeNode ? (
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#F2F5F7]/10 pb-4">
                  <div>
                    <span className="type-label text-[#4DEEEA] block mb-1">
                      {activeNode.code} · Acción Epistémica
                    </span>
                    <h3 className="font-display text-3xl font-bold text-[#F2F5F7]">
                      {activeNode.title}
                    </h3>
                  </div>
                  <span className="w-10 h-10 rounded-xl bg-[#4DEEEA]/15 border border-[#4DEEEA]/40 flex items-center justify-center text-[#4DEEEA]">
                    <Compass size={20} />
                  </span>
                </div>

                <div>
                  <span className="type-label text-[#9B72CF] block mb-2">
                    Fenómeno Cotidiano de Ejemplo
                  </span>
                  <p className="type-body text-[#F2F5F7] reading-column">{activeNode.desc}</p>
                </div>

                <div className="scientific-explanation-box p-5 border-l-4 border-l-[#FFD166]">
                  <span className="type-label text-[#FFD166] block mb-1.5">
                    Pregunta Orientadora
                  </span>
                  <p className="font-display text-lg font-medium text-[#F2F5F7]">
                    {activeNode.q}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 px-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#102A43] border border-[#4DEEEA]/30 flex items-center justify-center mx-auto mb-5 text-[#4DEEEA]">
                  <RotateCcw size={28} />
                </div>
                <span className="type-label text-[#4DEEEA] block mb-2">
                  Exploración Interactiva
                </span>
                <h3 className="type-card-title text-[#F2F5F7] mb-3">
                  Selecciona un nodo del sistema
                </h3>
                <p className="type-body text-sm mx-auto max-w-md">
                  Haz clic en <strong>Observar</strong>, <strong>Preguntar</strong>,{' '}
                  <strong>Experimentar</strong> o <strong>Explicar</strong> en el diagrama para analizar cómo cada acción articula el pensamiento científico.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Interacción: De la respuesta a la investigación */}
      <div className="simulation-frame p-8 sm:p-12 text-center relative overflow-hidden mb-16">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4DEEEA] via-[#9B72CF] to-[#FFD166]" />

        <div className="flex flex-wrap items-center justify-between gap-2 mb-8 pb-4 border-b border-[#F2F5F7]/10">
          <span className="type-label text-[#FFD166]">
            Laboratorio de Formulación · De la respuesta a la investigación
          </span>
          <span className="font-mono text-xs text-[#4DEEEA] bg-[#102A43] px-3 py-1 rounded-full border border-[#4DEEEA]/30">
            NIVEL DE PROFUNDIDAD: 0{investigationStep + 1} / 0{questions.length}
          </span>
        </div>

        <div className="min-h-[130px] flex flex-col items-center justify-center mb-8 px-4">
          <span className="type-label text-[#94A3B8] mb-3">
            {investigationStep === 0
              ? 'Afirmación Cotidiana Inicial'
              : `Pregunta de Investigación #${investigationStep}`}
          </span>
          <AnimatePresence mode="wait">
            <motion.p
              key={investigationStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold max-w-3xl leading-tight ${
                investigationStep === 0 ? 'text-[#F2F5F7]' : 'text-[#4DEEEA]'
              }`}
            >
              “{questions[investigationStep]}”
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Indicadores de paso */}
        <div className="flex justify-center gap-2 mb-8">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setInvestigationStep(idx)}
              aria-label={`Ir al paso ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                investigationStep === idx
                  ? 'w-10 bg-[#4DEEEA]'
                  : 'w-3 bg-[#F2F5F7]/20 hover:bg-[#F2F5F7]/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setInvestigationStep((p) => (p + 1) % questions.length)}
          className="bg-[#4DEEEA]/15 border border-[#4DEEEA] text-[#4DEEEA] font-display font-semibold text-sm sm:text-base px-7 py-3 rounded-full hover:bg-[#4DEEEA] hover:text-[#07111F] transition-all flex items-center gap-2 mx-auto"
        >
          <ChevronRight size={18} /> Transformar afirmación
        </button>
      </div>

      {/* Cita Editorial Destacada */}
      <EditorialPullQuote
        quote="Una buena experiencia de enseñanza no elimina la curiosidad ofreciendo respuestas inmediatas. La convierte en el punto de partida para aprender."
        context="Síntesis Didáctica · Capítulo I"
      />
    </section>
  );
}

// ==========================================
