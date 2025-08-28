import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  LOCALE_ID,
  enableProdMode,
  importProvidersFrom,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { DEBUG_INFO_ENABLED } from './app/app.constants';
import { MainComponent } from './app/layouts/main/main.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { BrowserModule, Title, bootstrapApplication } from '@angular/platform-browser';
import { provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig, withSessionStorage } from 'ngx-webstorage';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateDayjsAdapter } from 'app/config/datepicker-adapter';
// import { httpInterceptorProviders } from 'app/core/interceptor';
import { EventHandlerService } from 'app/scanexam/annotate-template/paint/event-handler.service';
import { DataUtils } from 'app/core/util/data-util.service';
import { FabricShapeService } from 'app/scanexam/annotate-template/paint/shape.service';
import { provideRouter } from '@angular/router';
import { HOME_ROUTE } from 'app/home/home.route';
import { SCANEXAM_ROUTES } from 'app/scanexam/scanexam.route';
import { APP_ROUTES } from 'app/app-routing.module';
import { providePrimeNG } from 'primeng/config';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from 'app/core/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from 'app/core/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from 'app/core/interceptor/error-handler.interceptor';

// import Aura from '@primeng/themes/aura';
// import Material from '@primeng/themes/material';
import Lara from '@primeng/themes/lara';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

// disable debug data on prod profile to improve performance
if (!DEBUG_INFO_ENABLED) {
  enableProdMode();
}

bootstrapApplication(MainComponent, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: `.json?_=${I18N_HASH}` }),
      fallbackLang: 'en',
      lang: 'fr',
    }),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.use(translate.getBrowserLang() || 'en');
    }),

    provideNgxWebstorage(
      withNgxWebstorageConfig({ prefix: 'jhi', separator: '-', caseSensitive: true }),
      withLocalStorage(),
      withSessionStorage(),
    ),
    importProvidersFrom(
      BrowserModule,
      KeyboardShortcutsModule.forRoot(),
      //    DynamicDialogModule,
      Title,
      // jhipster-needle-angular-add-module JHipster will add new module here

      // Set this to true to enable service worker (PWA)
      ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    ),

    { provide: LOCALE_ID, useValue: 'fr' },

    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },

    {
      provide: EventHandlerService,
      useClass: EventHandlerService,
    },
    {
      provide: FabricShapeService,
      useClass: FabricShapeService,
    },
    {
      provide: DataUtils,
      useClass: DataUtils,
    },
    provideAnimations(),
    providePrimeNG({
      theme: {
        options: {
          // eslint-disable-next-line no-constant-binary-expression
          darkModeSelector: false || 'none',
        },
        preset: Lara,
      },
    }),

    provideRouter([...HOME_ROUTE, ...SCANEXAM_ROUTES, ...APP_ROUTES]),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    //  {
    //    provide: HTTP_INTERCEPTORS,
    //    useClass: NotificationInterceptor,
    //    multi: true,
    //  },
  ],
})
  // eslint-disable-next-line no-console
  .then(() => console.error('Application started'))
  .catch(err => console.error(err));
