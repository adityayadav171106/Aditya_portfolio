import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

/**
 * A real local time for Mumbai, updated every 20 s. Genuinely live data —
 * the only thing on this page that changes without the visitor doing anything.
 */
@Component({
  selector: 'app-live-clock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<time [attr.datetime]="iso()">{{ label() }}</time>`,
  styles: [
    `
      :host {
        display: inline;
        color: var(--text-dim);
        font-variant-numeric: tabular-nums;
      }
      time {
        white-space: nowrap;
      }
    `,
  ],
})
export class LiveClockComponent {
  protected readonly label = signal('--:--');
  protected readonly iso = signal('');

  private readonly destroyRef = inject(DestroyRef);
  private readonly format = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  constructor() {
    afterNextRender(() => {
      const tick = () => {
        const now = new Date();
        this.label.set(`${this.format.format(now)} IST`);
        this.iso.set(now.toISOString());
      };
      tick();
      const timer = window.setInterval(tick, 20_000);
      this.destroyRef.onDestroy(() => clearInterval(timer));
    });
  }
}
