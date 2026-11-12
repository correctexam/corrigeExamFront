import { SwipeEvent } from '../swipe-gesture';

export type NavigationAction = 'previousStudent' | 'nextStudent' | 'previousQuestion' | 'nextQuestion';

/** Seuil plus court que sur la page : la zone est petite et dédiée à la navigation. */
export const PAD_SWIPE_THRESHOLD = 40;

/**
 * Convention de la zone de navigation, celle d'une liste ou d'un carrousel :
 * glisser vers la gauche montre la copie suivante, glisser vers le haut montre la question suivante.
 *
 * Sans navigation entre copies (vue étudiant), les deux axes changent de question.
 */
export function padSwipeAction(event: SwipeEvent, withStudents: boolean): NavigationAction {
  const next = event.distance < 0;
  if (event.direction === 'x' && withStudents) {
    return next ? 'nextStudent' : 'previousStudent';
  }
  return next ? 'nextQuestion' : 'previousQuestion';
}
