import { useEffect, useState } from 'react';

const STORAGE_KEY = 'universo_preguntas_notas';

/** Cuaderno del Explorador: notas persistentes en localStorage. */
export default function useNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setNotes(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading notes', e);
    }
  }, []);

  const persist = (updated) => {
    setNotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving notes', e);
    }
  };

  const saveNote = (text, tag = 'Exploración') => {
    if (!text.trim()) return false;
    persist([
      ...notes,
      {
        id: Date.now(),
        text,
        tag,
        date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
      }
    ]);
    return true;
  };

  const deleteNote = (id) => persist(notes.filter((n) => n.id !== id));

  const exportNotes = () => {
    if (notes.length === 0) return;
    const content = [
      'CUADERNO DEL EXPLORADOR — EL UNIVERSO DE LAS PREGUNTAS',
      '======================================================',
      '',
      ...notes.map((n, idx) => `[${idx + 1}] (${n.date} · ${n.tag})\n${n.text}\n`)
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cuaderno-del-explorador.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return { notes, saveNote, deleteNote, exportNotes };
}