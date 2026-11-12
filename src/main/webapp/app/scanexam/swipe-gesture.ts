/**
 * Détection de glissement (swipe) indépendante d'Angular et du DOM réel, pour pouvoir la tester.
 *
 * Règles (issue #657) :
 * - un seul doigt : dès que deux contacts sont présents (pinch-zoom), le geste est abandonné ;
 * - pas de stylet (Apple Pencil, stylet Android ou Surface), sauf si `allowPen` ;
 * - le geste est abandonné si l'appelant juge la cible ignorée (ex. canvas d'annotation pendant le dessin) ;
 * - le déplacement doit dépasser `threshold` pixels sur l'axe dominant, et l'axe dominant doit
 *   l'emporter nettement (`axisRatio`) pour qu'un trait en diagonale ne soit pas pris pour un glissement.
 */

export type SwipeAxis = 'x' | 'y';

export interface SwipeEvent {
  /** Axe dominant du geste. */
  direction: SwipeAxis;
  /** Déplacement signé sur l'axe dominant, en pixels (fin - début). */
  distance: number;
}

export interface SwipeTouchPoint {
  clientX: number;
  clientY: number;
  /** Safari : 'stylus' pour l'Apple Pencil, 'direct' pour un doigt. */
  touchType?: string;
}

/** Sous-ensemble de TouchEvent utilisé par le tracker. */
export interface SwipeTouchEvent {
  touches: { length: number };
  changedTouches: ArrayLike<SwipeTouchPoint>;
}

export interface SwipeGestureOptions {
  threshold: number;
  axisRatio: number;
  allowPen: boolean;
}

export const DEFAULT_SWIPE_OPTIONS: SwipeGestureOptions = {
  threshold: 70,
  axisRatio: 1.5,
  allowPen: false,
};

export class SwipeGestureTracker {
  private start: { x: number; y: number } | undefined;
  private cancelled = false;
  private lastPointerType: string | undefined;

  constructor(private readonly options: SwipeGestureOptions = DEFAULT_SWIPE_OPTIONS) {}

  /** À appeler sur `pointerdown` (qui précède `touchstart`) pour connaître le type de pointeur. */
  notePointerDown(pointerType: string): void {
    this.lastPointerType = pointerType;
  }

  /**
   * @param ignored vrai si la cible du geste ne doit pas déclencher de navigation.
   */
  touchStart(event: SwipeTouchEvent, ignored = false): void {
    if (event.touches.length > 1) {
      // Un deuxième doigt arrive : pinch-zoom ou geste à deux doigts, jamais une navigation.
      this.cancel();
      return;
    }
    const point = event.changedTouches[0];
    this.cancelled = ignored || (!this.options.allowPen && this.isPen(point));
    this.start = point ? { x: point.clientX, y: point.clientY } : undefined;
  }

  /** Renvoie le déplacement courant (pour un retour visuel), sans décider de la navigation. */
  touchMove(event: SwipeTouchEvent): SwipeEvent | undefined {
    if (event.touches.length > 1) {
      this.cancel();
      return undefined;
    }
    if (this.cancelled || this.start === undefined) {
      return undefined;
    }
    const point = event.changedTouches[0];
    if (!point) {
      return undefined;
    }
    const dx = point.clientX - this.start.x;
    const dy = point.clientY - this.start.y;
    return Math.abs(dx) >= Math.abs(dy) ? { direction: 'x', distance: dx } : { direction: 'y', distance: dy };
  }

  /** Renvoie le glissement reconnu, ou `undefined` si le geste n'est pas une navigation. */
  touchEnd(event: SwipeTouchEvent): SwipeEvent | undefined {
    if (event.touches.length > 0) {
      // Un doigt reste posé : le geste était multi-contact.
      this.cancel();
      return undefined;
    }
    const start = this.start;
    const cancelled = this.cancelled;
    this.reset();
    const point = event.changedTouches[0];
    if (cancelled || start === undefined || !point) {
      return undefined;
    }
    const dx = point.clientX - start.x;
    const dy = point.clientY - start.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const main = horizontal ? dx : dy;
    const other = horizontal ? dy : dx;
    if (Math.abs(main) < this.options.threshold || Math.abs(main) < this.options.axisRatio * Math.abs(other)) {
      return undefined;
    }
    return { direction: horizontal ? 'x' : 'y', distance: main };
  }

  cancel(): void {
    this.cancelled = true;
  }

  /** Fin de geste annulée par le navigateur (`touchcancel`). */
  touchCancel(): void {
    this.reset();
  }

  private reset(): void {
    this.start = undefined;
    this.cancelled = false;
    this.lastPointerType = undefined;
  }

  private isPen(point: SwipeTouchPoint | undefined): boolean {
    return this.lastPointerType === 'pen' || point?.touchType === 'stylus';
  }
}
