import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, Play, Pause, Thermometer, Wind, X, Save, Edit3,
  Image as ImageIcon, ChevronRight, Zap, Droplets, RotateCcw, Sparkles, Compass,
  Atom, Eye, HelpCircle, FlaskConical, MessageSquareQuote, Download
} from 'lucide-react';


export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-24 px-4 sm:px-6 flex flex-col justify-between items-center overflow-hidden cosmic-grid-bg"
    >
      {/* Halos de luz atmosférica y partículas espaciales */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 28%, rgba(77, 238, 234, 0.14) 0%, rgba(155, 114, 207, 0.1) 32%, rgba(7, 17, 31, 0.96) 72%)'
        }}
      />

      {/* Órbitas decorativas finas de observatorio */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
        viewBox="0 0 1200 800"
        fill="none"
      >
        <circle
          cx="600"
          cy="380"
          r="240"
          stroke="#4DEEEA"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <circle cx="600" cy="380" r="370" stroke="#9B72CF" strokeWidth="0.75" />
        <circle
          cx="600"
          cy="380"
          r="500"
          stroke="#F2F5F7"
          strokeWidth="0.5"
          strokeDasharray="2 10"
        />
        <line x1="100" y1="380" x2="1100" y2="380" stroke="#4DEEEA" strokeWidth="0.4" />
        <line x1="600" y1="40" x2="600" y2="740" stroke="#4DEEEA" strokeWidth="0.4" />
      </svg>

      {/* Estrellas suaves */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
        {[...Array(36)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: ((i % 3) + 1.5) + 'px',
              height: ((i % 3) + 1.5) + 'px',
              top: ((i * 29) % 94) + '%',
              left: ((i * 43) % 96) + '%'
            }}
            animate={{ y: [0, -14, 0], opacity: [0.2, 0.9, 0.2] }}
            transition={{
              duration: (i % 4) + 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-5xl mx-auto relative z-10 my-auto pt-6">
        {/* Metadato Editorial Superior */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-6"
        >
          <span className="type-label text-[#4DEEEA] bg-[#102A43]/90 border border-[#4DEEEA]/30 px-3.5 py-1.5 rounded-full flex items-center gap-2">
            <Sparkles size={13} /> Expediente de Didáctica de las Ciencias Naturales
          </span>
          <span className="font-mono text-xs text-[#94A3B8] hidden sm:inline">
            LAT 06°15&apos;N · OBS-UDEA · EDICIÓN INTERACTIVA
          </span>
        </motion.div>

        {/* Título Principal en Space Grotesk */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="type-hero text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#F2F5F7] via-[#4DEEEA] to-[#9B72CF]"
        >
          EL UNIVERSO DE LAS PREGUNTAS
        </motion.h1>

        {/* Subtítulo Editorial */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="type-section-subtitle text-center text-[#FFD166] max-w-3xl mx-auto mb-10 font-normal"
        >
          Un viaje por la didáctica de las ciencias naturales, las experiencias que nos transforman y las preguntas que nos enseñan a mirar el mundo de otra manera.
        </motion.p>

        {/* Bloque de Introducción Editorial en Dos Columnas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="glass-card identity-intro p-6 sm:p-8 md:p-10 max-w-4xl mx-auto mb-10 border border-[#4DEEEA]/20"
        >
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#F2F5F7]/10 pb-4 md:pb-0 md:pr-6">
              <span className="type-label text-[#9B72CF] block mb-2">Premisa Central</span>
              <p className="font-display text-xl sm:text-2xl font-semibold text-[#F2F5F7] leading-snug">
                La ciencia comienza cuando dejamos de dar por obvio lo cotidiano y nos atrevemos a preguntar por qué.
              </p>
            </div>
            <div className="md:col-span-8">
              <p className="type-body text-[#CBD5E1] reading-column">
                ¿Alguna vez te has preguntado adónde va el agua de un charco cuando desaparece? ¿O quién mueve los planetas si nadie los está empujando? Lo cotidiano está lleno de fenómenos que parecen simples hasta que intentamos explicarlos. Este espacio reúne experiencias, ideas y preguntas para explorar cómo construimos conocimiento científico.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Botones de Acción con Jerarquía Visual */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#cap1"
            className="w-full sm:w-auto text-center bg-[#4DEEEA] text-[#07111F] font-display font-bold text-sm sm:text-base px-8 py-4 rounded-full shadow-[0_0_25px_rgba(77,238,234,0.35)] transition-all hover:shadow-[0_0_35px_rgba(77,238,234,0.6)]"
          >
            Comenzar la exploración
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#cap6"
            className="w-full sm:w-auto text-center bg-[#102A43]/70 border border-[#9B72CF]/70 text-[#F2F5F7] font-display font-semibold text-sm sm:text-base px-8 py-4 rounded-full hover:bg-[#9B72CF]/20 hover:border-[#9B72CF] transition-all"
          >
            Lanzar una pregunta al universo
          </motion.a>
        </div>
      </div>

      {/* Indicador de Desplazamiento sin superposición */}
      <motion.a
        href="#cap1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="relative z-10 mt-12 flex flex-col items-center text-[#94A3B8] hover:text-[#4DEEEA] transition-colors"
      >
        <span className="type-label text-[11px]">Desliza para explorar</span>
        <ChevronDown size={20} className="mt-1.5 text-[#4DEEEA]" />
      </motion.a>
    </section>
  );
}
