import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AsciiArtComponent } from '../shared/ascii-art.component';
import { TypewriterComponent } from '../core/typewriter.component';
import { LiveClockComponent } from '../core/live-clock.component';
import { MotionService } from '../core/motion.service';
import { SectionService } from '../core/section.service';
import { compactMoon, identity, stats } from '../data/content';

const NAME = [
  ' █████╗ ██████╗ ██╗████████╗██╗   ██╗ █████╗',
  '██╔══██╗██╔══██╗██║╚══██╔══╝╚██╗ ██╔╝██╔══██╗',
  '███████║██║  ██║██║   ██║    ╚████╔╝ ███████║',
  '██╔══██║██║  ██║██║   ██║     ╚██╔╝  ██╔══██║',
  '██║  ██║██████╔╝██║   ██║      ██║   ██║  ██║',
  '╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝',
].join('\n');

const SCENE = String.raw`
                                 .
         _.-'''-.._  *                                     *
      .-'   _.-.   '-.                 /\_/\
    .'     (     )    '.              ( o.o )
   /         '-.-'       \            -= ^ =-
  |    _.-.         .-.   |           /|   |\       .    .
*  |   (     )       (     )|.        / |   | \     / \
  |    '-.-'         '-.-' |        |  |   |  |   /   \
   \                       /        |  |   |  |  |     |     +
    '.                   .'          \ |   | /   |     |
      '-.._         _..-'             \|___|/    |     |
           '-.....--'  *                | |      |     |
`;

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsciiArtComponent, TypewriterComponent, LiveClockComponent],
  template: `
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="hero__grid">
        <div class="hero__intro">
          <p class="hero__eyebrow">
            <span class="dot" aria-hidden="true"></span>
            {{ identity.location }} · <app-live-clock /> · {{ identity.status }}
          </p>

          <h1 class="sr-only" id="hero-title">{{ identity.name }} — just your average nerd</h1>

          <div class="hero__wordmark" aria-hidden="true">
            <app-ascii-art
              class="hero__nameart"
              [art]="nameArt"
              reveal="lines"
              [delay]="24"
              [maxFont]="16"
              label=""
            />
          </div>

          <p class="hero__tag" aria-hidden="true">
            just your <em>average</em> nerd <span class="hero__wink">;)</span>
          </p>

          <p class="hero__lead">
            <app-typewriter [text]="identity.lead" />
          </p>

          <div class="hero__actions">
            <a class="kbd" href="#work" (click)="jump('work', $event)">
              see the work <span class="kbd__key">{{ '{' }}W{{ '}' }}</span>
            </a>
            <a class="kbd" href="#contact" (click)="jump('contact', $event)">
              say hello <span class="kbd__key">{{ '{' }}C{{ '}' }}</span>
            </a>
            <a class="kbd kbd--ghost" [href]="'mailto:' + identity.email">
              {{ identity.email }}
            </a>
          </div>

          <dl class="hero__stats">
            @for (stat of stats; track stat.label) {
              <div class="stat">
                <dd>{{ stat.value }}</dd>
                <dt>{{ stat.label }}</dt>
              </div>
            }
          </dl>
        </div>

        <figure class="hero__plate" appReveal>
          <div class="plate__bar">
            <span>field plate</span>
            <span class="plate__meta">{{ hint() }}</span>
          </div>
          <app-ascii-art
            [art]="motion.coarse() ? moon : scene"
            [maxFont]="14"
            label="ASCII night scene: a cratered moon over a sitting cat with its tail curled up, surrounded by stars"
          />
          <figcaption class="plate__caption">
            fig. 01 — a small window into a curious mind.
            <span class="plate__meta">moon · cat · stars</span>
          </figcaption>
        </figure>
      </div>

      <a class="hero__scroll" href="#about" (click)="jump('about', $event)">
        <span class="hero__scrollline" aria-hidden="true"></span>
        scroll, or press <span class="kbd">J</span>
      </a>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: clamp(84px, 13vh, 132px) 0 clamp(30px, 6vh, 60px);
      }
      .hero__grid {
        display: grid;
        grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
        gap: clamp(26px, 4vw, 56px);
        align-items: start;
      }

      .hero__eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 18px;
        font-size: var(--fs-small);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-faint);
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 0 4px var(--accent-soft);
        animation: pulse 2.6s ease-in-out infinite;
      }
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.45;
        }
      }

      .hero__wordmark {
        margin: 0 0 14px;
      }
      .hero__tag {
        display: block;
        margin-bottom: 18px;
        font-size: clamp(20px, 4.2vw, 34px);
        font-weight: 200;
        color: var(--text-dim);
        line-height: 1.15;
        letter-spacing: -0.01em;
      }
      .hero__tag em {
        color: var(--accent);
        font-style: normal;
        font-weight: 400;
        border-bottom: 1px dashed var(--accent-glow);
      }
      .hero__wink {
        color: var(--accent);
        white-space: nowrap;
      }

      .hero__nameart {
        --art-color: var(--accent);
        filter: drop-shadow(0 0 22px var(--accent-glow));
      }

      .hero__lead {
        max-width: 46ch;
        font-size: var(--fs-lead);
        color: var(--text);
        min-height: 5.2em;
      }

      .hero__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 22px;
      }
      .kbd__key {
        color: var(--text-faint);
        font-size: var(--fs-micro);
        margin-left: 2px;
      }
      .kbd--ghost {
        color: var(--text-dim);
        border-style: dashed;
      }

      .hero__stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1px;
        margin: 26px 0 0;
        border: 1px solid var(--line);
        background: var(--line);
      }
      .stat {
        padding: 10px 12px;
        background: var(--ink-2);
      }
      .stat dt {
        font-size: var(--fs-micro);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--text-faint);
      }
      .stat dd {
        margin: 0 0 2px;
        font-size: 16px;
        color: var(--bright);
      }

      .hero__plate {
        position: relative;
        margin: 0;
        border: 1px solid var(--line);
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--ink-3) 78%, transparent),
          color-mix(in srgb, var(--ink-2) 55%, transparent)
        );
        box-shadow: var(--shadow);
        overflow: hidden;
      }
      .hero__plate::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(120% 90% at 78% 12%, var(--tint), transparent 60%);
        pointer-events: none;
      }
      .plate__bar {
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 7px 12px;
        border-bottom: 1px dashed var(--line);
        font-size: var(--fs-micro);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-faint);
      }
      app-ascii-art {
        display: block;
        padding: clamp(10px, 1.6vw, 18px);
        --art-color: #9fb4cf;
      }
      .plate__caption {
        position: relative;
        z-index: 1;
        padding: 9px 12px;
        border-top: 1px dashed var(--line);
        font-size: var(--fs-micro);
        color: var(--text-faint);
        letter-spacing: 0.03em;
      }
      .plate__meta {
        color: var(--accent);
        opacity: 0.8;
      }
      .plate__caption .plate__meta {
        float: right;
      }

      .hero__scroll {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin-top: clamp(24px, 5vh, 46px);
        font-size: var(--fs-micro);
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-faint);
      }
      .hero__scrollline {
        width: 44px;
        height: 1px;
        background: linear-gradient(90deg, var(--accent), transparent);
      }

      @media (max-width: 900px) {
        .hero__grid {
          grid-template-columns: minmax(0, 1fr);
        }
        .hero__plate {
          margin-top: 6px;
        }
        .hero__stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .hero__lead {
          min-height: 0;
        }
      }
      @media (max-width: 520px) {
        .hero__actions {
          flex-direction: column;
          align-items: stretch;
        }
        .hero__actions .kbd {
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class HeroComponent {
  protected readonly identity = identity;
  protected readonly stats = stats;
  protected readonly nameArt = NAME;

  protected readonly motion = inject(MotionService);
  private readonly sections = inject(SectionService);
  protected readonly scene = SCENE;
  protected readonly moon = compactMoon;
  protected readonly hint = computed(() => (this.motion.coarse() ? 'tap to navigate' : 'press T for theme'));

  jump(id: string, event: Event): void {
    event.preventDefault();
    this.sections.scrollTo(id as never);
  }
}
