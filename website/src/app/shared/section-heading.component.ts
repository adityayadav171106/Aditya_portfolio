import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A section title drawn as a boxed figure: `+-- 02 · work ----------+`.
 * The top rule is right-padded with dashes so every section lines up on
 * the same visual gutter regardless of how long its name is.
 */
@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <pre class="eye" aria-hidden="true">+-- {{ index() }} · {{ id() }} {{ tail() }}</pre>
      <h2 class="title">
        <span class="bracket" aria-hidden="true">[</span>
        <span class="word">{{ title() }}</span>
        <span class="bracket" aria-hidden="true">]</span>
      </h2>
      @if (note()) {
        <p class="note">{{ note() }}</p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-bottom: clamp(22px, 3.4vw, 40px);
      }
      .head {
        display: grid;
        gap: 8px;
      }
      .eye {
        margin: 0;
        font-family: var(--font);
        font-size: var(--fs-small);
        line-height: 1.2;
        color: var(--text-faint);
        white-space: pre;
        overflow: hidden;
        text-overflow: clip;
        max-width: 100%;
      }
      .title {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.35em;
        font-size: clamp(26px, 5.6vw, 46px);
        font-weight: 300;
        letter-spacing: -0.02em;
        color: var(--bright);
      }
      .bracket {
        color: var(--accent);
        font-weight: 200;
        opacity: 0.75;
      }
      .note {
        max-width: 62ch;
        color: var(--text-dim);
        font-size: var(--fs-body);
      }
      @media (max-width: 620px) {
        .note {
          font-size: 12.5px;
        }
        .eye {
          font-size: 11px;
        }
      }
    `,
  ],
})
export class SectionHeadingComponent {
  readonly index = input('01');
  readonly id = input('section');
  readonly title = input.required<string>();
  readonly note = input('');
  /** Total width of the ASCII rule in characters. */
  readonly width = input(46);

  /** Pure dash padding — string inputs, so a memoised getter is enough. */
  protected tail(): string {
    const used = 4 + this.index().length + 3 + this.id().length + 1;
    return '-'.repeat(Math.max(4, this.width() - used));
  }
}
