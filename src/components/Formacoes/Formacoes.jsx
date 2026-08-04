import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Formacoes.module.css'
import SectionTitle from '../shared/SectionTitle'
import { fadeUp, staggerContainer, VIEWPORT } from '../../animations/variants'

gsap.registerPlugin(ScrollTrigger)

// Abaixo disso, mantemos o drag nativo (scroll-jack de tela cheia não funciona bem no touch)
const PIN_BREAKPOINT = '(min-width: 860px)'

const CURSOS = [
  { nome: 'Programação Front End', tag: 'Formação', icone: '</>' },
  { nome: 'Programação Back End', tag: 'Formação', icone: '{ }' },
  { nome: 'Programação Full Stack', tag: 'Formação', icone: '∞' },
  { nome: 'Programação Mobile', tag: 'Formação', icone: '▤' },
  { nome: 'React', tag: 'Curso', icone: '⚛' },
  { nome: 'Node', tag: 'Curso', icone: '⬢' },
  { nome: 'JavaScript Completo', tag: 'Curso', icone: 'JS' },
  { nome: 'HTML5', tag: 'Curso', icone: '<>' },
  { nome: 'CSS3', tag: 'Curso', icone: '#' },
  { nome: 'Gestor de IA', tag: 'Carreira', icone: '◈' },
  { nome: 'IA e Automações', tag: 'Carreira', icone: '✦' },
  { nome: 'Claude & ClaudeCode', tag: 'IA', icone: '✳' },
  { nome: 'Trilha N8N', tag: 'IA', icone: '⇄' },
  { nome: 'Análise de Dados', tag: 'Dados', icone: '▂▅▇' },
  { nome: 'PowerBI', tag: 'Dados', icone: '◔' },
]

export default function Formacoes() {
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [dragLimit, setDragLimit] = useState(0)
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [pinEnabled, setPinEnabled] = useState(() => window.matchMedia(PIN_BREAKPOINT).matches)
  const useScrollJack = pinEnabled && !reduceMotion

  // Quanto a trilha excede o viewport visível — usado no drag mobile e no scroll-jack desktop
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (track && viewport) setDragLimit(Math.max(0, track.scrollWidth - viewport.offsetWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Acima do breakpoint, alterna entre drag nativo (mobile) e scroll-jack (desktop)
  useEffect(() => {
    const mq = window.matchMedia(PIN_BREAKPOINT)
    const update = () => setPinEnabled(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Prende a seção: o scroll vertical empurra a trilha na horizontal até acabarem os cursos,
  // só então a página volta a rolar normalmente para a próxima seção
  useLayoutEffect(() => {
    if (!useScrollJack) return

    const ctx = gsap.context(() => {
      const distance = () =>
        Math.max(0, trackRef.current.scrollWidth - viewportRef.current.offsetWidth)

      gsap.to(trackRef.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [useScrollJack])

  return (
    <section id="formacoes" className={styles.section} ref={sectionRef}>
      <div className="container">
        <SectionTitle
          eyebrow="Formações"
          lines={[
            <>Formações completas para aprender</>,
            <>tudo do zero ao <em className="serif-accent">avançado</em></>,
          ]}
        />
        <p className={styles.hint} aria-hidden="true">
          {useScrollJack ? 'role para explorar ↓' : '← arraste para explorar →'}
        </p>
      </div>

      <motion.div
        ref={viewportRef}
        className={`${styles.viewport} ${useScrollJack ? styles.viewportPinned : ''}`}
        variants={staggerContainer(0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.div
          ref={trackRef}
          className={styles.track}
          drag={useScrollJack ? false : 'x'}
          dragConstraints={{ left: -dragLimit, right: 0 }}
          dragElastic={0.06}
          whileTap={useScrollJack ? undefined : { cursor: 'grabbing' }}
        >
          {CURSOS.map((curso, i) => (
            <motion.article key={curso.nome} className={styles.card} variants={fadeUp} custom={i % 6}>
              <span className={styles.icone} aria-hidden="true">{curso.icone}</span>
              <span className={styles.tag}>{curso.tag}</span>
              <h3>{curso.nome}</h3>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
