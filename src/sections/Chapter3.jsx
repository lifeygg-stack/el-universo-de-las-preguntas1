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
import EvaporationSimulation from '../simulations/EvaporationSimulation';
import OrbitSimulation from '../simulations/OrbitSimulation';

export default function Chapter3() {
  return (
    <section id="cap3" className="py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionTitle
        chapter="III"
        domain="Modelización Física y Fenómenos Cotidianos"
        title="Preguntas obvias, pero lógicas"
        subtitle="Las preguntas más sencillas pueden esconder los problemas más interesantes"
      />

      <div className="grid lg:grid-cols-2 gap-10 mt-14">
        {/* SIMULACIÓN A: EVAPORACIÓN */}
        <div className="simulation-frame p-6 sm:p-8 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#F2F5F7]/10 pb-4 mb-5">
            <div>
              <span className="type-label text-[#4DEEEA] block mb-1">
                SIMULACIÓN 01 · CAMBIO DE ESTADO
              </span>
              <h3 className="font-display text-2xl font-bold text-[#F2F5F7]">
                Experimento A: El agua que se fue
              </h3>
            </div>
            <span className="p-2.5 rounded-xl bg-[#4DEEEA]/10 text-[#4DEEEA] border border-[#4DEEEA]/30">
              <Droplets size={22} />
            </span>
          </div>
          <p className="font-mono text-xs sm:text-sm text-[#FFD166] mb-6 bg-[#07111F]/80 px-4 py-2.5 rounded-lg border border-[#FFD166]/20">
            Pregunta: ¿El agua se fue del charco o quizás cambió de estado y se fue sin despedirse?
          </p>
          <EvaporationSimulation />
        </div>

        {/* SIMULACIÓN B: ÓRBITAS */}
        <div className="simulation-frame p-6 sm:p-8 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#F2F5F7]/10 pb-4 mb-5">
            <div>
              <span className="type-label text-[#9B72CF] block mb-1">
                SIMULACIÓN 02 · DINÁMICA ORBITAL
              </span>
              <h3 className="font-display text-2xl font-bold text-[#F2F5F7]">
                Experimento B: ¿Quién mueve los astros?
              </h3>
            </div>
            <span className="p-2.5 rounded-xl bg-[#9B72CF]/10 text-[#9B72CF] border border-[#9B72CF]/30">
              <Atom size={22} />
            </span>
          </div>
          <p className="font-mono text-xs sm:text-sm text-[#FFD166] mb-6 bg-[#07111F]/80 px-4 py-2.5 rounded-lg border border-[#FFD166]/20">
            Pregunta: Si algo se mueve, ¿alguien debe estar empujándolo continuamente?
          </p>
          <OrbitSimulation />
        </div>
      </div>

      {/* Enlace al laboratorio completo de simuladores */}
      <div className="mt-10 flex justify-center">
        <a
          href="#/simuladores"
          className="inline-flex items-center gap-2.5 bg-[#FFD166] text-[#07111F] font-display font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-[0_0_25px_rgba(255,209,102,0.3)] hover:shadow-[0_0_35px_rgba(255,209,102,0.55)] transition-all"
        >
          <FlaskConical size={18} /> Explorar más simuladores de física <ChevronRight size={18} />
        </a>
      </div>

      {/* Cita Editorial Intermedia */}
      <div className="my-20">
        <EditorialPullQuote
          quote="A veces, la dificultad no está en el fenómeno que observamos, sino en las ideas previas que utilizamos para explicarlo."
          context="Obstáculos Epistemológicos · Capítulo III"
        />
      </div>

      {/* Otras Preguntas Cotidianas */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="type-label text-[#4DEEEA] block mb-2">
            Archivo de Indagación Cotidiana
          </span>
          <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#F2F5F7] mb-3">
            Otras preguntas cotidianas
          </h3>
          <p className="type-body mx-auto text-sm sm:text-base">
            Haz clic en cada interrogante para desplegar su explicación física y profundizar en el modelo científico detrás del fenómeno.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <FAQItem
            index="01"
            tag="Óptica Atmosférica"
            q="¿Por qué el cielo no es violeta si la luz solar contiene muchos colores?"
            a="La atmósfera dispersa las distintas longitudes de onda de manera diferente. Aunque la luz violeta se dispersa intensamente, la combinación de la sensibilidad de nuestros ojos, el espectro solar y otros factores hace que percibamos el cielo despejado principalmente azul."
            deep="En la dispersión de Rayleigh, las longitudes de onda más cortas se desvían con mayor eficacia. Sin embargo, el Sol emite menos radiación violeta que azul y nuestros fotorreceptores (conos S, M y L) responden con mayor sensibilidad al rango azul-verde."
          />
          <FAQItem
            index="02"
            tag="Termodinámica"
            q="¿Por qué una cuchara metálica parece más fría que una de madera en la misma habitación?"
            a="El metal conduce el calor mucho más rápidamente. Cuando lo tocamos, extrae energía térmica de nuestra mano más deprisa que la madera, por lo que suele parecernos más frío aunque ambos objetos tengan una temperatura similar."
            deep="Nuestra piel no funciona como un termómetro directo de la temperatura del objeto, sino como un detector del flujo de energía térmica (conductividad térmica). Como el metal disipa rápidamente el calor de nuestros dedos, los termorreceptores cutáneos registran un enfriamiento veloz."
          />
          <FAQItem
            index="03"
            tag="Ondas y Propagación"
            q="¿Por qué vemos primero el relámpago y después escuchamos el trueno?"
            a="La luz viaja muchísimo más rápido que el sonido en el aire. Por eso la señal luminosa llega antes a nuestros ojos que el sonido a nuestros oídos."
            deep="Mientras la luz se propaga a casi 300 000 km/s en el aire, la onda acústica del trueno avanza a unos 343 m/s (a 20 °C). Contar los segundos de diferencia y dividir entre 3 permite estimar a cuántos kilómetros ocurrió la descarga."
          />
          <FAQItem
            index="04"
            tag="Estructura de la Materia"
            q="¿Por qué el hielo flota en el agua?"
            a="En condiciones habituales, el hielo tiene menor densidad que el agua líquida debido a la estructura que forman sus moléculas al congelarse."
            deep="Los puentes de hidrógeno entre las moléculas de H₂O forman una red cristalina hexagonal abierta al solidificarse, dejando más espacio vacío entre moléculas que en el estado líquido. Por el principio de Arquímedes, al tener menor densidad (~0,92 g/cm³), emerge parcialmente."
          />
          <FAQItem
            index="05"
            tag="Mecánica Clásica"
            q="¿Por qué sentimos que el suelo está quieto si la Tierra gira?"
            a="Nosotros, la atmósfera y los objetos cercanos compartimos gran parte del movimiento de rotación terrestre. No percibimos directamente un movimiento constante compartido; detectamos especialmente cambios en el movimiento (aceleraciones)."
            deep="Por el principio de relatividad galileano, dentro de un sistema que se mueve a velocidad prácticamente constante no percibimos el desplazamiento uniforme, del mismo modo que dentro de un avión en vuelo estable no sentimos sus 900 km/h."
          />
          <FAQItem
            index="06"
            tag="Interferencia Óptica"
            q="¿Por qué una burbuja de jabón muestra tantos colores?"
            a="La luz reflejada en las distintas superficies de la película de jabón puede interferir consigo misma. Dependiendo del espesor de la película, algunas longitudes de onda se refuerzan y otras se cancelan."
            deep="Este fenómeno se denomina interferencia en láminas delgadas: un rayo se refleja en la cara externa de la capa de agua y jabón, y otro en la cara interna. Al variar el grosor microscópico de la película por gravedad y evaporación, cambian las franjas de color."
          />
        </div>
      </div>
    </section>
  );
}
