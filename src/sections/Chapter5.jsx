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

export default function Chapter5() {
  return (
    <section id="cap5" className="py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionTitle
        chapter="V"
        domain="Contextos No Formales y Observación en Campo"
        title="Las salidas"
        subtitle="La ciencia también está afuera del aula"
      />

      <div className="mt-14 space-y-20">
        {/* EXPEDICIÓN 01: MUSEO UNIVERSITARIO */}
        <div className="glass-card p-6 sm:p-10 border-l-4 border-l-[#4DEEEA]">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="type-label text-[#4DEEEA] bg-[#4DEEEA]/10 px-3 py-1 rounded-full">
                  EXPEDICIÓN 01 · MUSEO UNIVERSITARIO (MUUA)
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F2F5F7] flex items-center gap-3">
                <BookOpen size={26} className="text-[#4DEEEA]" /> Museo de la Universidad de Antioquia
              </h3>

              <p className="type-body text-[#E2E8F0] max-w-none">
                Visitar un museo permite encontrarse con objetos, evidencias y representaciones que convierten ideas abstractas en algo que podemos observar y discutir. Desde la física, una exposición puede despertar preguntas sobre la materia, la energía, el movimiento, la luz o las propiedades de los materiales. Su valor educativo no depende únicamente de la información que ofrece, sino también de las preguntas que provoca.
              </p>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <InteractivePoint
                  title="Observar un objeto"
                  text="Fíjate en las texturas, la iluminación, la geometría de las piezas o cómo interactúa el material con la luz del recinto."
                  color="#4DEEEA"
                />
                <InteractivePoint
                  title="Formular una pregunta"
                  text="¿Por qué este objeto tiene esta estructura física? ¿Qué fenómeno natural o principio mecánico permite explicar su conservación o función?"
                  color="#4DEEEA"
                />
              </div>

              <div className="personal-log-card p-5 border-l-4 border-l-[#4DEEEA]">
                <label className="type-label text-[#4DEEEA] block mb-2">
                  Bitácora de Campo · Tu experiencia en el museo
                </label>
                <textarea
                  className="w-full bg-[#07111F]/80 border border-[#4DEEEA]/30 rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#4DEEEA] resize-none text-[#F2F5F7] leading-relaxed"
                  rows="3"
                  placeholder="El objeto o experiencia que más me llamó la atención fue: [COMPLETAR CON MI EXPERIENCIA REAL]"
                />
              </div>
            </div>

            {/* Ilustración Vectorial Arquitectónica de Exposición */}
            <div className="lg:col-span-5 simulation-frame h-80 w-full flex flex-col justify-between p-6 relative overflow-hidden">
              <div className="flex justify-between items-center font-mono text-[10px] text-[#94A3B8] z-10">
                <span>ESQUEMA MUSEOGRÁFICO</span>
                <span className="text-[#4DEEEA]">LUZ · MATERIA · ESCALA</span>
              </div>

              <svg viewBox="0 0 320 200" className="w-full h-48 my-auto" fill="none">
                {/* Haz de luz cenital */}
                <polygon
                  points="160,10 95,165 225,165"
                  fill="url(#museumBeam)"
                  opacity="0.35"
                />
                <defs>
                  <linearGradient id="museumBeam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4DEEEA" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                {/* Vitrina y objeto geométrico */}
                <rect
                  x="115"
                  y="65"
                  width="90"
                  height="100"
                  stroke="#4DEEEA"
                  strokeWidth="1.5"
                  fill="rgba(16,42,67,0.4)"
                />
                <circle
                  cx="160"
                  cy="110"
                  r="24"
                  stroke="#FFD166"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <polygon
                  points="160,92 142,124 178,124"
                  stroke="#9B72CF"
                  strokeWidth="1.5"
                />
                <line x1="40" y1="165" x2="280" y2="165" stroke="#F2F5F7" strokeOpacity="0.3" />
              </svg>

              <p className="font-mono text-xs text-center text-[#CBD5E1] z-10">
                [ Interacción entre iluminación, vitrina y observación científica ]
              </p>
            </div>
          </div>
        </div>

        {/* EXPEDICIÓN 02: PARQUE DE LA CONSERVACIÓN */}
        <div className="glass-card p-6 sm:p-10 border-l-4 border-l-[#FFD166]">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Ilustración Vectorial Biofísica */}
            <div className="lg:col-span-5 order-2 lg:order-1 simulation-frame h-80 w-full flex flex-col justify-between p-6 relative overflow-hidden">
              <div className="flex justify-between items-center font-mono text-[10px] text-[#94A3B8] z-10">
                <span>BIOFÍSICA Y ECOSISTEMA</span>
                <span className="text-[#FFD166]">ENERGÍA · BIOMECÁNICA</span>
              </div>

              <svg viewBox="0 0 320 200" className="w-full h-48 my-auto" fill="none">
                {/* Trayectoria parabólica de salto / movimiento */}
                <path
                  d="M 40 155 Q 160 25 280 155"
                  stroke="#FFD166"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                {/* Ondas acústicas / percepción */}
                <circle cx="160" cy="90" r="18" stroke="#4DEEEA" strokeWidth="1.2" opacity="0.8" />
                <circle cx="160" cy="90" r="34" stroke="#4DEEEA" strokeWidth="0.8" opacity="0.45" />
                <circle cx="160" cy="90" r="50" stroke="#9B72CF" strokeWidth="0.6" opacity="0.3" />
                {/* Vectores de fuerza */}
                <line x1="90" y1="110" x2="135" y2="75" stroke="#4DEEEA" strokeWidth="2" />
                <circle cx="90" cy="110" r="5" fill="#FFD166" />
                <line x1="30" y1="155" x2="290" y2="155" stroke="#F2F5F7" strokeOpacity="0.25" />
              </svg>

              <p className="font-mono text-xs text-center text-[#CBD5E1] z-10">
                [ Fuerzas, equilibrio térmico y propagación de señales en seres vivos ]
              </p>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-3">
                <span className="type-label text-[#FFD166] bg-[#FFD166]/10 px-3 py-1 rounded-full">
                  EXPEDICIÓN 02 · BIOFÍSICA Y ENTORNO VIVO
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F2F5F7] flex items-center gap-3">
                <Droplets size={26} className="text-[#FFD166]" /> Parque de la Conservación
              </h3>

              <p className="type-body text-[#E2E8F0] max-w-none">
                Observar animales permite reconocer que la vida también está atravesada por fenómenos físicos. El desplazamiento implica fuerzas, equilibrio y energía; la percepción del entorno involucra la luz y el sonido; y el intercambio térmico influye en la relación entre el organismo y su hábitat. Estas conexiones nos acercan a la ciencia desde los seres vivos, invitándonos a pensar en su conservación.
              </p>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <InteractivePoint
                  title="Movimiento y Fuerza"
                  text="¿Cómo cambia la trayectoria de un animal cuando acelera, salta o gira bruscamente sobre distintas superficies?"
                  color="#FFD166"
                />
                <InteractivePoint
                  title="Intercambio de Energía"
                  text="¿Cómo se relacionan la actividad del organismo, su metabolismo y la transferencia de calor con el microclima de su hábitat?"
                  color="#FFD166"
                />
              </div>

              <div className="personal-log-card p-5 border-l-4 border-l-[#FFD166]">
                <label className="type-label text-[#FFD166] block mb-2">
                  Bitácora de Campo · Tu experiencia en el parque
                </label>
                <textarea
                  className="w-full bg-[#07111F]/80 border border-[#FFD166]/30 rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#FFD166] resize-none text-[#F2F5F7] leading-relaxed"
                  rows="3"
                  placeholder="La observación que más me conectó con la física fue: [COMPLETAR CON MI EXPERIENCIA REAL]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
