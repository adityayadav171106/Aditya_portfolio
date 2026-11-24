import { DestroyRef, Injectable, inject, signal } from '@angular/core';

/** Tracks prefers-reduced-motion and a coarse pointer, once, for the whole app. */
@Injectable({ providedIn: 'root' })
export class MotionService {
  readonly reduced = signal(false);
  readonly coarse = signal(false);
  readonly finePointer = signal(true);

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (typeof window === 'undefined') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const hoverQuery = window.matchMedia('(hover: hover)');

    this.reduced.set(motionQuery.matches);
    this.coarse.set(coarseQuery.matches);
    this.finePointer.set(hoverQuery.matches);

    const onChange = () => {
      this.reduced.set(motionQuery.matches);
      this.coarse.set(coarseQuery.matches);
      this.finePointer.set(hoverQuery.matches);
    };

    motionQuery.addEventListener('change', onChange);
    coarseQuery.addEventListener('change', onChange);
    hoverQuery.addEventListener('change', onChange);

    this.destroyRef.onDestroy(() => {
      motionQuery.removeEventListener('change', onChange);
      coarseQuery.removeEventListener('change', onChange);
      hoverQuery.removeEventListener('change', onChange);
    });
  }
}
