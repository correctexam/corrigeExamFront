import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/fr';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import dayjs from 'dayjs';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';

// jhipster-needle-angular-add-module-import JHipster will add new module here
import { fontAwesomeIcons } from './config/font-awesome-icons';

@NgModule(/* TODO(standalone-migration): clean up removed NgModule class manually.
{
  imports: [
    BrowserModule,
    KeyboardShortcutsModule.forRoot(),
    //    DynamicDialogModule,
    HomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
    TranslationModule,
],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
    FocusViewService,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
} */)
export class AppModule {
  constructor(applicationConfigService: ApplicationConfigService, iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    applicationConfigService.setFrontUrl(FRONT_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...(fontAwesomeIcons as any[]));
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }
}
