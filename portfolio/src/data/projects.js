/**
 * Add published projects here. Keep each entry factual; omit unknown details.
 *
 * {
 *   title: 'Project name',
 *   description: 'What it does and why you made it.',
 *   technologies: ['Tool one', 'Tool two'],
 *   image: '/projects/project-image.webp',
 *   imageAlt: 'A concise description of the project image.',
 *   repository: 'https://github.com/…',
 *   demo: 'https://…',
 * }
 */
const projects = [
  {
    title: 'BAGTAG',
    description:
      'An ESP32 Bluetooth tracker and Android app that helps you notice when you have left an item behind. It uses safe zones and a grace period to avoid alerts when leaving the tag is intentional.',
    technologies: ['Kotlin', 'Jetpack Compose', 'ESP32', 'NimBLE-Arduino', 'Bluetooth LE'],
    repository: 'https://github.com/adityayadav171106/BAGTAG',
  },
  {
    title: 'CRCE Placement Portal',
    description:
      'A college placement portal with recruiter and internship listings, and separate views for students, faculty, and recruiters. Built for a college competition and kept running as a demo.',
    technologies: ['React', 'Vite', 'Node.js', 'Express', 'CSS'],
    repository: 'https://github.com/adityayadav171106/crce_placement_portal-',
  },
  {
    title: 'Personal Portfolio',
    description:
      'A single-page portfolio built with React and Vite. It pairs a moonlit blue collage with sections about me, my projects, and the interests I keep coming back to, with a responsive layout and a subtle animated background.',
    technologies: ['React', 'Vite', 'JavaScript', 'CSS', 'GSAP', 'Framer Motion'],
    repository: 'https://github.com/adityayadav171106/Aditya_portfolio',
  },
];

export default projects;
