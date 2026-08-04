import styles from './Marquee.module.css'

/**
 * Scroll infinito horizontal em CSS puro (performático no mobile).
 * Duplica o conteúdo para criar o loop contínuo.
 */
export default function Marquee({ children, reverse = false, duration = 30 }) {
  return (
    <div className={styles.marquee}>
      <div
        className={`${styles.track} ${reverse ? styles.reverse : ''}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
