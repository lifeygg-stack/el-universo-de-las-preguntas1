import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, Play, Pause, Thermometer, Wind, X, Save, Edit3,
  Image as ImageIcon, ChevronRight, Zap, Droplets, RotateCcw, Sparkles, Compass,
  Atom, Eye, HelpCircle, FlaskConical, MessageSquareQuote, Download
} from 'lucide-react';


export default function SectionTitle({ chapter, domain, title, subtitle }) {
  return (
    <header className="identity-chapter mb-12 border-b border-[#F2F5F7]/10 pb-8">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="type-label text-[#07111F] bg-[#4DEEEA] px-3 py-1 rounded-full font-bold">
          Capítulo {chapter}
        </span>
        {domain && (
          <span className="type-label text-[#9B72CF] border border-[#9B72CF]/40 px-3 py-1 rounded-full">
            {domain}
          </span>
        )}
      </div>
      <h2 className="type-chapter-title mt-2 mb-3">{title}</h2>
      {subtitle && <p className="type-section-subtitle text-[#CBD5E1] max-w-3xl">{subtitle}</p>}
    </header>
  );
}
