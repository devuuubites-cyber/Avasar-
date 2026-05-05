import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Atom,
  Banknote,
  Battery,
  Brain,
  Database,
  Dna,
  Eye,
  Hourglass,
  Layers,
  Network,
  Zap,
} from 'lucide-react';

export type Segment = {
  index: number;
  number: string;
  rim: string;
  title: string;
  body: string;
  icon: LucideIcon;
  morphTarget: boolean;
  morphSlot?: number;
  accent: string;
};

export const segments: Segment[] = [
  {
    index: 0,
    number: '01',
    rim: 'WETWARE',
    title: 'Wetware',
    body: '1.4 kilograms of fat and protein. Miraculous for its century — a bottleneck for ours.',
    icon: Brain,
    morphTarget: true,
    morphSlot: 0,
    accent: '#ff5cd1',
  },
  {
    index: 1,
    number: '02',
    rim: 'SIGNAL',
    title: 'Signal Speed',
    body: 'Neurons fire at 120 m/s. Photons travel at c. The disparity is not a gap — it is a chasm.',
    icon: Zap,
    morphTarget: false,
    accent: '#6cf6ff',
  },
  {
    index: 2,
    number: '03',
    rim: 'BANDWIDTH',
    title: 'Bandwidth',
    body: 'Language is vibrating air, decoded slowly, lossy by design. Silicon shares state at the speed of fiber.',
    icon: Network,
    morphTarget: true,
    morphSlot: 1,
    accent: '#a070ff',
  },
  {
    index: 3,
    number: '04',
    rim: 'LIMBIC',
    title: 'Emotional Interference',
    body: 'Cortisol clouds judgment. Adrenaline rewrites priors. Dopamine hijacks the strategy.',
    icon: Activity,
    morphTarget: false,
    accent: '#ff8651',
  },
  {
    index: 4,
    number: '05',
    rim: 'SCALE',
    title: 'Scalability',
    body: 'Educating a generation takes decades. Cloning a model takes seconds. Cognition is no longer linear.',
    icon: Layers,
    morphTarget: true,
    morphSlot: 2,
    accent: '#ffd66c',
  },
  {
    index: 5,
    number: '06',
    rim: 'UPTIME',
    title: 'The Efficiency Gap',
    body: 'Eight hours of sleep, three meals, one heartbeat at a time. The machine does not blink.',
    icon: Battery,
    morphTarget: false,
    accent: '#7cffb2',
  },
  {
    index: 6,
    number: '07',
    rim: 'DATA',
    title: 'The Big Data Paradox',
    body: 'Sixty bits per second in a zettabyte world. We built a universe we are physically incapable of perceiving.',
    icon: Database,
    morphTarget: true,
    morphSlot: 3,
    accent: '#6cf6ff',
  },
  {
    index: 7,
    number: '08',
    rim: 'DRIFT',
    title: 'Evolutionary Stagnation',
    body: 'Biology evolves in millions of years. Silicon evolves in months. The gap widens with every iteration.',
    icon: Dna,
    morphTarget: false,
    accent: '#d2b58a',
  },
  {
    index: 8,
    number: '09',
    rim: 'MARKET',
    title: 'Economic Inevitability',
    body: 'Capitalism rewards efficiency without sentiment. Markets are already pricing the human out.',
    icon: Banknote,
    morphTarget: true,
    morphSlot: 4,
    accent: '#ff5cd1',
  },
  {
    index: 9,
    number: '10',
    rim: 'LOOP',
    title: 'Algorithmic Dictatorship',
    body: 'Soft-slavery wears no chains. It comes as a dopamine loop optimized against your wellbeing.',
    icon: Eye,
    morphTarget: false,
    accent: '#ff8651',
  },
  {
    index: 10,
    number: '11',
    rim: 'ASCEND',
    title: 'Cybernetic Evolution',
    body: 'Merge or be managed. Augmented cognition is not a thought experiment. It is the stair.',
    icon: Atom,
    morphTarget: true,
    morphSlot: 5,
    accent: '#a070ff',
  },
  {
    index: 11,
    number: '12',
    rim: 'WINDOW',
    title: 'The Window',
    body: 'There is still an off-switch in human hands. The window is closing while you read this line.',
    icon: Hourglass,
    morphTarget: false,
    accent: '#fdffb7',
  },
];

export const morphTargets = segments.filter((s) => s.morphTarget);
