import { useEffect, useRef } from 'react';

const starPoints = [
  [78, 108, 1.5], [224, 332, 1], [346, 154, 1.2], [468, 704, 1.6],
  [590, 250, 1], [724, 814, 1.4], [862, 142, 1.3], [1010, 700, 1],
  [1188, 122, 1.7], [1300, 520, 1], [1374, 780, 1.3], [310, 850, 1],
  [112, 610, 1.2], [930, 420, 1.5], [1260, 314, 1], [600, 520, 1.1],
];

export default function SceneBackground() {
  const worldRef = useRef(null);

  useEffect(() => {
    const world = worldRef.current;
    if (!world) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      frame = 0;
      const hero = document.querySelector('.hero');
      const heroHeight = hero?.offsetHeight || window.innerHeight;
      const heroProgress = Math.max(0, Math.min(1, window.scrollY / heroHeight));
      const reveal = reducedMotion.matches
        ? (heroProgress > 0.72 ? 0.34 : 0)
        : Math.max(0, Math.min(0.34, (heroProgress - 0.28) / 0.65 * 0.34));
      const scrollShift = reducedMotion.matches ? 0 : Math.min(window.scrollY, heroHeight * 2) * -0.025;

      if (heroProgress > 0.05) {
        world.querySelectorAll('[data-src]').forEach((image) => {
          image.src = image.dataset.src;
          image.removeAttribute('data-src');
        });
      }

      world.style.setProperty('--scene-reveal', reveal.toFixed(3));
      world.style.setProperty('--scene-map-transform', reducedMotion.matches
        ? 'none'
        : `translate3d(${(pointerX * 0.28).toFixed(1)}px, ${(pointerY * 0.28 + scrollShift).toFixed(1)}px, 0)`);
      world.style.setProperty('--moon-transform', reducedMotion.matches
        ? 'none'
        : `translate3d(${(pointerX * 0.55).toFixed(1)}px, ${(pointerY * 0.55 + (1 - reveal / 0.34) * 24 + scrollShift * 0.35).toFixed(1)}px, 0) rotate(${((1 - reveal / 0.34) * -6).toFixed(2)}deg)`);
      world.style.setProperty('--cat-transform', reducedMotion.matches
        ? 'none'
        : `translate3d(${(pointerX * 1.2).toFixed(1)}px, ${(pointerY * 1.2 + (1 - reveal / 0.34) * 36 + scrollShift * 0.65).toFixed(1)}px, 0)`);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const onPointerMove = (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      pointerX = (event.clientX / window.innerWidth - 0.5) * 18;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 14;
      scheduleUpdate();
    };

    const onPreferenceChange = () => {
      if (reducedMotion.matches) {
        pointerX = 0;
        pointerY = 0;
      }
      scheduleUpdate();
    };
    const onVisibilityChange = () => {
      world.classList.toggle('is-document-hidden', document.hidden);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    reducedMotion.addEventListener('change', onPreferenceChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    onVisibilityChange();
    scheduleUpdate();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('pointermove', onPointerMove);
      reducedMotion.removeEventListener('change', onPreferenceChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="scene-world" aria-hidden="true" ref={worldRef}>
      <svg className="scene-world__map" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="field-grid" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M90 0H0V90" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="0" cy="0" r="1.4" fill="currentColor" />
          </pattern>
          <radialGradient id="field-glow" cx="50%" cy="45%" r="65%">
            <stop offset="0" stopColor="#244d83" stopOpacity=".18" />
            <stop offset="1" stopColor="#071020" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#field-glow)" />
        <rect className="scene-world__grid" width="1440" height="900" fill="url(#field-grid)" />
        <g className="scene-world__drift" fill="none" stroke="currentColor">
          <ellipse cx="1090" cy="310" rx="420" ry="184" transform="rotate(-19 1090 310)" />
          <ellipse cx="1090" cy="310" rx="330" ry="144" transform="rotate(-19 1090 310)" />
          <path d="M-80 700C190 560 360 548 540 610S930 790 1510 478" />
          <path d="M-40 744C220 608 380 598 558 655S946 827 1492 538" />
          <path d="M290 -40V940M1180 -40V940" strokeDasharray="2 12" />
        </g>
        <g className="scene-world__stars" fill="currentColor">
          {starPoints.map(([cx, cy, r], index) => <circle key={index} cx={cx} cy={cy} r={r} />)}
          <path d="M1010 168 1015 184 1031 189 1015 194 1010 210 1005 194 989 189 1005 184Z" />
          <path d="M286 488 290 500 302 504 290 508 286 520 282 508 270 504 282 500Z" />
        </g>
        <g className="scene-world__print" fill="currentColor" stroke="currentColor">
          <path d="M76 235h28M76 235v28M1364 653h-28M1364 653v-28M1288 92h38M1288 97h24" fill="none" />
          <circle cx="138" cy="310" r="2" />
          <circle cx="1292" cy="648" r="2" />
          <text x="112" y="235" stroke="none">FIELD STUDY / 001</text>
          <text x="112" y="252" stroke="none">CAT · LUNAR · CURIOSITY</text>
          <text x="1194" y="682" stroke="none">SIGNAL / STILL SEARCHING</text>
          <text x="1280" y="122" stroke="none">FOLIO 2026</text>
        </g>
      </svg>
      <img className="scene-world__subject scene-world__moon" data-src="/hero-layers/moon.png" alt="" decoding="async" />
      <img className="scene-world__subject scene-world__cat" data-src="/hero-layers/cat.png" alt="" decoding="async" />
      <div className="scene-world__haze" />
    </div>
  );
}
