# DevClub — Página institucional (Desafio Full Stack)

Landing page conceitual construída para o desafio da vaga Full Stack da DevClub,
na direção visual **Editorial Menta**: dark mode profundo, tipografia expressiva
(Manrope ExtraBold + Instrument Serif Italic) e menta `#7CF5C2` como cor de destaque.

## Stack

- **React 18 + Vite** — build e componentização
- **Framer Motion** — reveals por seção, microinterações, carrosséis com drag, accordion
- **GSAP + ScrollTrigger** — scroll-jack com pin, scrub de vídeo, animações scroll-linked
- **Lenis** — smooth scroll premium, sincronizado ao ScrollTrigger
- **CSS Modules** — estilos isolados por componente, tokens globais em `src/styles/global.css`

## Rodando o projeto

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção
npm run preview  # pré-visualização do build
```

## Arquitetura de animação

Cada seção tem uma "assinatura" de entrada própria (requisito do briefing),
centralizada em `src/animations/variants.js`:

| Seção        | Reveal                                            |
|--------------|---------------------------------------------------|
| Hero         | Linhas de texto sobem por máscara + vídeo scrubado pelo scroll, com a seção pinada |
| Formações    | Scroll-jack: a seção prende e o scroll vertical empurra a trilha na horizontal (drag no mobile) |
| Tecnologias  | Cartas "distribuídas" do centro da mesa, scrubadas com pin |
| Benefícios   | Linha do tempo vertical que se preenche com o scroll + notebook 3D que abre no mesmo progresso |
| Plataforma   | GSAP ScrollTrigger com `scrub` — dashboard levanta em 3D |
| Projetos     | Mosaico com `clip-path` reveal + hover reveal      |
| Depoimentos  | Grid uniforme com stagger e players de vídeo       |
| Mentores     | Foco de lente (blur → nítido) + wall of names      |
| MEC          | Certificado com glow pulsante                      |
| Salários     | Barras crescem do zero + contadores animados       |
| Garantia     | Selo rotativo em SVG + check desenhado (`pathLength`) |
| FAQ          | Accordion com altura animada (AnimatePresence)     |

### Scrub de vídeo pelo scroll

Hero e Benefícios amarram a linha do tempo de um `<video>` à posição do scroll.
O detalhe que faz a diferença está em `src/hooks/useVideoPlayhead.js`: em vez de
escrever `currentTime` a cada frame — o que dispara uma fila de seeks e faz a
imagem andar aos pulos — o vídeo **toca** e o scroll controla o `playbackRate`.
Seek fica reservado ao que playback não resolve: voltar atrás ou saltos longos.

Os MP4 são codificados com keyframe a cada 5 frames (`keyint=5`). Sem isso, um
seek para trás obriga o decoder a voltar ao keyframe anterior e re-decodificar
tudo até o alvo — é o que torna o scroll reverso travado em vídeos comuns.

Acessibilidade: `prefers-reduced-motion` desativa o Lenis, o scroll-jack e o
scrub de vídeo (que passa a exibir o quadro final); elementos decorativos usam
`aria-hidden`; o gráfico tem descrição em `aria-label`.

Responsivo: o scroll-jack vira drag por toque abaixo de 860px, o notebook do
Hero/Benefícios não é sequer baixado em telas sem espaço para ele, e o
enquadramento do vídeo do Hero se desloca em viewports mais estreitos que 16:9
para manter o aluno em quadro.

## Conteúdo

Todos os nomes, números, depoimentos e logos são fictícios, criados para
demonstrar capacidade técnica e de design, conforme autorizado no briefing.
