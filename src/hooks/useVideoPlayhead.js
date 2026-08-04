import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

/*
 * Por que não usar `video.currentTime = alvo` a cada frame:
 * cada atribuição dispara um seek, o decoder precisa voltar ao keyframe anterior
 * e remontar a imagem. Em 60 Hz isso vira uma fila de seeks e a imagem "anda aos
 * pulos" mesmo com o scroll perfeitamente suave.
 *
 * Aqui o vídeo simplesmente TOCA, e quem controla a velocidade de reprodução é a
 * distância até o alvo: o caminho normal de decode, quadro a quadro, sem seek
 * nenhum. Seek fica só para o que playback não resolve — voltar atrás ou saltos
 * muito longos.
 */

// Quanto a velocidade reage à distância até o alvo (por segundo de atraso).
const RATE_GAIN = 8
// Teto do que o navegador aceita em playbackRate.
const MAX_RATE = 16
const MIN_RATE = 0.1

// Só saltamos quando nem a 16x daria para alcançar rápido. Na prática o avanço
// quase nunca cai aqui — é o que elimina o tranco do scroll rápido.
const FORWARD_JUMP = 5
// Distância considerada "chegou": pausa e espera o scroll.
const FORWARD_SETTLE = 1 / 50
// Frames consecutivos "no alvo" antes de realmente pausar (histerese).
const SETTLE_FRAMES = 6
// Passar do ponto por menos que isso é overshoot natural do playback — corrigir
// geraria um seek por frame e devolveria o tranco que estamos evitando.
const BACK_TOLERANCE = 0.09

/**
 * Mantém a posição de um <video> perseguindo um alvo de progresso (0–1).
 *
 * Devolve um ref para um objeto `{ progress }`: escreva nele de onde quiser
 * (timeline do GSAP, motion value do Framer, o que for) e o vídeo persegue o
 * valor sozinho, a cada frame, sem passar por estado do React.
 */
export default function useVideoPlayhead({ videoRef, enabled = true }) {
  const playhead = useRef({ progress: 0 })

  useLayoutEffect(() => {
    const video = videoRef.current
    if (!enabled || !video) return

    const alvo = playhead.current
    let settledFrames = 0

    const follow = () => {
      const { duration } = video
      if (!duration || Number.isNaN(duration)) return

      const target = alvo.progress * duration
      const diff = target - video.currentTime

      // Chegou (ou passou um triz): segura o quadro. A histerese evita alternar
      // play/pause a cada frame no scroll lento — cada transição dessas custa
      // uma hesitação visível na imagem.
      if (diff < FORWARD_SETTLE && diff > -BACK_TOLERANCE) {
        settledFrames += 1
        if (settledFrames >= SETTLE_FRAMES && !video.paused) video.pause()
        return
      }
      settledFrames = 0

      // Para trás, ou longe demais à frente: só seek resolve.
      if (diff < 0 || diff > FORWARD_JUMP) {
        if (!video.paused) video.pause()
        if (!video.seeking) video.currentTime = target
        return
      }

      // À frente e por perto: deixa tocar, acelerando o quanto for preciso.
      video.playbackRate = Math.min(Math.max(diff * RATE_GAIN, MIN_RATE), MAX_RATE)
      if (video.paused) video.play().catch(() => {})
    }

    // Alguns navegadores (iOS em especial) só renderizam frames de um vídeo que
    // já entrou em playback ao menos uma vez.
    const primeDecoder = () => {
      const playing = video.play()
      if (playing && typeof playing.then === 'function') {
        playing.then(() => video.pause()).catch(() => {})
      } else {
        video.pause()
      }
    }

    primeDecoder()

    // Rebobinar é o único caso que playback não resolve (não existe playbackRate
    // negativo). Encadear o próximo seek no instante em que o anterior entrega o
    // frame — em vez de esperar o próximo tick — dá a cadência mais regular
    // possível e evita as paradas longas de seeks se atropelando.
    video.addEventListener('seeked', follow)

    // No ticker (não num listener de scroll): mesmo com o scroll parado o vídeo
    // ainda precisa de frames para desacelerar e parar no ponto certo. O ticker
    // do GSAP já é o mesmo rAF que roda o Lenis, então tudo cai no mesmo frame.
    gsap.ticker.add(follow)

    return () => {
      gsap.ticker.remove(follow)
      video.removeEventListener('seeked', follow)
      video.pause()
    }
  }, [enabled, videoRef])

  return playhead
}
