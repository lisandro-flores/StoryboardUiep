/**
 * Tokens de movimiento compartidos: una sola curva y escala de duraciones
 * para que todas las secciones "respiren" con el mismo ritmo.
 */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.25,
  base: 0.45,
  slow: 0.72,
} as const;

/** Escalonado estándar entre elementos hermanos (en segundos). */
export const STAGGER = 0.08;

export const SPRING_PILL = { type: 'spring', stiffness: 380, damping: 32 } as const;
