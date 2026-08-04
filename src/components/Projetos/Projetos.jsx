import { useRef, useState, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projetos.module.css'
import SectionTitle from '../shared/SectionTitle'

gsap.registerPlugin(ScrollTrigger)

const PROJETOS = [
  { nome: 'FinTrack — controle financeiro', tech: 'React · Node', tom: '#0f1f18' },
  { nome: 'PetCare agendamentos', tech: 'Full Stack', tom: '#101a14' },
  { nome: 'Dashboard de vendas', tech: 'PowerBI', tom: '#0d1812' },
  { nome: 'Delivery Burguer House', tech: 'React Native', tom: '#121c15' },
  { nome: 'Bot de atendimento com IA', tech: 'N8N · Claude', tom: '#0e1a15' },
  { nome: 'E-commerce Ateliê Flor', tech: 'Next.js', tom: '#101b13' },
  { nome: 'API de eventos ao vivo', tech: 'Node · Postgres', tom: '#0d1713' },
  { nome: 'Portfólio interativo 3D', tech: 'React · GSAP', tom: '#111d16' },
]

const VISIBLE_DEPTH = 4
const mod = (n, m) => ((n % m) + m) % m

// Transform de repouso de cada carta na pilha, de acordo com sua profundidade
// (0 = na frente da mão, quanto maior, mais "atrás" e escondida pelas outras)
function depthVars(depth, total) {
  const hidden = depth >= VISIBLE_DEPTH
  const d = hidden ? VISIBLE_DEPTH : depth
  const sign = d % 2 === 0 ? 1 : -1
  return {
    y: -d * 16,
    scale: 1 - d * 0.055,
    rotate: d === 0 ? 0 : sign * (3 + d * 1.4),
    opacity: hidden ? 0 : 1 - d * 0.22,
    zIndex: total - depth,
  }
}

export default function Projetos() {
  const sectionRef = useRef(null)
  const stackRef = useRef(null)
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  // Prende a seção: o scroll passa a carta da frente para o fim da fila — como
  // contar cartas na mão — até todos os projetos terem passado pela frente,
  // só então a página libera para a próxima seção.
  useLayoutEffect(() => {
    if (reduceMotion || !stackRef.current) return

    const cards = Array.from(stackRef.current.children)
    const total = cards.length
    const transitions = total - 1

    cards.forEach((card, i) => gsap.set(card, depthVars(i, total)))

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=' + transitions * 420,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      for (let k = 0; k < transitions; k++) {
        cards.forEach((card, c) => {
          const oldDepth = mod(c - k, total)
          const newDepth = mod(c - k - 1, total)
          const rest = depthVars(newDepth, total)

          if (oldDepth === 0) {
            // A carta da frente sobe e gira, como se fosse posta atrás de todas as outras
            tl.set(card, { zIndex: total + 5 }, k)
            tl.to(card, { y: -190, rotate: -16, scale: 0.72, opacity: 0.45, duration: 0.5, ease: 'power1.in' }, k)
            tl.set(card, { zIndex: rest.zIndex }, k + 0.5)
            tl.to(
              card,
              { y: rest.y, scale: rest.scale, rotate: rest.rotate, opacity: rest.opacity, duration: 0.5, ease: 'power1.out' },
              k + 0.5
            )
          } else {
            tl.set(card, { zIndex: rest.zIndex }, k)
            tl.to(card, { y: rest.y, scale: rest.scale, rotate: rest.rotate, opacity: rest.opacity, duration: 1, ease: 'none' }, k)
          }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [reduceMotion])

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className="container">
        <SectionTitle
          eyebrow="Mão na massa"
          spacing={28}
          lines={[
            <>Tudo com projetos</>,
            <><em className="serif-accent">práticos</em> e reais</>,
          ]}
        />

        {reduceMotion ? (
          <ul className={styles.staticList}>
            {PROJETOS.map((p) => (
              <li
                key={p.nome}
                className={styles.staticCard}
                style={{ background: `linear-gradient(160deg, ${p.tom}, var(--surface))` }}
              >
                <div className={styles.fakeUi} aria-hidden="true"><span /><span /><span /></div>
                <div className={styles.overlay}>
                  <span className={styles.tech}>{p.tech}</span>
                  <h3>{p.nome}</h3>
                  <span className={styles.ver}>Ver projeto →</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className={styles.hint} aria-hidden="true">role para passar os projetos ↓</p>
            <div className={styles.stage}>
              <div className={styles.stack} ref={stackRef}>
                {PROJETOS.map((p) => (
                  <article
                    key={p.nome}
                    className={styles.card}
                    style={{ background: `linear-gradient(160deg, ${p.tom}, var(--surface))` }}
                  >
                    <div className={styles.cardInner}>
                      <div className={styles.fakeUi} aria-hidden="true"><span /><span /><span /></div>
                      <div className={styles.overlay}>
                        <span className={styles.tech}>{p.tech}</span>
                        <h3>{p.nome}</h3>
                        <span className={styles.ver}>Ver projeto →</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}

        <p className={styles.caption}>Projetos fictícios ilustrativos, no formato dos entregues pelos alunos.</p>
      </div>
    </section>
  )
}
