import { DestroyRef, Directive, ElementRef, NgZone, OnInit, inject, input, output } from '@angular/core';
import { DEFAULT_SWIPE_OPTIONS, SwipeEvent, SwipeGestureTracker } from './swipe-gesture';

export type { SwipeEvent } from './swipe-gesture';

/**
 * Glissement tactile (un doigt) pour naviguer.
 *
 * Les écouteurs sont posés hors de la zone Angular, en phase de capture et en mode passif :
 * ils n'empêchent ni le défilement ni le dessin. Seule l'émission de `swipeEnd` revient dans la zone.
 */
@Directive({
  selector: '[jhiSwipe]',
  standalone: true,
})
export class SwipeDirective implements OnInit {
  /** Désactive complètement la détection. */
  readonly swipeEnabled = input(true);
  /** Accepte les gestes faits au stylet (désactivé par défaut : le stylet sert à annoter). */
  readonly swipeAllowPen = input(false);
  /** Renvoie vrai si un geste qui commence sur cet événement ne doit jamais naviguer. */
  readonly swipeIgnore = input<((event: TouchEvent) => boolean) | undefined>(undefined);

  readonly swipeMove = output<SwipeEvent>();
  readonly swipeEnd = output<SwipeEvent>();

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    const tracker = new SwipeGestureTracker({ ...DEFAULT_SWIPE_OPTIONS, allowPen: this.swipeAllowPen() });
    const options: AddEventListenerOptions = { capture: true, passive: true };

    const onPointerDown = (e: PointerEvent): void => tracker.notePointerDown(e.pointerType);
    const onTouchStart = (e: TouchEvent): void => {
      if (!this.swipeEnabled()) {
        tracker.cancel();
        return;
      }
      const ignore = this.swipeIgnore();
      tracker.touchStart(e, ignore !== undefined && ignore(e));
    };
    const onTouchMove = (e: TouchEvent): void => {
      const move = tracker.touchMove(e);
      if (move) {
        this.swipeMove.emit(move);
      }
    };
    const onTouchEnd = (e: TouchEvent): void => {
      const swipe = tracker.touchEnd(e);
      if (swipe && this.swipeEnabled()) {
        this.zone.run(() => this.swipeEnd.emit(swipe));
      }
    };
    const onTouchCancel = (): void => tracker.touchCancel();

    this.zone.runOutsideAngular(() => {
      element.addEventListener('pointerdown', onPointerDown, options);
      element.addEventListener('touchstart', onTouchStart, options);
      element.addEventListener('touchmove', onTouchMove, options);
      element.addEventListener('touchend', onTouchEnd, options);
      element.addEventListener('touchcancel', onTouchCancel, options);
    });

    this.destroyRef.onDestroy(() => {
      element.removeEventListener('pointerdown', onPointerDown, options);
      element.removeEventListener('touchstart', onTouchStart, options);
      element.removeEventListener('touchmove', onTouchMove, options);
      element.removeEventListener('touchend', onTouchEnd, options);
      element.removeEventListener('touchcancel', onTouchCancel, options);
    });
  }
}
