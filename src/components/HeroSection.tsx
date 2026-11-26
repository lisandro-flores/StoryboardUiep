import { motion } from 'motion/react';

interface HeroSectionProps {
  baseUrl: string;
}

export default function HeroSection({ baseUrl }: HeroSectionProps) {
  return (
    <header className="relative pt-6 pb-10 md:pt-10 md:pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Franja institucional superior */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-earth/20"
        >
          <div className="flex items-center gap-4">
            <div className="bg-cream-soft border border-earth/20 rounded-2xl px-3 py-2 shadow-xs">
              <img
                src={`${baseUrl}assets/uieplogo.png`}
                alt="Universidad Intercultural del Estado de Puebla (UIEP)"
                className="h-11 sm:h-13 w-auto object-contain"
                width={116}
                height={86}
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

          <div className="inline-flex items-center gap-2.5 rounded-full bg-rose-pale/90 border border-rose px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-terracotta animate-pulse" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-ink">
              San José Buenavista, Puebla
            </span>
          </div>
        </motion.div>

        {/* Composición editorial asimétrica */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-8 md:pt-12">
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-3 rounded-full bg-olive-pale/80 border border-olive/35 px-3.5 py-1"
            >
              <span className="font-mono text-xs font-medium text-forest">08 ESCENAS ILUSTRADAS</span>
              <span className="h-3 w-px bg-olive/40" aria-hidden="true" />
              <span className="text-xs font-medium text-forest">Guía abierta para vecinas y vecinos</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl sm:text-5xl lg:text-[3.65rem] font-semibold leading-[1.04] tracking-[-0.02em] text-ink"
            >
              Diagnóstico Comunitario{' '}
              <span className="italic font-medium text-forest block sm:inline">
                Participativo
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl"
            >
              Bienvenida y bienvenido. Escaneaste el código QR de nuestra lona comunitaria:
              conoce paso a paso cómo vecinas, vecinos, comités, autoridades y estudiantes
              trabajamos en equipo para construir soluciones reales y sustentables en{' '}
              <strong className="font-semibold text-ink">San José Buenavista</strong>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-3 pt-1 no-print"
            >
              <a
                href="#relato-interactivo"
                className="inline-flex items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-forest-dark"
              >
                Comenzar recorrido visual
              </a>
              <a
                href="#como-participar"
                className="inline-flex items-center justify-center rounded-full bg-peach-pale/80 border border-earth/30 px-5 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-peach/60"
              >
                Cómo participar en 3 pasos
              </a>
            </motion.div>
          </div>

          {/* Marco editorial flotante con vista previa en acuarela */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-[28px] bg-cream-soft p-3 sm:p-4 border border-earth/25 shadow-[0_20px_50px_rgba(92,64,43,0.12)]">
              <div className="overflow-hidden rounded-[20px] border border-earth/15 bg-cream-deep">
                <picture>
                  <source srcSet={`${baseUrl}assets/escena-01.webp`} type="image/webp" />
                  <img
                    src={`${baseUrl}assets/escena-01.jpg`}
                    alt="Bienvenida de la comunidad de San José Buenavista a la brigada de estudiantes de la UIEP"
                    className="w-full h-auto aspect-video object-cover"
                    width={1360}
                    height={759}
                  />
                </picture>
              </div>
              <div className="flex items-center justify-between gap-4 pt-3 px-1">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-earth">
                    Cuaderno de vinculación
                  </p>
                  <p className="font-serif text-sm sm:text-base text-ink font-medium">
                    La voz del pueblo guía cada propuesta
                  </p>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-peach/45 text-ink font-medium">
                  01 — 08
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
