import { CvDeletable, CvScope, safeDelete, withCvScope, withCvScopeAsync } from './cv-scope';

class FakeMat implements CvDeletable {
  static deletionOrder: string[] = [];
  deleted = false;
  deleteCalls = 0;

  constructor(public readonly name = 'mat') {}

  delete(): void {
    this.deleteCalls++;
    if (this.deleted) {
      throw new Error('already deleted');
    }
    this.deleted = true;
    FakeMat.deletionOrder.push(this.name);
  }

  isDeleted(): boolean {
    return this.deleted;
  }
}

describe('CvScope', () => {
  beforeEach(() => {
    FakeMat.deletionOrder = [];
  });

  it('deletes every tracked object in reverse allocation order', () => {
    const scope = new CvScope();
    scope.track(new FakeMat('a'));
    scope.track(new FakeMat('b'));
    scope.track(new FakeMat('c'));

    scope.dispose();

    expect(FakeMat.deletionOrder).toEqual(['c', 'b', 'a']);
    expect(scope.size).toBe(0);
  });

  it('does not delete objects whose ownership was transferred with keep()', () => {
    const scope = new CvScope();
    const kept = scope.track(new FakeMat('kept'));
    const other = scope.track(new FakeMat('other'));

    expect(scope.keep(kept)).toBe(kept);
    scope.dispose();

    expect(kept.deleted).toBe(false);
    expect(other.deleted).toBe(true);
  });

  it('release() deletes immediately and only once', () => {
    const scope = new CvScope();
    const m = scope.track(new FakeMat());

    scope.release(m);
    scope.dispose();

    expect(m.deleteCalls).toBe(1);
  });

  it('refuses tracking after dispose', () => {
    const scope = new CvScope();
    scope.dispose();
    expect(() => scope.track(new FakeMat())).toThrow();
  });
});

describe('safeDelete', () => {
  it('ignores null, undefined and already deleted objects', () => {
    const m = new FakeMat();
    m.delete();
    expect(() => safeDelete(m)).not.toThrow();
    expect(() => safeDelete(undefined)).not.toThrow();
    expect(() => safeDelete(null)).not.toThrow();
    expect(m.deleteCalls).toBe(1);
  });

  it('never propagates an error thrown by delete()', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const broken: CvDeletable = {
      delete() {
        throw new Error('boom');
      },
    };
    expect(() => safeDelete(broken)).not.toThrow();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('withCvScope', () => {
  it('releases tracked objects and returns the callback result', () => {
    let m: FakeMat | undefined;
    const result = withCvScope(scope => {
      m = scope.track(new FakeMat());
      return 42;
    });
    expect(result).toBe(42);
    expect(m!.deleted).toBe(true);
  });

  it('releases tracked objects when the callback throws', () => {
    let m: FakeMat | undefined;
    expect(() =>
      withCvScope(scope => {
        m = scope.track(new FakeMat());
        throw new Error('OpenCV failure');
      }),
    ).toThrow('OpenCV failure');
    expect(m!.deleted).toBe(true);
  });

  it('keeps the returned object alive when keep() is used', () => {
    const tmp = new FakeMat('tmp');
    const out = withCvScope(scope => {
      scope.track(tmp);
      return scope.keep(scope.track(new FakeMat('out')));
    });
    expect(out.deleted).toBe(false);
    expect(tmp.deleted).toBe(true);
  });

  it('rejects asynchronous callbacks', () => {
    expect(() => withCvScope(() => Promise.resolve(1))).toThrow(/synchronous/);
  });
});

describe('withCvScopeAsync', () => {
  it('releases tracked objects after the promise resolves', async () => {
    let m: FakeMat | undefined;
    const result = await withCvScopeAsync(async scope => {
      m = scope.track(new FakeMat());
      await Promise.resolve();
      expect(m.deleted).toBe(false);
      return 'ok';
    });
    expect(result).toBe('ok');
    expect(m!.deleted).toBe(true);
  });

  it('releases tracked objects after the promise rejects', async () => {
    let m: FakeMat | undefined;
    await expect(
      withCvScopeAsync(async scope => {
        m = scope.track(new FakeMat());
        await Promise.resolve();
        throw new Error('async failure');
      }),
    ).rejects.toThrow('async failure');
    expect(m!.deleted).toBe(true);
  });
});
