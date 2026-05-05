import { motion, useMotionTemplate, useScroll, useTransform, useAnimationFrame, useMotionValue } from 'motion/react';
import { useRef, type FC } from 'react';
import OrbitImagesUntyped from './OrbitImages';

// OrbitImages is the verbatim spec component (// @ts-nocheck), so its prop
// types collapse to defaults like `images = []` (never[]). Cast at the boundary.
const OrbitImages = OrbitImagesUntyped as unknown as FC<Record<string, unknown>>;

const orbitImagesData: string[] = [
  '/assets/orbit/01.svg',
  '/assets/orbit/02.svg',
  '/assets/orbit/03.svg',
  '/assets/orbit/04.svg',
  '/assets/orbit/05.svg',
  '/assets/orbit/06.svg',
];

export default function ShamoniPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const rx = useTransform(scrollYProgress, [0, 0.08, 1], ['0%', '55%', '55%']);
  const ry = useTransform(scrollYProgress, [0, 0.08, 1], ['0%', '55%', '55%']);
  const clipPath = useMotionTemplate`ellipse(${rx} ${ry} at 50% 50%)`;

  const textOpacity = useTransform(scrollYProgress, [0.03, 0.08, 0.15, 0.22, 0.9, 0.98, 1], [0, 1, 1, 0, 0, 1, 1]);
  const textBlurVal = useTransform(scrollYProgress, [0.03, 0.08, 0.15, 0.22, 0.9, 0.98, 1], [15, 0, 0, 15, 15, 0, 0]);
  const filterText = useMotionTemplate`blur(${textBlurVal}px)`;
  const yElement = useTransform(scrollYProgress, [0.03, 0.08, 0.15, 0.22, 0.9, 0.98, 1], [20, 0, 0, 20, 20, 0, 0]);

  const targetRadius = 650;

  const orbitItemSize = useTransform(scrollYProgress, [0.15, 0.25, 0.85, 0.95, 1], [80, 520, 520, 80, 80]);
  const orbitRx = useTransform(scrollYProgress, [0.15, 0.25, 0.85, 0.95, 1], [330, targetRadius, targetRadius, 330, 330]);
  const orbitRy = useTransform(scrollYProgress, [0.15, 0.25, 0.85, 0.95, 1], [140, targetRadius, targetRadius, 140, 140]);
  const orbitRotation = useTransform(scrollYProgress, [0.15, 0.25, 0.85, 0.95, 1], [-15, 0, 0, -15, -15]);
  const orbitTx = useTransform(scrollYProgress, [0.15, 0.25, 0.85, 0.95, 1], [0, -targetRadius, -targetRadius, 0, 0]);
  const focusStrength = useTransform(scrollYProgress, [0.15, 0.25, 0.85, 0.95, 1], [0, 1, 1, 0, 0]);

  const orbitProgress = useMotionValue(0);
  const prevScroll = useRef(0);

  useAnimationFrame((time, delta) => {
    const pos = scrollYProgress.get();
    const scrollDelta = pos - prevScroll.current;
    prevScroll.current = pos;

    let frameSpeed = 0;
    if (pos > 0.15 && pos < 0.85) {
      frameSpeed = scrollDelta * 200;
    } else {
      frameSpeed = (delta / 1000) * 2.5;
    }

    orbitProgress.set(orbitProgress.get() + frameSpeed);
  });

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden text-white">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/Video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/10 z-0"></div>

        <div className="absolute z-10 w-[80vw]" style={{ left: '3vw', bottom: '3vw' }}>
          <svg viewBox="0 10 350 72" className="w-full h-auto drop-shadow-2xl overflow-visible" preserveAspectRatio="xMinYMax meet">
            <text x="-3" y="80" fontFamily="'Instrument Serif', serif" fill="#FDFFB7" className="select-none">
              <tspan fontSize="90">Avasar</tspan>
              <tspan fontSize="28.8" dx="4" dy="-40">©</tspan>
            </text>
          </svg>
        </div>

        <motion.div
          className="absolute z-20 flex items-center justify-center overflow-hidden"
          style={{ clipPath, rotate: -15, width: '150vw', height: '150vh', left: '-25vw', top: '-25vh' }}
        >
          <div className="absolute inset-0 bg-white" />
          <div
            className="relative flex flex-col items-center justify-center"
            style={{ width: '100vw', height: '100vh', transform: 'rotate(15deg)' }}
          >
            <motion.div className="w-[90vw] max-w-[1200px] aspect-square relative z-0">
              <OrbitImages
                images={orbitImagesData}
                shape="ellipse"
                direction="normal"
                duration={40}
                fill={true}
                showPath={false}
                responsive={true}
                baseWidth={800}
                progressOverride={orbitProgress}
                radiusXOverride={orbitRx}
                radiusYOverride={orbitRy}
                itemSizeOverride={orbitItemSize}
                rotationOverride={orbitRotation}
                translateXOverride={orbitTx}
                focusStrength={focusStrength}
              />
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute inset-0 z-[60] pointer-events-none">
          <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
            <motion.div
              className="flex flex-col items-center whitespace-nowrap pointer-events-auto"
              style={{
                filter: filterText,
                opacity: textOpacity,
                WebkitFontSmoothing: 'antialiased',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
              }}
            >
              <div className="flex items-baseline text-black leading-none mb-1">
                <span className="font-serif text-[45px] md:text-[55px] italic tracking-tight text-black">E</span>
                <span className="font-serif text-[45px] md:text-[55px] tracking-tight text-black">volve or Subserve</span>
              </div>
              <span className="font-sans text-[28px] md:text-[36px] tracking-tight text-black mt-[-5px]">choose</span>
            </motion.div>
          </div>

          <motion.div
            className="absolute top-32 right-[calc(6vw+150px)] md:right-[214px] flex flex-col items-start text-left pointer-events-auto cursor-text"
            style={{ y: yElement, filter: filterText, opacity: textOpacity }}
          >
            <span className="font-serif text-[40px] leading-none mb-3 text-black">2K26</span>
            <span className="font-serif text-[16px] uppercase tracking-widest text-black leading-[20px] text-left">
              JOIN THE COGNITIVE
              <br />
              TRANSITION
            </span>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-8 md:bottom-16 md:left-16 flex flex-col items-start text-black pointer-events-auto cursor-text"
            style={{ y: yElement, filter: filterText, opacity: textOpacity }}
          >
            <span className="font-serif text-[40px] leading-none mb-1 text-black">12 / 12</span>
            <span className="font-serif text-[16px] uppercase tracking-widest text-black">DISPATCH ARCHIVE</span>
          </motion.div>

          <div className="absolute bottom-16 right-[6vw] md:right-[10vw] flex flex-col items-start z-10 pointer-events-auto">
            <motion.p
              className="font-serif text-[16px] uppercase tracking-widest text-black leading-[20px] mb-6 text-left w-[240px] cursor-text"
              style={{ y: yElement, filter: filterText, opacity: textOpacity }}
            >
              THE WINDOW IS CLOSING. STEP THROUGH IT NOW, OR INHERIT THE FLOOR.
            </motion.p>
            <motion.div
              className="flex gap-0 pointer-events-auto items-center"
              style={{ y: yElement, filter: filterText, opacity: textOpacity }}
            >
              <button className="bg-black hover:bg-black/90 transition-colors text-white rounded-[40px] px-8 py-3.5 font-serif tracking-[0.1em] uppercase text-[12px] md:text-[14px] z-10">
                READ THE REPORT
              </button>
              <button className="bg-black hover:bg-black/90 transition-colors w-[46px] h-[46px] flex items-center justify-center rounded-[50%] text-white -ml-2 z-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        <motion.header
          className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-[100] pointer-events-none"
          style={{ opacity: textOpacity, filter: filterText }}
        >
          <div
            className="flex items-start text-black select-none leading-none pointer-events-auto"
            style={{ fontFamily: "'Instrument Serif', serif", WebkitFontSmoothing: 'antialiased' }}
          >
            <span style={{ fontSize: '40px' }}>Avasar</span>
            <span style={{ fontSize: '14px', marginLeft: '4px', marginTop: '4px' }}>©</span>
          </div>

          <button
            className="group relative flex items-center justify-center w-[72px] h-[44px] hover:scale-105 transition-transform duration-300 cursor-pointer pointer-events-auto"
            aria-label="Menu"
          >
            <div className="absolute inset-0 bg-black rounded-[50%] -rotate-15"></div>
            <svg
              className="relative z-10"
              width="24"
              height="10"
              viewBox="0 0 24 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1H23M1 9H23" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </motion.header>
      </div>
    </div>
  );
}
