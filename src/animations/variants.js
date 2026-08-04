/**
 * Variants centralizados do Framer Motion.
 * Cada seção usa uma "assinatura" de entrada diferente — requisito do briefing.
 */

export const EASE = [0.22, 1, 0.36, 1]

// Assinatura da direção editorial: linhas de texto sobem de dentro de uma máscara
export const lineReveal = {
  hidden: { y: '110%' },
  visible: (i = 0) => ({
    y: '0%',
    transition: { duration: 0.9, ease: EASE, delay: 0.08 * i },
  }),
}

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: 0.07 * i },
  }),
}

// Tecnologias: onda de escala no grid
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE, delay: 0.045 * i },
  }),
}

// Benefícios: itens deslizam alternando o lado
export const slideSide = {
  hidden: (dir = 1) => ({ opacity: 0, x: 48 * dir }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
}

// Projetos: recorte com clip-path, do centro para fora
export const clipReveal = {
  hidden: { clipPath: 'inset(12% 12% 12% 12% round 20px)', opacity: 0 },
  visible: (i = 0) => ({
    clipPath: 'inset(0% 0% 0% 0% round 20px)',
    opacity: 1,
    transition: { duration: 0.9, ease: EASE, delay: 0.08 * i },
  }),
}

// Mentores: foco de lente — sai do desfoque
export const blurIn = {
  hidden: { opacity: 0, filter: 'blur(14px)', y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: 0.09 * i },
  }),
}

export const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

// Mentores: sem deslocamento nem giro — a carta só "aparece" no lugar, como um teleporte
export const teleportIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: EASE, delay: 0.12 * i },
  }),
}

export const VIEWPORT = { once: true, margin: '-80px' }
