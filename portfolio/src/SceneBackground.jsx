const starPoints = [
  [78, 108, 1.5], [224, 332, 1], [346, 154, 1.2], [468, 704, 1.6],
  [590, 250, 1], [724, 814, 1.4], [862, 142, 1.3], [1010, 700, 1],
  [1188, 122, 1.7], [1300, 520, 1], [1374, 780, 1.3], [310, 850, 1],
  [112, 610, 1.2], [930, 420, 1.5], [1260, 314, 1], [600, 520, 1.1],
];

export default function SceneBackground() {
  return (
    <div className="scene-world" aria-hidden="true">
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
      </svg>
      <div className="scene-world__haze" />
    </div>
  );
}
