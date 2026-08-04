import { motion } from 'framer-motion'
import { lineReveal, fadeUp, staggerContainer, VIEWPORT } from '../../animations/variants'

/**
 * Título de seção com a assinatura editorial do projeto:
 * cada linha sobe de dentro de uma máscara (overflow: hidden).
 * `lines` é um array de nós React — um por linha do título.
 */
export default function SectionTitle({ eyebrow, lines, align = 'left', spacing = 64 }) {
  return (
    <motion.header
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      style={{ textAlign: align, marginBottom: spacing }}
    >
      {eyebrow && (
        <motion.p className="eyebrow" variants={fadeUp}>
          {eyebrow}
        </motion.p>
      )}
      <h2 className="h2" style={align === 'center' ? { marginInline: 'auto' } : undefined}>
        {lines.map((line, i) => (
          <span className="line-mask" key={i}>
            <motion.span variants={lineReveal} custom={i}>
              {line}
            </motion.span>
          </span>
        ))}
      </h2>
    </motion.header>
  )
}
