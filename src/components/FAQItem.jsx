import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, Play, Pause, Thermometer, Wind, X, Save, Edit3,
  Image as ImageIcon, ChevronRight, Zap, Droplets, RotateCcw, Sparkles, Compass,
  Atom, Eye, HelpCircle, FlaskConical, MessageSquareQuote, Download
} from 'lucide-react';


export default function FAQItem({ index, tag, q, a, deep }) {
  const [open, setOpen] = useState(false);
  const [showDeep, setShowDeep] = useState(false);

  return (
    <div className="glass-card border border-[#F2F5F7]/10 rounded-xl overflow-hidden transition-all hover:border-[#4DEEEA]/40 flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 sm:p-6 flex justify-between items-start gap-4 hover:bg-[#102A43]/40 transition-colors"
      >
        <div className="space-y-1.5 identity-question">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#4DEEEA] bg-[#4DEEEA]/10 px-2 py-0.5 rounded">
              {index}
            </span>
            <span className="type-label text-[11px] text-[#9B72CF]">{tag}</span>
          </div>
          <h4 className="type-card-title text-[#F2F5F7]">{q}</h4>
        </div>
        <ChevronDown
          size={20}
          className={`shrink-0 mt-1 transform transition-transform text-[#4DEEEA] ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#F2F5F7]/10 space-y-4">
              <p className="type-body text-sm sm:text-base text-[#E2E8F0]">{a}</p>

              <div>
                <button
                  onClick={() => setShowDeep(!showDeep)}
                  className="font-mono text-xs bg-[#102A43] border border-[#FFD166]/40 px-3.5 py-1.5 rounded-lg text-[#FFD166] hover:bg-[#FFD166] hover:text-[#07111F] transition-colors font-semibold"
                >
                  {showDeep ? 'Ocultar profundización' : 'Quiero profundizar'}
                </button>

                <AnimatePresence>
                  {showDeep && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mt-3 p-3.5 rounded-lg bg-[#07111F]/90 border-l-2 border-[#FFD166] text-xs sm:text-sm text-[#CBD5E1] leading-relaxed"
                    >
                      <span className="type-label text-[10px] text-[#FFD166] block mb-1">
                        Apunte Físico-Químico
                      </span>
                      {deep}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// CAPÍTULO IV: LAS VISIONES DE LA CIENCIA
