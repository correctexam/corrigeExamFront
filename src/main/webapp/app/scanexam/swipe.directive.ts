import { DestroyRef, Directive, ElementRef, NgZone, OnInit, inject, input, output } from '@angular/core';
import { DEFAULT_SWIPE_OPTIONS, SwipeEvent, SwipeGestureTracker } from './swipe-gesture';

export type { SwipeEvent } from './swipe-gesture';

/** Éléments où un glissement a déjà un sens (saisie, curseur de note, dialogue) : jamais de navigation. */
const NATIVE_GESTURE_SELECTOR = 'input, textarea, select, [contenteditable="true"], [role="slider"], .p-slider, [role="dialog"]';

/**
 * Glissement tactile (un doigt) pour naviguer.
 *
 * Les écouteurs sont posés hors de la zone Angular, en phase de capture et en mode passif :
 * ils n'empêchent ni le défilement ni le dessin. Seule l'émission de `swipeEnd` revient dans la zone ;
 * `swipeMove` est émis hors zone (à consommer avec des signals).
 */
@Directive({
  selector: '[jhiSwipe]',
  standalone: true,
  host: { 'data-jhi-swipe': '' },
})
export class SwipeDirective implements OnInit {
  /** Désactive complètement la détection. */
  readonly swipeEnabled = input(true);
  /** Accepte les gestes faits au stylet (désactivé par défaut : le stylet sert à annoter). */
  readonly swipeAllowPen = input(false);
  /** Distance minimale, en pixels, sur l'axe dominant. */
  readonly swipeThreshold = input(DEFAULT_SWIPE_OPTIONS.threshold);
  /** Renvoie vrai si un geste qui commence sur cet événement ne doit jamais naviguer. */
  readonly swipeIgnore = input<((event: TouchEvent) => boolean) | undefined>(undefined);

  readonly swipeMove = output<SwipeEvent>();
  readonly swipeEnd = output<SwipeEvent>();

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    const tracker = new SwipeGestureTracker({
      ...DEFAULT_SWIPE_OPTIONS,
      allowPen: this.swipeAllowPen(),
      threshold: this.swipeThreshold(),
    });
    const options: AddEventListenerOptions = { capture: true, passive: true };

    const onPointerDown = (e: PointerEvent): void => tracker.notePointerDown(e.pointerType);
    const onTouchStart = (e: TouchEvent): void => {
      if (!this.swipeEnabled()) {
        tracker.cancel();
        return;
      }
      const ignore = this.swipeIgnore();
      const ignored = this.startsInNestedSwipe(e.target, element) || this.startsOnNativeGesture(e.target) || (ignore?.(e) ?? false);
      tracker.touchStart(e, ignored);
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

    this.destroyRef.onDestroy((): void => {
      element.removeEventListener('pointerdown', onPointerDown, options);
      element.removeEventListener('touchstart', onTouchStart, options);
      element.removeEventListener('touchmove', onTouchMove, options);
      element.removeEventListener('touchend', onTouchEnd, options);
      element.removeEventListener('touchcancel', onTouchCancel, options);
    });
  }

  /** Un geste fait dans une zone `jhiSwipe` imbriquée (la zone de navigation) est traité par celle-ci seulement. */
  private startsInNestedSwipe(target: EventTarget | null, element: HTMLElement): boolean {
    if (!(target instanceof Element)) {
      return false;
    }
    const closest = target.closest('[data-jhi-swipe]');
    return closest !== null && closest !== element;
  }

  private startsOnNativeGesture(target: EventTarget | null): boolean {
    return target instanceof Element && target.closest(NATIVE_GESTURE_SELECTOR) !== null;
  }
}
