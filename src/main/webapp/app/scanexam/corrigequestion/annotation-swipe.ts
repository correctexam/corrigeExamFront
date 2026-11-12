import { DrawingTools } from '../annotate-template/paint/models';

/** Conteneur que fabric.js crée autour de chaque canvas d'annotation. */
export const ANNOTATION_CANVAS_SELECTOR = '.canvas-container';

/**
 * Issue #657 : un glissement qui commence sur un canvas d'annotation est un trait, pas une navigation.
 *
 * Seule exception : avec l'outil de sélection, un glissement sur une partie vide du canvas navigue.
 * S'il commence sur une annotation, c'est un déplacement de cette annotation.
 *
 * @param target cible du `touchstart`
 * @param tool outil d'annotation actif
 * @param startsOnObject indique si le geste commence sur une annotation (appelé seulement avec l'outil de sélection)
 */
export function isAnnotationGesture(target: EventTarget | null, tool: DrawingTools, startsOnObject: () => boolean): boolean {
  if (!isElement(target) || target.closest(ANNOTATION_CANVAS_SELECTOR) === null) {
    return false;
  }
  return tool !== DrawingTools.SELECT || startsOnObject();
}

function isElement(target: EventTarget | null): target is Element {
  return target !== null && typeof (target as Partial<Element>).closest === 'function';
}
