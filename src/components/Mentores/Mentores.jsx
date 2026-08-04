import { motion } from 'framer-motion'
import styles from './Mentores.module.css'
import SectionTitle from '../shared/SectionTitle'
import { teleportIn, blurIn, staggerContainer, VIEWPORT } from '../../animations/variants'

const MENTORES = [
  { nome: 'Rodolfo Mori', cargo: 'Fundador & Full Stack Educator', foto: '/mentores/mentor-1.jpg' },
  { nome: 'Fernanda Duarte', cargo: 'Tech Recruiter Lead', foto: '/mentores/mentor-2.jpg' },
  { nome: 'Andrey Maia', cargo: 'Senior Back End Engineer', foto: '/mentores/mentor-3.jpg' },
  { nome: 'Henrique Sales', cargo: 'Product Designer', foto: '/mentores/mentor-4.jpg' },
]

const NOMES = [
  'Rodolfo Mori', 'Fernanda', 'Agustinho', 'Henrique', 'Márcio',
  'Juliana', 'Mateus', 'Design System Specialist', 'Camila', 'Vitor',
  'Ana Clara', 'Roberto', 'Paula', 'Diego',
]

export default function Mentores() {
  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle
          eyebrow="Mentores"
          spacing={32}
          lines={[<>Aprenda com <em className="serif-accent">os melhores</em></>]}
        />

        <motion.div
          className={styles.grid}
          variants={staggerContainer(0.09)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {MENTORES.map((m, i) => (
            <motion.article
              key={m.nome}
              className={styles.card}
              variants={teleportIn}
              custom={MENTORES.length - 1 - i}
            >
              <div
                className={styles.foto}
                style={{ backgroundImage: `url(${m.foto})` }}
                role="img"
                aria-label={m.nome}
              />
              <div className={styles.overlay}>
                <h3>{m.nome}</h3>
                <p>{m.cargo}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className={styles.wall}
          variants={staggerContainer(0.03)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <p className={styles.wallLabel}>E um time inteiro com você:</p>
          <p className={styles.names}>
            {NOMES.map((n, i) => (
              <motion.span key={n} variants={blurIn} custom={i}>
                {n}
                {i < NOMES.length - 1 && <em aria-hidden="true"> · </em>}
              </motion.span>
            ))}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
