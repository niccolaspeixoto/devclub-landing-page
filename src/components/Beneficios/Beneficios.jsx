import { useCallback, useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import styles from './Beneficios.module.css'
import SectionTitle from '../shared/SectionTitle'
import useVideoPlayhead from '../../hooks/useVideoPlayhead'
import { slideSide, EASE, VIEWPORT } from '../../animations/variants'

const NOTEBOOK_VIDEO = '/videos/beneficios/notebook-devclub.mp4'

const BENEFICIOS = [
  { titulo: 'Acompanhamento de recrutadora', desc: 'Sessões semanais de carreira, currículo e LinkedIn com quem contrata de verdade.', icone: '◎' },
  { titulo: 'Terapeuta de alta performance', desc: 'Saúde mental levada a sério — foco, ansiedade e consistência nos estudos.', icone: '❋' },
  { titulo: 'Mentorias semanais', desc: 'Encontros ao vivo com profissionais seniores das maiores empresas do país.', icone: '◈' },
  { titulo: 'Agentes de IA 24h', desc: 'Tire dúvidas de código a qualquer hora com agentes treinados no conteúdo.', icone: '✦' },
  { titulo: 'Suporte humano 7 dias por semana', desc: 'Ninguém fica travado: professores respondem todos os dias.', icone: '☰' },
  { titulo: 'A maior comunidade tech do Brasil', desc: 'Networking, duplas de estudo e indicações que viram contratações.', icone: '⬡' },
  { titulo: 'Vagas exclusivas', desc: 'Empresas parceiras abrem processos fechados só para alunos DevClub.', icone: '→' },
]

// A "cabeça" da linha do tempo passa pelo item quando ele cruza ~65% da viewport —
// mesmo ponto em que o preenchimento da linha chega até ele.
const NODE_VIEWPORT = { once: true, margin: '0px 0px -35% 0px' }

// Abaixo disso não sobra espaço ao lado da lista: o notebook nem chega a ser
// baixado (são ~2,6 MB que não fariam falta nenhuma no celular).
const NOTEBOOK_MQ = '(min-width: 901px)'

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function Beneficios() {
  const timelineRef = useRef(null)
  const videoRef = useRef(null)

  const [ambiente] = useState(() => ({
    reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    temEspaco: window.matchMedia(NOTEBOOK_MQ).matches,
  }))
  // O vídeo só entra no DOM (e só então é baixado) quando a seção se aproxima:
  // o Hero também carrega um vídeo pesado e não faz sentido disputar banda com ele.
  const perto = useInView(timelineRef, { once: true, margin: '900px 0px 900px 0px' })
  const mostrarVideo = ambiente.temEspaco && perto
  const notebookAnimado = mostrarVideo && !ambiente.reduceMotion

  // Progresso do scroll dentro da lista: 0 quando o topo entra, 1 quando o fim sai.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 60%'],
  })
  const progresso = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  const altura = useTransform(progresso, (v) => `${clamp01(v) * 100}%`)
  const opacidadeCabeca = useTransform(progresso, [0, 0.02, 0.985, 1], [0, 1, 1, 0])

  // O notebook bebe do MESMO progresso que preenche a linha — sem o spring, que
  // passaria do ponto no fim e forçaria o vídeo a rebobinar. Assim a tampa acaba
  // de abrir no instante exato em que a linha do tempo chega ao último item.
  const playhead = useVideoPlayhead({ videoRef, enabled: notebookAnimado })
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    playhead.current.progress = clamp01(v)
  })

  // Sem animação: mostra direto o quadro final, com o notebook aberto.
  const handleLoaded = useCallback(() => {
    const video = videoRef.current
    if (!notebookAnimado && video?.duration) {
      video.currentTime = Math.max(0, video.duration - 0.05)
    }
  }, [notebookAnimado])

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle
          eyebrow="Além do código"
          lines={[
            <>Tudo que você precisa <em className="serif-accent">além</em></>,
            <>do código para evoluir mais rápido</>,
          ]}
        />

        <div className={styles.layout}>
          <div className={styles.timeline} ref={timelineRef}>
            <div className={styles.trilho} aria-hidden="true">
              <motion.span className={styles.preenchimento} style={{ height: altura }} />
              <motion.span className={styles.cabeca} style={{ top: altura, opacity: opacidadeCabeca }} />
            </div>

            <ul>
              {BENEFICIOS.map((b, i) => (
                <motion.li
                  key={b.titulo}
                  className={styles.item}
                  variants={slideSide}
                  custom={i % 2 === 0 ? 1 : -1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                >
                  <motion.span
                    className={styles.marcador}
                    initial={{ scale: 0.55, backgroundColor: 'rgba(124, 245, 194, 0.14)', boxShadow: '0 0 0 0 rgba(124, 245, 194, 0)' }}
                    whileInView={{ scale: 1, backgroundColor: 'rgba(124, 245, 194, 1)', boxShadow: '0 0 14px 2px rgba(124, 245, 194, 0.35)' }}
                    viewport={NODE_VIEWPORT}
                    transition={{ duration: 0.5, ease: EASE }}
                    aria-hidden="true"
                  />
                  <span className={styles.num} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.icone} aria-hidden="true">{b.icone}</span>
                  <div>
                    <h3>{b.titulo}</h3>
                    <p>{b.desc}</p>
                  </div>
                  <motion.span
                    className={styles.line}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    aria-hidden="true"
                  />
                </motion.li>
              ))}
            </ul>
          </div>

          {ambiente.temEspaco && (
            <aside className={styles.palco} aria-hidden="true">
              <motion.div
                className={styles.sticky}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <span className={styles.brilho} />
                {mostrarVideo && (
                  <video
                    ref={videoRef}
                    className={styles.notebook}
                    src={NOTEBOOK_VIDEO}
                    preload="auto"
                    muted
                    playsInline
                    disablePictureInPicture
                    onLoadedData={handleLoaded}
                  />
                )}
              </motion.div>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
