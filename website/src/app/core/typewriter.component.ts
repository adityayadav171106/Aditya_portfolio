import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { MotionService } from './motion.service';

/**
 * Types a phrase out one character at a time, then leaves a blinking caret.
 * Falls back to plain text for reduced-motion users and screen readers.
 */
@Component({
  selector: 'app-typewriter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tw" [attr.aria-label]="text()">
      <span aria-hidden="true">{{ shown() }}</span>
      <span class="caret" aria-hidden="true" [class.caret--blink]="done()">▌</span>
    </span>
  `,
  styles: [
    `
      :host {
        display: inline;
      }
      .tw {
        display: inline;
      }
      .caret {
        display: inline-block;
        margin-left: 1px;
        color: var(--accent);
        opacity: 1;
      }
      .caret--blink {
        animation: blink 1.15s steps(1, end) infinite;
      }
      @keyframes blink {
        0%,
        55% {
          opacity: 1;
        }
        56%,
        100% {
          opacity: 0.1;
        }
      }
    `,
  ],
})
export class TypewriterComponent {
  readonly text = input.required<string>();
  readonly startDelay = input(260);
  readonly speed = input(34);

  readonly shown = signal('');
  readonly done = signal(false);

  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const full = this.text();
      if (this.motion.reduced()) {
        this.shown.set(full);
        this.done.set(true);
        return;
      }

      let index = 0;
      let timer = 0;
      const start = setTimeout(() => tick(), this.startDelay());

      const tick = () => {
        index += 1;
        this.shown.set(full.slice(0, index));
        if (index >= full.length) {
          this.done.set(true);
          return;
        }
        const jitter = this.speed() * (0.55 + Math.random() * 0.9);
        timer = window.setTimeout(tick, jitter);
      };

      this.destroyRef.onDestroy(() => {
        clearTimeout(start);
        clearTimeout(timer);
      });
    });
  }
}
