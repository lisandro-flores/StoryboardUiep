import { motion } from 'motion/react';
import { PARTICIPATION_STEPS, BRIGADE_TEAM } from '../data/storyboard';

export default function CommunityClosing() {
  return (
    <section id="como-participar" className="pb-16 pt-2 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-forest font-medium">
              El diagnóstico continúa
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink leading-tight">
              ¿Cómo puedes participar?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PARTICIPATION_STEPS.map((item, idx) => (
              <motion.article
                key={item.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-48px' }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-[24px] border border-earth/20 bg-cream-soft p-5 sm:p-6 shadow-[0_10px_30px_rgba(70,45,25,0.05)]"
              >
                <span className="font-mono text-xs font-semibold tracking-[0.14em] text-terracotta">
                  PASO {item.step}
                </span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-ink leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>

        <details className="group rounded-[22px] border border-earth/20 bg-cream-soft shadow-xs">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block font-semibold text-ink">Conoce al equipo responsable</span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                UIEP · {BRIGADE_TEAM.students.length} estudiantes
              </span>
            </span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-olive-pale text-forest transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="border-t border-earth/15 px-5 py-4">
            <p className="text-sm text-ink-soft">
              Asesor: <strong className="font-semibold text-ink">{BRIGADE_TEAM.advisor}</strong>
            </p>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-ink-soft">
              {BRIGADE_TEAM.students.map((student) => (
                <li key={student}>{student}</li>
              ))}
            </ul>
          </div>
        </details>

        <motion.footer
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[28px] bg-gradient-to-br from-peach-pale via-cream-soft to-olive-pale/70 border border-earth/25 px-6 py-8 sm:px-12 sm:py-10 text-center space-y-3"
        >
          <p className="font-serif italic text-2xl sm:text-4xl font-semibold text-ink leading-tight">
            ¡Juntos construimos un mejor San José Buenavista!
          </p>
          <p className="text-sm sm:text-base text-forest font-medium max-w-2xl mx-auto">
            Gracias a las familias, comités y autoridades de la comunidad por abrirnos sus puertas
            y trabajar en equipo con la Universidad Intercultural del Estado de Puebla.
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
