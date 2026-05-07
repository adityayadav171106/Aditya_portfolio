import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import './SectionDivider.css';

const SectionDivider = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div className="section-divider" ref={ref}>
      <motion.div
        className="section-divider__line"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="section-divider__diamond"
        initial={{ scale: 0, rotate: 45 }}
        animate={isInView ? { scale: 1, rotate: 45 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="section-divider__line"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
};

export default SectionDivider;
