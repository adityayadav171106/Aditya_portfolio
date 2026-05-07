import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Contact.css';

const Contact = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <footer className="contact" id="contact" ref={sectionRef}>
      <div className="contact__container container">
        {/* Section header */}
        <div className="contact__header">
          <motion.div
            className="contact__label-line"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="contact__label"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="contact__label-number">04</span>
            Contact
          </motion.span>
        </div>

        <motion.h2
          className="contact__title"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Let's <em>Connect</em>
        </motion.h2>

        <motion.p
          className="contact__text"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Have a project in mind? Want to collaborate? Feel free to reach out.
        </motion.p>

        <motion.div
          className="contact__cta"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a href="mailto:hello@example.com" className="contact__email-btn">
            <span className="contact__email-btn-text">Say Hello</span>
            <span className="contact__email-btn-arrow">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="contact__divider"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Footer bottom */}
        <motion.div
          className="contact__footer"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <span className="contact__copyright">
            © {new Date().getFullYear()} Aditya
          </span>
          <div className="contact__socials">
            {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
              <a key={social} href="#" className="contact__social-link">
                {social}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Contact;
