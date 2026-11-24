import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { nav } from '../data/content';
import { SectionService } from './section.service';
import { THEMES, ThemeService } from './theme.service';
import { MotionService } from './motion.service';

@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#work">skip to work</a>

    <div class="bar">
      <a class="mark" href="#top" (click)="jump('top', $event)" aria-label="Aditya Yadav, back to top">
        <span class="mark__art" aria-hidden="true">~/aditya</span>
        <span class="mark__caret" aria-hidden="true">▌</span>
      </a>

      <nav class="nav" aria-label="Sections">
        @for (link of links; track link.href) {
          <a
            class="nav__link"
            [href]="link.href"
            [class.is-active]="sections.active() === link.href.slice(1)"
            [attr.aria-current]="sections.active() === link.href.slice(1) ? 'true' : null"
            (click)="jump(link.href.slice(1), $event)"
          >
            <span class="nav__key" aria-hidden="true">{{ link.key }}</span>
            <span class="nav__label">{{ link.label }}</span>
          </a>
        }
      </nav>

      <div class="tools">
        <button
          type="button"
          class="tool"
          (click)="cycleTheme()"
          [attr.aria-label]="'Switch theme, currently ' + themeLabel()"
          title="cycle theme (T)"
        >
          <span class="tool__dot" [style.background]="swatch()"></span>
          <span class="tool__label">{{ themeLabel() }}</span>
        </button>

        <button
          type="button"
          class="tool tool--menu"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="mobile-menu"
          aria-label="Toggle section menu"
        >
          <span aria-hidden="true">{{ menuOpen() ? '[x]' : '[≡]' }}</span>
          <span class="tool__label">menu</span>
        </button>
      </div>
    </div>

    <div class="scrollline" aria-hidden="true">
      <span [style.transform]="'scaleX(' + sections.progress() + ')'"></span>
    </div>

    @if (menuOpen()) {
      <div class="menu" id="mobile-menu">
        @for (link of links; track link.href) {
          <a
            class="menu__link"
            [href]="link.href"
            [class.is-active]="sections.active() === link.href.slice(1)"
            (click)="jump(link.href.slice(1), $event)"
          >
            <span>{{ link.key }}</span>{{ link.label }}
          </a>
        }
        <p class="menu__hint">
          press <span class="kbd">T</span> to change theme · <span class="kbd">/</span> is not a search, it is
          a lifestyle
        </p>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0 0 auto 0;
        z-index: 50;
        display: block;
      }
      .skip {
        position: absolute;
        left: -9999px;
        top: 8px;
        background: var(--accent);
        color: var(--ink);
        padding: 6px 12px;
        z-index: 5;
      }
      .skip:focus {
        left: 12px;
      }

      .bar {
        display: flex;
        align-items: center;
        gap: 18px;
        padding: 12px var(--gutter);
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--ink) 92%, transparent),
          color-mix(in srgb, var(--ink) 42%, transparent) 78%,
          transparent
        );
        backdrop-filter: blur(9px) saturate(120%);
      }

      .mark {
        display: inline-flex;
        align-items: baseline;
        gap: 3px;
        font-size: var(--fs-small);
        letter-spacing: 0.02em;
        color: var(--text);
        white-space: nowrap;
      }
      .mark__art {
        color: var(--text-dim);
      }
      .mark__caret {
        color: var(--accent);
        animation: caret 1.2s steps(1, end) infinite;
      }
      @keyframes caret {
        0%,
        55% {
          opacity: 1;
        }
        56%,
        100% {
          opacity: 0;
        }
      }

      .nav {
        display: flex;
        gap: 2px;
        margin-left: auto;
      }
      .nav__link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 9px;
        border: 1px solid transparent;
        border-radius: 3px;
        font-size: var(--fs-small);
        color: var(--text-faint);
        transition:
          color 0.25s var(--ease),
          border-color 0.25s var(--ease),
          background 0.25s var(--ease);
      }
      .nav__key {
        display: inline-grid;
        place-items: center;
        width: 15px;
        height: 15px;
        border: 1px solid var(--line);
        border-radius: 2px;
        font-size: 9px;
        color: var(--text-faint);
        line-height: 1;
      }
      .nav__link:hover {
        color: var(--text);
        border-color: var(--line);
        background: rgba(255, 255, 255, 0.02);
      }
      .nav__link.is-active {
        color: var(--bright);
        border-color: var(--line-strong);
        background: var(--accent-soft);
      }
      .nav__link.is-active .nav__key {
        color: var(--ink);
        background: var(--accent);
        border-color: var(--accent);
      }
      .nav__label {
        display: none;
      }

      .tools {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .tool {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border: 1px solid var(--line);
        border-radius: 3px;
        font-size: var(--fs-micro);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-dim);
        transition:
          color 0.25s var(--ease),
          border-color 0.25s var(--ease),
          background 0.25s var(--ease);
      }
      .tool:hover {
        color: var(--text);
        border-color: var(--line-strong);
        background: rgba(255, 255, 255, 0.03);
      }
      .tool__dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        box-shadow: 0 0 10px currentColor;
      }
      .tool--menu {
        display: none;
      }
      @media (max-width: 759px) {
        .tool--menu {
          display: inline-flex;
        }
      }

      .scrollline {
        height: 1px;
        background: var(--line);
        overflow: hidden;
      }
      .scrollline span {
        display: block;
        height: 100%;
        background: var(--accent);
        transform-origin: 0 50%;
        transform: scaleX(0);
        transition: transform 0.12s linear;
      }

      .menu {
        display: grid;
        gap: 2px;
        padding: 10px var(--gutter) 18px;
        background: color-mix(in srgb, var(--ink) 97%, transparent);
        border-bottom: 1px solid var(--line);
      }
      .menu__link {
        display: flex;
        gap: 12px;
        padding: 10px 4px;
        border-bottom: 1px dashed var(--line);
        color: var(--text-dim);
        font-size: var(--fs-lead);
      }
      .menu__link span {
        color: var(--text-faint);
        font-size: var(--fs-small);
      }
      .menu__link.is-active {
        color: var(--bright);
      }
      .menu__hint {
        margin-top: 12px;
        font-size: var(--fs-micro);
        color: var(--text-faint);
        letter-spacing: 0.04em;
      }

      @media (min-width: 760px) {
        .nav__label {
          display: inline;
        }
      }
      @media (max-width: 759px) {
        .nav {
          display: none;
        }
        .tools {
          margin-left: auto;
        }
      }
      @media (max-width: 520px) {
        .tool__label {
          display: none;
        }
        .tool {
          padding-inline: 6px;
        }
      }
    `,
  ],
})
export class SiteHeaderComponent {
  protected readonly sections = inject(SectionService);
  private readonly themeService = inject(ThemeService);
  protected readonly motion = inject(MotionService);

  protected readonly links = nav;
  protected readonly menuOpen = signal(false);
  protected readonly themeLabel = computed(
    () => THEMES.find((t) => t.name === this.themeService.theme())?.label ?? 'moonlight',
  );
  protected readonly swatch = computed(
    () => THEMES.find((t) => t.name === this.themeService.theme())?.swatch ?? '#8fb7f5',
  );

  jump(id: string, event: Event): void {
    event.preventDefault();
    this.menuOpen.set(false);
    this.sections.scrollTo(id as never);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  cycleTheme(): void {
    this.themeService.cycle();
  }
}
