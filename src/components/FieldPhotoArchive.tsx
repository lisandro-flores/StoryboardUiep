import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { REAL_PHOTO_ARCHIVE, type RealPhotoItem } from '../data/storyboard';
import { soundscape } from '../utils/soundscape';

interface FieldPhotoArchiveProps {
  baseUrl: string;
}

type FilterKey = 'todas' | RealPhotoItem['category'];

const FILTERS: { id: FilterKey; label: string }[] = [
  { id: 'todas', label: 'Todas las evidencias (10)' },
  { id: 'campo', label: 'Recorridos y encuestas en calle (5)' },
  { id: 'talleres', label: 'Juzgado de Paz y talleres vecinales (3)' },
  { id: 'gabinete', label: 'Análisis y diseño de propuestas (2)' },
];

export default function FieldPhotoArchive({ baseUrl }: FieldPhotoArchiveProps) {
  const [filter, setFilter] = useState<FilterKey>('todas');

  const filteredPhotos =
    filter === 'todas'
      ? REAL_PHOTO_ARCHIVE
      : REAL_PHOTO_ARCHIVE.filter((p) => p.category === filter);

  const openPhoto = (item: RealPhotoItem, index: number) => {
    soundscape.playHarmonicNote(index);
    window.dispatchEvent(
      new CustomEvent('uiep:open-photo', {
        detail: {
          jpg: `${baseUrl}${item.jpg}`,
          alt: item.alt,
          label: `EVIDENCIA EN CAMPO · ${item.location.toUpperCase()}`,
          subtitle: item.caption,
        },
      })
    );
  };

  return (
    <section id="bitacora-fotografica" className="pb-20 scroll-mt-28 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-forest font-medium">
              Transparencia y evidencia real
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink leading-tight">
              Bitácora fotográfica en San José Buenavista
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted max-w-xs">
            Toca cualquier fotografía para abrirla completa sin recorte y acercar cada detalle.
          </p>
        </div>

        {/* Filtros animados con layoutId */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id);
                  soundscape.playHarmonicNote(1);
                }}
                className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'text-cream'
                    : 'bg-cream-soft border border-earth/20 text-ink-soft hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeArchiveFilterPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-forest"
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cuadrícula editorial fluida */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((item, idx) => (
              <motion.figure
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => openPhoto(item, idx)}
                className="group m-0 rounded-[24px] bg-cream-soft border border-earth/20 overflow-hidden shadow-xs cursor-zoom-in flex flex-col justify-between"
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-cream-deep">
                  <picture>
                    <source srcSet={`${baseUrl}${item.webp}`} type="image/webp" />
                    <img
                      src={`${baseUrl}${item.jpg}`}
                      alt={item.alt}
                      loading="lazy"
                      style={{ objectPosition: item.objectPosition }}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </picture>
                  <div className="absolute top-3 left-3 rounded-full bg-cream-soft/90 backdrop-blur-xs border border-earth/15 px-2.5 py-0.5">
                    <span className="font-mono text-[10px] font-semibold text-forest">
                      {item.location}
                    </span>
                  </div>
                </div>

                <figcaption className="p-4 flex items-center justify-between gap-3">
                  <p className="text-xs sm:text-sm font-medium text-ink leading-snug">
                    {item.caption}
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-earth shrink-0">
                    Ampliar
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
