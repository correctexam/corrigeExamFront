/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

export interface IKeyBoardShortCutPreference {
  shortcuts: Map<string, IKeyBoardShortCutPreferenceEntry[]>;
}

export interface IKeyBoardShortCutPreferenceEntry {
  key: string | string[];

  commentId: number;
  questionId: number;
  examId: number;
  label: string;
  textComment: boolean;
  questionIndex: number;

  /**
   * Description for the command can be used for rendering help menu.
   */
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class KeyboardShortcutService {
  constructor(public localStorageService: LocalStorageService) {}

  getShortCutPreference(): IKeyBoardShortCutPreference {
    const spref: string | null = this.localStorageService.retrieve('keyboardshortcuts');
    if (spref === null) {
      const defaultvalue: IKeyBoardShortCutPreference = {
        shortcuts: new Map(),
      };
      this.localStorageService.store('keyboardshortcuts', JSON.stringify(defaultvalue, this.replacer));
      return defaultvalue;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(spref, this.reviver);
    }
  }

  save(pref: IKeyBoardShortCutPreference): void {
    this.localStorageService.store('keyboardshortcuts', JSON.stringify(pref, this.replacer));
  }

  clearToDefault(): IKeyBoardShortCutPreference {
    const defaultvalue = {
      shortcuts: new Map(),
    };
    this.localStorageService.store('keyboardshortcuts', JSON.stringify(defaultvalue, this.replacer));
    return defaultvalue;
  }

  replacer(key: any, value: any): any {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }
  reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }
}
