import { useState } from 'react';
import projects from './data/projects';
import heroPlate from '../assets/plates/hero-collage.png';
import SceneBackground from './SceneBackground';
import './App.css';
import './Portfolio.css';

const interests = ['Coding', 'Chess', 'Cats', 'Robots'];

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['About', '#about'],
    ['Work', '#work'],
    ['Side quests', '#side-quests'],
    ['Contact', '#contact'],
  ];

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Aditya, home">A<span>.</span></a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>{menuOpen ? 'Close' : 'Menu'}</span>
        <span className={`menu-toggle__glyph ${menuOpen ? 'is-open' : ''}`} aria-hidden="true"><i /><i /></span>
      </button>
      <nav id="site-navigation" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
      </nav>
      <p className="folio-meta">Personal folio <span>/</span> 2026</p>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <img className="hero__image" src={heroPlate} alt="Blue collage of a cat, moon, stars, and layered editorial graphics" fetchPriority="high" />
      <div className="hero__shade" />
      <div className="hero__copy">
        <p className="hero__descriptor">Aditya · Engineering student</p>
        <h1 id="hero-title">just your<br />average<br /><span>nerd <i>;)</i></span></h1>
        <p className="hero__intro">Coding, chess, cats, robots—and whatever I get curious about next.</p>
        <a className="hero__link" href="#about"><span>Explore the folio</span><span className="arrow" aria-hidden="true">↘</span></a>
      </div>
      <div className="hero__caption"><span>FIELD PLATE</span><span>A small window into a curious mind</span></div>
    </section>
  );
}

function About() {
  return (
    <section className="about section-shell" id="about" aria-labelledby="about-title">
      <p className="about__kicker">Field entry / about</p>
      <div className="section-heading">
        <h2 id="about-title">A few things<br /><em>about me.</em></h2>
        <span className="section-heading__note">A short introduction, no formalities.</span>
      </div>
      <div className="about__body">
        <p className="about__statement">I’m interested in a lot of things, and I tend to follow the questions that come with them.</p>
        <div className="about__details">
          <p>Engineering is what I study. Outside of it, I’m drawn to coding, chess, cats, robots, and whatever catches my curiosity next.</p>
          <p>This site is a place to collect the things I make and the things I’m still figuring out.</p>
        </div>
      </div>
      <div className="about__margin-note" aria-hidden="true">STILL CURIOUS <span /></div>
    </section>
  );
}

function Work() {
  return (
    <section className="work section-shell" id="work" aria-labelledby="work-title">
      <div className="section-heading section-heading--work">
        <h2 id="work-title">Things I’ve<br /><em>made.</em></h2>
        <p className="section-heading__note">An archive in progress. Real projects will go here when they’re ready to share.</p>
      </div>
      {projects.length ? (
        <div className="project-list">
          {projects.map((project, index) => (
            <article className="project-slot" key={project.title}>
              <span className="project-slot__index">PROJECT / {String(index + 1).padStart(2, '0')}</span>
              {project.image && <img className="project-slot__image" src={project.image} alt={project.imageAlt || ''} loading="lazy" />}
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-slot__meta">
                {project.technologies?.length > 0 && <span>{project.technologies.join(' · ')}</span>}
                {project.repository && <a href={project.repository} target="_blank" rel="noreferrer">Source ↗</a>}
                {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live ↗</a>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="project-empty">
          <span className="project-empty__mark" aria-hidden="true"><i /><i /><i /></span>
          <p><strong>The archive is still open.</strong><br />Projects will show up here when there’s something real to share.</p>
          <span className="project-empty__label">NO PROJECTS PUBLISHED YET</span>
        </div>
      )}
    </section>
  );
}

function SideQuests() {
  return (
    <section className="side-quests" id="side-quests" aria-labelledby="side-title">
      <div className="side-quests__orb" aria-hidden="true"><span /><span /><span /></div>
      <div className="side-quests__content">
        <h2 id="side-title">Current<br /><em>rabbit holes.</em></h2>
        <p>Not a live activity feed. Just a few interests that tend to pull me in.</p>
        <ul className="interest-list">
          {interests.map((interest, index) => (
            <li key={interest}><span>0{index + 1}</span>{interest}<span className="interest-list__asterisk" aria-hidden="true">✳</span></li>
          ))}
        </ul>
      </div>
      <div className="side-quests__note">A rotating collection<br />of curiosities.</div>
    </section>
  );
}

function Contact() {
  const socials = [
    ['GitHub', 'https://github.com/adityayadav171106'],
    ['LinkedIn', 'https://www.linkedin.com/in/aditya-yadav-a183b8330'],
    ['Instagram', 'https://www.instagram.com/adi_likes_cats/'],
  ];

  return (
    <footer className="contact section-shell" id="contact" aria-labelledby="contact-title">
      <div className="contact__main">
        <h2 id="contact-title">Have a thought?<br /><em>Send it my way.</em></h2>
        <a className="contact__email" href="mailto:adityayadav171106@gmail.com">adityayadav171106@gmail.com <span aria-hidden="true">↗</span></a>
      </div>
      <div className="contact__bottom">
        <span>Made with curiosity by Aditya.</span>
        <nav aria-label="Social links">
          {socials.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}<span aria-hidden="true">↗</span></a>)}
        </nav>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="app-shell">
      <SceneBackground />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Work />
        <SideQuests />
      </main>
      <Contact />
    </div>
  );
}

export default App;
