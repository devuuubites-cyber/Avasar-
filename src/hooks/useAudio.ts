import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type AudioState = {
  unlocked: boolean;
  muted: boolean;
};

class AudioEngine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  whirNodes: { osc: OscillatorNode; lfo: OscillatorNode; lfoGain: GainNode; gain: GainNode } | null = null;
  whirGain = 0;
  muted = true;
  unlocked = false;

  unlock() {
    if (this.unlocked) return;
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    if (!Ctx) return;
    try {
      this.ctx = new Ctx({ latencyHint: 'interactive' });
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
      // Resume if suspended
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      // Create whir loop
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 60;
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 1.6;
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 8;
      lfo.connect(lfoGain).connect(osc.frequency);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 220;
      const gain = this.ctx.createGain();
      gain.gain.value = 0;
      osc.connect(filter).connect(gain).connect(this.master);
      osc.start();
      lfo.start();
      this.whirNodes = { osc, lfo, lfoGain, gain };
      this.unlocked = true;
    } catch {
      /* swallow */
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : 1;
  }

  setWhir(level: number) {
    this.whirGain = Math.max(0, Math.min(1, level));
    if (!this.whirNodes || !this.ctx) return;
    const target = this.whirGain * 0.32;
    this.whirNodes.gain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
  }

  tick() {
    if (!this.ctx || !this.master || this.muted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(620, t + 0.05);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    osc.connect(gain).connect(this.master);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  boom() {
    if (!this.ctx || !this.master || this.muted) return;
    const t = this.ctx.currentTime;
    // sub thump
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(180, t);
    sub.frequency.exponentialRampToValueAtTime(40, t + 1.2);
    subGain.gain.setValueAtTime(0.0001, t);
    subGain.gain.exponentialRampToValueAtTime(0.55, t + 0.04);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    sub.connect(subGain).connect(this.master);
    sub.start(t);
    sub.stop(t + 1.5);
    // noise tail
    const bufferSize = 2 * (this.ctx.sampleRate || 44100);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 800;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    noise.connect(noiseFilter).connect(noiseGain).connect(this.master);
    noise.start(t);
    noise.stop(t + 1.7);
  }
}

let engine: AudioEngine | null = null;
function getEngine() {
  if (!engine) engine = new AudioEngine();
  return engine;
}

export function useAudio() {
  const [state, setState] = useState<AudioState>({ unlocked: false, muted: true });
  const eng = useMemo(getEngine, []);

  useEffect(() => {
    const onGesture = () => {
      eng.unlock();
      setState({ unlocked: eng.unlocked, muted: eng.muted });
    };
    const evts: (keyof WindowEventMap)[] = ['pointerdown', 'wheel', 'keydown', 'touchstart'];
    evts.forEach((e) => window.addEventListener(e, onGesture, { once: true, passive: true }));
    return () => evts.forEach((e) => window.removeEventListener(e, onGesture));
  }, [eng]);

  const toggleMute = useCallback(() => {
    eng.unlock();
    eng.setMuted(!eng.muted);
    setState({ unlocked: eng.unlocked, muted: eng.muted });
  }, [eng]);

  const setWhir = useCallback((v: number) => eng.setWhir(v), [eng]);
  const tick = useCallback(() => eng.tick(), [eng]);
  const boom = useCallback(() => eng.boom(), [eng]);

  return { ...state, toggleMute, setWhir, tick, boom };
}
