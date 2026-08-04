import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Salarios.module.css'
import SectionTitle from '../shared/SectionTitle'
import Counter from '../shared/Counter'

gsap.registerPlugin(ScrollTrigger)

const DADOS = [
  { nivel: 'Júnior', brasil: 3500, exterior: 9000 },
  { nivel: 'Pleno', brasil: 8000, exterior: 19000 },
  { nivel: 'Sênior', brasil: 15000, exterior: 34000 },
]

const MAX = 34000

export default function Salarios() {
  const chartRef = useRef(null)
  const barRefs = useRef([])
  barRefs.current = []
  const addBarRef = (el) => { if (el) barRefs.current.push(el) }

  // O scroll é o maestro: a altura de cada barra é amarrada direto à posição
  // do scroll (scrub), em vez de disparar uma vez só ao entrar na tela.
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      barRefs.current.forEach((bar) => {
        gsap.fromTo(
          bar,
          { height: 0 },
          {
            height: bar.dataset.height,
            ease: 'none',
            scrollTrigger: {
              trigger: chartRef.current,
              start: 'top 85%',
              end: 'top 25%',
              scrub: 0.6,
            },
          }
        )
      })
    }, chartRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle
          eyebrow="Mercado"
          align="center"
          lines={[<>O mercado paga <em className="serif-accent">bem?</em></>]}
        />

        <div
          className={styles.chart}
          ref={chartRef}
          role="img"
          aria-label="Comparativo de salários mensais: júnior R$3.500 no Brasil e R$9.000 no exterior; pleno R$8.000 e R$19.000; sênior R$15.000 e R$34.000"
        >
          {DADOS.map((d) => (
            <div className={styles.group} key={d.nivel}>
              <div className={styles.bars}>
                <div className={styles.barCol}>
                  <span className={styles.valor}>
                    <Counter to={d.brasil} prefix="R$ " duration={1.6} />
                  </span>
                  <span
                    ref={addBarRef}
                    className={styles.barBrasil}
                    data-height={`${(d.brasil / MAX) * 260}px`}
                  />
                </div>
                <div className={styles.barCol}>
                  <span className={`${styles.valor} ${styles.valorMint}`}>
                    <Counter to={d.exterior} prefix="R$ " duration={1.6} />
                  </span>
                  <span
                    ref={addBarRef}
                    className={styles.barExterior}
                    data-height={`${(d.exterior / MAX) * 260}px`}
                  />
                </div>
              </div>
              <p className={styles.nivel}>{d.nivel}</p>
            </div>
          ))}
        </div>

        <div className={styles.legenda}>
          <span><i className={styles.dotBr} /> Brasil (mês)</span>
          <span><i className={styles.dotEx} /> Internacional remoto (mês)</span>
        </div>
        <p className={styles.fonte}>Valores ilustrativos de mercado, base 2026.</p>
      </div>
    </section>
  )
}
