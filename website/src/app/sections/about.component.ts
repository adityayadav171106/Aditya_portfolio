import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { SectionHeadingComponent } from '../shared/section-heading.component';
import { AsciiArtComponent } from '../shared/ascii-art.component';
import { about, identity, interests } from '../data/content';

const PORTRAIT = String.raw`
      _________
     /  .---.  \
    /  / o o \  \
   |  |   ^   |  |
   |  |  '-'  |  |
    \  \_____/  /
     '._______.'
    .-'  ___  '-.
   /  .-|   |-.  \
  |  /  |   |  \  |
  | |   |   |   | |
  | |   '---'   | |
   \|           |/
    '-----------'
`;

const THINKING = String.raw`
   .-.   .-.   .-.
  ( o ) ( o ) ( o )
   '-'   '-'   '-'
  ~~~~~~~~~~~~~~~~~
`;

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadingComponent, AsciiArtComponent],
  template: `
    <section class="about" id="about" aria-labelledby="about-title">
      <app-section-heading
        index="01"
        id="about"
        title="about"
        note="A short introduction, no formalities."
      />

      <div class="about__grid">
        <div class="about__main" appReveal>
          <p class="about__statement">{{ about.statement }}</p>
          @for (paragraph of about.paragraphs; track paragraph; let i = $index) {
            <p class="about__para" [style.--reveal-delay.ms]="i * 60">{{ paragraph }}</p>
          }
        </div>

        <aside class="about__side" appReveal [delay]="90">
          <div class="card">
            <div class="card__bar">
              <span>id.card</span>
              <span class="card__accent">verified</span>
            </div>
            <app-ascii-art
              [art]="portrait"
              [maxFont]="15"
              label="An ASCII portrait of a person in a hoodie"
            />
            <dl class="idlist">
              <div>
                <dt>name</dt>
                <dd>{{ identity.name }}</dd>
              </div>
              <div>
                <dt>base</dt>
                <dd>{{ identity.location }}</dd>
              </div>
              <div>
                <dt>doing</dt>
                <dd>B.Tech, computer engineering</dd>
              </div>
              <div>
                <dt>status</dt>
                <dd class="ok">{{ identity.status }}</dd>
              </div>
            </dl>
          </div>

          <div class="interests">
            <p class="interests__title">current interests</p>
            <ul>
              @for (interest of interests; track interest.name) {
                <li>
                  <span class="interests__box" aria-hidden="true">[ ]</span>
                  <strong>{{ interest.name }}</strong>
                  <span class="interests__note">{{ interest.note }}</span>
                </li>
              }
            </ul>
          </div>
        </aside>
      </div>

      <ol class="timeline" aria-label="A short timeline">
        @for (item of about.timeline; track item.title; let i = $index) {
          <li class="timeline__item" appReveal [delay]="i * 70">
            <span class="timeline__when">{{ item.when }}</span>
            <div class="timeline__body">
              <h3>{{ item.title }}</h3>
              <p>{{ item.detail }}</p>
            </div>
          </li>
        }
      </ol>

      <div class="about__strip" appReveal aria-hidden="true">
        <app-ascii-art [art]="thinking" [maxFont]="13" label="" />
        <span class="about__strip-note">three thoughts, none of them finished</span>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding-block: clamp(46px, 8vh, 96px);
      }
      .about__grid {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.8fr);
        gap: clamp(24px, 4vw, 48px);
        align-items: start;
      }

      .about__statement {
        font-size: clamp(18px, 2.6vw, 25px);
        line-height: 1.45;
        font-weight: 300;
        color: var(--bright);
        max-width: 46ch;
        margin-bottom: 18px;
      }
      .about__para {
        max-width: 62ch;
        color: var(--text-dim);
        margin-bottom: 12px;
      }
      .about__para:first-of-type::first-letter {
        color: var(--accent);
      }

      .card {
        border: 1px solid var(--line);
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--ink-3) 82%, transparent),
          color-mix(in srgb, var(--ink-2) 62%, transparent)
        );
      }
      .card__bar {
        display: flex;
        justify-content: space-between;
        padding: 6px 10px;
        border-bottom: 1px dashed var(--line);
        font-size: var(--fs-micro);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-faint);
      }
      .card__accent {
        color: var(--accent);
      }
      app-ascii-art {
        display: block;
        padding: 12px;
        --art-color: #a9bdd6;
      }
      .idlist {
        margin: 0;
        border-top: 1px dashed var(--line);
      }
      .idlist > div {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        padding: 6px 10px;
        border-bottom: 1px solid rgba(150, 175, 205, 0.07);
        font-size: var(--fs-small);
      }
      .idlist dt {
        color: var(--text-faint);
        text-transform: lowercase;
      }
      .idlist dd {
        margin: 0;
        text-align: right;
        color: var(--text);
      }
      .idlist .ok {
        color: var(--accent);
      }

      .interests {
        margin-top: 18px;
        border: 1px dashed var(--line);
        padding: 12px;
      }
      .interests__title {
        font-size: var(--fs-micro);
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-faint);
        margin-bottom: 8px;
      }
      .interests li {
        display: flex;
        align-items: baseline;
        gap: 8px;
        padding: 3px 0;
        font-size: var(--fs-small);
      }
      .interests__box {
        color: var(--accent);
        letter-spacing: -1px;
      }
      .interests strong {
        font-weight: 500;
        color: var(--text);
      }
      .interests__note {
        margin-left: auto;
        color: var(--text-faint);
        font-size: var(--fs-micro);
      }

      .timeline {
        display: grid;
        gap: 0;
        margin-top: clamp(30px, 5vh, 56px);
        border-top: 1px dashed var(--line);
      }
      .timeline__item {
        display: grid;
        grid-template-columns: 92px minmax(0, 1fr);
        gap: 16px;
        padding: 14px 0;
        border-bottom: 1px dashed var(--line);
      }
      .timeline__when {
        font-size: var(--fs-micro);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--accent);
        padding-top: 4px;
      }
      .timeline__body h3 {
        font-size: var(--fs-lead);
        font-weight: 500;
        color: var(--bright);
      }
      .timeline__body p {
        max-width: 70ch;
        color: var(--text-dim);
        font-size: var(--fs-small);
      }

      .about__strip {
        display: flex;
        align-items: flex-end;
        gap: 16px;
        margin-top: 26px;
        opacity: 0.65;
      }
      .about__strip-note {
        font-size: var(--fs-micro);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-faint);
        padding-bottom: 2px;
      }

      @media (max-width: 900px) {
        .about__grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      @media (max-width: 560px) {
        .timeline__item {
          grid-template-columns: minmax(0, 1fr);
          gap: 4px;
        }
        .about__strip {
          display: none;
        }
      }
    `,
  ],
})
export class AboutComponent {
  protected readonly about = about;
  protected readonly identity = identity;
  protected readonly interests = interests;
  protected readonly portrait = PORTRAIT;
  protected readonly thinking = THINKING;
}
