# El Universo de las Preguntas 🌌

Proyecto web modularizado a partir del documento original de divulgación y didáctica de la física: *"El Universo de las Preguntas: ¿Cómo enseñar física sin matar la curiosidad?"*.

Incluye un sitio editorial completo interactivo, un cuaderno de notas dinámico, soporte directo para **Streamlit**, y una **subpágina dedicada con 12 simuladores de física fluidos y realistas** desarrollados con HTML5 Canvas y física continua (`requestAnimationFrame`).

---

## 📁 Estructura del Proyecto

```
el-universo-de-las-preguntas1/
├── streamlit_app.py                # Wrapper para ejecutar directamente en Streamlit Cloud o local
├── streamlit_static/
│   └── index.html                  # Bundle autocontenido generado por vite-plugin-singlefile
├── requirements.txt                # Dependencias Python (streamlit)
├── .streamlit/
│   └── config.toml                 # Configuración de tema oscuro (#07111F)
├── index.html                      # Entrada HTML para desarrollo Vite
├── vite.config.js                  # Configuración dual (modo dist estándar y modo streamlit singlefile)
├── tailwind.config.js              # Configuración de Tailwind CSS
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                    # Punto de entrada React
    ├── App.jsx                     # Enrutador por hash (#/ y #/simuladores) y drawer del cuaderno
    ├── index.css                   # Tailwind + variables de diseño
    ├── styles/
    │   └── editorial.css           # Estilos tipográficos y estéticos extraídos
    ├── assets/
    │   └── caramelo-escaso.jpg     # Imagen extraída del Base64 original (109 KB)
    ├── hooks/
    │   ├── useNotes.js             # Lógica de notas con persistencia en localStorage
    │   └── useRoute.js             # Enrutamiento hash compatible con iframes de Streamlit
    ├── components/
    │   ├── Navbar.jsx              # Barra de navegación con enlace directo a simuladores
    │   ├── NotebookPanel.jsx       # Panel de notas y reflexiones del usuario
    │   ├── SectionTitle.jsx
    │   ├── EditorialPullQuote.jsx
    │   ├── FAQItem.jsx
    │   └── InteractivePoint.jsx
    ├── sections/                   # Modularización de cada capítulo del libro/guía
    │   ├── HeroSection.jsx
    │   ├── Chapter1.jsx            # Las cuatro trampas de la enseñanza tradicional
    │   ├── Chapter2.jsx            # El método de las preguntas generativas
    │   ├── Chapter3.jsx            # Laboratorio de Física Viva (con CTA a subpágina)
    │   ├── Chapter4.jsx            # Diez experimentos que transforman el aula
    │   ├── Chapter5.jsx            # La evaluación como brújula, no como martillo
    │   ├── Chapter6.jsx            # Preguntas frecuentes del docente
    │   └── ClosingSection.jsx       # Conclusión y manifiesto
    ├── pages/
    │   ├── HomePage.jsx            # Página editorial principal
    │   └── SimulatorsPage.jsx      # Subpágina dedicada a la suite de simuladores
    └── simulations/                # Motores de física desacoplados de React con Canvas fluido
        ├── core/
        │   ├── SimCanvas.jsx       # Canvas con sub-stepping y auto-pause offscreen
        │   ├── draw.js             # Renderizado: vectores, resplandores, partículas, estelas
        │   └── ui.jsx              # Controles throttled a 60fps (sliders, botones, presets)
        ├── registry.js             # Registro, filtros por categoría y metadatos de los 12 simuladores
        ├── ProjectileSimulation.jsx     # Tiro parabólico con vectores vx/vy
        ├── InclinedPlaneSimulation.jsx   # Plano inclinado con fricción estática/dinámica
        ├── FreeFallSimulation.jsx        # Caída libre (esfera vs pluma en vacío / aire)
        ├── PendulumSimulation.jsx        # Péndulo simple (integración RK4, espacio fásico)
        ├── SpringSimulation.jsx          # Oscilador armónico con amortiguamiento
        ├── CollisionSimulation.jsx       # Choques 1D elásticos e inelásticos
        ├── OrbitSimulation.jsx           # Órbitas gravitatorias con vector interactivo
        ├── EvaporationSimulation.jsx     # Evaporación molecular y viento
        ├── WaveSuperpositionSimulation.jsx # Superposición de ondas y pulsos
        ├── RippleTankSimulation.jsx      # Cubeta de ondas 2D e interferencia
        ├── OhmCircuitSimulation.jsx      # Ley de Ohm, circuitos serie/paralelo y calor Joule
        └── RefractionSimulation.jsx      # Refracción, reflexión interna total y Ley de Snell
```

---

## 🚀 Despliegue en Streamlit Cloud

El proyecto está 100% preparado para ser subido directamente a **Streamlit Cloud**:

1. Sube este repositorio a tu cuenta de GitHub (por ejemplo: `https://github.com/TU_USUARIO/el-universo-de-las-preguntas1`).
2. Entra en [share.streamlit.io](https://share.streamlit.io).
3. Selecciona tu repositorio `el-universo-de-las-preguntas1`, branch `main`.
4. Especifica el archivo principal: `streamlit_app.py`.
5. ¡Listo! Streamlit levantará la aplicación web con la página completa y la subpágina interactiva de simuladores sin dependencias externas pesadas.

---

## 💻 Ejecución Local

### Opción 1: Desarrollo Web Frontend (Vite)
Para modificar la interfaz o los simuladores con recarga en vivo (Hot Module Reload):
```bash
npm install
npm run dev
```
Abre en tu navegador: `http://localhost:5173/`

Para reconstruir el bundle estático de Streamlit:
```bash
npm run build:streamlit
```

### Opción 2: Servidor Streamlit
```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```
Abre en tu navegador: `http://localhost:8501/`

---

## 📤 Subir a tu cuenta de GitHub

Para vincular este repositorio con tu usuario de GitHub:

```bash
# 1. Inicia sesión en GitHub CLI (si lo tienes instalado):
gh auth login

# 2. O configura la URL de tu repositorio remoto directamente:
git remote set-url origin https://github.com/TU_USUARIO/el-universo-de-las-preguntas1.git

# 3. Empuja los cambios:
git push -u origin main
```
