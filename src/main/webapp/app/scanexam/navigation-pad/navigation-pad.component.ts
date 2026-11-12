import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PreferenceService } from '../preference-page/preference.service';
import { TOUCH_TABLET_MEDIA_QUERY, shouldShowNavigationPad } from '../preference-page/touch-navigation.preference';
import { SwipeDirective, SwipeEvent } from '../swipe.directive';
import { NavigationAction, PAD_SWIPE_THRESHOLD, padSwipeAction } from './navigation-pad.model';

/**
 * Zone de navigation pour tablettes et écrans tactiles (issue #657).
 *
 * Boutons fléchés et surface de glissement : haut/bas pour les questions, gauche/droite pour les copies.
 * Le stylet y est accepté, contrairement au glissement sur toute la page.
 */
@Component({
  selector: 'jhi-navigation-pad',
  standalone: true,
  templateUrl: './navigation-pad.component.html',
  styleUrls: ['./navigation-pad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SwipeDirective, TranslatePipe],
})
export class NavigationPadComponent {
  /** Faux sur la vue étudiant : seule la navigation entre questions existe. */
  readonly withStudents = input(true);
  /** Libellé de la position courante, par exemple « Q 3 / 10 ». */
  readonly questionInfo = input<string>();
  readonly studentInfo = input<string>();

  readonly navigate = output<NavigationAction>();

  readonly threshold = PAD_SWIPE_THRESHOLD;

  readonly preference = inject(PreferenceService).touchNavigation();
  // `isTouchTablet` est déclaré plus bas : un computed ne lit ses dépendances qu'à l'évaluation.
  readonly visible = computed(() => shouldShowNavigationPad(this.preference().pad, this.isTouchTablet()));
  readonly collapsed = computed(() => this.preference().padCollapsed);

  /** Glissement en cours dans la surface, pour le retour visuel (mis à jour hors zone Angular). */
  readonly drag = signal<SwipeEvent | undefined>(undefined);
  readonly dragOffset = computed(() => {
    const d = this.drag();
    if (d === undefined) {
      return 'translate(0, 0)';
    }
    const offset = Math.max(-this.threshold, Math.min(this.threshold, d.distance));
    return d.direction === 'x' ? `translate(${offset}px, 0)` : `translate(0, ${offset}px)`;
  });
  /** Action qui sera déclenchée si le doigt est levé maintenant. */
  readonly pendingAction = computed<NavigationAction | undefined>(() => {
    const d = this.drag();
    return d !== undefined && Math.abs(d.distance) >= this.threshold ? padSwipeAction(d, this.withStudents()) : undefined;
  });

  private readonly preferenceService = inject(PreferenceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isTouchTablet = signal(this.watchTouchTablet());

  go(action: NavigationAction): void {
    this.navigate.emit(action);
  }

  onSwipeMove(event: SwipeEvent): void {
    this.drag.set(event);
  }

  onSwipeEnd(event: SwipeEvent): void {
    this.drag.set(undefined);
    this.go(padSwipeAction(event, this.withStudents()));
  }

  /** Remet la surface en place si le geste n'a pas abouti (trop court, annulé). */
  resetDrag(): void {
    this.drag.set(undefined);
  }

  toggleCollapsed(): void {
    const pref = this.preference();
    this.preferenceService.saveTouchNavigation({ ...pref, padCollapsed: !pref.padCollapsed });
  }

  private watchTouchTablet(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    const query = window.matchMedia(TOUCH_TABLET_MEDIA_QUERY);
    const listener = (e: MediaQueryListEvent): void => this.isTouchTablet.set(e.matches);
    query.addEventListener('change', listener);
    this.destroyRef.onDestroy(() => query.removeEventListener('change', listener));
    return query.matches;
  }
}
