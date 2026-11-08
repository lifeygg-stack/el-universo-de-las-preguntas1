# El Universo de las Preguntas

Sitio editorial interactivo sobre didáctica de las ciencias naturales: seis capítulos, un cuaderno del explorador y un **laboratorio de simuladores de física** en una subpágina propia (`#/simuladores`).

Construido con React + Vite + Tailwind CSS + Framer Motion. Se puede publicar como sitio estático o dentro de Streamlit.

## Estructura

```
├── index.html                 Entrada de Vite (fuentes, metadatos)
├── src/
│   ├── main.jsx · App.jsx     Arranque y composición (barra de progreso, navegación, cuaderno)
│   ├── styles/editorial.css   Sistema de diseño (tipografía, tarjetas, identidades visuales)
│   ├── assets/                Imágenes (registro del caramelo escaso)
│   ├── pages/                 HomePage (la historia) · SimulatorsPage (laboratorio)
│   ├── sections/              Portada, Capítulos I–VI y cierre
│   ├── components/            Navbar, NotebookPanel, SectionTitle, FAQItem, EditorialPullQuote…
│   ├── hooks/                 useNotes (localStorage), useRoute (enrutado por hash)
│   └── simulations/
│       ├── core/              SimCanvas (canvas + bucle rAF), ui (sliders, lecturas), draw (utilidades)
│       ├── registry.js        Catálogo de simuladores (agrega aquí uno nuevo)
│       └── *Simulation.jsx    12 simuladores
├── streamlit_app.py           Envoltorio para Streamlit
├── streamlit_static/          Build de un solo archivo que usa Streamlit (se versiona)
├── requirements.txt           Dependencias de Streamlit
└── .streamlit/config.toml     Tema oscuro
```

## Simuladores

Tiro parabólico · Plano inclinado con rozamiento · Caída libre y resistencia del aire · Péndulo simple · Masa-resorte · Colisiones 1D · Órbitas y gravedad · Superposición de ondas · Cubeta de ondas (interferencia) · Refracción de la luz (Snell) · Ley de Ohm (serie/paralelo) · Evaporación.

**Animaciones fluidas:** cada simulador dibuja en `<canvas>` con un bucle `requestAnimationFrame` que integra la física con el tiempo real transcurrido (pasos pequeños, RK4/leapfrog), en lugar de avanzar un paso fijo por temporizador. Las estelas, partículas y vectores se actualizan en cada fotograma y el bucle se pausa cuando el simulador no está a la vista.

## Desarrollo local

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # sitio estático en dist/
```

## Despliegue en Streamlit

1. Genera el bundle (solo cuando cambies el código de `src/`):
   ```bash
   npm run build:streamlit
   ```
   Esto crea `streamlit_static/index.html` (HTML + JS + CSS + imagen en un solo archivo). **Debe subirse al repositorio.**
2. Prueba en local:
   ```bash
   pip install -r requirements.txt
   streamlit run streamlit_app.py
   ```
3. En [share.streamlit.io](https://share.streamlit.io) crea una app nueva apuntando a este repositorio, rama `main` y archivo principal `streamlit_app.py`.

> La página se incrusta en un iframe de Streamlit. Las fuentes de Google se cargan desde internet.
