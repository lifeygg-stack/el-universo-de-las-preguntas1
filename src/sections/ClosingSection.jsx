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

export default function ClosingSection({ saveNote, setIsNotebookOpen }) {
  const [finalQuestion, setFinalQuestion] = useState('');

  const handleSaveFinal = () => {
    if (finalQuestion.trim()) {
      saveNote(`Pregunta Final: ${finalQuestion}`, 'Gran Pregunta');
      setFinalQuestion('');
      setIsNotebookOpen(true);
    }
  };

  return (
    <section className="py-32 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-t from-[#07111F] via-[#102A43]/70 to-[#07111F] border-t border-[#F2F5F7]/10">
      {/* Convergencia Orbital de Fondo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
        <div className="w-[780px] h-[780px] border border-[#F2F5F7] rounded-full absolute" />
        <div className="w-[560px] h-[560px] border border-dashed border-[#4DEEEA] rounded-full absolute" />
        <div className="w-[360px] h-[360px] border border-[#9B72CF] rounded-full absolute" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="type-label text-[#4DEEEA] block mb-3">
            Epílogo · Síntesis del Viaje
          </span>
          <h2 className="type-chapter-title bg-clip-text text-transparent bg-gradient-to-r from-[#F2F5F7] via-[#4DEEEA] to-[#9B72CF]">
            Una pregunta nunca es solamente una pregunta
          </h2>
        </div>

        {/* Prosa Editorial en Dos Columnas */}
        <div className="grid md:grid-cols-2 gap-8 mb-14 glass-card p-6 sm:p-10">
          <p className="type-body text-[#E2E8F0]">
            Aprender ciencias es aprender a mirar dos veces. Es reconocer que detrás de un charco que desaparece hay transformaciones de la materia; detrás del movimiento de los planetas hay leyes físicas; y detrás de una experiencia personal puede surgir una pregunta que cambie nuestra manera de pensar.
          </p>
          <p className="type-body text-[#E2E8F0]">
            La didáctica nos recuerda que aprender no consiste únicamente en llegar a una respuesta. También implica descubrir cómo llegamos a ella. Porque quizás la ciencia no comienza cuando conocemos todas las respuestas, sino cuando aprendemos a formular mejores preguntas.
          </p>
        </div>

        {/* Tarjeta Interactiva de Gran Pregunta Final */}
        <div className="simulation-frame p-6 sm:p-10 mb-16">
          <span className="type-label text-[#FFD166] block mb-2">
            Bitácora Abierta hacia el Futuro
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F2F5F7] mb-4">
            Si pudiera investigar una sola pregunta sobre el universo, la materia o la vida, sería...
          </h3>
          <textarea
            value={finalQuestion}
            onChange={(e) => setFinalQuestion(e.target.value)}
            className="w-full bg-[#07111F] border border-[#4DEEEA]/35 rounded-xl p-4 text-base sm:text-lg focus:outline-none focus:border-[#4DEEEA] resize-none text-[#F2F5F7] placeholder-[#64748B]"
            rows="2"
            placeholder="Escribe tu gran pregunta aquí..."
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveFinal}
              className="bg-[#4DEEEA] text-[#07111F] font-display font-bold text-sm sm:text-base py-3 px-8 rounded-full hover:bg-[#3bc2be] transition-all shadow-[0_0_20px_rgba(77,238,234,0.35)] flex items-center gap-2"
            >
              <Save size={18} /> Guardar en mi Cuaderno
            </button>
          </div>
        </div>

        {/* Frase Final con Tipografía Editorial (sin Times New Roman) */}
        <EditorialPullQuote
          quote="El universo está lleno de respuestas, pero necesita personas que se atrevan a preguntar."
          context="El Universo de las Preguntas · Didáctica de las Ciencias Naturales"
        />
      </div>
    </section>
  );
}
