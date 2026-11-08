import React, { useEffect, useRef } from 'react';

/**
 * Lienzo de simulación con bucle de animación propio.
 *
 *  - El mundo se dibuja en unidades lógicas (width x height) y se escala a la pantalla
 *    (nítido en pantallas retina).
 *  - `onFrame(ctx, dt, t)` se llama en CADA fotograma con el tiempo real transcurrido,
 *    de modo que el movimiento es continuo y no depende de la tasa de refresco.
 *  - El bucle se pausa solo cuando el lienzo no está visible (ahorra CPU en páginas con muchos simuladores).
 *  - Los eventos de puntero llegan ya convertidos a coordenadas del mundo.
 */
export default function SimCanvas({
  width = 800,
  height = 450,
  onFrame,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  className = '',
  label = 'Simulación interactiva',
  cursor
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(onFrame);
  frameRef.current = onFrame;
  const handlers = useRef({});
  handlers.current = { onPointerDown, onPointerMove, onPointerUp };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let cssW = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = rect.width;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round((rect.width * height * dpr) / width));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        last = performance.now();
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || !frameRef.current || cssW === 0) return;
      const s = canvas.width / width;
      ctx.setTransform(s, 0, 0, s, 0, 0);
      frameRef.current(ctx, dt, now / 1000);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [width, height]);

  const toWorld = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * width,
      y: ((e.clientY - rect.top) / rect.height) * height
    };
  };

  const down = (e) => {
    if (!handlers.current.onPointerDown) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    handlers.current.onPointerDown(toWorld(e), e);
  };
  const move = (e) => handlers.current.onPointerMove?.(toWorld(e), e);
  const up = (e) => handlers.current.onPointerUp?.(toWorld(e), e);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={`w-full block touch-none select-none rounded-xl bg-[#07111F] ${className}`}
      style={{ aspectRatio: `${width} / ${height}`, cursor }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    />
  );
}
