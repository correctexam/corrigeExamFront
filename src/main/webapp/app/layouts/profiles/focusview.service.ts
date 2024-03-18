import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FocusViewService {
  private focusView = new Subject<boolean>();
  constructor() {}

  registerFocusView(): Observable<boolean> {
    return this.focusView;
  }

  updateFocusView(b: boolean): void {
    this.focusView.next(b);
  }
}
