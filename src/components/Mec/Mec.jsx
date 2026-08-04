import { motion } from 'framer-motion'
import styles from './Mec.module.css'
import SectionTitle from '../shared/SectionTitle'
import { VIEWPORT, EASE } from '../../animations/variants'

export default function Mec() {
  return (
    <section id="mec" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <SectionTitle
          eyebrow="Faculdade DevClub"
          lines={[
            <>Escola reconhecida pelo MEC,</>,
            <>com diplomas <em className="serif-accent">oficiais</em></>,
          ]}
        />

        <motion.div
          className={styles.stage}
          initial={{ opacity: 0, y: 60, rotate: -3 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className={styles.certGlow} aria-hidden="true" />
          <div className={styles.cert} role="img" aria-label="Certificado oficial DevClub">
            <div className={styles.certBorder}>
              <p className={styles.certBrand}>Dev<span>Club</span></p>
              <p className={styles.certLabel}>Certificado de conclusão</p>
              <p className={styles.certNome}>Ana Beatriz Souza</p>
              <p className={styles.certCurso}>Formação em Programação Full Stack — 480 horas</p>
              <div className={styles.certFooter}>
                <span>Reconhecido pelo MEC</span>
                <span className={styles.selo} aria-hidden="true">✦</span>
                <span>Diploma oficial</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
