import { useRef } from 'react';
import gsap from 'gsap';
import { MotionConfig } from 'motion/react';
import { useGSAP } from '@gsap/react';
import TiltPlate from './TiltPlate';
import BlurFade from './BlurFade';

gsap.registerPlugin(useGSAP);

interface HeroSectionProps {
  baseUrl: string;
}

export default function HeroSection({ baseUrl }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-topbar', { y: -18, opacity: 0, duration: 0.65 }).from(
        '.hero-plate',
        {
          scale: 0.95,
          y: 26,
          opacity: 0,
          duration: 0.9,
        },
        '-=0.35'
      );
    },
    { scope: containerRef }
  );

  return (
    <MotionConfig reducedMotion="user">
    <header ref={containerRef} className="relative pt-4 pb-8 sm:pt-10 sm:pb-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Barra institucional superior */}
        <div className="hero-topbar flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-earth/20">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="shrink-0">
              <img
                src={`${baseUrl}assets/uieplogo-transparent.png`}
                alt="Universidad Intercultural del Estado de Puebla (UIEP)"
                className="h-11 sm:h-13 w-auto object-contain"
                width={150}
                height={112}
              />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-earth font-medium">
                Vinculación Comunitaria · UIEP
              </p>
              <p className="text-sm sm:text-base font-semibold text-ink">
                Ingeniería Civil Sustentable
              </p>
            </div>
          </div>
        </div>

        {/* Escenario principal con fotografía documental real */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center pt-1 sm:pt-2">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <BlurFade delay={0.02} className="space-y-3">
              <p className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-forest">
                Diagnóstico territorial · San José Buenavista
              </p>
              <h1 className="font-serif text-[2.4rem] sm:text-5xl lg:text-[3.7rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
                Diagnóstico Comunitario{' '}
                <span className="italic font-medium text-forest">Participativo</span>
              </h1>
            </BlurFade>
            <BlurFade delay={0.12}>
              <p className="text-[15px] sm:text-lg text-ink-soft leading-relaxed max-w-xl">
                Un trabajo conjunto entre habitantes, autoridades y estudiantes de la UIEP para
                identificar prioridades y orientar propuestas de ingeniería sustentable en{' '}
                <strong className="font-semibold text-ink">San José Buenavista</strong>.
              </p>
            </BlurFade>
            <BlurFade delay={0.2} className="space-y-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                Así se realizó
              </p>
              <ul
                aria-label="Métodos del diagnóstico"
                className="flex flex-wrap gap-2 text-xs sm:text-sm text-ink-soft"
              >
                {[
                  'Recorridos de campo',
                  'Encuestas y conversatorios',
                  'Mapa social',
                  'Análisis técnico',
                ].map((method) => (
                  <li
                    key={method}
                    className="rounded-full border border-earth/20 bg-cream-soft/80 px-3 py-1.5"
                  >
                    {method}
                  </li>
                ))}
              </ul>
            </BlurFade>

            <BlurFade
              delay={0.28}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 no-print"
            >
              <a
                href="#relato-interactivo"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream shadow-[0_8px_20px_rgba(31,74,35,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-dark sm:w-fit"
              >
                Explorar el proceso
              </a>
            </BlurFade>
          </div>

          {/* Fotografía real principal de la brigada en San José Buenavista */}
          <div className="lg:col-span-5 hero-plate">
            <TiltPlate
              maxTilt={4.5}
              className="rounded-[30px] bg-cream-soft p-3.5 sm:p-4 border border-earth/25 shadow-[0_24px_60px_rgba(92,64,43,0.14)]"
            >
              <div className="overflow-hidden rounded-[22px] border border-earth/15 bg-cream-deep">
                <picture>
                  <source srcSet={`${baseUrl}assets/foto-01.webp`} type="image/webp" />
                  <img
                    src={`${baseUrl}assets/foto-01.jpg`}
                    alt="Brigada estudiantil de Ingeniería Civil Sustentable de la UIEP en las calles de San José Buenavista"
                    className="w-full h-auto aspect-[4/3] object-cover"
                    style={{ objectPosition: '50% 42%' }}
                    width={1599}
                    height={1191}
                  />
                </picture>
              </div>
              <div className="flex items-center justify-between gap-4 pt-3.5 px-1.5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-earth">
                    Registro fotográfico de campo
                  </p>
                  <p className="font-serif text-sm sm:text-base text-ink font-medium">
                    Brigada UIEP en San José Buenavista
                  </p>
                </div>
              </div>
            </TiltPlate>
          </div>
        </div>

      </div>
    </header>
    </MotionConfig>
  );
}
