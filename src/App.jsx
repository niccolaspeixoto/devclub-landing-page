import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from './hooks/useLenis'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Formacoes from './components/Formacoes/Formacoes'
import Tecnologias from './components/Tecnologias/Tecnologias'
import Beneficios from './components/Beneficios/Beneficios'
import Plataforma from './components/Plataforma/Plataforma'
import Projetos from './components/Projetos/Projetos'
import Depoimentos from './components/Depoimentos/Depoimentos'
import Mentores from './components/Mentores/Mentores'
import Mec from './components/Mec/Mec'
import Salarios from './components/Salarios/Salarios'
import Garantia from './components/Garantia/Garantia'
import Faq from './components/Faq/Faq'
import Footer from './components/Footer/Footer'

export default function App() {
  useLenis()

  // Recalcula todos os ScrollTriggers depois que todas as seções (e seus pin-spacers,
  // como Formações e Tecnologias) montaram — evita cálculos de posição desatualizados
  // quando uma seção pinada altera a altura do documento antes das seguintes montarem.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Formacoes />
        <Tecnologias />
        <Beneficios />
        <Plataforma />
        <Projetos />
        <Depoimentos />
        <Mentores />
        <Mec />
        <Salarios />
        <Garantia />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
