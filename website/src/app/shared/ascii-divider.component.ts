import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * A thin ASCII rule between sections. Repeating a pattern instead of a
 * border keeps the page feeling like a terminal printout.
 */
@Component({
  selector: 'app-ascii-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="divider" aria-hidden="true">
      <span class="divider__art">{{ art() }}</span>
      @if (label()) {
        <span class="divider__label">{{ label() }}</span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .divider {
        display: flex;
        align-items: center;
        gap: 12px;
        overflow: hidden;
        padding-block: clamp(18px, 3.5vh, 34px);
        color: var(--text-faint);
        font-size: var(--fs-micro);
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .divider__art {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        font-family: var(--font);
        font-size: 11px;
        line-height: 1;
        opacity: 0.55;
      }
      .divider__label {
        flex: none;
        padding: 1px 8px;
        border: 1px dashed var(--line);
        border-radius: 99px;
      }
    `,
  ],
})
export class AsciiDividerComponent {
  readonly label = input('');
  readonly pattern = input('· · · ── ·· ── · · · ── ·· ');
  readonly repeat = input(12);

  protected readonly art = computed(() => this.pattern().repeat(this.repeat()));
}
