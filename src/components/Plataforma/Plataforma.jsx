import { useRef, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Plataforma.module.css'
import SectionTitle from '../shared/SectionTitle'
import { fadeUp, staggerContainer, VIEWPORT } from '../../animations/variants'

gsap.registerPlugin(ScrollTrigger)

const RECURSOS = [
  'Plataforma de Ensino',
  'Cursos por Trilhas e Formações',
  'Comunidade de alunos',
  'Club Agents',
  'Playground de Treinamento',
  'Mural da Fama',
]

export default function Plataforma() {
  const wrapRef = useRef(null)
  const mockRef = useRef(null)

  // Scroll-linked com scrub: o dashboard "levanta" da mesa conforme o scroll avança
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mockRef.current,
        { rotateX: 32, y: 90, scale: 0.92, opacity: 0.4 },
        {
          rotateX: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.6,
          },
        }
      )
    }, wrapRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="plataforma" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div>
          <SectionTitle
            eyebrow="Plataforma"
            lines={[
              <>Acesso a toda a plataforma,</>,
              <>com suporte <em className="serif-accent">dos professores</em></>,
            ]}
          />
          <motion.ul
            className={styles.list}
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {RECURSOS.map((r, i) => (
              <motion.li key={r} variants={fadeUp} custom={i}>
                <span aria-hidden="true">✓</span> {r}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className={styles.stage} ref={wrapRef}>
          <div className={styles.mock} ref={mockRef} role="img" aria-label="Dashboard da plataforma">
            <header>
              <p>Boa noite, <em>Ana</em> 👋</p>
              <span className={styles.streak}>🔥 21 dias seguidos</span>
            </header>
            <div className={styles.mockGrid}>
              <div className={styles.tile}>
                <p className={styles.tileLabel}>Trilha atual</p>
                <p className={styles.tileValue}>Full Stack</p>
                <div className={styles.bar}><span style={{ width: '68%' }} /></div>
              </div>
              <div className={styles.tile}>
                <p className={styles.tileLabel}>Club Agents</p>
                <p className={styles.tileValue}>3 ativos</p>
                <p className={styles.tileHint}>Dúvida respondida há 2 min</p>
              </div>
              <div className={styles.tileWide}>
                <p className={styles.tileLabel}>Mural da fama</p>
                <p className={styles.tileHint}>“Contratada como Dev Jr na Stone” — Camila R.</p>
              </div>
            </div>
          </div>
          <div className={styles.stageGlow} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
