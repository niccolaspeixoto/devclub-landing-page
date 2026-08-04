import { useRef, useState, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Tecnologias.module.css'
import SectionTitle from '../shared/SectionTitle'

gsap.registerPlugin(ScrollTrigger)

const TECHS = [
  'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js',
  'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Prisma', 'Docker',
  'Git', 'Python', 'AWS', 'Figma', 'Tailwind', 'N8N',
]

export default function Tecnologias() {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  // Prende a seção: o scroll "distribui" as cartas de tecnologia como num baralho,
  // até todas estarem na mesa — só então a página libera para a próxima seção
  useLayoutEffect(() => {
    if (reduceMotion) return

    const ctx = gsap.context(() => {
      const grid = gridRef.current
      const items = Array.from(grid.children)
      const gridRect = grid.getBoundingClientRect()

      // Ponto de onde as cartas "saem", como um baralho no centro da mesa
      const dealX = gridRect.width / 2
      const dealY = gridRect.height + 80

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=' + Math.max(700, items.length * 70),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      items.forEach((item, i) => {
        const itemRect = item.getBoundingClientRect()
        const itemX = itemRect.left - gridRect.left + itemRect.width / 2
        const itemY = itemRect.top - gridRect.top + itemRect.height / 2

        tl.fromTo(
          item,
          {
            x: dealX - itemX,
            y: dealY - itemY,
            rotate: gsap.utils.random(-18, 18),
            scale: 0.7,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            duration: 1,
            clearProps: 'transform',
          },
          i * 0.12
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduceMotion])

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className="container">
        <SectionTitle
          eyebrow="Stack"
          align="center"
          lines={[
            <>Aprenda as principais tecnologias</>,
            <>do mercado, de forma <em className="serif-accent">didática</em>,</>,
            <>com os melhores do mercado</>,
          ]}
        />

        <ul className={styles.grid} ref={gridRef}>
          {TECHS.map((tech) => (
            <li key={tech} className={styles.item}>
              <span className={styles.dot} aria-hidden="true" />
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
