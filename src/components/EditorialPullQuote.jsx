import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, Play, Pause, Thermometer, Wind, X, Save, Edit3,
  Image as ImageIcon, ChevronRight, Zap, Droplets, RotateCcw, Sparkles, Compass,
  Atom, Eye, HelpCircle, FlaskConical, MessageSquareQuote, Download
} from 'lucide-react';


export default function EditorialPullQuote({ quote, context }) {
  return (
    <blockquote className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#102A43]/70 via-[#102A43]/40 to-transparent border-l-4 border-[#9B72CF] my-8">
      <MessageSquareQuote
        size={28}
        className="text-[#4DEEEA]/40 mb-3"
        aria-hidden="true"
      />
      <p className="type-quote text-[#F2F5F7] mb-3">&ldquo;{quote}&rdquo;</p>
      {context && (
        <footer className="font-mono text-xs uppercase tracking-widest text-[#4DEEEA]">
          — {context}
        </footer>
      )}
    </blockquote>
  );
}
