import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, Play, Pause, Thermometer, Wind, X, Save, Edit3,
  Image as ImageIcon, ChevronRight, Zap, Droplets, RotateCcw, Sparkles, Compass,
  Atom, Eye, HelpCircle, FlaskConical, MessageSquareQuote, Download
} from 'lucide-react';


export default function InteractivePoint({ title, text, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#F2F5F7]/15 rounded-xl bg-[#07111F]/80 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex justify-between items-center font-display text-sm font-bold hover:bg-[#102A43]/40 transition-colors"
        style={{ color }}
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`transform transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="p-4 pt-2 text-xs sm:text-sm text-[#CBD5E1] border-t border-[#F2F5F7]/10 leading-relaxed">
          {text}
        </div>
      )}
    </div>
  );
}

// ==========================================
// CAPÍTULO VI: EL LABORATORIO DE PREGUNTAS
