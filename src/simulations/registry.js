import React from 'react';
import { Rocket, Triangle, Activity, Waves, Zap, Droplets, Orbit, Gauge, Sun, Wind, Waypoints } from 'lucide-react';
import ProjectileSimulation from './ProjectileSimulation';
import InclinedPlaneSimulation from './InclinedPlaneSimulation';
import PendulumSimulation from './PendulumSimulation';
import SpringSimulation from './SpringSimulation';
import CollisionSimulation from './CollisionSimulation';
import FreeFallSimulation from './FreeFallSimulation';
import OrbitSimulation from './OrbitSimulation';
import EvaporationSimulation from './EvaporationSimulation';
import WaveSuperpositionSimulation from './WaveSuperpositionSimulation';
import RippleTankSimulation from './RippleTankSimulation';
import OhmCircuitSimulation from './OhmCircuitSimulation';
import RefractionSimulation from './RefractionSimulation';

export const CATEGORIES = ['Todos', 'Mecánica', 'Ondas y luz', 'Electricidad', 'Termodinámica', 'Gravitación'];

/** Catálogo de simuladores: para agregar uno nuevo basta con crear el componente y registrarlo aquí. */
export const SIMULATORS = [
  {
    id: 'tiro-parabolico',
    category: 'Mecánica',
    title: 'Tiro parabólico',
    question: '¿Qué ángulo hace que un proyectil llegue más lejos?',
    icon: Rocket,
    accent: '#FFD166',
    Component: ProjectileSimulation
  },
  {
    id: 'plano-inclinado',
    category: 'Mecánica',
    title: 'Plano inclinado con rozamiento',
    question: '¿Por qué un objeto se queda quieto o desliza según la inclinación?',
    icon: Triangle,
    accent: '#4DEEEA',
    Component: InclinedPlaneSimulation
  },
  {
    id: 'caida-libre',
    category: 'Mecánica',
    title: 'Caída libre y resistencia del aire',
    question: '¿Una pluma cae más lento que una bola de acero… también en el vacío?',
    icon: Wind,
    accent: '#9B72CF',
    Component: FreeFallSimulation
  },
  {
    id: 'pendulo',
    category: 'Mecánica',
    title: 'Péndulo simple',
    question: '¿De qué depende el periodo de un péndulo?',
    icon: Activity,
    accent: '#9B72CF',
    Component: PendulumSimulation
  },
  {
    id: 'masa-resorte',
    category: 'Mecánica',
    title: 'Masa-resorte (movimiento armónico)',
    question: '¿Cómo cambia la oscilación si cambiamos la masa o la rigidez del resorte?',
    icon: Waypoints,
    accent: '#4DEEEA',
    Component: SpringSimulation
  },
  {
    id: 'colisiones',
    category: 'Mecánica',
    title: 'Colisiones en una dimensión',
    question: '¿Qué se conserva cuando chocan dos cuerpos?',
    icon: Gauge,
    accent: '#FFD166',
    Component: CollisionSimulation
  },
  {
    id: 'orbitas',
    category: 'Gravitación',
    title: 'Órbitas y gravedad',
    question: 'Si algo se mueve, ¿alguien debe estar empujándolo continuamente?',
    icon: Orbit,
    accent: '#9B72CF',
    Component: OrbitSimulation
  },
  {
    id: 'ondas',
    category: 'Ondas y luz',
    title: 'Superposición de ondas',
    question: '¿Qué pasa cuando dos ondas se encuentran?',
    icon: Waves,
    accent: '#4DEEEA',
    Component: WaveSuperpositionSimulation
  },
  {
    id: 'interferencia',
    category: 'Ondas y luz',
    title: 'Cubeta de ondas: interferencia de dos fuentes',
    question: '¿Por qué hay zonas donde el agua no se mueve?',
    icon: Waves,
    accent: '#9B72CF',
    Component: RippleTankSimulation
  },
  {
    id: 'refraccion',
    category: 'Ondas y luz',
    title: 'Refracción y reflexión de la luz',
    question: '¿Por qué un lápiz parece quebrarse dentro del agua?',
    icon: Sun,
    accent: '#FFD166',
    Component: RefractionSimulation
  },
  {
    id: 'ohm',
    category: 'Electricidad',
    title: 'Ley de Ohm: serie y paralelo',
    question: '¿Cómo se reparte la corriente entre varias resistencias?',
    icon: Zap,
    accent: '#FFD166',
    Component: OhmCircuitSimulation
  },
  {
    id: 'evaporacion',
    category: 'Termodinámica',
    title: 'Evaporación: ¿adónde se fue el agua?',
    question: '¿El agua se fue del charco o cambió de estado y se fue sin despedirse?',
    icon: Droplets,
    accent: '#4DEEEA',
    Component: EvaporationSimulation
  }
];
