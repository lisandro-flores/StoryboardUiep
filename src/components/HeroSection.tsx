import { useRef } from 'react';
import { motion, MotionConfig, useScroll, useTransform } from 'motion/react';

interface HeroSectionProps {
  baseUrl: string;
}

export default function HeroSection({ baseUrl }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundTransform = useTransform(
    scrollYProgress,
    [0, 0.82, 1],
    ['scale(1)', 'scale(1.24)', 'scale(1.3)']
  );
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 0.9, 0.5]);
  const backgroundFilter = useTransform(
    scrollYProgress,
    [0, 1],
    ['blur(0px)', 'blur(4px)']
  );
  const textTransform = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    ['translateY(0%)', 'translateY(-5%)', 'translateY(-12%)']
  );
  const textOpacity = useTransform(scrollYProgress, [0, 0.65, 0.92, 1], [1, 0.96, 0.3, 0]);

  return (
    <MotionConfig reducedMotion="user">
      <section ref={containerRef} className="scroll-zoom-hero relative">
        <header className="scroll-zoom-stage sticky top-0 isolate flex min-h-svh flex-col overflow-hidden bg-ink text-cream">
          <motion.div
            className="scroll-zoom-background absolute inset-0"
            style={{
              transform: backgroundTransform,
              opacity: backgroundOpacity,
              filter: backgroundFilter,
            }}
          >
            <picture>
              <source srcSet={`${baseUrl}assets/foto-01.webp`} type="image/webp" />
              <img
                src={`${baseUrl}assets/foto-01.jpg`}
                alt="Brigada estudiantil de Ingeniería Civil Sustentable de la UIEP en las calles de San José Buenavista"
                className="h-full w-full object-cover object-[50%_42%]"
                width={1599}
                height={1191}
              />
            </picture>
          </motion.div>

          <div
            className="absolute inset-0 bg-gradient-to-r from-[#171b12]/90 via-[#171b12]/65 to-[#171b12]/25"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#171b12]/35 via-transparent to-[#171b12]/65"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-1 flex-col px-5 pb-5 pt-3 sm:px-8 sm:pb-7 sm:pt-6 lg:px-12">
            <div className="hero-topbar flex items-center justify-between gap-4">
              <div className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-white/35 bg-cream/95 px-3 py-2 text-ink shadow-lg backdrop-blur-md sm:px-4 sm:py-2.5">
                <img
                  src={`${baseUrl}assets/uieplogo-transparent.png`}
                  alt="Universidad Intercultural del Estado de Puebla (UIEP)"
                  className="h-9 w-auto shrink-0 object-contain sm:h-11"
                  width={150}
                  height={112}
                />
                <div className="min-w-0">
                  <p className="truncate font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-earth sm:text-[10px]">
                    Vinculación Comunitaria · UIEP
                  </p>
                  <p className="text-xs font-semibold text-ink sm:text-sm">
                    Ingeniería Civil Sustentable
                  </p>
                </div>
              </div>
              <p className="hidden font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-cream/80 sm:block">
                San José Buenavista · Puebla
              </p>
            </div>

            <div className="flex flex-1 items-center py-2 sm:py-10">
              <div className="w-full max-w-4xl">
                <motion.div
                  className="scroll-zoom-copy"
                  style={{ transform: textTransform, opacity: textOpacity }}
                >
                  <h1 className="max-w-4xl font-serif text-[clamp(2.4rem,8vw,6.25rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-cream [text-wrap:balance]">
                    Diagnóstico Comunitario{' '}
                    <span className="italic font-medium text-peach">Participativo</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/90 sm:mt-6 sm:text-lg">
                    Un trabajo conjunto entre habitantes, autoridades y estudiantes de la UIEP
                    para identificar prioridades y orientar propuestas de ingeniería sustentable
                    en <strong className="font-semibold text-white">San José Buenavista</strong>.
                  </p>

                  <div className="mt-4 sm:mt-7">
                    <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-cream/70 sm:text-[10px]">
                      Así se realizó
                    </p>
                    <ul
                      aria-label="Métodos del diagnóstico"
                      className="flex flex-wrap gap-2 text-[10px] text-cream sm:text-xs"
                    >
                      {[
                        'Recorridos de campo',
                        'Encuestas y conversatorios',
                        'Mapa social',
                        'Análisis técnico',
                      ].map((method) => (
                        <li
                          key={method}
                          className="rounded-full border border-white/30 bg-ink/25 px-3 py-1.5 backdrop-blur-sm"
                        >
                          {method}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <div className="mt-4 flex flex-col items-start gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-5">
                  <a
                    href="#relato-interactivo"
                    onClick={() => window.dispatchEvent(new Event('storyboard:explore'))}
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-forest shadow-[0_8px_24px_rgba(0,0,0,0.24)] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                  >
                    Explorar el proceso
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/25 pt-3">
              <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-cream/85 sm:text-[10px]">
                Desliza para descubrir
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 5v14m-7-7 7 7 7-7" />
                </svg>
              </p>
            </div>
          </div>
        </header>
      </section>
    </MotionConfig>
  );
}
