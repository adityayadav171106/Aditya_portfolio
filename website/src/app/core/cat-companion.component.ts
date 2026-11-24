import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { MotionService } from './motion.service';
import { SectionService, type SectionId } from './section.service';

type Pose = 'idle' | 'walk' | 'sleep' | 'wave';

const ART: Record<Pose, string[]> = {
  idle: [
    '   /\\_/\\',
    '  ( o.o )',
    '   > ^ <',
    '  /|   |\\   .',
    ' / |   | \\ / \\',
    '|  |   |  |   |',
    ' \\_|___|_/    |',
    '   |   |     _|',
  ],
  walk: [
    '   /\\_/\\   .',
    '  ( o.o ) / \\',
    '   > ^ < |   |',
    '  /|   |\\|   |',
    ' / |   | |   |',
    '|  |   | |___|',
    ' \\_|___|/',
    '   |   |',
  ],
  sleep: ['   /\\_/\\     z', '  ( -.- )   z', '   > . <  z', '  /_____\\', ' |_______|'],
  wave: [
    '   /\\_/\\   \\o/',
    '  ( ^.^ )   |',
    '   > ^ <   / \\',
    '  /|   |\\   .',
    ' / |   | \\ / \\',
    '|  |   |  |   |',
    ' \\_|___|_/    |',
    '   |   |     _|',
  ],
};

const NOTES: Record<SectionId, string> = {
  top: 'hello',
  about: 'reading about me',
  work: 'inspecting the repos',
  quests: 'lost in a rabbit hole',
  contact: 'waiting at the door',
};

/**
 * A small ASCII cat that follows the reader down the page: it walks while you
 * scroll, sleeps when you idle, and waves when you land on a new section.
 * Purely decorative — hidden from assistive tech and from reduced-motion users.
 */
@Component({
  selector: 'app-cat-companion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!motion.reduced()) {
      <div
        class="cat"
        [class.cat--walk]="pose() === 'walk'"
        [class.cat--night]="pose() === 'sleep'"
        [style.scale]="flip() ? '-1 1' : '1 1'"
        aria-hidden="true"
      >
        <pre class="cat__art">{{
          art().join(
            '
'
          )
        }}</pre>
        <span class="cat__note">{{ note() }}</span>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        right: clamp(10px, 2.4vw, 28px);
        bottom: clamp(12px, 2.4vw, 26px);
        z-index: 40;
        pointer-events: none;
      }
      .cat {
        display: grid;
        justify-items: end;
        gap: 2px;
        opacity: 0.9;
        transform-origin: 80% 100%;
        animation: float 6s ease-in-out infinite;
        transition:
          opacity 0.5s var(--ease),
          transform 0.5s var(--ease);
      }
      .cat--walk {
        animation: bob 0.42s ease-in-out infinite;
      }
      .cat--night {
        opacity: 0.55;
      }
      .cat__art {
        margin: 0;
        font-family: var(--font);
        font-size: 11px;
        line-height: 1.1;
        color: var(--accent);
        white-space: pre;
        text-shadow: 0 0 18px var(--accent-glow);
      }
      .cat__note {
        font-size: 9.5px;
        letter-spacing: 0.1em;
        text-transform: lowercase;
        color: var(--text-faint);
        padding-right: 4px;
      }
      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }
      @keyframes bob {
        0%,
        100% {
          transform: translateY(0) rotate(-1deg);
        }
        50% {
          transform: translateY(-3px) rotate(1deg);
        }
      }
      @media (max-width: 720px) {
        .cat__art {
          font-size: 9px;
        }
        .cat__note {
          display: none;
        }
      }
    `,
  ],
})
export class CatCompanionComponent {
  protected readonly motion = inject(MotionService);
  private readonly sections = inject(SectionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pose = signal<Pose>('idle');
  protected readonly flip = signal(false);
  protected readonly art = signal<string[]>(ART.idle);
  protected readonly note = signal<string>(NOTES.top);

  private idleTimer = 0;
  private frame = 0;
  private lastY = 0;
  private direction = 0;

  constructor() {
    if (typeof window === 'undefined') return;

    effect(() => {
      const section = this.sections.active();
      this.note.set(NOTES[section]);
      this.wave();
    });

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - this.lastY) < 2) return;
      this.direction = y > this.lastY ? 1 : -1;
      this.lastY = y;
      if (!this.frame) {
        this.frame = window.requestAnimationFrame(() => {
          this.frame = 0;
          this.set('walk');
          this.mirror(this.direction);
        });
      }
      this.restartIdle();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(this.idleTimer);
      if (this.frame) window.cancelAnimationFrame(this.frame);
    });

    this.restartIdle();
  }

  private set(pose: Pose): void {
    if (this.pose() === pose) return;
    this.pose.set(pose);
    this.art.set(ART[pose]);
  }

  private mirror(direction: number): void {
    this.flip.set(direction < 0);
  }

  private wave(): void {
    this.set('wave');
    this.restartIdle();
  }

  private restartIdle(): void {
    clearTimeout(this.idleTimer);
    this.idleTimer = window.setTimeout(() => {
      this.set(this.sections.active() === 'contact' ? 'sleep' : 'idle');
    }, 2600);
  }
}
