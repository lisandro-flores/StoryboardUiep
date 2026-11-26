import { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { PARTICIPATION_STEPS, BRIGADE_TEAM } from '../data/storyboard';
import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';
import { EASE_OUT_EXPO, STAGGER } from '@/lib/motion';

interface CommunityClosingProps {
  baseUrl?: string;
}

const COMMUNITY_IMPACTS = [
  'Mayor participación ciudadana.',
  'Mejora en la infraestructura y los servicios.',
  'Propuestas viables para el desarrollo local.',
  'Fortalecimiento del vínculo entre la universidad y San José Buenavista.',
];

export default function CommunityClosing({ baseUrl = '/' }: CommunityClosingProps) {
  const [teamOpen, setTeamOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <section id="como-participar" className="pb-16 pt-2 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            <BlurFade inView delay={0} className="h-full">
              <article className="h-full rounded-card border border-earth/20 bg-cream-soft p-6 sm:p-7 shadow-card flex flex-col justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-earth font-medium">
                    Propósito del diagnóstico
                  </p>
                  <h2 className="mt-2 font-serif text-2xl sm:text-[1.7rem] font-semibold text-ink leading-snug">
                    ¿Para qué se realiza el diagnóstico?
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-ink-soft leading-relaxed">
                    Organizar las prioridades expresadas por la comunidad y ofrecer una base para
                    construir propuestas pertinentes junto con sus habitantes.
                  </p>
                </div>
              </article>
            </BlurFade>

            <BlurFade inView delay={STAGGER} className="h-full">
              <article className="h-full rounded-card border border-olive/30 bg-olive-pale/45 p-6 sm:p-7 shadow-card">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-forest font-medium">
                  Cambios que se busca impulsar
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Aspiraciones del proceso; no significan que las obras ya se hayan realizado.
                </p>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-ink-soft">
                  {COMMUNITY_IMPACTS.map((impact) => (
                    <li key={impact} className="flex items-start gap-2.5">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta"
                        aria-hidden="true"
                      />
                      <span>{impact}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </BlurFade>
          </div>

          <div className="space-y-6">
            <div className="max-w-2xl space-y-2">
              <BlurFade inView delay={0}>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-forest font-medium">
                  Siguientes pasos
                </p>
              </BlurFade>
              <BlurFade inView delay={STAGGER}>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink leading-tight">
                  ¿Cómo puedes participar?
                </h2>
              </BlurFade>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              {PARTICIPATION_STEPS.map((item, idx) => (
                <BlurFade key={item.step} inView delay={idx * STAGGER} className="h-full">
                  <MagicCard className="h-full shadow-card transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-card-hover">
                    <article className="h-full p-5 sm:p-6 flex flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-terracotta">
                          PASO {item.step}
                        </span>
                        <span
                          aria-hidden="true"
                          className="grid h-7 w-7 place-items-center rounded-full bg-peach-pale/80 font-mono text-[11px] font-semibold text-earth"
                        >
                          {item.step}
                        </span>
                      </div>
                      <h3 className="mt-3 font-serif text-xl font-semibold text-ink leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                        {item.description}
                      </p>
                    </article>
                  </MagicCard>
                </BlurFade>
              ))}
            </div>
          </div>

          {/* Créditos de la brigada con apertura animada y soporte para impresión */}
          <div className="rounded-inner border border-earth/20 bg-cream-soft shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setTeamOpen((open) => !open)}
              aria-expanded={teamOpen}
              aria-controls="brigade-team-panel"
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-cream-deep/35 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-forest"
            >
              <span>
                <span className="block font-semibold text-ink">
                  Conoce al equipo responsable
                </span>
                <span className="mt-0.5 block text-xs text-ink-muted">
                  UIEP · Ingeniería Civil Sustentable · {BRIGADE_TEAM.students.length} estudiantes
                </span>
              </span>
              <motion.span
                animate={{ rotate: teamOpen ? 45 : 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-olive-pale text-forest font-medium no-print"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {teamOpen && (
                <motion.div
                  id="brigade-team-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-earth/15 px-5 py-5 space-y-4">
                    <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-olive-pale/55 border border-olive/30 px-3.5 py-1.5 text-xs text-forest">
                      <span className="font-mono uppercase tracking-wider font-semibold">
                        Asesor académico:
                      </span>
                      <strong className="font-semibold text-ink">{BRIGADE_TEAM.advisor}</strong>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-sm text-ink-soft">
                      {BRIGADE_TEAM.students.map((student, i) => (
                        <li
                          key={student}
                          className="flex items-center gap-2.5 rounded-xl bg-cream/85 border border-earth/10 px-3 py-2"
                        >
                          <span className="font-mono text-[10px] font-semibold text-earth/75">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{student}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.footer
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
            className="rounded-card bg-gradient-to-br from-peach-pale via-cream-soft to-olive-pale/70 border border-earth/25 px-6 py-8 sm:px-12 sm:py-10 text-center space-y-4 shadow-card"
          >
            <img
              src={`${baseUrl}assets/uieplogo-transparent.png`}
              alt="Universidad Intercultural del Estado de Puebla"
              width={120}
              height={90}
              loading="lazy"
              className="mx-auto h-11 w-auto object-contain opacity-90"
            />
            <p className="font-serif italic text-2xl sm:text-4xl font-semibold text-ink leading-tight [text-wrap:balance]">
              ¡Juntos construimos un mejor San José Buenavista!
            </p>
            <p className="text-sm sm:text-base text-forest font-medium max-w-2xl mx-auto leading-relaxed">
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
                className="inline-flex items-center gap-2 rounded-full border border-earth/25 bg-cream-soft/90 px-4 py-2 text-xs font-semibold text-ink-soft transition-colors hover:bg-white hover:text-forest cursor-pointer"
              >
                <span>Volver al inicio</span>
                <span aria-hidden="true">↑</span>
              </button>
            </div>
          </motion.footer>
        </div>
      </section>
    </MotionConfig>
  );
}
