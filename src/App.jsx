import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import NotebookPanel from './components/NotebookPanel';
import HomePage from './pages/HomePage';
import SimulatorsPage from './pages/SimulatorsPage';
import useNotes from './hooks/useNotes';
import useRoute from './hooks/useRoute';

export default function App() {
  const route = useRoute();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const { notes, saveNote, deleteNote, exportNotes } = useNotes();

  return (
    <div className="editorial-root bg-[#07111F] text-[#F2F5F7] min-h-screen overflow-x-hidden selection:bg-[#9B72CF] selection:text-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4DEEEA] via-[#9B72CF] to-[#FFD166] origin-left z-50 shadow-[0_0_12px_#4DEEEA]"
        style={{ scaleX }}
      />
      <Navbar route={route} />
      <NotebookPanel
        isOpen={isNotebookOpen}
        setIsOpen={setIsNotebookOpen}
        notes={notes}
        saveNote={saveNote}
        deleteNote={deleteNote}
        exportNotes={exportNotes}
      />
      {route === 'simuladores' ? (
        <SimulatorsPage />
      ) : (
        <HomePage saveNote={saveNote} setIsNotebookOpen={setIsNotebookOpen} />
      )}
    </div>
  );
}