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
import CARAMELO_ESCASO_IMG from '../assets/caramelo-escaso.jpg';

export default function Chapter2() {
  const [image, setImage] = useState(CARAMELO_ESCASO_IMG);
  const [showReflection, setShowReflection] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <section
      id="cap2"
      className="py-28 px-4 sm:px-6 bg-gradient-to-b from-[#07111F] via-[#102A43]/40 to-[#07111F] border-y border-[#F2F5F7]/5"
    >
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          chapter="II"
          domain="Identidad, Creatividad y Mediación Pedagógica"
          title="El caramelo escaso"
          subtitle="Una chocolatina, una identidad y una forma de aprender"
        />

        <div className="grid lg:grid-cols-12 gap-10 items-stretch mt-12">
          {/* Vitrina del Objeto de Estudio */}
          <div className="lg:col-span-12 simulation-frame p-6 sm:p-8 flex flex-col items-center justify-between relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, rgba(255, 209, 102, 0.14) 0%, transparent 70%)'
              }}
            />

            <div className="w-full flex items-center justify-between border-b border-[#F2F5F7]/10 pb-3 mb-6 z-10">
              <span className="type-label text-[#FFD166]">ESPÉCIMEN #001 · ÁLBUM JET</span>
              <span className="font-mono text-xs text-[#94A3B8]">REGISTRO PERSONAL</span>
            </div>

            <label style={{ aspectRatio: "8 / 3" }} className="relative group cursor-pointer w-full max-w-5xl rounded-2xl overflow-hidden border border-[#FFD166]/30 flex flex-col items-center justify-center bg-[#07111F]/90 shadow-[0_0_50px_rgba(255,209,102,0.14)] transition-all hover:border-[#FFD166] hover:shadow-[0_0_60px_rgba(255,209,102,0.22)] z-10">
              {image ? (
                <img
                  src={image}
                  alt="Registro del caramelo escaso: título manuscrito y dos composiciones dibujadas"
                  className="w-full h-full object-contain bg-[#F8FAFC]"
                />
              ) : (
                <div className="text-center p-6 flex flex-col items-center text-[#CBD5E1] group-hover:text-[#FFD166] transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFD166]/10 border border-[#FFD166]/30 flex items-center justify-center mb-4 text-[#FFD166]">
                    <ImageIcon size={28} />
                  </div>
                  <p className="font-display font-semibold text-base text-[#F2F5F7] mb-1">
                    Cargar fotografía original
                  </p>
                  <p className="font-mono text-xs text-[#4DEEEA] mt-2 leading-relaxed">
                    Aquí aparecerá la fotografía de mi caramelo escaso
                  </p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            <div className="w-full mt-6 pt-4 border-t border-[#F2F5F7]/10 flex items-center justify-between text-xs font-mono text-[#94A3B8] z-10">
              <span>ESTADO: {image ? 'CARGADO' : 'PENDIENTE DE ARCHIVO'}</span>
              <span className="text-[#FFD166]">CLICK PARA REEMPLAZAR</span>
            </div>
          </div>

        </div>

        {/* Bloque Editorial de Reflexión Pedagógica */}
        <div className="mt-16 glass-card p-8 sm:p-12 border border-[#FFD166]/20">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <span className="type-label text-[#FFD166] block mb-2">
                Análisis Didáctico
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F2F5F7] mb-3">
                Reflexión Pedagógica
              </h3>
              <p className="type-caption">
                Vínculo entre objeto cultural, subjetividad del estudiante y construcción de conocimiento.
              </p>
            </div>

            <div className="md:col-span-8 space-y-6 reading-column">
              <p className="type-body text-[#E2E8F0] max-w-none">
                El caramelo escaso fue una actividad que nos permitió construir un objeto propio a partir de una chocolatina JET, una frase característica y algo que nos representara. Más allá de diseñar un sticker, la experiencia abrió un espacio para reconocer que también aprendemos cuando relacionamos los contenidos con nuestra identidad, nuestras experiencias y nuestra manera de interpretar el mundo.
              </p>

              {!showReflection ? (
                <button
                  onClick={() => setShowReflection(true)}
                  className="bg-[#9B72CF] text-white font-display font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl hover:bg-[#8659c2] transition-all shadow-[0_0_25px_rgba(155,114,207,0.35)] flex items-center gap-2.5"
                >
                  <Zap size={18} /> Descubrir lo que hay detrás del caramelo
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="identity-science p-6 sm:p-8 border-l-4 border-l-[#9B72CF]"
                >
                  <span className="type-label text-[#9B72CF] block mb-2">
                    Articulación con la Didáctica de las Ciencias
                  </span>
                  <h4 className="font-display text-xl font-bold text-[#FFD166] mb-3">
                    ¿Qué tiene que ver esto con la didáctica de las ciencias?
                  </h4>
                  <p className="type-body text-sm sm:text-base text-[#E2E8F0] max-w-none">
                    Una actividad creativa puede favorecer la participación, la expresión personal y la conexión entre conocimientos y experiencias. Sin embargo, el valor pedagógico de una actividad depende también de sus propósitos, la reflexión que promueve y la manera en que se relaciona con los aprendizajes esperados. No se trata solo de &ldquo;hacer por hacer&rdquo;, sino de usar el objeto como un puente hacia nuevas preguntas.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
