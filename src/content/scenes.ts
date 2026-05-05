export type Scene = { id: number; tag: string; title: string; body: string };

export const hero = {
  tag: 'AVASAR // FUTURE STUDIES 24',
  title: 'THE CASE\nAGAINST HUMAN\nINTELLIGENCE',
  sub: 'Six dispatches on the cybernetic threshold.',
};

export const scenes: Scene[] = [
  {
    id: 1,
    tag: 'WETWARE',
    title: 'WETWARE',
    body: '1.4kg of fat and protein. Miraculous for its century — a bottleneck for ours.',
  },
  {
    id: 2,
    tag: 'BANDWIDTH',
    title: 'BANDWIDTH',
    body: 'Language is vibrating air, decoded slowly. Silicon shares state at the speed of fiber.',
  },
  {
    id: 3,
    tag: 'SCALE',
    title: 'SCALE',
    body: 'Educating a generation takes decades. Cloning a model takes seconds.',
  },
  {
    id: 4,
    tag: 'MARKET',
    title: 'MARKET',
    body: 'Capitalism rewards efficiency without sentiment. The human is being priced out.',
  },
  {
    id: 5,
    tag: 'LOOP',
    title: 'THE LOOP',
    body: 'Soft-slavery wears no chains. It comes as a dopamine loop optimized against you.',
  },
  {
    id: 6,
    tag: 'WINDOW',
    title: 'THE WINDOW',
    body: 'There is still an off-switch in human hands. The window is closing while you read this line.',
  },
];
