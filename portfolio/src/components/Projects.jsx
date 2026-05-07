import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Projects.css';

const projectPlaceholders = [
  {
    id: 1,
    title: 'Project One',
    category: 'Coming Soon',
    description: 'Details about this project will be added soon.',
  },
  {
    id: 2,
    title: 'Project Two',
    category: 'Coming Soon',
    description: 'Details about this project will be added soon.',
  },
  {
    id: 3,
    title: 'Project Three',
    category: 'Coming Soon',
    description: 'Details about this project will be added soon.',
  },
  {
    id: 4,
    title: 'Project Four',
    category: 'Coming Soon',
    description: 'Details about this project will be added soon.',
  },
];

const Projects = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <div className="projects__container container">
        {/* Section header */}
        <div className="projects__header">
          <motion.div
            className="projects__label-line"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="projects__label"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="projects__label-number">03</span>
            Work
          </motion.span>
        </div>

        <motion.h2
          className="projects__title"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Selected <em>Projects</em>
        </motion.h2>

        {/* Project grid */}
        <div className="projects__grid">
          {projectPlaceholders.map((project, i) => (
            <motion.article
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 80 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.3 + i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8 }}
            >
              {/* Project image placeholder */}
              <div className="project-card__image">
                <div className="project-card__image-inner">
                  <span className="project-card__image-label">
                    {String(project.id).padStart(2, '0')}
                  </span>
                  <div className="project-card__image-lines">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <motion.div
                        key={j}
                        className="project-card__image-line"
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : {}}
                        transition={{
                          duration: 0.8,
                          delay: 0.6 + i * 0.15 + j * 0.05,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Project info */}
              <div className="project-card__info">
                <span className="project-card__category">{project.category}</span>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__description">{project.description}</p>
                <div className="project-card__link">
                  <span>View Project</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8H13M13 8L8 3M13 8L8 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="project-card__glow" />
            </motion.article>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="projects__bg-text" aria-hidden="true">WORK</div>
    </section>
  );
};

export default Projects;
