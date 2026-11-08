import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`            -> dist/ (sitio estático normal, p. ej. GitHub Pages)
// `npm run build:streamlit`  -> streamlit_static/index.html (un solo archivo autocontenido
//                               que `streamlit_app.py` incrusta con components.html)
export default defineConfig(({ mode }) => {
  const streamlit = mode === 'streamlit';
  return {
    base: './',
    plugins: [react(), ...(streamlit ? [viteSingleFile()] : [])],
    build: {
      outDir: streamlit ? 'streamlit_static' : 'dist',
      emptyOutDir: true,
      assetsInlineLimit: streamlit ? 100000000 : 4096
    }
  };
});