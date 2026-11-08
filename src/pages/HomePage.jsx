import React from 'react';
import HeroSection from '../sections/HeroSection';
import Chapter1 from '../sections/Chapter1';
import Chapter2 from '../sections/Chapter2';
import Chapter3 from '../sections/Chapter3';
import Chapter4 from '../sections/Chapter4';
import Chapter5 from '../sections/Chapter5';
import Chapter6 from '../sections/Chapter6';
import ClosingSection from '../sections/ClosingSection';

export default function HomePage({ saveNote, setIsNotebookOpen }) {
  return (
    <main className="relative">
      <HeroSection />
      <Chapter1 />
      <Chapter2 />
      <Chapter3 />
      <Chapter4 />
      <Chapter5 />
      <Chapter6 saveNote={saveNote} setIsNotebookOpen={setIsNotebookOpen} />
      <ClosingSection saveNote={saveNote} setIsNotebookOpen={setIsNotebookOpen} />
    </main>
  );
}