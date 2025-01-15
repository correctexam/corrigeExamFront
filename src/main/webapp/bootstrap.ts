import { LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';

import { DEBUG_INFO_ENABLED } from './app/app.constants';
import { MainComponent } from './app/layouts/main/main.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { BrowserModule, Title, bootstrapApplication } from '@angular/platform-browser';
import { provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig, withSessionStorage } from 'ngx-webstorage';
import { TranslationModule } from 'app/shared/language/translation.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateDayjsAdapter } from 'app/config/datepicker-adapter';
import { httpInterceptorProviders } from 'app/core/interceptor';
import { EventHandlerService } from 'app/scanexam/annotate-template/paint/event-handler.service';
import { DataUtils } from 'app/core/util/data-util.service';
import { FabricShapeService } from 'app/scanexam/annotate-template/paint/shape.service';
import { provideRouter } from '@angular/router';
import { HOME_ROUTE } from 'app/home/home.route';
import { SCANEXAM_ROUTES } from 'app/scanexam/scanexam.route';
import { APP_ROUTES } from 'app/app-routing.module';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// import Aura from '@primeng/themes/aura';
// import Material from '@primeng/themes/material';
import Lara from '@primeng/themes/lara';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// disable debug data on prod profile to improve performance
if (!DEBUG_INFO_ENABLED) {
  enableProdMode();
}

bootstrapApplication(MainComponent, {
  providers: [
    provideAnimationsAsync(),

    provideNgxWebstorage(
      withNgxWebstorageConfig({ prefix: 'jhi', separator: '-', caseSensitive: true }),
      withLocalStorage(),
      withSessionStorage(),
    ),
    importProvidersFrom(
      BrowserModule,
      KeyboardShortcutsModule.forRoot(),
      //    DynamicDialogModule,
      TranslationModule,
      Title,
      // jhipster-needle-angular-add-module JHipster will add new module here

      // Set this to true to enable service worker (PWA)
      ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    ),
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
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

    providePrimeNG({
      theme: {
        preset: Lara,
      },
    }),
    importProvidersFrom([BrowserAnimationsModule]),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter([...HOME_ROUTE, ...SCANEXAM_ROUTES, ...APP_ROUTES]),
    /*

        , TranslationModule),
        Title,
        { provide: LOCALE_ID, useValue: 'fr' },
        { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
        httpInterceptorProviders,
        FocusViewService,*/
    //        provideHttpClient(withInterceptorsFromDi(),
  ],
})
  // eslint-disable-next-line no-console
  .then(() => console.log('Application started'))
  .catch(err => console.error(err));
