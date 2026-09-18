import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, Code2, Menu, MessageCircle, X } from 'lucide-react'
import { expertise, profile, projects } from './data'
import './portrait.css'
import yanPhoto from '../assets/Yan.jpeg'
import javaLogo from '../assets/java.svg'

const nav = ['Início', 'Sobre', 'Projetos', 'Contato']
const typingPhrases = ['desenvolvedor web', 'estudante de software', 'criador de projetos']
const technologies = [
  ['HTML', 'Estrutura web', 'https://cdn.simpleicons.org/html5/E34F26'],
  ['CSS', 'Estilo e layout', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg'],
  ['JavaScript', 'Interatividade', 'https://cdn.simpleicons.org/javascript/F7DF1E'],
  ['TypeScript', 'Código seguro', 'https://cdn.simpleicons.org/typescript/3178C6'],
  ['React', 'Interfaces', 'https://cdn.simpleicons.org/react/61DAFB'],
  ['Git', 'Versionamento', 'https://cdn.simpleicons.org/git/F05032'],
  ['Java', 'Programação', javaLogo],
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('Início')
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<typeof projects[number] | null>(null)
  const [typingText, setTypingText] = useState('')
  const [typingPhraseIndex, setTypingPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const technologyRailRef = useRef<HTMLDivElement>(null)
  const projectRailRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('section[id]')]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting)
      if (visible) setActive(visible.target.getAttribute('data-label') || 'Início')
    }, { rootMargin: '-35% 0px -55%' })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const phrase = typingPhrases[typingPhraseIndex]
    const isComplete = typingText === phrase
    const isEmpty = typingText.length === 0
    const delay = isComplete ? 700 : isEmpty && isDeleting ? 120 : isDeleting ? 25 : 45
    const timer = window.setTimeout(() => {
      if (isComplete && !isDeleting) {
        setIsDeleting(true)
      } else if (isEmpty && isDeleting) {
        setIsDeleting(false)
        setTypingPhraseIndex((index) => (index + 1) % typingPhrases.length)
      } else {
        setTypingText(isDeleting ? phrase.slice(0, typingText.length - 1) : phrase.slice(0, typingText.length + 1))
      }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [isDeleting, typingPhraseIndex, typingText])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const rail = technologyRailRef.current
      if (rail) rail.scrollLeft = rail.scrollWidth / 3
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const goTo = (label: string) => {
    document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const moveTechnologies = (direction: 'previous' | 'next') => {
    const rail = technologyRailRef.current
    if (!rail) return
    rail.scrollBy({ left: direction === 'next' ? 250 : -250, behavior: 'smooth' })
  }

  const moveProjects = (direction: 'previous' | 'next') => {
    projectRailRef.current?.scrollBy({ left: direction === 'next' ? projectRailRef.current.clientWidth + 22 : -(projectRailRef.current.clientWidth + 22), behavior: 'smooth' })
  }

  const loopTechnologies = () => {
    const rail = technologyRailRef.current
    if (!rail) return
    const cycleWidth = rail.scrollWidth / 3
    if (cycleWidth <= 0) return
    if (rail.scrollLeft >= cycleWidth * 2) rail.scrollLeft -= cycleWidth
    if (rail.scrollLeft <= 0) rail.scrollLeft += cycleWidth
  }

  return (
    <main>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <header className="nav-wrap">
        <button className="logo" onClick={() => goTo('Início')} aria-label="Voltar ao início">{profile.name.split(' ').map((part) => part[0]).join('')}</button>
        <nav className={menuOpen ? 'open' : ''}>
          {nav.map((item) => <button className={active === item ? 'active' : ''} onClick={() => goTo(item)} key={item}>{item}</button>)}
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X /> : <Menu />}</button>
        <span className="availability"><i /> Disponível para projetos</span>
      </header>

      <section className="hero" id="início" data-label="Início">
        <div className="hero-section-dots" aria-label="Navegação por seção">{nav.map((item) => <button className={active === item ? 'active' : ''} onClick={() => goTo(item)} key={item}><i /><span>{item}</span></button>)}</div>
        <div className="intro-shell">
          <div className="intro-copy">
            <motion.p className="intro-greeting" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>OLÁ, EU SOU</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .7 }}>{profile.name.split(' ')[0]}<br /><span>{profile.name.split(' ')[1]}.</span></motion.h1>
            <motion.p className="intro-description" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22 }}>Desenvolvedor web. Este é o meu portfólio, onde reúno projetos, experiências e ideias construídas para a web.</motion.p>
            <motion.p className="typing-line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}><span>&gt;</span> {typingText}<b aria-hidden="true">_</b></motion.p>
            <motion.button className="intro-button" onClick={() => goTo('Projetos')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }}>Ver projetos <ArrowDownRight /></motion.button>
          </div>
          <motion.div className="portrait-stage" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .7 }}>
            <div className="portrait-orbit orbit-one" />
            <div className="portrait-orbit orbit-two" />
            <div className="portrait-frame">
              <div className="portrait-corner corner-top" />
              <div className="portrait-placeholder"><img src={yanPhoto} alt={`Retrato de ${profile.name}`} /><span className="portrait-image-label">YAN / 2025</span></div>
              <div className="portrait-corner corner-bottom" />
            </div>
            <div className="portrait-caption"><span>PORTFÓLIO / 2025</span><strong>{profile.name}</strong><small>{profile.role}</small></div>
            <span className="portrait-stamp">Desenvolvedor<br />Web</span>
          </motion.div>
        </div>
      </section>

      <section className="about section-pad" id="sobre" data-label="Sobre">
        <p className="section-index">Sobre mim</p>
        <div className="about-grid"><div className="about-heading"><h2>Sobre<br /><i>mim.</i></h2><p>ESTUDANTE DE ENGENHARIA DE SOFTWARE<br />DESENVOLVEDOR EM FORMAÇÃO</p></div><div className="about-content"><div className="about-copy"><p>Sou <strong>Yan Teles</strong>, estudante de Engenharia de Software e desenvolvedor em formação. Sempre tive interesse por tecnologia e gosto de transformar ideias em projetos que sejam úteis, funcionais e bem feitos.</p><p>Também tenho experiência com manutenção e montagem de computadores, o que aumentou ainda mais meu interesse pela área.</p><p>Sou uma pessoa curiosa, proativa e que gosta de aprender na prática. Atualmente, busco evoluir cada vez mais como desenvolvedor e ganhar experiência em projetos reais.</p></div><a href="#contato" onClick={(e) => { e.preventDefault(); goTo('Contato') }}>Vamos conversar <ArrowUpRight /></a></div></div>
        <div className="technology-block"><div className="technology-heading"><div><span>STACK ATUAL</span><strong>Tecnologias</strong></div><small>ARRASTE OU USE AS SETAS PARA EXPLORAR</small><em>{technologies.length} itens</em></div><div className="technology-carousel"><button className="technology-arrow" onClick={() => moveTechnologies('previous')} aria-label="Tecnologia anterior"><ArrowLeft /></button><div className="technology-viewport" ref={technologyRailRef} onScroll={loopTechnologies}><div className="technology-list">{[...technologies, ...technologies, ...technologies].map(([name, description, logo], index) => <article className="technology-card" key={`${name}-${index}`}><div className="technology-card-top"><b>0{(index % technologies.length) + 1}</b><span className="technology-logo"><img src={logo} alt={`${name} logo`} /></span></div><div className="technology-card-info"><strong>{name}</strong><small>{description}</small></div></article>)}</div></div><button className="technology-arrow" onClick={() => moveTechnologies('next')} aria-label="Próxima tecnologia"><ArrowRight /></button></div></div>
      </section>

      <section className="projects section-pad" id="projetos" data-label="Projetos">
        <div className="section-head"><p className="section-index">Projetos</p><p>Uma seleção de ideias<br />transformadas em realidade.</p></div>
        <div className="project-carousel"><button className="project-arrow" onClick={() => moveProjects('previous')} aria-label="Projeto anterior"><ArrowLeft /></button><div className="project-viewport" ref={projectRailRef}><div className="project-list">{projects.map((project, index) => <motion.article className={`project-card ${project.color}`} key={project.title} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .08 }}>
          <div className="project-visual"><span>{project.year}</span><div className="visual-shape" /><span className="project-number">0{index + 1}</span></div>
          <div className="project-info"><div><p>{project.category}</p><h3>{project.title}</h3></div><p className="description">{project.description}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button aria-label={`Abrir ${project.title}`}><ArrowUpRight /></button></div>
        </motion.article>)}</div></div><button className="project-arrow" onClick={() => moveProjects('next')} aria-label="Próximo projeto"><ArrowRight /></button></div>
        <button className="all-projects" onClick={() => { setProjectsOpen(true); setSelectedProject(null) }}>Ver todos os projetos <ArrowUpRight /></button>
        {projectsOpen && <div className="project-modal-backdrop" role="presentation" onClick={() => setProjectsOpen(false)}><section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onClick={(event) => event.stopPropagation()}><div className="project-modal-header"><div><p className="section-index">ARQUIVO COMPLETO</p><h2 id="project-modal-title">Todos os projetos</h2></div><button className="project-modal-close" onClick={() => setProjectsOpen(false)} aria-label="Fechar projetos"><X /></button></div>{selectedProject && <div className={`project-detail ${selectedProject.color}`}><div className="project-detail-visual"><div className="visual-shape" /></div><div><p>{selectedProject.category} · {selectedProject.year}</p><h3>{selectedProject.title}</h3><span>{selectedProject.description}</span><div>{selectedProject.tags.map((tag) => <b key={tag}>{tag}</b>)}</div></div></div>}<div className="project-modal-list">{projects.map((project, index) => <article className="project-modal-item" key={project.title} role="button" tabIndex={0} onClick={() => setSelectedProject(project)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedProject(project) }}><span>0{index + 1}</span><div className={`project-modal-preview ${project.color}`}><div className="visual-shape" /></div><div><p>{project.category} · {project.year}</p><h3>{project.title}</h3><small>{project.description}</small><div>{project.tags.map((tag) => <b key={tag}>{tag}</b>)}</div></div><ArrowUpRight /></article>)}</div></section></div>}
      </section>

      <section className="expertise section-pad"><p className="section-index contact-section-label">O que eu faço</p><div className="expertise-list">{expertise.map(([num, title, text, metric, detail], index) => <article className={index === 0 ? 'featured-expertise' : ''} key={num}><span className="expertise-number">{num}</span><div className={`expertise-preview expertise-preview-${index + 1}`} aria-hidden="true">{index === 0 && <><i /><i /><i /></>}{index === 1 && <><b /><b /><b /><i /></>}{index === 2 && <><i /><i /><i /><b /></>}</div><div className="expertise-copy"><h3>{title}</h3><p>{text}</p></div><span className="expertise-metric">{metric}</span><span className="expertise-detail">{detail}</span></article>)}</div></section>

      <section className="contact section-pad" id="contato" data-label="Contato"><p className="section-index contact-section-label">Contato</p><div className="contact-main"><div className="contact-intro"><h2 className="contact-title">abrindo espaço para<br /><em>um novo projeto.</em></h2><span className="contact-note">Tem uma ideia, projeto ou problema para resolver?<br />Me conta. Eu respondo por e-mail.</span></div><div className="contact-actions"><div className="contact-socials"><a href="https://linkedin.com" target="_blank" rel="noreferrer"><BriefcaseBusiness /><span>LinkedIn</span><ArrowUpRight /></a><a href="https://github.com" target="_blank" rel="noreferrer"><Code2 /><span>GitHub</span><ArrowUpRight /></a><a href="https://wa.me/?text=Olá%20Yan%2C%20vim%20pelo%20seu%20portfólio." target="_blank" rel="noreferrer"><MessageCircle /><span>WhatsApp</span><ArrowUpRight /></a></div><a className="contact-email" href={`mailto:${profile.email}`}><span>{profile.email}</span><ArrowUpRight /></a><span className="contact-location">Trabalho com desenvolvimento web no Brasil e respondo mensagens em até dois dias úteis.</span></div></div><footer><span className="footer-identity">© 2025 / {profile.name}</span><span className="footer-note">desenvolvimento web com clareza, código e curiosidade</span><span className="footer-stack">HTML, CSS e JS — sem frameworks, sem atalhos</span></footer></section>
    </main>
  )
}

export default App
