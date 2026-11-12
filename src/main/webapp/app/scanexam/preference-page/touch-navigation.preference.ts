/** Affichage de la zone de navigation tactile (issue #657). */
export type NavigationPadMode = 'auto' | 'always' | 'never';
export type NavigationPadSide = 'left' | 'right';

export interface ITouchNavigationPreference {
  /** Glissement sur toute la page (comportement historique, désactivé pendant le dessin). */
  swipeOnPage: boolean;
  /** `auto` : affichée seulement sur tablette ou écran tactile. */
  pad: NavigationPadMode;
  /** Côté de l'écran où se place la zone (gauchers). */
  padSide: NavigationPadSide;
  /** Zone repliée en un simple bouton. */
  padCollapsed: boolean;
}

export const DEFAULT_TOUCH_NAVIGATION: ITouchNavigationPreference = {
  swipeOnPage: true,
  pad: 'auto',
  padSide: 'right',
  padCollapsed: false,
};

/**
 * Tablettes et PC tactiles : un pointeur grossier (doigt) est disponible.
 * Les téléphones sont exclus par la largeur minimale.
 */
export const TOUCH_TABLET_MEDIA_QUERY = '(any-pointer: coarse) and (min-width: 600px)';

/** Complète une préférence stockée (éventuellement partielle ou ancienne) avec les valeurs par défaut. */
export function withTouchNavigationDefaults(stored: Partial<ITouchNavigationPreference> | null | undefined): ITouchNavigationPreference {
  const pref = { ...DEFAULT_TOUCH_NAVIGATION, ...(stored ?? {}) };
  if (!['auto', 'always', 'never'].includes(pref.pad)) {
    pref.pad = DEFAULT_TOUCH_NAVIGATION.pad;
  }
  if (!['left', 'right'].includes(pref.padSide)) {
    pref.padSide = DEFAULT_TOUCH_NAVIGATION.padSide;
  }
  return pref;
}

export function shouldShowNavigationPad(mode: NavigationPadMode, isTouchTablet: boolean): boolean {
  return mode === 'always' || (mode === 'auto' && isTouchTablet);
}
