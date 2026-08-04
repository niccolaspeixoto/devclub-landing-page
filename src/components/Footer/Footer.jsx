import { motion } from 'framer-motion'
import styles from './Footer.module.css'
import Marquee from '../shared/Marquee'
import { fadeUp, staggerContainer, VIEWPORT } from '../../animations/variants'

const COLUNAS = [
  { titulo: 'Workshops', links: ['Do zero ao deploy', 'Freelas que pagam', 'IA para devs', 'Entrevista técnica'] },
  { titulo: 'Ferramentas', links: ['Gerador de currículo', 'Roadmap interativo', 'Calculadora salarial', 'Playground'] },
  { titulo: 'Ebooks', links: ['Guia do primeiro emprego', 'JavaScript essencial', 'Carreira internacional', 'Portfólio matador'] },
]

const SUBMARCAS = ['Cursos Skills', 'Framer Skills', 'UI Skills', 'Figma Skills', 'Coding Skills']

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <motion.div
        className={`container ${styles.top}`}
        variants={staggerContainer(0.09)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.div className={styles.brand} variants={fadeUp}>
          <p className={styles.logo}>Dev<span>Club</span></p>
          <p className={styles.tagline}>
            A escola de quem <em className="serif-accent">vive</em> de código.
          </p>
          <div className={styles.social}>
            {['Instagram', 'YouTube', 'LinkedIn', 'TikTok'].map((s) => (
              <a key={s} href="#" aria-label={s}>{s}</a>
            ))}
          </div>
        </motion.div>

        {COLUNAS.map((c, i) => (
          <motion.nav key={c.titulo} variants={fadeUp} custom={i + 1} aria-label={c.titulo}>
            <h3>{c.titulo}</h3>
            <ul>
              {c.links.map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </motion.nav>
        ))}
      </motion.div>

      <div className={styles.subBrands}>
        <Marquee duration={26}>
          {SUBMARCAS.map((s) => (
            <span key={s} className={styles.subBrand}>{s}</span>
          ))}
        </Marquee>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© 2026 DevClub. Projeto conceitual desenvolvido para o desafio de vaga Full Stack.</p>
        <p>Feito com React, Framer Motion e GSAP por <a href="https://instagram.com/niccolaspeixotodev">@niccolaspeixotodev</a></p>
      </div>
    </footer>
  )
}
