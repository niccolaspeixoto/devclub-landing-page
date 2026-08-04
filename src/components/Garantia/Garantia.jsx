import { motion } from 'framer-motion'
import styles from './Garantia.module.css'
import { fadeUp, staggerContainer, VIEWPORT, EASE } from '../../animations/variants'

export default function Garantia() {
  return (
    <section className={styles.section}>
      <motion.div
        className={`container ${styles.box}`}
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.div className={styles.selo} variants={fadeUp} aria-hidden="true">
          <svg viewBox="0 0 100 100" className={styles.rotator}>
            <defs>
              <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text fontSize="10" letterSpacing="2.5" fill="currentColor">
              <textPath href="#circlePath">7 DIAS DE GARANTIA · RISCO ZERO ·</textPath>
            </text>
          </svg>
          <motion.svg viewBox="0 0 24 24" className={styles.check} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              d="M4 12.5 L9.5 18 L20 6.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            />
          </motion.svg>
        </motion.div>

        <motion.p className="eyebrow" variants={fadeUp} custom={1}>E se eu não curtir?</motion.p>
        <motion.h2 className={styles.titulo} variants={fadeUp} custom={2}>
          7 dias de garantia <em className="serif-accent">incondicional.</em>
        </motion.h2>
        <motion.p className={styles.texto} variants={fadeUp} custom={3}>
          Entre, assista às aulas, conheça a comunidade. Se por qualquer motivo você
          sentir que não é pra você, devolvemos 100% do valor. Sem perguntas,
          sem letras miúdas, sem constrangimento.
        </motion.p>
        <motion.a href="#formacoes" className="btn btn-primary" variants={fadeUp} custom={4}>
          Começar sem risco
        </motion.a>
      </motion.div>
    </section>
  )
}
