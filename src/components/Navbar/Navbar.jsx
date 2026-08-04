import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from 'framer-motion'
import styles from './Navbar.module.css'

const FORMACOES = [
  'Programação Full Stack',
  'Programação Front End',
  'Programação Back End',
  'Programação Mobile',
  'IA e Automações',
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  return (
    <motion.header
      className={`${styles.navbar} ${scrolled ? styles.solid : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <nav className={`container ${styles.inner}`}>
        <a href="#" className={styles.logo} aria-label="DevClub — início">
          Dev<span>Club</span>
        </a>

        <ul className={styles.links}>
          <li
            className={styles.dropdownWrap}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className={styles.link} aria-expanded={dropdownOpen}>
              Formações <span className={styles.caret}>▾</span>
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {FORMACOES.map((f) => (
                    <li key={f}>
                      <a href="#formacoes">{f}</a>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
          <li>
            <a className={styles.link} href="#mec">Faculdade</a>
          </li>
        </ul>

        <div className={styles.actions}>
          <a href="#" className={`btn btn-ghost ${styles.btnSmall}`}>Área do aluno</a>
          <a href="#formacoes" className={`btn btn-primary ${styles.btnSmall}`}>Quero ser aluno</a>
        </div>

        <button
          className={styles.burger}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
        >
          <span /><span />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#formacoes" onClick={() => setMobileOpen(false)}>Formações</a>
            <a href="#mec" onClick={() => setMobileOpen(false)}>Faculdade</a>
            <a href="#" onClick={() => setMobileOpen(false)}>Área do aluno</a>
            <a href="#formacoes" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
              Quero ser aluno
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
