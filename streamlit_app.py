"""El Universo de las Preguntas — envoltorio de Streamlit.

La página real es una aplicación React (carpeta `src/`). `npm run build:streamlit` la compila en un
único archivo autocontenido (`streamlit_static/index.html`) y este script lo incrusta en Streamlit.

Ejecución local:   streamlit run streamlit_app.py
Streamlit Cloud:   apunta el "Main file path" a `streamlit_app.py`.
"""
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="El Universo de las Preguntas",
    page_icon="🪐",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Oculta el marco de Streamlit para que la página ocupe toda la ventana.
st.markdown(
    """
    <style>
      #MainMenu, header, footer {visibility: hidden;}
      .stApp {background: #07111F;}
      .block-container {padding: 0 !important; max-width: 100% !important;}
      iframe {border: 0; display: block;}
    </style>
    """,
    unsafe_allow_html=True,
)

BUNDLE = Path(__file__).parent / "streamlit_static" / "index.html"

if BUNDLE.exists():
    components.html(BUNDLE.read_text(encoding="utf-8"), height=1000, scrolling=True)
else:
    st.error(
        "No se encontró `streamlit_static/index.html`. Ejecuta `npm install` y "
        "`npm run build:streamlit` y vuelve a lanzar la aplicación."
    )
