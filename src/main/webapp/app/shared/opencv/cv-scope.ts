/**
 * Gestion déterministe de la mémoire des objets natifs OpenCV.js (WebAssembly).
 *
 * Les objets `cv.Mat`, `cv.MatVector`, … sont alloués dans le tas Wasm et ne sont
 * jamais collectés par le garbage collector JavaScript : ils doivent être libérés
 * explicitement avec `.delete()`, y compris lorsqu'une exception interrompt le traitement
 * (scan froissé, zone vide, image corrompue…).
 *
 * `CvScope` enregistre les objets alloués et les libère tous, dans l'ordre inverse
 * d'allocation, lors de `dispose()`. `withCvScope` garantit cet appel via `try/finally`.
 *
 * Remarque : `cv.Rect`, `cv.Point`, `cv.Size`, `cv.Scalar` et `cv.TermCriteria` sont des
 * objets valeur en OpenCV.js et n'ont pas besoin d'être suivis.
 */
export interface CvDeletable {
  delete(): void;
  isDeleted?(): boolean;
}

export class CvScope {
  private readonly tracked: CvDeletable[] = [];
  private disposed = false;

  /** Enregistre un objet natif qui sera libéré au plus tard à la fin du scope. */
  track<T extends CvDeletable>(obj: T): T {
    if (this.disposed) {
      throw new Error('CvScope already disposed');
    }
    this.tracked.push(obj);
    return obj;
  }

  /**
   * Retire un objet du scope sans le libérer : la responsabilité de son `.delete()`
   * est transférée à l'appelant (typiquement une valeur de retour).
   */
  keep<T extends CvDeletable>(obj: T): T {
    const index = this.tracked.lastIndexOf(obj);
    if (index >= 0) {
      this.tracked.splice(index, 1);
    }
    return obj;
  }

  /** Libère immédiatement un objet (pour réduire le pic mémoire dans une boucle). */
  release(obj: CvDeletable | null | undefined): void {
    if (obj === null || obj === undefined) {
      return;
    }
    this.keep(obj);
    safeDelete(obj);
  }

  /** Libère tous les objets encore suivis, dans l'ordre inverse d'allocation. */
  dispose(): void {
    this.disposed = true;
    while (this.tracked.length > 0) {
      safeDelete(this.tracked.pop());
    }
  }

  /** Nombre d'objets encore suivis (utile pour les tests). */
  get size(): number {
    return this.tracked.length;
  }
}

/** Appelle `.delete()` sans jamais propager d'erreur (objet déjà libéré, etc.). */
export function safeDelete(obj: CvDeletable | null | undefined): void {
  if (obj === null || obj === undefined) {
    return;
  }
  try {
    if (typeof obj.isDeleted === 'function' && obj.isDeleted()) {
      return;
    }
    obj.delete();
  } catch (e) {
    console.warn('OpenCV object could not be deleted', e);
  }
}

/**
 * Exécute `fn` dans un scope OpenCV : tous les objets suivis sont libérés à la sortie,
 * que `fn` retourne normalement ou lève une exception.
 *
 * `fn` doit être synchrone ; pour du code asynchrone utiliser `withCvScopeAsync`.
 */
export function withCvScope<T>(fn: (scope: CvScope) => T): T {
  const scope = new CvScope();
  try {
    const result = fn(scope);
    if (result instanceof Promise) {
      throw new Error('withCvScope callback must be synchronous, use withCvScopeAsync');
    }
    return result;
  } finally {
    scope.dispose();
  }
}

/** Variante asynchrone de `withCvScope` : la libération a lieu après résolution ou rejet. */
export async function withCvScopeAsync<T>(fn: (scope: CvScope) => Promise<T>): Promise<T> {
  const scope = new CvScope();
  try {
    return await fn(scope);
  } finally {
    scope.dispose();
  }
}
