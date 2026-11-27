import { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { PARTICIPATION_STEPS, BRIGADE_TEAM } from '../data/storyboard';
import { BlurFade } from '@/components/ui/blur-fade';
import { EASE_OUT_EXPO, STAGGER } from '@/lib/motion';

interface CommunityClosingProps {
  baseUrl?: string;
}

const COMMUNITY_IMPACTS = [
  'Mayor participación de las familias en las decisiones locales.',
  'Mejora gradual en caminos, cruces y accesos comunitarios.',
  'Propuestas técnicas realistas acordes al entorno de la localidad.',
  'Trabajo continuo entre San José Buenavista y la universidad.',
];

export default function CommunityClosing({ baseUrl = '/' }: CommunityClosingProps) {
  const [teamOpen, setTeamOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <section id="como-participar" className="pb-20 pt-2 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Bloque editorial en dos columnas sobre papel, sin cajas anidadas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-y border-earth/25 py-9 sm:py-11">
            <BlurFade inView delay={0} className="lg:col-span-5 space-y-2.5">
              <p className="text-sm font-semibold text-terracotta">Para qué sirve</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink leading-snug">
                ¿Para qué se realiza este diagnóstico?
              </h2>
              <p className="text-base text-ink-soft leading-relaxed">
                Para reunir y ordenar las prioridades que expresan quienes viven en San José
                Buenavista y contar con una base clara al momento de diseñar y gestionar mejoras
                junto con sus autoridades.
              </p>
            </BlurFade>

            <BlurFade
              inView
              delay={STAGGER}
              className="lg:col-span-7 lg:border-l lg:border-earth/20 lg:pl-10 space-y-3"
            >
              <p className="text-sm font-semibold text-forest">
                Cambios que se busca impulsar
              </p>
              <p className="text-sm text-ink-muted">
                Son metas del proceso conjunto; las propuestas se revisan y validan antes de
                cualquier obra.
              </p>
              <ul className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm sm:text-base text-ink-soft">
                {COMMUNITY_IMPACTS.map((impact) => (
                  <li key={impact} className="flex items-start gap-2.5">
                    <span className="text-terracotta font-bold select-none" aria-hidden="true">
                      —
                    </span>
                    <span>{impact}</span>
                  </li>
                ))}
              </ul>
            </BlurFade>
          </div>

          {/* Tres columnas limpias con numeración editorial impresa */}
          <div className="space-y-7">
            <div className="max-w-2xl space-y-1.5">
              <BlurFade inView delay={0}>
                <p className="text-sm font-semibold text-forest">Participación vecinal</p>
              </BlurFade>
              <BlurFade inView delay={STAGGER}>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
                  ¿Cómo puedes participar?
                </h2>
              </BlurFade>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-8">
              {PARTICIPATION_STEPS.map((item, idx) => (
                <BlurFade key={item.step} inView delay={idx * STAGGER}>
                  <article className="border-t-2 border-forest/80 pt-4 space-y-2">
                    <span className="block font-serif text-3xl font-bold text-terracotta tabular-nums">
                      {idx + 1}.
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                      {item.description}
                    </p>
                  </article>
                </BlurFade>
              ))}
            </div>
          </div>

          {/* Colofón desplegable del equipo universitario */}
          <div className="rounded-card border border-earth/25 bg-cream-soft overflow-hidden">
            <button
              type="button"
              onClick={() => setTeamOpen((open) => !open)}
              aria-expanded={teamOpen}
              aria-controls="brigade-team-panel"
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-cream-deep/35 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-forest"
            >
              <span>
                <span className="block font-serif text-lg sm:text-xl font-bold text-ink">
                  Conoce al equipo de trabajo de la UIEP
                </span>
                <span className="mt-0.5 block text-xs sm:text-sm text-ink-muted">
                  Ingeniería Civil Sustentable · Asesor y {BRIGADE_TEAM.students.length} estudiantes
                </span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-forest underline underline-offset-4 no-print shrink-0">
                {teamOpen ? 'Ocultar lista' : 'Ver integrantes'}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {teamOpen && (
                <motion.div
                  id="brigade-team-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-earth/20 px-5 py-5 space-y-4">
                    <p className="text-sm sm:text-base text-ink-soft">
                      Asesor de brigada:{' '}
                      <strong className="font-semibold text-ink">{BRIGADE_TEAM.advisor}</strong>
                    </p>
                    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm sm:text-base text-ink-soft list-decimal list-inside">
                      {BRIGADE_TEAM.students.map((student) => (
                        <li key={student} className="marker:text-earth marker:font-semibold">
                          {student}
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cierre editorial sobrio sobre papel */}
          <footer className="border-t-2 border-earth/30 pt-10 text-center space-y-4">
            <img
              src={`${baseUrl}assets/uieplogo-transparent.png`}
              alt="Universidad Intercultural del Estado de Puebla"
              width={120}
              height={90}
              loading="lazy"
              className="mx-auto h-12 w-auto object-contain"
            />
            <p className="font-serif italic text-2xl sm:text-4xl font-bold text-ink leading-tight max-w-2xl mx-auto [text-wrap:balance]">
              ¡Juntos construimos un mejor San José Buenavista!
            </p>
            <p className="text-sm sm:text-base text-ink-soft max-w-xl mx-auto leading-relaxed">
              Gracias a las familias, comités y autoridades de la comunidad por abrirnos sus puertas
              y trabajar en equipo con la Universidad Intercultural del Estado de Puebla.
            </p>
            <div className="pt-2 no-print">
              <button
                type="button"
                onClick={() => {
                  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  if (prefersReduced) {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                  } else {
                    window.dispatchEvent(
                      new CustomEvent('uiep:lenis-scroll', { detail: { target: 0 } })
                    );
                  }
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest underline underline-offset-4 hover:text-forest-dark cursor-pointer"
              >
                <span>Volver al inicio</span>
                <span aria-hidden="true">↑</span>
              </button>
            </div>
          </footer>
        </div>
      </section>
    </MotionConfig>
  );
}
