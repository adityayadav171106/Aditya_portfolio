import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { SectionHeadingComponent } from '../shared/section-heading.component';
import { AsciiArtComponent } from '../shared/ascii-art.component';
import { projects, type Project } from '../data/content';

@Component({
  selector: 'app-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadingComponent, AsciiArtComponent],
  template: `
    <section class="work" id="work" aria-labelledby="work-title">
      <app-section-heading
        index="02"
        id="work"
        title="work"
        note="Three things I actually shipped. Each one links to the source, so you can judge for yourself."
      />

      <div class="filters" role="group" aria-label="Filter projects by kind">
        @for (kind of kinds(); track kind) {
          <button
            type="button"
            class="filter"
            [class.is-on]="filter() === kind"
            [attr.aria-pressed]="filter() === kind"
            (click)="setFilter(kind)"
          >
            {{ kind }}
          </button>
        }
        <span class="filters__count">{{ visible().length }} / {{ all.length }}</span>
      </div>

      <div class="projects">
        @for (project of visible(); track project.slug; let i = $index) {
          <article class="project" [class.is-open]="open() === project.slug" appReveal [delay]="i * 60">
            <header class="project__head">
              <button
                type="button"
                class="project__toggle"
                [attr.aria-expanded]="open() === project.slug"
                [attr.aria-controls]="'panel-' + project.slug"
                (click)="toggle(project.slug)"
              >
                <span class="project__index" aria-hidden="true">{{ pad(i) }}</span>
                <span class="project__id">
                  <span class="project__name">{{ project.name }}</span>
                  <span class="project__sum">{{ project.summary }}</span>
                </span>
                <span class="project__kind">{{ project.kind }} · {{ project.year }}</span>
                <span class="project__chev" aria-hidden="true">{{
                  open() === project.slug ? '[-]' : '[+]'
                }}</span>
              </button>
            </header>

            <div class="project__body" [id]="'panel-' + project.slug" [hidden]="open() !== project.slug">
              <div class="project__copy">
                <p class="project__blurb">{{ project.blurb }}</p>
                <ul class="project__list">
                  @for (bullet of project.bullets; track bullet) {
                    <li><span aria-hidden="true">+ </span>{{ bullet }}</li>
                  }
                </ul>
                <ul class="project__stack" aria-label="Built with">
                  @for (tool of project.stack; track tool) {
                    <li class="tag">{{ tool }}</li>
                  }
                </ul>
                <div class="project__links">
                  @for (link of project.links; track link.href) {
                    <a class="kbd" [href]="link.href" target="_blank" rel="noopener noreferrer">
                      {{ link.label }} <span aria-hidden="true">↗</span>
                    </a>
                  }
                </div>
              </div>

              <figure class="project__art">
                <app-ascii-art [art]="project.ascii" [maxFont]="13" [label]="project.artLabel" />
              </figure>
            </div>
          </article>
        }
      </div>

      <p class="work__foot">
        <span class="work__foot-key">note</span>
        Everything above is public on
        <a
          class="inline"
          href="https://github.com/adityayadav171106"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/adityayadav171106 ↗
        </a>
        . More is in progress — this list grows when something is worth showing, not before.
      </p>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding-block: clamp(46px, 8vh, 96px);
      }

      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 16px;
      }
      .filter {
        padding: 3px 10px;
        border: 1px dashed var(--line);
        border-radius: 99px;
        font-size: var(--fs-micro);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-faint);
        transition:
          color 0.25s var(--ease),
          border-color 0.25s var(--ease),
          background 0.25s var(--ease);
      }
      .filter:hover {
        color: var(--text);
        border-color: var(--line-strong);
      }
      .filters__count {
        margin-left: auto;
        align-self: center;
        font-size: var(--fs-micro);
        letter-spacing: 0.1em;
        color: var(--text-faint);
      }
      .filter.is-on {
        color: var(--ink);
        background: var(--accent);
        border-color: var(--accent);
        border-style: solid;
      }

      .projects {
        border-top: 1px solid var(--line);
      }
      .project {
        border-bottom: 1px solid var(--line);
        transition: background 0.3s var(--ease);
      }
      .project.is-open {
        background: linear-gradient(180deg, var(--tint), transparent 60%);
      }

      .project__toggle {
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr) auto 32px;
        align-items: center;
        gap: 14px;
        width: 100%;
        padding: 16px 6px;
        text-align: left;
        color: inherit;
      }
      .project__index {
        font-size: var(--fs-micro);
        color: var(--text-faint);
        letter-spacing: 0.1em;
      }
      .project__id {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .project__name {
        font-size: clamp(17px, 2.6vw, 22px);
        color: var(--bright);
        font-weight: 400;
      }
      .project__toggle:hover .project__name {
        color: var(--accent);
      }
      .project__sum {
        font-size: var(--fs-small);
        color: var(--text-dim);
      }
      .project__kind {
        font-size: var(--fs-micro);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-faint);
        white-space: nowrap;
      }
      .project__chev {
        justify-self: end;
        color: var(--accent);
        font-size: var(--fs-small);
      }

      .project__body {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
        gap: clamp(18px, 3vw, 36px);
        padding: 4px 6px 22px 48px;
        animation: open 0.4s var(--ease);
      }
      .project__body[hidden] {
        display: none;
      }
      @keyframes open {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      .project__blurb {
        color: var(--text);
        margin-bottom: 12px;
        max-width: 66ch;
      }
      .project__list {
        display: grid;
        gap: 6px;
        margin-bottom: 14px;
      }
      .project__list li {
        position: relative;
        padding-left: 0;
        color: var(--text-dim);
        font-size: var(--fs-small);
        max-width: 72ch;
      }
      .project__list li span {
        color: var(--accent);
        margin-right: 2px;
      }
      .project__stack {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 16px;
      }
      .project__links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .project__art {
        position: relative;
        margin: 0;
        border: 1px dashed var(--line);
        padding: 12px;
        align-self: start;
        overflow: hidden;
        background:
          radial-gradient(120% 90% at 80% 0%, var(--tint-strong), transparent 70%),
          color-mix(in srgb, var(--ink) 40%, transparent);
        --art-color: #a9bdd6;
      }
      .project__art::after {
        content: '';
        position: absolute;
        inset: auto 0 0 0;
        height: 40%;
        background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--ink) 62%, transparent));
        pointer-events: none;
      }

      .work__foot {
        margin-top: 18px;
        font-size: var(--fs-small);
        color: var(--text-dim);
        max-width: 78ch;
      }
      .work__foot-key {
        display: inline-block;
        margin-right: 8px;
        padding: 0 6px;
        border: 1px solid var(--line);
        border-radius: 2px;
        font-size: var(--fs-micro);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-faint);
      }
      .inline {
        color: var(--accent);
        border-bottom: 1px dotted var(--accent);
      }

      @media (max-width: 820px) {
        .project__toggle {
          grid-template-columns: 26px minmax(0, 1fr) 26px;
          gap: 10px;
        }
        .project__kind {
          display: none;
        }
        .project__body {
          grid-template-columns: minmax(0, 1fr);
          padding-left: 6px;
        }
        .project__art {
          order: -1;
        }
      }
    `,
  ],
})
export class WorkComponent {
  protected readonly all = projects;
  protected readonly filter = signal('all');
  protected readonly open = signal<string | null>(projects[0]?.slug ?? null);

  protected readonly kinds = computed(() => ['all', ...new Set(projects.map((p) => p.kind))]);
  protected readonly visible = computed(() => {
    const kind = this.filter();
    return kind === 'all' ? this.all : this.all.filter((p: Project) => p.kind === kind);
  });

  protected pad(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  protected setFilter(kind: string): void {
    this.filter.set(kind);
    const first = (kind === 'all' ? this.all : this.all.filter((p) => p.kind === kind))[0];
    this.open.set(first?.slug ?? null);
  }

  protected toggle(slug: string): void {
    this.open.update((current) => (current === slug ? null : slug));
  }
}
