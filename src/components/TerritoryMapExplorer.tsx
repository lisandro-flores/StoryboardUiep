import { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { TERRITORY_NODES } from '../data/storyboard';
import { soundscape } from '../utils/soundscape';

interface TerritoryMapExplorerProps {
  baseUrl: string;
}

const MAP_QUERY = 'San José Buenavista, CP 75685, Tlacotepec de Benito Juárez, Puebla, México';
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;
const MAP_PAGE_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

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
    <MotionConfig reducedMotion="user">
    <section id="mapa-territorial" className="pb-20 scroll-mt-28 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-earth font-medium">
              Cinco puntos del diagnóstico
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink leading-tight">
              Frentes de atención en San José Buenavista
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xs">
            Selecciona un punto para consultar el hallazgo y la propuesta correspondiente.
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
          {/* Mapa real de la localidad y el código postal */}
          <div className="lg:col-span-6 relative min-h-[340px] sm:min-h-[420px] overflow-hidden rounded-[28px] border border-earth/25 bg-cream-deep shadow-[0_14px_40px_rgba(70,45,25,0.07)]">
            <iframe
              src={MAP_EMBED_URL}
              title="Mapa de San José Buenavista, código postal 75685, Puebla"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
            <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-earth/20 bg-cream-soft/95 px-3.5 py-1.5 shadow-sm">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                San José Buenavista · CP 75685
              </span>
            </div>
            <a
              href={MAP_PAGE_URL}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 right-3 rounded-full border border-earth/20 bg-cream-soft/95 px-3.5 py-2 text-xs font-semibold text-forest shadow-sm transition-colors hover:bg-white"
            >
              Abrir en Google Maps
            </a>
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
                    Ir a la tarjeta 0{activeNode.relatedScene}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}
