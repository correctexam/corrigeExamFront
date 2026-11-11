# Contributing to the CorrectExam front-end

## RxJS subscriptions and signals

Angular does not unsubscribe for us. A subscription to an observable that never completes keeps the
component alive (and all its data: scans, images, caches) after navigation, and keeps running its callback.

| Source                                                                                                                                               | Completes by itself?                            | What to do                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------- |
| `HttpClient` calls, `firstValueFrom(...)`, `translateService.get(...)`                                                                               | yes (one value)                                 | nothing                                                                           |
| `ActivatedRoute` observables (`paramMap`, `data`...)                                                                                                 | cleaned up by Angular with the routed component | nothing                                                                           |
| Application-wide streams: `translateService.onLangChange`, `accountService.getAuthenticationState()`, `router.events`, services exposing a `Subject` | **no**                                          | `takeUntilDestroyed`                                                              |
| `FormControl.valueChanges` of a control owned by the component                                                                                       | with the component                              | `takeUntilDestroyed` when the subscription is (re)created outside the constructor |
| Web Workers / `EventSource`                                                                                                                          | **no**                                          | close them on completion and in the teardown of the observable                    |

```ts
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MyComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // outside the constructor, pass the DestroyRef explicitly
    this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateTitle());
  }
}
```

Rules:

- Subscribe to a long-lived stream **once** (in the constructor or `ngOnInit`), never inside a callback that
  runs again (`paramMap` subscription, a method called on each user action...): each call would add one more
  subscription.
- If a subscription must be recreated, keep it in a field and `unsubscribe()` the previous one first.
- Do **not** add `takeUntilDestroyed` to HTTP calls that must finish after navigation (saves): it would cancel them.
- New state shared with the template uses `signal` / `computed`; use `toSignal(...)` to expose an observable to the
  template instead of subscribing manually.

## OpenCV.js memory

Every OpenCV.js object lives in the WebAssembly heap and must be deleted, including on errors: use `withCvScope` /
`CvScope` from `app/shared/opencv/cv-scope.ts` (see `.cursorrules`).

## Commits and pull requests

- Commits: `type(scope): description` (feat, fix, docs, refactor, test, chore), imperative, max 72 characters.
- One branch and one pull request per feature, named after the GitHub issue: `feat/<issue>-short-description`.
- Before pushing: `npm run lint`, `npm run prettier:check`, `npm test`.
