import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { StarCanvasComponent } from './core/star-canvas.component';
import { SiteHeaderComponent } from './core/site-header.component';
import { CatCompanionComponent } from './core/cat-companion.component';
import { SectionService, type SectionId } from './core/section.service';
import { ThemeService } from './core/theme.service';
import { MotionService } from './core/motion.service';
import { HeroComponent } from './sections/hero.component';
import { AboutComponent } from './sections/about.component';
import { WorkComponent } from './sections/work.component';
import { QuestsComponent } from './sections/quests.component';
import { ContactComponent } from './sections/contact.component';
import { AsciiDividerComponent } from './shared/ascii-divider.component';

const ORDER: SectionId[] = ['top', 'about', 'work', 'quests', 'contact'];
const KEY_MAP: Record<string, SectionId> = {
  h: 'top',
  a: 'about',
  w: 'work',
  s: 'quests',
  c: 'contact',
};

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StarCanvasComponent,
    SiteHeaderComponent,
    CatCompanionComponent,
    HeroComponent,
    AboutComponent,
    WorkComponent,
    QuestsComponent,
    ContactComponent,
    AsciiDividerComponent,
  ],
  template: `
    @if (curtain()) {
      <div class="intro-curtain" [class.intro-curtain--out]="curtainOut()" aria-hidden="true">
        <pre>{{ curtainArt }}</pre>
      </div>
    }

    <app-star-canvas />

    <a class="skip-link" href="#top" (click)="jump('top', $event)">skip to content</a>

    <app-site-header />

    <aside class="rail" aria-label="Folio metadata">
      <span class="rail__text">personal folio · mmxxvi · ascii edition</span>
      <span class="rail__line" aria-hidden="true"></span>
      <span class="rail__pct">{{ pct() }}%</span>
    </aside>

    <main class="shell" id="main">
      <app-hero />
      <app-ascii-divider label="about" pattern="· ── ·  ── " />
      <app-about />
      <app-ascii-divider label="work" pattern="── · ·  " />
      <app-work />
      <app-ascii-divider label="side quests" pattern="· · ──  " />
      <app-quests />
      <app-ascii-divider label="contact" pattern="── ·  ── " />
      <app-contact />
    </main>

    <app-cat-companion />

    <div class="toast" role="status" aria-live="polite" [class.toast--on]="toast()">
      {{ toast() }}
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100dvh;
        position: relative;
      }
      .skip-link {
        position: absolute;
        left: -9999px;
        top: 0;
        z-index: 60;
        padding: 8px 14px;
        background: var(--accent);
        color: var(--ink);
      }
      .skip-link:focus {
        left: 12px;
        top: 10px;
      }
      @media (min-width: 1440px) {
        .rail {
          display: grid;
        }
      }
      .toast {
        position: fixed;
        left: 50%;
        bottom: 22px;
        transform: translate(-50%, 12px);
        z-index: 60;
        padding: 5px 12px;
        border: 1px solid var(--line-strong);
        border-radius: 3px;
        background: color-mix(in srgb, var(--ink) 92%, transparent);
        color: var(--text);
        font-size: var(--fs-micro);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0;
        pointer-events: none;
        transition:
          opacity 0.25s var(--ease),
          transform 0.25s var(--ease);
        backdrop-filter: blur(6px);
      }
      .rail {
        display: none;
        position: fixed;
        left: 14px;
        top: 50%;
        z-index: 20;
        transform: translateY(-50%);
        grid-template-rows: auto 1fr auto;
        justify-items: center;
        gap: 12px;
        color: var(--text-faint);
        font-size: 9.5px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        pointer-events: none;
      }
      .rail__text {
        writing-mode: vertical-rl;
        transform: rotate(180deg);
      }
      .rail__line {
        width: 1px;
        height: clamp(80px, 16vh, 160px);
        background: linear-gradient(180deg, transparent, var(--line-strong), transparent);
      }
      .rail__pct {
        color: var(--accent);
        letter-spacing: 0.08em;
      }
      .toast--on {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    `,
  ],
})
export class App {
  private readonly sections = inject(SectionService);
  private readonly theme = inject(ThemeService);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly toast = signal('');
  protected readonly pct = computed(() => Math.round(this.sections.progress() * 100));
  protected readonly curtain = signal(true);
  protected readonly curtainOut = signal(false);
  protected readonly curtainArt = [
    '   /\\_/\\',
    '  ( o.o )  compiling the atmosphere...',
    '   > ^ <',
    '',
    '  [############------------]  58%',
  ].join('\n');
  private toastTimer = 0;

  constructor() {
    afterNextRender(() => {
      this.sections.observe();

      const lift = () => {
        this.curtainOut.set(true);
        window.setTimeout(() => this.curtain.set(false), 620);
      };
      if (this.motion.reduced()) {
        lift();
      } else {
        window.setTimeout(lift, 560);
      }

      const onKey = (event: KeyboardEvent) => this.onKey(event);
      window.addEventListener('keydown', onKey);
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('keydown', onKey);
        clearTimeout(this.toastTimer);
      });
    });
  }

  protected jump(id: SectionId, event: Event): void {
    event.preventDefault();
    this.sections.scrollTo(id);
  }

  private onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const key = event.key.toLowerCase();

    if (key === 't') {
      const name = this.theme.cycle();
      this.say(`theme → ${name}`);
      return;
    }

    if (key === 'j' || key === 'k' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') return;
      event.preventDefault();
      const index = ORDER.indexOf(this.sections.active());
      const next = key === 'j' ? Math.min(ORDER.length - 1, index + 1) : Math.max(0, index - 1);
      this.sections.scrollTo(ORDER[next]);
      return;
    }

    if (KEY_MAP[key] && !event.shiftKey) {
      event.preventDefault();
      this.sections.scrollTo(KEY_MAP[key]);
    }
  }

  private say(message: string): void {
    this.toast.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toast.set(''), 1600);
  }
}
