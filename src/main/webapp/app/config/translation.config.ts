import { HttpClient } from '@angular/common/http';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const translationNotFoundMessage = 'translation-not-found';

export class MissingTranslationHandlerImpl implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    const key = params.key;
    return `${translationNotFoundMessage}[${key}]`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function translatePartialLoader(http: HttpClient): TranslateLoader {
  // return new TranslateHttpLoader(http, 'i18n/', `.json?_=${I18N_HASH}`);
  const t = new TranslateHttpLoader();

  return t;
}

export function missingTranslationHandler(): MissingTranslationHandler {
  return new MissingTranslationHandlerImpl();
}
