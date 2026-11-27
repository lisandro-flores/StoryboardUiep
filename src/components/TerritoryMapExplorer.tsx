import { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { TERRITORY_NODES, type TerritoryNode } from '../data/storyboard';
import { soundscape } from '../utils/soundscape';
import { BlurFade } from '@/components/ui/blur-fade';
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
      <section id="mapa-territorial" className="pb-20 pt-6 scroll-mt-28 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 border-t border-earth/25 pt-12 sm:pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl space-y-1.5">
              <BlurFade inView delay={0}>
                <p className="text-sm font-semibold text-terracotta">
                  Puntos revisados en la localidad
                </p>
              </BlurFade>
              <BlurFade inView delay={STAGGER}>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight [text-wrap:balance]">
                  Frentes de atención en San José Buenavista
                </h2>
              </BlurFade>
            </div>
            <BlurFade inView delay={STAGGER * 2}>
              <p className="text-sm text-ink-muted max-w-xs leading-relaxed">
                Elige uno de los cinco lugares para consultar qué se observó y qué mejora se propone.
              </p>
            </BlurFade>
          </div>

          {/* Pestañas sobrias estilo índice de plano (sin píldoras flotantes) */}
          <div
            role="tablist"
            aria-label="Puntos territoriales del diagnóstico"
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-b border-earth/25"
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
                  className={`relative shrink-0 px-3.5 py-2.5 text-sm transition-colors cursor-pointer ${
                    isSelected
                      ? 'font-semibold text-forest'
                      : 'font-medium text-ink-muted hover:text-ink'
                  }`}
                >
                  <span className="tabular-nums text-terracotta/85 mr-1.5 font-semibold">
                    0{idx + 1}.
                  </span>
                  <span>{node.zone}</span>
                  {isSelected && (
                    <motion.span
                      layoutId="activeTerritoryUnderline"
                      transition={SPRING_PILL}
                      className="absolute inset-x-0 -bottom-px h-[2.5px] bg-forest"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Mapa de ubicación con cabecera limpia */}
            <div className="lg:col-span-6 flex flex-col overflow-hidden rounded-card border border-earth/25 bg-cream-soft shadow-card min-h-[360px] sm:min-h-[440px]">
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-earth/20 bg-cream-soft">
                <span className="text-xs sm:text-sm font-semibold text-ink-soft">
                  San José Buenavista · CP 75685, Puebla
                </span>
                <a
                  href={MAP_PAGE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-forest underline underline-offset-4 hover:text-forest-dark"
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

            {/* Cédula del punto seleccionado: papel limpio y filetes divisorios, sin cajas pastel */}
            <div className="lg:col-span-6 flex">
              <div className="w-full rounded-card border border-earth/25 bg-cream-soft shadow-card">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNode.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.26, ease: EASE_OUT_EXPO }}
                    className="h-full p-5 sm:p-7 flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-4">
                      <figure className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => openNodePhoto(activeNode)}
                          aria-label={`Ampliar fotografía de ${activeNode.zone}`}
                          className="group relative block w-full overflow-hidden rounded-inner border border-earth/20 aspect-[16/9] bg-cream-deep cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                        >
                          <picture className="block h-full w-full transition-transform duration-500 ease-out-expo group-hover:scale-[1.025]">
                            <source srcSet={`${baseUrl}${activeNode.photoWebp}`} type="image/webp" />
                            <img
                              src={`${baseUrl}${activeNode.photoJpg}`}
                              alt={activeNode.zone}
                              style={{ objectPosition: activeNode.photoPosition }}
                              className="w-full h-full object-cover"
                            />
                          </picture>
                        </button>
                        <figcaption className="flex items-center justify-between text-xs text-ink-muted">
                          <span>Fotografía en sitio · {activeNode.zone}</span>
                          <span className="underline underline-offset-2">Clic para ampliar</span>
                        </figcaption>
                      </figure>

                      <div>
                        <h3 className="font-serif text-2xl sm:text-[1.65rem] font-bold text-ink leading-snug">
                          <span className="text-terracotta mr-2 tabular-nums">
                            0{selectedIndex + 1}.
                          </span>
                          {activeNode.zone}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-earth/20">
                        <div className="space-y-1.5">
                          <p className="text-xs font-bold uppercase tracking-wider text-terracotta">
                            Qué se observó
                          </p>
                          <p className="text-sm sm:text-[15px] text-ink-soft leading-relaxed">
                            {activeNode.diagnosis}
                          </p>
                        </div>

                        <div className="space-y-1.5 sm:border-l sm:border-earth/20 sm:pl-5">
                          <p className="text-xs font-bold uppercase tracking-wider text-forest">
                            Qué se propone
                          </p>
                          <p className="text-sm sm:text-[15px] text-ink leading-relaxed font-medium">
                            {activeNode.proposal}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3.5 border-t border-earth/20 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs sm:text-sm text-ink-muted italic flex-1">
                        {activeNode.benefit}
                      </p>
                      <button
                        type="button"
                        onClick={() => jumpToRelatedScene(activeNode.relatedScene)}
                        className="group inline-flex items-center gap-1.5 rounded-md bg-forest px-4 py-2 text-xs sm:text-sm font-semibold text-cream hover:bg-forest-dark transition-colors cursor-pointer shrink-0"
                      >
                        <span>Ir al paso 0{activeNode.relatedScene}</span>
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                          →
                        </span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
