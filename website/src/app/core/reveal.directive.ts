import { Directive, ElementRef, DestroyRef, afterNextRender, inject, input } from '@angular/core';
import { MotionService } from './motion.service';

/**
 * Lightweight scroll reveal: adds `.is-in` once the element enters the
 * viewport. One observer per instance, disconnected as soon as it fires,
 * and a no-op for reduced-motion visitors.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[class.reveal]': 'motion.reduced() === false',
    '[class.is-in]': 'motion.reduced()',
    '[style.--reveal-delay.ms]': 'delay()',
  },
})
export class RevealDirective {
  readonly appReveal = input<'' | 'up' | 'fade'>('up');
  readonly delay = input(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const node = this.host.nativeElement;

    afterNextRender(() => {
      if (this.motion.reduced()) return;

      if (typeof IntersectionObserver === 'undefined') {
        node.classList.add('is-in');
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add('is-in');
              observer.disconnect();
            }
          }
        },
        { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
      );
      observer.observe(node);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
