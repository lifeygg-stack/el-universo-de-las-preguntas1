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

export default function Chapter6({ saveNote, setIsNotebookOpen }) {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [hypothesisText, setHypothesisText] = useState('');

  const questions = [
    {
      cat: 'Física',
      code: 'FIS-01',
      color: '#4DEEEA',
      q: '¿Qué es realmente el tiempo y por qué parece avanzar en una sola dirección?',
      known:
        'Sabemos que está ligado al espacio (espaciotiempo relativista) y que la entropía (desorden) de un sistema aislado tiende a aumentar según la segunda ley de la termodinámica, lo que define una "flecha del tiempo".',
      discuss:
        'Se investiga si el tiempo es una propiedad fundamental del cosmos o una propiedad emergente a partir del entrelazamiento cuántico y la termodinámica estadística.',
      hint: 'Piensa en una taza de porcelana cayendo al suelo. Las leyes microscópicas son reversibles, pero ¿por qué nunca vemos los fragmentos recomponerse espontáneamente?'
    },
    {
      cat: 'Química',
      code: 'QUI-01',
      color: '#FFD166',
      q: '¿En qué momento una colección de moléculas deja de ser una mezcla y se convierte en un sistema capaz de mantener organización compleja (vida)?',
      known:
        'Conocemos la estructura de las biomoléculas, las redes metabólicas y cómo ciertos sistemas químicos fuera del equilibrio pueden autoorganizarse y autocatalizarse.',
      discuss:
        'La transición exacta entre química prebiótica compleja y los primeros sistemas con herencia, compartimentación y evolución darwiniana sigue siendo un problema abierto.',
      hint: 'Una sola molécula de H₂O no tiene tensión superficial ni es líquida. ¿Cómo emergen nuevas leyes cuando miles de millones de moléculas interactúan?'
    },
    {
      cat: 'Universo',
      code: 'COS-01',
      color: '#9B72CF',
      q: '¿Qué son la materia oscura y la energía oscura?',
      known:
        'Medimos sus efectos gravitacionales y cosmológicos: la rotación de las galaxias, el lente gravitacional y la expansión acelerada del universo indican que la materia ordinaria visible representa apenas ~5% del cosmos.',
      discuss:
        'Aún buscamos detectar directamente partículas candidatas de materia oscura o determinar si debemos ajustar nuestros modelos gravitatorios a escalas cosmológicas.',
      hint: 'Cuando observas las hojas de una copa de árbol agitarse, infieres la presencia e intensidad del viento aunque el aire sea invisible.'
    },
    {
      cat: 'Fronteras',
      code: 'EPI-01',
      color: '#F2F5F7',
      q: '¿Toda pregunta científica puede responderse mediante un experimento?',
      known:
        'La contrastación empírica, la observación sistemática y los experimentos controlados son pilares para validar modelos científicos.',
      discuss:
        'En disciplinas históricas o cosmológicas (como el origen del universo o la evolución planetaria) no siempre podemos repetir el fenómeno en un laboratorio, por lo que recurrimos a inferencias, simulaciones y rastros observacionales.',
      hint: '¿Cómo reconstruimos la estructura interna de una estrella lejana o del núcleo terrestre sin poder viajar físicamente hasta su interior?'
    }
  ];

  const handleSaveHypothesis = () => {
    if (!hypothesisText.trim() || !activeQuestion) return;
    saveNote(
      `[${activeQuestion.cat}] ${activeQuestion.q} — Mi hipótesis: ${hypothesisText}`,
      'Hipótesis'
    );
    setHypothesisText('');
    setActiveQuestion(null);
    setIsNotebookOpen(true);
  };

  return (
    <section id="cap6" className="py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionTitle
        chapter="VI"
        domain="Fronteras del Conocimiento"
        title="El laboratorio de preguntas"
        subtitle="Preguntas profundas sobre física, química y filosofía de la ciencia sin respuestas fáciles"
      />

      <div className="grid md:grid-cols-2 gap-6 mt-14">
        {questions.map((item, idx) => (
          <motion.article
            key={idx}
            whileHover={{ y: -4 }}
            onClick={() => {
              setActiveQuestion(item);
              setHypothesisText('');
            }}
            className="glass-card p-7 sm:p-8 cursor-pointer hover:border-[#9B72CF]/60 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="type-label px-3 py-1 rounded-full bg-[#07111F]/80 border"
                  style={{ color: item.color, borderColor: `${item.color}40` }}
                >
                  {item.cat}
                </span>
                <span className="font-mono text-xs text-[#94A3B8]">{item.code}</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F2F5F7] leading-snug group-hover:text-[#4DEEEA] transition-colors">
                {item.q}
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F2F5F7]/10 flex items-center justify-between text-xs sm:text-sm font-display font-semibold text-[#4DEEEA]">
              <span>Abrir expediente de investigación</span>
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </motion.article>
        ))}
      </div>

      {/* Modal de Expediente de Investigación */}
      <AnimatePresence>
        {activeQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111F]/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              className="bg-[#0B1D30] border border-[#4DEEEA]/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button
                onClick={() => setActiveQuestion(null)}
                className="absolute top-5 right-5 text-[#94A3B8] hover:text-white p-1.5 rounded-lg bg-[#07111F]/60"
                aria-label="Cerrar expediente"
              >
                <X size={22} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span
                  className="type-label px-2.5 py-0.5 rounded bg-[#07111F]"
                  style={{ color: activeQuestion.color }}
                >
                  {activeQuestion.cat}
                </span>
                <span className="font-mono text-xs text-[#94A3B8]">
                  EXPEDIENTE {activeQuestion.code}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F2F5F7] mb-6 pr-8 leading-tight">
                {activeQuestion.q}
              </h2>

              <div className="space-y-5">
                <div className="scientific-explanation-box p-5">
                  <h4 className="type-label text-[#4DEEEA] mb-2 flex items-center gap-2">
                    <BookOpen size={15} /> Lo que sabemos (Evidencia establecida)
                  </h4>
                  <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed">
                    {activeQuestion.known}
                  </p>
                </div>

                <div className="bg-[#07111F]/80 border border-[#FFD166]/30 rounded-xl p-5">
                  <h4 className="type-label text-[#FFD166] mb-2 flex items-center gap-2">
                    <Zap size={15} /> Lo que todavía discutimos (Frontera abierta)
                  </h4>
                  <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed">
                    {activeQuestion.discuss}
                  </p>
                </div>

                <div className="bg-[#102A43]/60 p-4 rounded-xl border-l-4 border-[#9B72CF]">
                  <h4 className="type-label text-[#9B72CF] mb-1">Una pista para pensar</h4>
                  <p className="text-sm text-[#CBD5E1] italic leading-relaxed">
                    {activeQuestion.hint}
                  </p>
                </div>

                <div className="pt-2">
                  <label className="type-label text-[#F2F5F7] block mb-2">
                    Mi hipótesis personal
                  </label>
                  <textarea
                    value={hypothesisText}
                    onChange={(e) => setHypothesisText(e.target.value)}
                    className="w-full bg-[#07111F] border border-[#4DEEEA]/30 rounded-xl p-3.5 text-sm focus:outline-none focus:border-[#4DEEEA] resize-none text-[#F2F5F7] leading-relaxed"
                    rows="3"
                    placeholder="Escribe aquí tu propia explicación, conjetura o reflexión sobre este problema..."
                  />
                  <div className="mt-3 flex justify-end gap-3">
                    <button
                      onClick={() => setActiveQuestion(null)}
                      className="px-4 py-2 rounded-lg text-xs font-mono text-[#94A3B8] hover:text-white"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={handleSaveHypothesis}
                      className="bg-[#4DEEEA] text-[#07111F] font-display font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-[#3bc2be] transition-colors flex items-center gap-2"
                    >
                      <Save size={15} /> Guardar en mi Cuaderno
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ==========================================
