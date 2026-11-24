import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { SectionHeadingComponent } from '../shared/section-heading.component';
import { AsciiArtComponent } from '../shared/ascii-art.component';
import { LiveClockComponent } from '../core/live-clock.component';
import { SectionService, type SectionId } from '../core/section.service';
import { contactLinks, identity, nav } from '../data/content';

const CAT = String.raw`
    /\_/\
   ( ^.^ )   <3
   -= ^ =-
   /|   |\
  / |   | \
 |  |   |  |
 |  |   |  |
  \ |   | /
   \|___|/
     | |
     |_|
`;

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadingComponent, AsciiArtComponent, LiveClockComponent],
  template: `
    <section class="contact" id="contact" aria-labelledby="contact-title">
      <app-section-heading
        index="04"
        id="contact"
        title="contact"
        note="Have a thought? Send it my way. Email is the one that always reaches me."
      />

      <div class="contact__grid">
        <div class="contact__main" appReveal>
          <a class="mail" [href]="'mailto:' + identity.email">
            <span class="mail__label" aria-hidden="true">$ mail</span>
            <span class="mail__address">{{ identity.email }}</span>
            <span class="mail__arrow" aria-hidden="true">→</span>
          </a>

          <ul class="links">
            @for (link of links; track link.href) {
              <li>
                <a [href]="link.href" target="_blank" rel="noopener noreferrer">
                  <span class="links__key" aria-hidden="true">{{ link.key }}</span>
                  <span class="links__label">{{ link.label }}</span>
                  <span class="links__note">{{ link.note }}</span>
                  <span class="links__arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            }
          </ul>
        </div>

        <figure class="contact__art" appReveal [delay]="80">
          <app-ascii-art [art]="cat" [maxFont]="14" label="A content ASCII cat" />
          <figcaption>the site mascot, signing off.</figcaption>
        </figure>
      </div>

      <footer class="footer">
        <div class="footer__row">
          <span class="footer__brand">
            <span aria-hidden="true">~/</span>aditya
            <span class="footer__caret" aria-hidden="true">▌</span>
          </span>
          <span class="footer__note">
            Made with curiosity, monospace and a cat. Local time <app-live-clock />
          </span>
          <span class="footer__year">© {{ year }} Aditya Yadav</span>
        </div>
        <div class="footer__row footer__row--quiet">
          <nav aria-label="Footer">
            @for (item of navItems; track item.href) {
              <a [href]="item.href" (click)="jump(item.href.slice(1), $event)">{{ item.label }}</a>
            }
          </nav>
          <span class="footer__hint">
            <span class="kbd">J</span>/<span class="kbd">K</span> to move · <span class="kbd">T</span> for
            theme · <span class="kbd">esc</span> to close things
          </span>
        </div>
      </footer>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding-block: clamp(46px, 8vh, 96px) 0;
      }
      .contact__grid {
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr);
        gap: clamp(22px, 4vw, 44px);
        align-items: start;
      }

      .mail {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        padding: clamp(14px, 2.4vw, 22px);
        border: 1px solid var(--line-strong);
        background: linear-gradient(120deg, var(--tint), transparent 65%);
        transition:
          border-color 0.3s var(--ease),
          background 0.3s var(--ease),
          transform 0.3s var(--ease);
      }
      .mail:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
        background: linear-gradient(120deg, var(--tint-strong), transparent 70%);
      }
      .mail__label {
        font-size: var(--fs-micro);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--accent);
      }
      .mail__address {
        font-size: clamp(13px, 2.6vw, 22px);
        color: var(--bright);
        overflow-wrap: anywhere;
      }
      .mail__arrow {
        color: var(--accent);
        font-size: clamp(15px, 2.6vw, 22px);
        transition: transform 0.3s var(--ease);
      }
      .mail:hover .mail__arrow {
        transform: translateX(4px);
      }

      .links {
        display: grid;
        margin-top: 18px;
        border-top: 1px dashed var(--line);
      }
      .links a {
        display: grid;
        grid-template-columns: 24px 90px minmax(0, 1fr) 18px;
        align-items: center;
        gap: 10px;
        padding: 10px 4px;
        border-bottom: 1px dashed var(--line);
        color: var(--text);
        font-size: var(--fs-small);
        transition:
          background 0.25s var(--ease),
          padding-left 0.25s var(--ease);
      }
      .links a:hover {
        background: var(--tint);
        padding-left: 8px;
      }
      .links__key {
        color: var(--text-faint);
        font-size: var(--fs-micro);
        border: 1px solid var(--line);
        border-radius: 2px;
        text-align: center;
      }
      .links__label {
        color: var(--bright);
      }
      .links__note {
        color: var(--text-faint);
        font-size: var(--fs-micro);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .links__arrow {
        justify-self: end;
        color: var(--accent);
      }

      .contact__art {
        margin: 0;
        padding: 14px;
        border: 1px dashed var(--line);
        text-align: center;
        --art-color: var(--accent);
      }
      .contact__art figcaption {
        margin-top: 8px;
        font-size: var(--fs-micro);
        letter-spacing: 0.06em;
        color: var(--text-faint);
      }

      .footer {
        margin-top: clamp(40px, 7vh, 80px);
        border-top: 1px dashed var(--line);
        padding: 18px 0 26px;
      }
      .footer__row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px 20px;
        font-size: var(--fs-small);
        color: var(--text-dim);
      }
      .footer__row--quiet {
        margin-top: 12px;
        font-size: var(--fs-micro);
        color: var(--text-faint);
      }
      .footer__brand {
        color: var(--bright);
      }
      .footer__caret {
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
      .footer__note {
        color: var(--text-faint);
      }
      .footer__year {
        margin-left: auto;
      }
      .footer__row nav {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
      }
      .footer__row nav a {
        color: var(--text-dim);
      }
      .footer__row nav a:hover {
        color: var(--accent);
      }
      .footer__hint {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }

      @media (max-width: 860px) {
        .contact__grid {
          grid-template-columns: minmax(0, 1fr);
        }
        .contact__art {
          display: none;
        }
      }
      @media (max-width: 560px) {
        .links a {
          grid-template-columns: 22px minmax(0, 1fr) 16px;
        }
        .links__note {
          display: none;
        }
        .footer__hint {
          display: none;
        }
      }
    `,
  ],
})
export class ContactComponent {
  private readonly sections = inject(SectionService);
  protected readonly identity = identity;
  protected readonly links = contactLinks;
  protected readonly navItems = nav;
  protected readonly cat = CAT;
  protected readonly year = new Date().getFullYear();

  jump(id: string, event: Event): void {
    event.preventDefault();
    this.sections.scrollTo(id as SectionId);
  }
}
