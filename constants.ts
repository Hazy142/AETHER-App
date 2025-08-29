
import { Chakra } from './types';

export const BINAURAL_BASE_HZ = 120;

export const CHAKRAS: Chakra[] = [
  {
    name: 'Root',
    color: '#ef4444', // red-500
    minHz: 1,
    maxHz: 4,
    defaultHz: 2.5,
    description: 'Grounding, Stability, Security'
  },
  {
    name: 'Sacral',
    color: '#f97316', // orange-500
    minHz: 4,
    maxHz: 8,
    defaultHz: 6,
    description: 'Creativity, Emotion, Sensuality'
  },
  {
    name: 'Solar Plexus',
    color: '#eab308', // yellow-500
    minHz: 8,
    maxHz: 12,
    defaultHz: 10,
    description: 'Confidence, Power, Self-esteem'
  },
  {
    name: 'Heart',
    color: '#22c55e', // green-500
    minHz: 10,
    maxHz: 14,
    defaultHz: 12,
    description: 'Love, Compassion, Connection'
  },
  {
    name: 'Throat',
    color: '#3b82f6', // blue-500
    minHz: 15,
    maxHz: 20,
    defaultHz: 17.5,
    description: 'Communication, Truth, Expression'
  },
  {
    name: 'Third Eye',
    color: '#8b5cf6', // violet-500
    minHz: 30,
    maxHz: 40,
    defaultHz: 35,
    description: 'Intuition, Imagination, Wisdom'
  },
  {
    name: 'Crown',
    color: '#d946ef', // fuchsia-500
    minHz: 40,
    maxHz: 60,
    defaultHz: 50,
    description: 'Spirituality, Consciousness, Bliss'
  },
];
