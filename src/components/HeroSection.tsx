import { useRef } from 'react';
import { motion, MotionConfig, useScroll, useTransform } from 'motion/react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { STAGGER } from '@/lib/motion';

interface HeroSectionProps {
  baseUrl: string;
}

const METHODS = [
  'Recorridos a pie',
  'Encuestas y pláticas',
  'Mapa social',
  'Propuestas técnicas',
];

export default function HeroSection({ baseUrl }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundTransform = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    ['scale(1)', 'scale(1.16)', 'scale(1.22)']
  );
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.92, 0.55]);
  const textTransform = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ['translateY(0%)', 'translateY(-4%)', 'translateY(-10%)']
  );
  const textOpacity = useTransform(scrollYProgress, [0, 0.65, 0.92, 1], [1, 0.96, 0.3, 0]);
  const curtainOpacity = useTransform(scrollYProgress, [0.5, 1], [0, 1]);

  return (
    <MotionConfig reducedMotion="user">
      <section ref={containerRef} className="scroll-zoom-hero relative">
        <header className="scroll-zoom-stage sticky top-0 isolate flex min-h-svh flex-col overflow-hidden bg-ink text-cream">
          <motion.div
            className="scroll-zoom-background absolute inset-0"
            style={{
              transform: backgroundTransform,
              opacity: backgroundOpacity,
            }}
          >
            <motion.picture
              className="block h-full w-full"
              initial={{ scale: 1.05, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <source srcSet={`${baseUrl}assets/foto-01.webp`} type="image/webp" />
              <img
                src={`${baseUrl}assets/foto-01.jpg`}
                alt="Brigada estudiantil de Ingeniería Civil Sustentable de la UIEP en las calles de San José Buenavista"
                className="h-full w-full object-cover object-[50%_42%]"
                width={1599}
                height={1191}
                fetchPriority="high"
              />
            </motion.picture>
          </motion.div>

          <div
            className="absolute inset-0 bg-gradient-to-r from-[#161812]/92 via-[#161812]/68 to-[#161812]/25"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#161812]/45 via-transparent to-[#161812]/70"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-1 flex-col px-5 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-6 lg:px-10">
            {/* Cabezal editorial impreso */}
            <BlurFade
              delay={0}
              offset={6}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-cream/20 pb-3.5"
            >
              <div className="inline-flex max-w-full items-center gap-3">
                <div className="rounded bg-cream px-2 py-1.5 shadow-xs shrink-0">
                  <img
                    src={`${baseUrl}assets/uieplogo-transparent.png`}
                    alt="Universidad Intercultural del Estado de Puebla (UIEP)"
                    className="h-8 w-auto object-contain sm:h-9"
                    width={150}
                    height={112}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-cream/90 sm:text-sm">
                    Universidad Intercultural del Estado de Puebla
                  </p>
                  <p className="truncate text-xs text-cream/70">
                    Ingeniería Civil Sustentable · Vinculación Comunitaria
                  </p>
                </div>
              </div>
              <p className="hidden text-xs font-medium text-cream/80 sm:block">
                San José Buenavista, Tlacotepec de Benito Juárez, Puebla
              </p>
            </BlurFade>

            <div className="flex flex-1 items-center py-6 sm:py-10">
              <div className="w-full max-w-3xl">
                <motion.div
                  className="scroll-zoom-copy"
                  style={{ transform: textTransform, opacity: textOpacity }}
                >
                  <BlurFade delay={0.1} offset={6}>
                    <p className="mb-3 text-sm font-semibold text-peach sm:text-base">
                      Memoria documental · San José Buenavista
                    </p>
                  </BlurFade>

                  <h1 className="font-serif text-[clamp(2.5rem,7.2vw,5.4rem)] font-bold leading-[1.02] tracking-[-0.015em] text-cream [text-wrap:balance]">
                    <TextAnimate
                      as="span"
                      by="word"
                      animation="blurInUp"
                      startOnView={false}
                      once
                      delay={0.15}
                      duration={0.55}
                    >
                      Diagnóstico Comunitario Participativo
                    </TextAnimate>
                  </h1>

                  <BlurFade delay={0.65} offset={8}>
                    <div className="mt-5 h-[2px] w-14 bg-peach/85" aria-hidden="true" />
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/92 sm:text-xl">
                      Un trabajo conjunto entre habitantes, autoridades locales y estudiantes de la
                      UIEP para escuchar las prioridades del pueblo y proponer mejoras viables en{' '}
                      <strong className="font-semibold text-white">San José Buenavista</strong>.
                    </p>
                  </BlurFade>

                  <BlurFade delay={0.85} offset={8}>
                    <ul
                      aria-label=" Actividades realizadas en el diagnóstico"
                      className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-cream/80 sm:mt-6 sm:text-base"
                    >
                      {METHODS.map((method, idx) => (
                        <li key={method} className="inline-flex items-center gap-3">
                          <span>{method}</span>
                          {idx < METHODS.length - 1 && (
                            <span className="text-peach/80 select-none" aria-hidden="true">
                              ·
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </BlurFade>

                  <BlurFade delay={1.05} offset={8}>
                    <div className="mt-6 sm:mt-8">
                      <a
                        href="#relato-interactivo"
                        onClick={() => window.dispatchEvent(new Event('storyboard:explore'))}
                        className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-cream px-6 py-3 text-base font-semibold text-forest shadow-md transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                      >
                        <span>Ver el trabajo paso a paso</span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                        >
                          <path d="M12 5v14m-6-6 6 6 6-6" />
                        </svg>
                      </a>
                    </div>
                  </BlurFade>
                </motion.div>
              </div>
            </div>

            <BlurFade delay={1.25} offset={0}>
              <div className="flex items-center justify-between gap-4 border-t border-cream/20 pt-3 text-xs text-cream/75 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <span>Desliza hacia abajo para leer</span>
                  <span aria-hidden="true" className="inline-block animate-scroll-cue">
                    ↓
                  </span>
                </span>
                <span className="sm:hidden">San José Buenavista, Pue.</span>
              </div>
            </BlurFade>
          </div>

          <motion.div
            aria-hidden="true"
            style={{ opacity: curtainOpacity }}
            className="scroll-zoom-curtain pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[42%] bg-gradient-to-b from-transparent via-cream/70 to-cream"
          />
        </header>
      </section>
    </MotionConfig>
  );
}
