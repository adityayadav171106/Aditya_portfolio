import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { MotionService } from './motion.service';
import { ThemeService } from './theme.service';

type Star = {
  x: number;
  y: number;
  z: number;
  glyph: string;
  twinkle: number;
  phase: number;
};

/**
 * The whole background: one canvas of twinkling ASCII stars, a drifting
 * constellation, and a pointer parallax. Deliberately cheap: caps DPR,
 * pauses when the tab is hidden, and renders a single static frame when
 * the visitor prefers reduced motion.
 */
@Component({
  selector: 'app-star-canvas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background:
          radial-gradient(120% 80% at 50% -10%, var(--accent-soft), transparent 62%),
          radial-gradient(90% 70% at 88% 12%, var(--tint), transparent 60%), var(--ink);
        transition: background 0.6s var(--ease);
      }
      canvas {
        width: 100%;
        height: 100%;
        display: block;
        opacity: 0.95;
      }
      :host::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
          0deg,
          color-mix(in srgb, var(--ink) 72%, transparent),
          transparent 34%
        );
      }
    `,
  ],
})
export class StarCanvasComponent {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly motion = inject(MotionService);
  private readonly theme = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);

  private stars: Star[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private frame = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private pointer = { x: 0.5, y: 0.5 };
  private eased = { x: 0.5, y: 0.5 };
  private scrollY = 0;

  constructor() {
    afterNextRender(() => this.start());
  }

  private start(): void {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.colors = this.readColors();
    this.resize();
    this.seed();

    const onResize = () => {
      this.resize();
      this.seed();
      if (this.motion.reduced()) this.drawStatic();
    };
    const onPointer = (event: PointerEvent) => {
      this.pointer.x = event.clientX / Math.max(1, window.innerWidth);
      this.pointer.y = event.clientY / Math.max(1, window.innerHeight);
    };
    const onScroll = () => {
      this.scrollY = window.scrollY;
    };
    const onVisibility = () => {
      if (document.hidden) {
        this.stop();
      } else if (!this.motion.reduced()) {
        this.loop();
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      this.stop();
    });

    if (this.motion.reduced()) {
      this.drawStatic();
    } else {
      this.loop();
    }

    // recolour when the visitor cycles the theme
    let lastTheme = this.theme.theme();
    const themeTimer = setInterval(() => {
      const current = this.theme.theme();
      if (current === lastTheme) return;
      lastTheme = current;
      this.colors = this.readColors();
      if (this.motion.reduced()) this.drawStatic();
    }, 500);
    this.destroyRef.onDestroy(() => clearInterval(themeTimer));
  }

  /** Read the live theme tokens so the canvas follows the palette. */
  private colors = {
    star: '159, 181, 208',
    bright: '214, 231, 255',
    accent: '143, 183, 245',
    ink: '8, 9, 12',
  };

  private readColors() {
    if (typeof getComputedStyle === 'undefined') return this.colors;
    const cs = getComputedStyle(document.documentElement);
    const toTriplet = (value: string, fallback: string) => {
      const probe = value.trim();
      if (!probe) return fallback;
      if (probe.startsWith('#')) {
        const hex =
          probe.length === 4
            ? probe
                .slice(1)
                .split('')
                .map((c) => c + c)
                .join('')
            : probe.slice(1);
        const num = parseInt(hex, 16);
        return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
      }
      const match = probe.match(/[\d.]+/g);
      return match && match.length >= 3 ? `${match[0]}, ${match[1]}, ${match[2]}` : fallback;
    };
    return {
      star: toTriplet(cs.getPropertyValue('--text-dim'), this.colors.star),
      bright: toTriplet(cs.getPropertyValue('--bright'), this.colors.bright),
      accent: toTriplet(cs.getPropertyValue('--accent'), this.colors.accent),
      ink: toTriplet(cs.getPropertyValue('--ink'), this.colors.ink),
    };
  }

  private resize(): void {
    const canvas = this.canvasRef().nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = Math.floor(this.width * this.dpr);
    canvas.height = Math.floor(this.height * this.dpr);
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private seed(): void {
    const count = Math.round((this.width * this.height) / 9800);
    const glyphs = ['.', '.', '.', '·', '*', '+', '·', '·'];
    this.stars = Array.from({ length: count }, (_, i) => {
      const z = Math.random();
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        glyph: glyphs[i % glyphs.length],
        twinkle: 0.25 + Math.random() * 0.75,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }

  private loop(): void {
    if (this.frame) return;
    const tick = (time: number) => {
      this.frame = window.requestAnimationFrame(tick);
      this.draw(time);
    };
    this.frame = window.requestAnimationFrame(tick);
  }

  private stop(): void {
    if (this.frame) {
      window.cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  }

  private draw(time: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    this.eased.x += (this.pointer.x - this.eased.x) * 0.045;
    this.eased.y += (this.pointer.y - this.eased.y) * 0.045;

    const px = (this.eased.x - 0.5) * 2;
    const py = (this.eased.y - 0.5) * 2;
    const drift = (this.scrollY % 4000) * 0.02;
    const t = time / 1000;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.textBaseline = 'middle';

    // far dust
    for (const star of this.stars) {
      const depth = 0.25 + star.z * 0.75;
      const size = 9 + star.z * 7;
      const x = (star.x * this.width + px * depth * 26) % this.width;
      const y = (star.y * this.height - drift * depth + py * depth * 20 + this.height) % this.height;
      const flicker = 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(t * (0.5 + star.twinkle) + star.phase));
      const alpha = (0.1 + star.z * 0.55) * flicker;
      ctx.font = `${size}px JBMono, monospace`;
      ctx.fillStyle =
        star.z > 0.82 ? `rgba(${this.colors.bright}, ${alpha})` : `rgba(${this.colors.star}, ${alpha})`;
      ctx.fillText(star.glyph, x, y);
    }

    // a slow constellation that breathes once every few seconds
    this.drawConstellation(t, px, py);

    // a faint horizon glow that rises as you scroll
    const glow = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 2));
    const grad = ctx.createLinearGradient(0, this.height, 0, this.height * 0.55);
    grad.addColorStop(0, `rgba(${this.colors.accent}, ${0.09 + glow * 0.07})`);
    grad.addColorStop(1, `rgba(${this.colors.accent}, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, this.height * 0.55, this.width, this.height * 0.45);
  }

  private drawConstellation(t: number, px: number, py: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const cx = this.width * 0.72 + px * 18;
    const cy = this.height * 0.26 + py * 14;
    const points: [number, number][] = [
      [-120, 40],
      [-52, -34],
      [18, 8],
      [96, -52],
      [150, 26],
      [64, 74],
      [-16, 96],
    ];
    const breathe = 0.35 + 0.25 * Math.sin(t * 0.5);

    ctx.strokeStyle = `rgba(${this.colors.accent}, ${0.16 * breathe})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    points.forEach(([dx, dy], i) => {
      const x = cx + dx;
      const y = cy + dy;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '12px JBMono, monospace';
    ctx.fillStyle = `rgba(${this.colors.bright}, ${0.28 * breathe})`;
    for (const [dx, dy] of points) {
      ctx.fillText('+', cx + dx - 3, cy + dy - 4);
    }
  }

  private drawStatic(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.textBaseline = 'middle';
    for (const star of this.stars) {
      ctx.font = `${9 + star.z * 7}px JBMono, monospace`;
      ctx.fillStyle = `rgba(${this.colors.star}, ${0.12 + star.z * 0.4})`;
      ctx.fillText(star.glyph, star.x * this.width, star.y * this.height);
    }
    this.drawConstellation(0, 0, 0);
  }
}
