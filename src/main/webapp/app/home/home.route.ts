import { Route } from '@angular/router';

import { HomeComponent } from './home.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    pageTitle: 'home.title',
    documentation: {
      anonymous: {
        en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-0-how-do-i-create-an-account-on-the-platform',
        fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-0-comment-creer-un-compte-sur-la-plateforme',
      },
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-1-create-your-course-and-exam-this-includes-creating-your-exam-using-a-word-processor-word-google-doc-libreoffice-or-latex',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-1-creer-son-cours-et-son-examen-cela-comprend-fabriquer-l-enonce-de-son-examen-a-l-aide-d-un-traitement-de-texte-word-google-doc-libreoffice-ou-de-latex',
    },
  },
};
