import { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { TERRITORY_NODES, type TerritoryNode } from '../data/storyboard';
import { soundscape } from '../utils/soundscape';
import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';
import { EASE_OUT_EXPO, SPRING_PILL, STAGGER } from '@/lib/motion';

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

  const openNodePhoto = (node: TerritoryNode) => {
    window.dispatchEvent(
      new CustomEvent('uiep:open-photo', {
        detail: {
          jpg: `${baseUrl}${node.photoJpg}`,
          alt: node.zone,
          label: `${node.code} · ${node.zone}`,
          subtitle: node.proposal,
        },
      })
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="mapa-territorial" className="pb-20 scroll-mt-28 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <BlurFade inView delay={0}>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-earth font-medium">
                  Cinco puntos del diagnóstico
                </p>
              </BlurFade>
              <BlurFade inView delay={STAGGER}>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink leading-tight [text-wrap:balance]">
                  Frentes de atención en San José Buenavista
                </h2>
              </BlurFade>
            </div>
            <BlurFade inView delay={STAGGER * 2}>
              <p className="text-xs sm:text-sm text-ink-muted max-w-xs">
                Selecciona un punto para consultar el hallazgo y la propuesta correspondiente.
              </p>
            </BlurFade>
          </div>

          <div
            role="tablist"
            aria-label="Puntos territoriales del diagnóstico"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
          >
            {TERRITORY_NODES.map((node, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={node.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(idx)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-cream'
                      : 'text-ink-soft bg-cream-soft border border-earth/20 hover:text-ink hover:border-earth/35'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="activeTerritoryPill"
                      transition={SPRING_PILL}
                      className="absolute inset-0 rounded-full bg-forest shadow-xs"
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
            {/* Mapa real con cabecera propia (sin superponerse a los controles nativos de Google Maps) */}
            <div className="lg:col-span-6 flex flex-col overflow-hidden rounded-card border border-earth/25 bg-cream-soft shadow-card min-h-[380px] sm:min-h-[460px]">
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-earth/15 bg-cream-soft/95">
                <span className="inline-flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                  <span className="h-2 w-2 rounded-full bg-forest" aria-hidden="true" />
                  San José Buenavista · CP 75685
                </span>
                <a
                  href={MAP_PAGE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-earth/20 bg-cream px-3 py-1 text-xs font-semibold text-forest transition-colors hover:bg-peach-pale/60"
                >
                  <span>Abrir en Google Maps</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="relative flex-1 bg-cream-deep">
                <iframe
                  src={MAP_EMBED_URL}
                  title="Mapa de San José Buenavista, código postal 75685, Puebla"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </div>

            {/* Ficha interactiva con luz cálida MagicCard + foto ampliable + diagnóstico + propuesta */}
            <div className="lg:col-span-6 flex">
              <MagicCard className="w-full shadow-card transition-shadow duration-500 hover:shadow-card-hover">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNode.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                    className="h-full p-5 sm:p-7 flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => openNodePhoto(activeNode)}
                        aria-label={`Ampliar fotografía de ${activeNode.zone}`}
                        className="group relative block w-full overflow-hidden rounded-inner border border-earth/15 aspect-[16/9] bg-cream-deep cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                      >
                        <picture className="block h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
                          <source srcSet={`${baseUrl}${activeNode.photoWebp}`} type="image/webp" />
                          <img
                            src={`${baseUrl}${activeNode.photoJpg}`}
                            alt={activeNode.zone}
                            style={{ objectPosition: activeNode.photoPosition }}
                            className="w-full h-full object-cover"
                          />
                        </picture>
                        <span className="absolute bottom-3 right-3 rounded-full bg-cream-soft/92 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-ink shadow-xs opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                          Ampliar foto
                        </span>
                      </button>

                      <div className="space-y-1">
                        <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-terracotta">
                          {activeNode.code}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink leading-snug">
                          {activeNode.zone}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-inner bg-rose-pale/45 border border-rose/60 p-3.5 space-y-1">
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-earth font-semibold">
                            Qué se detectó
                          </p>
                          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                            {activeNode.diagnosis}
                          </p>
                        </div>

                        <div className="rounded-inner bg-olive-pale/55 border border-olive/35 p-3.5 space-y-1">
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
                        className="group inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream hover:bg-forest-dark transition-colors cursor-pointer shrink-0"
                      >
                        <span>Ir a la tarjeta 0{activeNode.relatedScene}</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                          →
                        </span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </MagicCard>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
