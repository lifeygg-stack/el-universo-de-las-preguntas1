import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Save, Edit3, Compass, Download } from 'lucide-react';

/** Botón flotante + panel lateral del Cuaderno del Explorador. */
export default function NotebookPanel({ isOpen, setIsOpen, notes, saveNote, deleteNote, exportNotes }) {
  const [newNote, setNewNote] = useState('');

  const handleSave = () => {
    if (saveNote(newNote, 'Reflexión')) setNewNote('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#102A43]/95 hover:bg-[#193B5A] text-[#F2F5F7] border border-[#9B72CF]/60 px-4 py-3.5 rounded-full shadow-[0_10px_30px_rgba(155,114,207,0.4)] transition-all hover:scale-105 flex items-center gap-2.5 group"
        title="Abrir Cuaderno del Explorador"
      >
        <BookOpen size={20} className="text-[#4DEEEA] group-hover:rotate-6 transition-transform" />
        <span className="font-display text-xs sm:text-sm font-semibold tracking-wide hidden sm:inline">
          Cuaderno del Explorador
        </span>
        {notes.length > 0 && (
          <span className="font-mono text-xs bg-[#9B72CF] text-white px-2 py-0.5 rounded-full">{notes.length}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, x: 360 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 360 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0B1D30]/95 backdrop-blur-2xl border-l border-[#4DEEEA]/25 z-50 shadow-2xl p-6 sm:p-8 flex flex-col"
          >
            <div className="flex justify-between items-start pb-5 mb-6 border-b border-[#F2F5F7]/10">
              <div>
                <span className="type-label text-[#4DEEEA] block mb-1">Bitácora de Campo Personal</span>
                <h2 className="font-display text-xl font-bold text-[#FFD166] flex items-center gap-2">
                  <Edit3 size={20} /> Cuaderno del Explorador
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#102A43] transition-colors"
                aria-label="Cerrar cuaderno"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {notes.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#F2F5F7]/15 bg-[#07111F]/40">
                  <Compass size={36} className="mx-auto mb-3 text-[#4DEEEA]/50" />
                  <p className="text-sm text-[#CBD5E1] font-medium mb-1">Tu bitácora aún no tiene registros</p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Guarda preguntas, hipótesis o hallazgos durante tu recorrido por los capítulos.
                  </p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-[#07111F]/80 p-4 rounded-xl border border-[#9B72CF]/35 relative group transition-all hover:border-[#4DEEEA]/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="type-label text-[10px] text-[#9B72CF] bg-[#9B72CF]/10 px-2 py-0.5 rounded">
                        {note.tag || 'Nota'}
                      </span>
                      <span className="font-mono text-[11px] text-[#94A3B8]">{note.date}</span>
                    </div>
                    <p className="text-sm text-[#F2F5F7] leading-relaxed pr-5">{note.text}</p>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="absolute top-3 right-3 text-[#94A3B8] hover:text-red-400 opacity-70 group-hover:opacity-100 transition-opacity"
                      title="Eliminar anotación"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-[#F2F5F7]/10 space-y-3">
              <label className="type-label text-[#4DEEEA] block">Registrar nueva pregunta o reflexión</label>
              <textarea
                className="w-full bg-[#07111F] text-[#F2F5F7] placeholder-[#64748B] border border-[#4DEEEA]/30 rounded-xl p-3.5 text-sm focus:outline-none focus:border-[#4DEEEA] resize-none leading-relaxed"
                rows="3"
                placeholder="Anota una pregunta, una observación o una hipótesis..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#4DEEEA] text-[#07111F] font-display font-bold text-sm py-2.5 px-4 rounded-xl hover:bg-[#3bc2be] transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Guardar Anotación
                </button>
                {notes.length > 0 && (
                  <button
                    onClick={exportNotes}
                    className="bg-[#102A43] text-[#F2F5F7] border border-[#F2F5F7]/20 hover:border-[#4DEEEA] px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-center"
                    title="Exportar bitácora en texto (.txt)"
                  >
                    <Download size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}