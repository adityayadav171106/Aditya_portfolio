import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import './Hero.css';

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    // Parallax on mouse move
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;

      gsap.to(imageRef.current, {
        x: x * 0.5,
        y: y * 0.5,
        duration: 1.2,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current || !nameRef.current) return;
      const scrollY = window.scrollY;
      gsap.to(imageRef.current, {
        y: scrollY * 0.3,
        duration: 0.1,
      });
      gsap.to(nameRef.current, {
        y: scrollY * -0.15,
        duration: 0.1,
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const letterVariants = {
    hidden: { y: 200, opacity: 0, rotateX: -90 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 1.2,
        delay: 0.3 + i * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const name = 'ADITYA';

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Background Image */}
      <div className="hero__image-wrapper">
        <motion.div
          className="hero__image"
          ref={imageRef}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src="/hero-bg.png" alt="" />
        </motion.div>
        <div className="hero__image-overlay" />
        <div className="hero__vignette" />
      </div>

      {/* Large Name Title */}
      <div className="hero__name-wrapper" ref={nameRef}>
        <h1 className="hero__name">
          {name.split('').map((letter, i) => (
            <motion.span
              key={i}
              className="hero__name-letter"
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'inline-block' }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Magazine-style corner details */}
      <motion.div
        className="hero__corner hero__corner--tl"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="hero__corner-label">PORTFOLIO</span>
        <span className="hero__corner-year">2026</span>
      </motion.div>

      <motion.div
        className="hero__corner hero__corner--tr"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="hero__corner-label">DEVELOPER</span>
      </motion.div>

      <motion.div
        className="hero__corner hero__corner--bl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="hero__issue-number">001</span>
      </motion.div>

      {/* Bottom subtitle area */}
      <motion.div
        className="hero__bottom"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero__subtitle">
          <span className="hero__subtitle-accent">Creative</span>
          <span className="hero__subtitle-divider">—</span>
          <span className="hero__subtitle-text">Developer & Designer</span>
        </div>
        <div className="hero__scroll-indicator">
          <span className="hero__scroll-text">Scroll</span>
          <div className="hero__scroll-line">
            <motion.div
              className="hero__scroll-progress"
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Decorative barcode element */}
      <motion.div
        className="hero__corner hero__corner--br"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="hero__barcode">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="hero__barcode-line"
              style={{
                width: Math.random() > 0.5 ? '2px' : '1px',
                height: `${20 + Math.random() * 15}px`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
