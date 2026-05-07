import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './About.css';

const About = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about__container container">
        {/* Section header */}
        <div className="about__header">
          <motion.div
            className="about__label-line"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="about__label"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="about__label-number">02</span>
            About
          </motion.span>
        </div>

        <div className="about__content">
          <motion.h2
            className="about__title"
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            About <em>Me</em>
          </motion.h2>

          <motion.div
            className="about__body"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="about__placeholder">
              {/* Add your about text here */}
              Your story goes here. Tell the world who you are, what drives you, and what makes you unique.
            </p>
          </motion.div>

          {/* Decorative stats / info boxes */}
          <motion.div
            className="about__stats"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {[
              { value: '—', label: 'Years Experience' },
              { value: '—', label: 'Projects Built' },
              { value: '—', label: 'Technologies' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="about__stat"
                whileHover={{ y: -4, borderColor: 'rgba(201, 169, 110, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                <span className="about__stat-value">{stat.value}</span>
                <span className="about__stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="about__bg-text" aria-hidden="true">ABOUT</div>
    </section>
  );
};

export default About;
