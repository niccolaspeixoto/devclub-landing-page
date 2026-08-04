import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Faq.module.css'
import SectionTitle from '../shared/SectionTitle'
import { fadeUp, staggerContainer, VIEWPORT, EASE } from '../../animations/variants'

const PERGUNTAS = [
  { q: 'É pra iniciante ou precisa de repertório?', a: 'É 100% do zero. A primeira trilha assume que você nunca escreveu uma linha de código — começamos pela lógica e evoluímos passo a passo até o nível avançado.' },
  { q: 'Eu já trabalho como programador, esse curso vale a pena?', a: 'Sim. Além das trilhas avançadas (arquitetura, IA, automações), você aproveita as mentorias com seniores, a recrutadora e as vagas exclusivas para acelerar promoções e transições.' },
  { q: 'Quanto tempo leva até conseguir a primeira vaga?', a: 'Depende da sua dedicação, mas a média dos nossos alunos comprometidos fica entre 8 e 14 meses do zero até a primeira contratação.' },
  { q: 'Preciso de um computador potente?', a: 'Não. Qualquer notebook razoável dos últimos anos dá conta de todo o conteúdo, incluindo os projetos práticos.' },
  { q: 'As aulas são ao vivo ou gravadas?', a: 'As trilhas são gravadas para você estudar no seu ritmo, e as mentorias, correções de projeto e encontros de carreira acontecem ao vivo toda semana.' },
  { q: 'Por quanto tempo tenho acesso?', a: 'Enquanto sua assinatura estiver ativa, você acessa tudo: cursos novos, atualizações, comunidade, agentes de IA e eventos.' },
  { q: 'Tem certificado?', a: 'Sim — certificados por curso e formação, além do diploma oficial da faculdade reconhecida pelo MEC nas graduações.' },
  { q: 'E se eu travar em algum conteúdo?', a: 'Você nunca fica sozinho: agentes de IA respondem 24h e o suporte humano dos professores funciona 7 dias por semana.' },
]

function Item({ pergunta, resposta, aberto, onToggle, index }) {
  return (
    <motion.li className={styles.item} variants={fadeUp} custom={index}>
      <button className={styles.trigger} onClick={onToggle} aria-expanded={aberto}>
        <span>{pergunta}</span>
        <motion.span
          className={styles.icon}
          animate={{ rotate: aberto ? 45 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            className={styles.answerWrap}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <p className={styles.answer}>{resposta}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export default function Faq() {
  const [aberto, setAberto] = useState(0)

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle
          eyebrow="FAQ"
          align="center"
          lines={[<>Perguntas <em className="serif-accent">frequentes</em></>]}
        />

        <motion.ul
          className={styles.list}
          variants={staggerContainer(0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {PERGUNTAS.map((p, i) => (
            <Item
              key={p.q}
              pergunta={p.q}
              resposta={p.a}
              index={i}
              aberto={aberto === i}
              onToggle={() => setAberto(aberto === i ? null : i)}
            />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
