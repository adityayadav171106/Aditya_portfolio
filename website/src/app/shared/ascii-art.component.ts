import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { MotionService } from '../core/motion.service';

/** JetBrains Mono's advance width; used to fit art to its container in `ch`. */
const ADVANCE = 0.6;

/**
 * Renders ASCII art in a monospace block that always fits its container.
 *
 * - Measures the longest line, then sizes the font so the art never overflows.
 * - `reveal="lines"` fades the art in line by line (skipped for reduced motion).
 * - The art is exposed to screen readers as a single labelled image.
 */
@Component({
  selector: 'app-ascii-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="art-wrap" #wrap>
      <pre
        class="art"
        role="img"
        [attr.aria-label]="label() || 'ASCII art'"
        [style.--art-fs.px]="fontSize()"
      >@for (line of lines(); track $index) {
        <span
          class="ln"
          [class.ln--on]="!animate() || revealed() > $index"
          [style.transition-delay.ms]="animate() ? $index * delay() : 0"
          >{{ line === '' ? ' ' : line }}</span
        >
      }</pre>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 100%;
      }
      .art-wrap {
        max-width: 100%;
        overflow: hidden;
      }
      .art {
        margin: 0;
        color: var(--art-color, var(--text-dim));
        font-family: var(--font);
        font-size: var(--art-fs, 12px);
        line-height: 1.16;
        white-space: normal;
        letter-spacing: 0;
        font-variant-ligatures: none;
        font-feature-settings:
          'liga' 0,
          'calt' 0;
        font-weight: 400;
        transition: color 0.6s var(--ease);
      }
      .ln {
        display: block;
        white-space: pre;
        min-height: 1em;
        opacity: 0;
        transform: translateY(4px);
        transition:
          opacity 0.5s var(--ease),
          transform 0.5s var(--ease);
      }
      .ln--on {
        opacity: 1;
        transform: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .ln {
          opacity: 1;
          transform: none;
        }
      }
    `,
  ],
})
export class AsciiArtComponent {
  readonly art = input.required<string>();
  readonly label = input('');
  readonly reveal = input<'none' | 'lines'>('none');
  readonly delay = input(38);
  readonly maxFont = input(16);

  readonly lines = computed(() => this.art().replace(/\t/g, '    ').replace(/\n+$/, '').split('\n'));
  readonly columns = computed(() => this.lines().reduce((max, line) => Math.max(max, line.length), 0));
  readonly fontSize = signal(12);
  readonly revealed = signal(0);
  readonly animate = computed(() => this.reveal() === 'lines' && !this.motion.reduced());

  private readonly wrapRef = viewChild.required<ElementRef<HTMLElement>>('wrap');
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: ResizeObserver;

  constructor() {
    afterNextRender(() => {
      const node = this.wrapRef().nativeElement;
      this.fit();

      if (typeof ResizeObserver !== 'undefined') {
        this.observer = new ResizeObserver(() => this.fit());
        this.observer.observe(node);
        this.destroyRef.onDestroy(() => this.observer?.disconnect());
      }

      if (this.animate()) {
        this.runReveal();
      } else {
        this.revealed.set(this.lines().length);
      }
    });
  }

  private fit(): void {
    const node = this.wrapRef().nativeElement;
    const available = node.clientWidth - 2;
    const cols = Math.max(1, this.columns());
    if (!available) return;
    const size = Math.min(this.maxFont(), available / (cols * ADVANCE));
    this.fontSize.set(Math.max(4.5, Math.round(size * 100) / 100));
  }

  private runReveal(): void {
    const total = this.lines().length;
    const step = Math.max(28, this.delay());
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < total; i++) {
      timers.push(setTimeout(() => this.revealed.set(i + 1), i * step));
    }
    this.destroyRef.onDestroy(() => timers.forEach(clearTimeout));
  }
}
