import { useEffect, useState } from 'react';

// Enrutado por hash (#/simuladores): funciona en hosting estático y dentro del iframe de Streamlit.
const read = () => (window.location.hash.startsWith('#/simuladores') ? 'simuladores' : 'home');

export default function useRoute() {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onHash = () => {
      setRoute(read());
      if (!window.location.hash.startsWith('#/') || window.location.hash === '#/') {
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    // Los anclajes internos (#cap1, #hero...) se resuelven con scroll suave sin tocar la ruta.
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href.startsWith('#/') || href === '#') return;
      const target = document.getElementById(href.slice(1));
      e.preventDefault();
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = '#/';
        setTimeout(() => document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return route;
}