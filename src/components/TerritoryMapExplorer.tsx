import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TERRITORY_NODES } from '../data/storyboard';
import { soundscape } from '../utils/soundscape';

interface TerritoryMapExplorerProps {
  baseUrl: string;
}

export default function TerritoryMapExplorer({ baseUrl }: TerritoryMapExplorerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeNode = TERRITORY_NODES[selectedIndex] ?? TERRITORY_NODES[0];

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    soundscape.playHarmonicNote(idx + 2);
  };

  const jumpToRelatedScene = (sceneNumber: number) => {
    window.dispatchEvent(
      new CustomEvent('uiep:goto-scene', { detail: { sceneNumber } })
    );
  };

  return (
    <section id="mapa-territorial" className="pb-20 scroll-mt-28 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-earth font-medium">
              Del diagnóstico a las propuestas reales
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink leading-tight">
              Frentes de atención en San José Buenavista
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xs">
            Toca cada punto para ver la fotografía real del sitio, la problemática detectada y la propuesta que se trabaja.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {TERRITORY_NODES.map((node, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-cream'
                    : 'text-ink-soft bg-cream-soft border border-earth/20 hover:text-ink'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeTerritoryPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-forest"
                  />
                )}
                <span className="relative z-10 font-mono mr-1.5 text-[11px] opacity-80">
                  0{idx + 1}
                </span>
                <span className="relative z-10">{node.zone}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Esquema territorial interactivo */}
          <div className="lg:col-span-6 relative rounded-[28px] bg-cream-soft border border-earth/25 overflow-hidden min-h-[340px] sm:min-h-[420px] shadow-[0_14px_40px_rgba(70,45,25,0.07)]">
            <svg
              viewBox="0 0 800 500"
              fill="none"
              className="w-full h-full object-cover absolute inset-0"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <rect width="800" height="500" fill="#F8EFE0" />
              <path
                d="M-40 130 C 140 50, 310 155, 510 85 C 650 35, 740 110, 850 75"
                stroke="#C9B396"
                strokeWidth="1.6"
              />
              <path
                d="M-30 175 C 160 95, 330 195, 530 125 C 670 75, 760 150, 860 115"
                stroke="#D6C3AA"
                strokeWidth="1.3"
                strokeDasharray="6 6"
              />
              <path
                d="M40 90 Q 175 18 310 95"
                fill="#E5ECD6"
                fillOpacity="0.65"
                stroke="#7D9154"
                strokeWidth="1.5"
              />
              <path
                d="M450 80 Q 610 10 760 95"
                fill="#E5ECD6"
                fillOpacity="0.55"
                stroke="#7D9154"
                strokeWidth="1.5"
              />
              <path
                d="M145 95 C 165 210, 215 275, 190 365 C 172 425, 210 470, 230 515"
                stroke="#B99A78"
                strokeWidth="22"
                strokeLinecap="round"
                opacity="0.35"
              />
              <path
                d="M145 95 C 165 210, 215 275, 190 365 C 172 425, 210 470, 230 515"
                stroke="#8E6545"
                strokeWidth="2"
                strokeDasharray="8 6"
              />
              <path
                d="M40 340 C 210 320, 380 280, 520 340 C 625 385, 710 350, 780 330"
                stroke="#EFE2CE"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M40 340 C 210 320, 380 280, 520 340 C 625 385, 710 350, 780 330"
                stroke="#8E6545"
                strokeWidth="2.2"
              />
              <path
                d="M370 185 L 415 295 L 495 335"
                stroke="#8E6545"
                strokeWidth="1.8"
              />
              <path
                d="M495 335 L 635 215"
                stroke="#8E6545"
                strokeWidth="1.8"
                strokeDasharray="5 5"
              />
              <rect
                x="335"
                y="165"
                width="68"
                height="42"
                rx="6"
                fill="#FBEAD4"
                stroke="#8E6545"
                strokeWidth="1.8"
              />
              <rect
                x="392"
                y="242"
                width="58"
                height="36"
                rx="6"
                fill="#F9E6E8"
                stroke="#8E6545"
                strokeWidth="1.8"
              />
              <rect
                x="595"
                y="188"
                width="54"
                height="38"
                rx="6"
                fill="#E5ECD6"
                stroke="#1F4A23"
                strokeWidth="1.6"
              />
              <rect
                x="168"
                y="306"
                width="48"
                height="18"
                rx="4"
                transform="rotate(-8 168 306)"
                fill="#F1C28B"
                stroke="#1F4A23"
                strokeWidth="2"
              />
            </svg>

            <div className="absolute top-4 left-4 rounded-full bg-cream-soft/90 backdrop-blur-xs border border-earth/20 px-3.5 py-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                Croquis participativo · San José Buenavista
              </span>
            </div>

            {TERRITORY_NODES.map((node, idx) => {
              const active = idx === selectedIndex;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  aria-label={`Seleccionar ${node.code}: ${node.zone}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                >
                  {active && (
                    <span
                      className="absolute inset-0 -m-2.5 rounded-full bg-terracotta/30 animate-ping"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-semibold border shadow-md transition-transform duration-200 ${
                      active
                        ? 'bg-forest text-cream border-cream scale-110'
                        : 'bg-cream-soft/95 text-ink border-earth/35 group-hover:scale-105'
                    }`}
                  >
                    <span>0{idx + 1}</span>
                    <span className="hidden sm:inline font-sans font-semibold">
                      {node.zone.split(' ')[0]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ficha con fotografía real del punto + diagnóstico + propuesta */}
          <div className="lg:col-span-6 flex">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full rounded-[28px] bg-cream-soft border border-earth/25 p-5 sm:p-7 shadow-sm flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-[18px] border border-earth/15 aspect-[16/9] bg-cream-deep">
                    <picture>
                      <source srcSet={`${baseUrl}${activeNode.photoWebp}`} type="image/webp" />
                      <img
                        src={`${baseUrl}${activeNode.photoJpg}`}
                        alt={activeNode.zone}
                        style={{ objectPosition: activeNode.photoPosition }}
                        className="w-full h-full object-cover"
                      />
                    </picture>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold tracking-wider text-terracotta">
                      {activeNode.code}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink">
                      {activeNode.zone}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-rose-pale/45 border border-rose/60 p-3.5 space-y-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-earth font-semibold">
                        Qué se detectó
                      </p>
                      <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                        {activeNode.diagnosis}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-olive-pale/55 border border-olive/35 p-3.5 space-y-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-forest font-semibold">
                        Qué se propone
                      </p>
                      <p className="text-xs sm:text-sm text-ink leading-relaxed font-medium">
                        {activeNode.proposal}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-earth/15 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-ink-muted font-medium flex-1">
                    {activeNode.benefit}
                  </p>
                  <button
                    type="button"
                    onClick={() => jumpToRelatedScene(activeNode.relatedScene)}
                    className="rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream hover:bg-forest-dark transition-colors cursor-pointer shrink-0"
                  >
                    Ir al paso 0{activeNode.relatedScene}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
