import { motion } from 'framer-motion'
import styles from './Depoimentos.module.css'
import SectionTitle from '../shared/SectionTitle'
import { fadeUp, staggerContainer, VIEWPORT } from '../../animations/variants'

const DEPOIMENTOS = [
  { nome: 'Camila Ribeiro', cargo: 'Dev Jr na Stone', texto: 'Saí do atendimento ao cliente para o meu primeiro emprego como dev em 11 meses. O acompanhamento da recrutadora fez toda a diferença.', video: true },
  { nome: 'João Pedro Alves', cargo: 'Front End no iFood', texto: 'A comunidade me segurou nos dias difíceis. Hoje trabalho remoto e triplicei minha renda.', video: false },
  { nome: 'Marina Costa', cargo: 'Full Stack na XP Inc.', texto: 'Os projetos práticos viraram meu portfólio. Foi exatamente o que mostrei na entrevista.', video: true },
  { nome: 'Rafael Santos', cargo: 'Back End no Mercado Livre', texto: 'Mentoria semanal com sênior de verdade não tem preço. Aprendi o que nenhum curso gravado ensina.', video: false },
  { nome: 'Beatriz Lima', cargo: 'Mobile na PicPay', texto: 'Comecei do absoluto zero, sem saber o que era HTML. Um ano depois, assinei minha carteira como dev.', video: false },
  { nome: 'Lucas Ferreira', cargo: 'Gestor de IA na TOTVS', texto: 'A trilha de IA me colocou numa posição que nem existia na empresa. Fui promovido criando automações.', video: true },
]

export default function Depoimentos() {
  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle
          eyebrow="Depoimentos"
          lines={[
            <>Milhares de vidas <em className="serif-accent">transformadas</em></>,
            <>dentro da nossa comunidade</>,
          ]}
        />

        <motion.div
          className={styles.gridA}
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {DEPOIMENTOS.map((d, i) => (
            <motion.figure key={d.nome} className={styles.card} variants={fadeUp} custom={i}>
              {d.video && (
                <div className={styles.player} aria-label={`Vídeo de ${d.nome}`}>
                  <span className={styles.play}>▶</span>
                </div>
              )}
              <blockquote>“{d.texto}”</blockquote>
              <figcaption>
                <span className={styles.avatar} aria-hidden="true">
                  {d.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <div>
                  <strong>{d.nome}</strong>
                  <p>{d.cargo}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
