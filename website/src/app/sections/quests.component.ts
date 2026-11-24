import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { SectionHeadingComponent } from '../shared/section-heading.component';
import { AsciiArtComponent } from '../shared/ascii-art.component';
import { quests } from '../data/content';

const CURIOSITY = String.raw`
   /\_/\        ?        .-.
  ( o.o )      ?       /  /
   > ^ <   ?          /  /
  /|   |\            /__/
 / |   | \
|  |   |  |
 \_|___|_/
   |   |
   |___|
`;

@Component({
  selector: 'app-quests',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadingComponent, AsciiArtComponent],
  template: `
    <section class="quests" id="quests" aria-labelledby="quests-title">
      <app-section-heading
        index="03"
        id="quests"
        title="side quests"
        note="Not a live activity feed. Just the interests that keep pulling me in."
      />

      <div class="quests__grid">
        <div class="quests__tabs" role="tablist" aria-label="Interests" aria-orientation="vertical">
          @for (quest of items; track quest.name; let i = $index) {
            <button
              type="button"
              role="tab"
              class="tab"
              [class.is-on]="active() === i"
              [attr.aria-selected]="active() === i"
              [id]="'quest-tab-' + i"
              [attr.aria-controls]="'quest-panel-' + i"
              (click)="active.set(i)"
            >
              <span class="tab__box" aria-hidden="true">[{{ active() === i ? 'x' : ' ' }}]</span>
              <span class="tab__name">{{ quest.name }}</span>
              <span class="tab__key" aria-hidden="true">{{ quest.key }}</span>
            </button>
          }
        </div>

        <div class="quests__panels">
          @for (quest of items; track quest.name; let i = $index) {
            @if (active() === i) {
              <div
                class="panel"
                role="tabpanel"
                [id]="'quest-panel-' + i"
                [attr.aria-labelledby]="'quest-tab-' + i"
              >
                <div class="panel__head">
                  <h3>{{ quest.name }}</h3>
                  <span class="panel__key">{{ quest.key }} / 04</span>
                </div>
                <app-ascii-art [art]="quest.ascii" [maxFont]="13" [label]="'ASCII art for ' + quest.name" />
                @for (line of quest.lines; track line) {
                  <p class="panel__line">{{ line }}</p>
                }
              </div>
            }
          }
        </div>

        <aside class="quests__aside" appReveal aria-hidden="true">
          <app-ascii-art [art]="curiosity" [maxFont]="12" label="" />
          <p class="quests__note">a rotating collection<br />of curiosities.</p>
        </aside>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding-block: clamp(46px, 8vh, 96px);
      }
      .quests__grid {
        display: grid;
        grid-template-columns: minmax(0, 0.62fr) minmax(0, 1.38fr);
        gap: clamp(18px, 3vw, 40px);
        align-items: start;
      }

      .quests__tabs {
        display: grid;
        gap: 4px;
      }
      .tab {
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        padding: 11px 12px;
        border: 1px dashed var(--line);
        color: var(--text-dim);
        text-align: left;
        transition:
          color 0.25s var(--ease),
          border-color 0.25s var(--ease),
          background 0.25s var(--ease),
          transform 0.25s var(--ease);
      }
      .tab:hover {
        color: var(--text);
        border-color: var(--line-strong);
        transform: translateX(2px);
      }
      .tab.is-on {
        color: var(--bright);
        border-style: solid;
        border-color: var(--accent);
        background: var(--accent-soft);
      }
      .tab__box {
        color: var(--accent);
        font-size: var(--fs-small);
        letter-spacing: -1px;
      }
      .tab__name {
        font-size: var(--fs-lead);
      }
      .tab__key {
        font-size: var(--fs-micro);
        color: var(--text-faint);
      }

      .quests__panels {
        min-height: 260px;
      }
      .panel {
        border: 1px solid var(--line);
        padding: clamp(12px, 2vw, 20px);
        background: linear-gradient(180deg, color-mix(in srgb, var(--ink-3) 62%, transparent), transparent);
        animation: panel 0.35s var(--ease);
      }
      @keyframes panel {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      .panel__head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 10px;
        margin-bottom: 12px;
        border-bottom: 1px dashed var(--line);
      }
      .panel__head h3 {
        font-size: clamp(17px, 2.4vw, 21px);
        font-weight: 400;
        color: var(--bright);
      }
      .panel__key {
        font-size: var(--fs-micro);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-faint);
      }
      app-ascii-art {
        display: block;
        margin-bottom: 14px;
        --art-color: var(--accent);
        opacity: 0.85;
      }
      .panel__line {
        color: var(--text-dim);
        font-size: var(--fs-small);
        max-width: 66ch;
        margin-bottom: 8px;
      }

      .quests__aside {
        display: none;
        align-self: end;
        opacity: 0.55;
      }
      .quests__note {
        margin-top: 8px;
        font-size: var(--fs-micro);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-faint);
      }

      @media (max-width: 760px) {
        .quests__grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class QuestsComponent {
  protected readonly items = quests;
  protected readonly active = signal(0);
  protected readonly curiosity = CURIOSITY;
}
