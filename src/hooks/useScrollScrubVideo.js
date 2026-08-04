import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useVideoPlayhead from './useVideoPlayhead'

gsap.registerPlugin(ScrollTrigger)

/**
 * Amarra a linha do tempo de um <video> à posição do scroll.
 *
 * `pinRef` fica preso na viewport enquanto o vídeo avança e é liberado no último
 * frame; rolar para cima rebobina. Nenhum estado do React muda durante o scroll.
 *
 * `buildTimeline` recebe a mesma timeline scrubada, para que o consumidor
 * sincronize outras animações (texto, overlays) exatamente com o vídeo.
 *
 * Quem só quer o scrub, sem prender o scroll da página, usa `useVideoPlayhead`
 * direto — é ele quem faz o vídeo perseguir o progresso.
 */
export default function useScrollScrubVideo({
  videoRef,
  pinRef,
  scrollLengthVh = 2.5,
  scrub = 0.6,
  enabled = true,
  onProgress,
  buildTimeline,
}) {
  const playhead = useVideoPlayhead({ videoRef, enabled })

  // Refs mantêm os callbacks atuais sem recriar o ScrollTrigger a cada render.
  const onProgressRef = useRef(onProgress)
  onProgressRef.current = onProgress
  const buildTimelineRef = useRef(buildTimeline)
  buildTimelineRef.current = buildTimeline

  useLayoutEffect(() => {
    const pin = pinRef.current
    if (!enabled || !pin) return

    const alvo = playhead.current

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${window.innerHeight * scrollLengthVh}`,
          pin: true,
          anticipatePin: 1,
          scrub,
          invalidateOnRefresh: true,
          onUpdate: (self) => onProgressRef.current?.(self.progress),
        },
      })

      tl.to(alvo, { progress: 1, ease: 'none', duration: 1 }, 0)
      buildTimelineRef.current?.(tl)
    }, pin)

    return () => ctx.revert()
  }, [enabled, scrub, scrollLengthVh, pinRef, playhead])
}
