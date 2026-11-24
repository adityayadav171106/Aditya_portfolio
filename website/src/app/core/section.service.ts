import { DestroyRef, Injectable, inject, signal } from '@angular/core';

export type SectionId = 'top' | 'about' | 'work' | 'quests' | 'contact';

const ORDER: SectionId[] = ['top', 'about', 'work', 'quests', 'contact'];

/**
 * Tracks which section is in the middle of the viewport so the header,
 * the side rail and the cat companion all agree on where you are.
 */
@Injectable({ providedIn: 'root' })
export class SectionService {
  readonly active = signal<SectionId>('top');
  readonly progress = signal(0);

  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;
  private frame = 0;

  constructor() {
    if (typeof window === 'undefined') return;

    const onScroll = () => {
      if (this.frame) return;
      this.frame = window.requestAnimationFrame(() => {
        this.frame = 0;
        this.measure();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      this.observer?.disconnect();
      if (this.frame) window.cancelAnimationFrame(this.frame);
    });
  }

  /** Called by the app shell once the section nodes exist. */
  observe(): void {
    if (typeof window === 'undefined' || this.observer) return;
    if (typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.id as SectionId | undefined;
        if (id && ORDER.includes(id)) this.active.set(id);
      },
      { rootMargin: '-38% 0px -46% 0px', threshold: [0, 0.2, 0.5, 1] },
    );

    for (const id of ORDER) {
      const node = document.getElementById(id);
      if (node) this.observer.observe(node);
    }
    this.measure();

    // honour a deep link such as /#work on first load
    const hash = (location.hash || '').replace('#', '') as SectionId;
    if (ORDER.includes(hash)) {
      document.getElementById(hash)?.scrollIntoView({ block: 'start' });
      this.active.set(hash);
    }
  }

  scrollTo(id: SectionId): void {
    const node = document.getElementById(id);
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (typeof history.replaceState === 'function') {
      history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`);
    }
  }

  private measure(): void {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    this.progress.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
  }
}
