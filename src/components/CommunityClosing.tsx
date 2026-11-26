import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  PARTICIPATION_STEPS,
  COMMUNITY_IMPACTS,
  BRIGADE_TEAM,
} from '../data/storyboard';
import { soundscape } from '../utils/soundscape';

export default function CommunityClosing() {
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('uiep-neighbor-steps');
      if (saved) setCheckedSteps(JSON.parse(saved));
    } catch {
      // Ignorar si no hay almacenamiento
    }
  }, []);

  const fireWarmConfetti = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    confetti({
      particleCount: 48,
      spread: 68,
      origin: { y: 0.72 },
      colors: ['#1F4A23', '#7D9154', '#F1C28B', '#EAB6BA', '#8E6545'],
      scalar: 0.9,
      ticks: 180,
    });
  };

  const toggleStep = (stepCode: string, idx: number) => {
    setCheckedSteps((prev) => {
      const nextVal = !prev[stepCode];
      const updated = { ...prev, [stepCode]: nextVal };
      try {
        localStorage.setItem('uiep-neighbor-steps', JSON.stringify(updated));
      } catch {
        // Ignorar
      }
      if (nextVal) {
        soundscape.playHarmonicNote(idx + 4);
        const completedCount = Object.values(updated).filter(Boolean).length;
        if (completedCount === PARTICIPATION_STEPS.length || completedCount === 1) {
          fireWarmConfetti();
        }
      }
      return updated;
    });
  };

  const completedTotal = Object.values(checkedSteps).filter(Boolean).length;

  return (
    <section id="como-participar" className="pb-20 pt-2 scroll-mt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Bento Interactivo de Participación Vecinal en 3 Pasos */}
        <div className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-forest font-medium">
                Compromiso participativo
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink leading-tight">
                ¿Qué puedes hacer tú como vecina o vecino?
              </h2>
            </div>

            <div className="rounded-full bg-cream-soft border border-earth/20 px-4 py-1.5 text-xs font-mono text-ink-soft no-print">
              Pasos marcados: <strong className="text-forest">{completedTotal} / 03</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PARTICIPATION_STEPS.map((item, idx) => {
              const isDone = Boolean(checkedSteps[item.step]);
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -4 }}
                  className={`rounded-[26px] border p-6 sm:p-7 transition-colors duration-300 shadow-[0_10px_30px_rgba(70,45,25,0.05)] flex flex-col justify-between gap-6 ${
                    isDone
                      ? 'bg-olive-pale/60 border-olive'
                      : 'bg-cream-soft border-earth/20'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-block font-serif text-4xl font-semibold text-terracotta/85 leading-none">
                        {item.step}
                      </span>
                      <span
                        className={`rounded-full px-3 py-0.5 text-[11px] font-mono uppercase tracking-wider ${
                          isDone
                            ? 'bg-forest text-cream font-semibold'
                            : 'bg-peach-pale text-earth'
                        }`}
                      >
                        {isDone ? 'Paso asumido' : `Paso 0${idx + 1}`}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-semibold text-ink leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleStep(item.step, idx)}
                    aria-pressed={isDone}
                    className={`no-print w-full rounded-full py-2.5 px-4 text-xs font-semibold transition-all cursor-pointer border ${
                      isDone
                        ? 'bg-forest text-cream border-forest'
                        : 'bg-cream text-ink border-earth/25 hover:bg-peach-pale/80'
                    }`}
                  >
                    {isDone ? 'Compromiso registrado' : 'Me sumo a este paso'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bloque Bento Dual: Impacto Comunitario + Créditos de Brigada UIEP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-5 rounded-[28px] bg-forest text-cream p-7 sm:p-8 flex flex-col justify-between gap-6"
          >
            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-peach">
                Propósito compartido
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-snug">
                Impacto positivo en nuestra comunidad
              </h3>
              <ul className="space-y-3 pt-2">
                {COMMUNITY_IMPACTS.map((impact) => (
                  <li
                    key={impact}
                    className="flex items-start gap-3 text-sm sm:text-base text-cream/90"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 rounded-full bg-peach shrink-0"
                      aria-hidden="true"
                    />
                    <span>{impact}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs font-mono uppercase tracking-[0.14em] text-cream/70 pt-2 border-t border-cream/15">
              San José Buenavista · Tlacotepec de Benito Juárez, Puebla
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="lg:col-span-7 rounded-[28px] bg-cream-soft border border-earth/20 p-7 sm:p-8 space-y-6 shadow-[0_12px_36px_rgba(70,45,25,0.05)]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-earth/15">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-earth">
                  Equipo universitario de campo
                </p>
                <h3 className="font-serif text-2xl font-semibold text-ink">
                  Brigada de Ingeniería Civil Sustentable
                </h3>
              </div>
              <span className="rounded-full bg-rose-pale px-3.5 py-1 text-xs font-semibold text-ink">
                10 estudiantes · UIEP
              </span>
            </div>

            <div className="rounded-2xl bg-peach-pale/55 border border-earth/15 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-earth">
                Asesor de brigada
              </span>
              <strong className="font-serif text-lg font-semibold text-ink">
                {BRIGADE_TEAM.advisor}
              </strong>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted mb-3">
                Integrantes de la brigada
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-ink-soft">
                {BRIGADE_TEAM.students.map((student) => (
                  <li key={student} className="flex items-center gap-2.5">
                    <span
                      className="h-1 w-3 rounded-full bg-olive/70 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-medium text-ink">{student}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Cierre inspirador con disparo opcional de celebración */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-[32px] bg-gradient-to-br from-peach-pale via-cream-soft to-olive-pale/70 border border-earth/25 px-6 py-10 sm:px-12 sm:py-12 text-center space-y-4 shadow-sm"
        >
          <p className="font-serif italic text-2xl sm:text-4xl font-semibold text-ink leading-tight">
            ¡Porque juntos construimos un mejor San José Buenavista!
          </p>
          <p className="text-sm sm:text-base text-forest font-medium max-w-2xl mx-auto">
            Agradecemos profundamente a las familias, comités y autoridades de San José Buenavista
            por abrirnos sus puertas y caminar en equipo con la Universidad Intercultural del Estado de Puebla.
          </p>
          <div className="pt-2 no-print">
            <button
              type="button"
              onClick={() => {
                soundscape.playHarmonicNote(7);
                fireWarmConfetti();
              }}
              className="rounded-full bg-cream-soft/90 border border-earth/25 px-5 py-2 text-xs font-semibold text-ink hover:bg-peach/60 transition-colors cursor-pointer"
            >
              Celebrar trabajo en comunidad
            </button>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}
