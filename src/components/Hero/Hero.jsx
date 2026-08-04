import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Hero.module.css'
import Marquee from '../shared/Marquee'
import Counter from '../shared/Counter'
import useScrollScrubVideo from '../../hooks/useScrollScrubVideo'
import { lineReveal, fadeUp, staggerContainer } from '../../animations/variants'

const HERO_VIDEO = '/videos/hero/Create_a_premium_cinematic_tra.mp4'
// Primeiro frame do próprio vídeo: cobre o instante entre o primeiro paint e o
// vídeo terminar de decodificar — sem isso, a área fica vazia até lá.
const HERO_POSTER = '/videos/hero/hero-poster.jpg'

// Quanto de scroll (em alturas de viewport) percorre o vídeo inteiro.
const SCROLL_LENGTH_VH = 2.5

// O texto acompanha o vídeo inteiro e só termina de sumir no último segundo dele.
// O ease deixa a leitura confortável quase todo o percurso e concentra a saída no fim.
const COPY_EXIT_AT = 0.95
const SCRIM_TO = 0.24

const EMPRESAS_ROW_1 = ['iFood', 'Nubank', 'OAB', 'USP', 'Magalu', 'Itaú', 'Globo', 'Ambev']
const EMPRESAS_ROW_2 = ['Google', 'Mercado Livre', 'Stone', 'XP Inc.', 'PicPay', 'TOTVS', 'Localiza', 'Vivo']
const AVATARES = ['MC', 'JP', 'AL', 'RS', 'TF']

export default function Hero() {
  const stageRef = useRef(null)
  const videoRef = useRef(null)
  const copyRef = useRef(null)
  const scrimRef = useRef(null)
  const fillRef = useRef(null)

  const [reduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  // Texto e scrim entram na MESMA timeline scrubada do vídeo: um só ScrollTrigger
  // governa tudo, então nada pode dessincronizar.
  const buildTimeline = useCallback((tl) => {
    tl.to(
      copyRef.current,
      {
        // autoAlpha também aplica visibility:hidden no fim, tirando o texto do
        // hit-test sem precisar mexer em pointer-events na mão.
        autoAlpha: 0,
        filter: 'blur(18px)',
        y: -70,
        scale: 0.94,
        ease: 'power2.in',
        duration: COPY_EXIT_AT,
      },
      0
    )
    tl.to(scrimRef.current, { opacity: SCRIM_TO, ease: 'none', duration: 1 }, 0)
  }, [])

  // Escrita direta no DOM — roda a cada frame, nunca via setState.
  const handleProgress = useCallback((progress) => {
    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${progress})`
    }
  }, [])

  const handleLoaded = useCallback(() => {
    const video = videoRef.current
    // Movimento reduzido: sem animação, apenas o quadro final da transformação.
    if (reduceMotion && video?.duration) {
      video.currentTime = Math.max(0, video.duration - 0.05)
    }
  }, [reduceMotion])

  useScrollScrubVideo({
    videoRef,
    pinRef: stageRef,
    scrollLengthVh: SCROLL_LENGTH_VH,
    enabled: !reduceMotion,
    onProgress: handleProgress,
    buildTimeline,
  })

  const titleLines = [
    <>Sua carreira em tech</>,
    <>começa <em className="serif-accent">aqui.</em></>,
  ]

  return (
    <section className={styles.hero}>
      <div className={styles.stage} ref={stageRef}>
        <video
          ref={videoRef}
          className={styles.video}
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          aria-label="Transformação de um estudante de programação em astronauta futurista, conduzida pelo scroll da página"
          onLoadedData={handleLoaded}
        />
        <div className={styles.scrim} ref={scrimRef} aria-hidden="true" />

        <motion.div
          className={`container ${styles.copy}`}
          ref={copyRef}
          variants={staggerContainer(0.1, 0.35)}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="eyebrow" variants={fadeUp}>
            A escola de quem vive de código
          </motion.p>

          <h1 className={styles.title}>
            {titleLines.map((line, i) => (
              <span className="line-mask" key={i}>
                <motion.span variants={lineReveal} custom={i}>{line}</motion.span>
              </span>
            ))}
          </h1>

          <motion.p className={styles.subtitle} variants={fadeUp} custom={2}>
            Formações completas do zero ao avançado, com acompanhamento real
            até a sua primeira vaga — e muito além dela.
          </motion.p>

          <motion.div className={styles.ctas} variants={fadeUp} custom={3}>
            <a href="#formacoes" className="btn btn-primary">Quero ser aluno</a>
            <a href="#plataforma" className={styles.linkCta}>Conhecer formações →</a>
          </motion.div>

          <motion.div className={styles.social} variants={fadeUp} custom={4}>
            <div className={styles.avatars} aria-hidden="true">
              {AVATARES.map((a, i) => (
                <span key={a} style={{ zIndex: AVATARES.length - i }}>{a}</span>
              ))}
            </div>
            <p>
              <strong><Counter to={25} prefix="+" suffix=" mil" /></strong> alunos já passaram por aqui
            </p>
          </motion.div>
        </motion.div>

        {!reduceMotion && (
          <div className={styles.progress} aria-hidden="true">
            <span className={styles.fill} ref={fillRef} />
          </div>
        )}
      </div>

      <motion.div
        className={styles.logosBlock}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9 }}
      >
        <Marquee duration={28}>
          {EMPRESAS_ROW_1.map((e) => <span key={e} className={styles.logoItem}>{e}</span>)}
        </Marquee>
        <p className={styles.logosCaption}>Alunos nas maiores empresas do Brasil e do mundo</p>
        <Marquee reverse duration={34}>
          {EMPRESAS_ROW_2.map((e) => <span key={e} className={styles.logoItem}>{e}</span>)}
        </Marquee>
      </motion.div>
    </section>
  )
}
