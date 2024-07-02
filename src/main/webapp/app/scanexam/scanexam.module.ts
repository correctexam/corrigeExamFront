import { CreercoursComponent } from './creercours/creercours.component';
import { CoursdetailsComponent } from './coursdetail/coursdetails.component';
import { ImportStudentComponent } from './import-student/import-student.component';

import { Route } from '@angular/router';
import { CreerexamComponent } from './creerexam/creerexam.component';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';
import { AnnotateTemplateComponent } from './annotate-template/annotate-template.component';
import { ChargerscanComponent } from './chargerscan/chargerscan.component';
import { AssocierCopiesEtudiantsComponent } from './associer-copies-etudiants/associer-copies-etudiants.component';
import { AlignScanComponent } from './alignscan/alignscan.component';
import { CorrigequestionComponent } from './corrigequestion/corrigequestion.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VoirCopieComponent } from './voircopie/voircopie.component';
import { ResultatStudentcourseComponent } from './resultatstudentcourse/resultatstudentcourse.component';
import { StatsExamComponent } from './statsexam/statsexam.component';
import { VoirReponseComponent } from './voirreponse/voirreponse.component';
import { VoirReponsesStarUnstarComponent } from './voirreponsesstarunstarexam/voirreponsesstarunstarexam.component';
import { MarkingSummaryComponent } from './marking-summary/marking-summary.component';
import { ComparestudentanswerComponent } from './comparestudentanswer/comparestudentanswer.component';

import { ExportanonymoupdfComponent } from './exportanonymoupdf/exportanonymoupdf.component';

// set the location of the OpenCV files
// registerAllModules();

export const COURSMAIN_ROUTE: Route = {
  path: 'course/:courseid',
  component: CoursdetailsComponent,
  canActivate: [UserRouteAccessService],
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.coursmain',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-1-create-your-course-and-exam-this-includes-creating-your-exam-using-a-word-processor-word-google-doc-libreoffice-or-latex',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-1-creer-son-cours-et-son-examen-cela-comprend-fabriquer-l-enonce-de-son-examen-a-l-aide-d-un-traitement-de-texte-word-google-doc-libreoffice-ou-de-latex',
    },
  },
};

export const CREERCOURS_ROUTE: Route = {
  path: 'creercours',
  canActivate: [UserRouteAccessService],
  component: CreercoursComponent,
  data: {
    pageTitle: 'home.creercours',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-1-create-your-course-and-exam-this-includes-creating-your-exam-using-a-word-processor-word-google-doc-libreoffice-or-latex',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-1-creer-son-cours-et-son-examen-cela-comprend-fabriquer-l-enonce-de-son-examen-a-l-aide-d-un-traitement-de-texte-word-google-doc-libreoffice-ou-de-latex',
    },
  },
};

export const REGISTERSTUDENT_ROUTE: Route = {
  path: 'registerstudents/:courseid',
  canActivate: [UserRouteAccessService],
  component: ImportStudentComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.registerstudents',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-1-create-your-course-and-exam-this-includes-creating-your-exam-using-a-word-processor-word-google-doc-libreoffice-or-latex',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-1-creer-son-cours-et-son-examen-cela-comprend-fabriquer-l-enonce-de-son-examen-a-l-aide-d-un-traitement-de-texte-word-google-doc-libreoffice-ou-de-latex',
    },
  },
};

export const STATS_ROUTE: Route = {
  path: 'statistics/:examid',
  canActivate: [UserRouteAccessService],
  component: StatsExamComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.stats',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-7-view-the-statistics-associated-with-passing-the-exam-to-potentially-adjust-the-grading-slightly',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-7-regarder-les-statistiques-associees-a-la-reussite-a-l-examen-pour-potentiellement-ajuster-un-peu-le-bareme',
    },
  },
};

export const EXPORTPDF_ROUTE: Route = {
  path: 'exportpdf/:examid',
  canActivate: [UserRouteAccessService],
  component: ExportanonymoupdfComponent,
  data: {
    authorities: ['ROLE_USER'],
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-7-view-the-statistics-associated-with-passing-the-exam-to-potentially-adjust-the-grading-slightly',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-7-regarder-les-statistiques-associees-a-la-reussite-a-l-examen-pour-potentiellement-ajuster-un-peu-le-bareme',
    },
  },
};

export const EXPORTPDFBYSHEET_ROUTE: Route = {
  path: 'exportpdf/:examid/:sheetuid',
  //  canActivate: [UserRouteAccessService],
  component: ExportanonymoupdfComponent,
  data: {
    authorities: ['ROLE_USER'],
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-7-view-the-statistics-associated-with-passing-the-exam-to-potentially-adjust-the-grading-slightly',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-7-regarder-les-statistiques-associees-a-la-reussite-a-l-examen-pour-potentiellement-ajuster-un-peu-le-bareme',
    },
  },
};

export const CREEREXAM_ROUTE: Route = {
  path: 'creerexam/:courseid',
  canActivate: [UserRouteAccessService],
  component: CreerexamComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.creerexam',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-1-create-your-course-and-exam-this-includes-creating-your-exam-using-a-word-processor-word-google-doc-libreoffice-or-latex',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-1-creer-son-cours-et-son-examen-cela-comprend-fabriquer-l-enonce-de-son-examen-a-l-aide-d-un-traitement-de-texte-word-google-doc-libreoffice-ou-de-latex',
    },
  },
};

export const CHARGERSCAN_ROUTE: Route = {
  path: 'loadscan/:examid',
  canActivate: [UserRouteAccessService],
  component: ChargerscanComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.loadscan',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-3-load-scans-of-correctly-ordered-exam-papers',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-3-charger-les-scans-des-copies-des-examens-correctement-ordonnes',
    },
  },
};

export const EXAMDETAIL_ROUTE: Route = {
  path: 'exam/:examid',
  canActivate: [UserRouteAccessService],
  component: ExamDetailComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.exam',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-1-create-your-course-and-exam-this-includes-creating-your-exam-using-a-word-processor-word-google-doc-libreoffice-or-latex',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-1-creer-son-cours-et-son-examen-cela-comprend-fabriquer-l-enonce-de-son-examen-a-l-aide-d-un-traitement-de-texte-word-google-doc-libreoffice-ou-de-latex',
    },
  },
};

export const ANNOTATETEMPLATE_ROUTE: Route = {
  path: 'exam/annotate/:examid',
  canActivate: [UserRouteAccessService],
  component: AnnotateTemplateComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.annotate',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-2-create-your-grading-scale-how-each-question-will-be-graded-typical-comments-per-question-etc',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-2-creer-son-bareme-de-correction-la-facon-dont-chaque-question-sera-evaluee-ses-commentaires-types-par-question',
    },
  },
};

export const AlignerCopiesEtudiants_ROUTE: Route = {
  path: 'imagealign/:examid',
  canActivate: [UserRouteAccessService],
  component: AlignScanComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.imagealign',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-4-straighten-your-scans',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-4-redresser-ses-scans',
    },
  },
};

export const AssocierCopiesEtudiants_ROUTE: Route = {
  path: 'studentbindings/:examid',
  canActivate: [UserRouteAccessService],
  component: AssocierCopiesEtudiantsComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.studentbindings',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-5-associate-each-copy-with-a-student-ai-assisted',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-5-associer-chaque-copie-avec-un-etudiant-assistee-a-l-aide-de-l-ia',
    },
  },
};

export const MarkingSummary_ROUTE: Route = {
  path: 'marking-summary/:examid',
  canActivate: [UserRouteAccessService],
  component: MarkingSummaryComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.answer',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-6-correct-copies-question-by-question-or-student-by-student-or-any-other-combination',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-6-corriger-ses-copies-question-par-question-ou-etudiant-par-etudiant-ou-tout-autre-combinaison',
    },
  },
};

export const AssocierCopiesEtudiantsToStudent_ROUTE: Route = {
  path: 'studentbindings/:examid/:currentStudent',
  canActivate: [UserRouteAccessService],
  component: AssocierCopiesEtudiantsComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.studentbindings',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-5-associate-each-copy-with-a-student-ai-assisted',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-5-associer-chaque-copie-avec-un-etudiant-assistee-a-l-aide-de-l-ia',
    },
  },
};

export const CorrigerCopiesEtudiantsToQuestion_ROUTE: Route = {
  path: 'answer/:examid/:questionno/:studentid',
  canActivate: [UserRouteAccessService],
  component: CorrigequestionComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.answer',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-6-correct-copies-question-by-question-or-student-by-student-or-any-other-combination',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-6-corriger-ses-copies-question-par-question-ou-etudiant-par-etudiant-ou-tout-autre-combinaison',
    },
  },
};

export const CorrigerCopiesEtudiants_ROUTE: Route = {
  path: 'answer/:examid',
  canActivate: [UserRouteAccessService],
  component: CorrigequestionComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.answer',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-6-correct-copies-question-by-question-or-student-by-student-or-any-other-combination',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-6-corriger-ses-copies-question-par-question-ou-etudiant-par-etudiant-ou-tout-autre-combinaison',
    },
  },
};

export const VoirCopieEtudiants_ROUTE: Route = {
  path: 'copie/:uuid/:questionno',
  component: VoirCopieComponent,
  data: {
    pageTitle: 'home.voircopie',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html',
    },
  },
};

export const VoirReponseEtudiants_ROUTE: Route = {
  path: 'reponse/:base64uuid',
  component: VoirReponseComponent,
  data: {
    pageTitle: 'home.voirreponse',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html',
    },
  },
};

export const VoirReponsesstarunstar_ROUTE: Route = {
  path: 'voirreponsesstarunstar/:examId',
  component: VoirReponsesStarUnstarComponent,
  data: {
    pageTitle: 'home.voirreponsesstarunstar',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-7-view-the-statistics-associated-with-passing-the-exam-to-potentially-adjust-the-grading-slightly',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-7-regarder-les-statistiques-associees-a-la-reussite-a-l-examen-pour-potentiellement-ajuster-un-peu-le-bareme',
    },
  },
};

export const ShowResults_ROUTE: Route = {
  path: 'showresults/:examid',
  canActivate: [UserRouteAccessService],
  component: ResultatStudentcourseComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.voirresultat',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-8-sending-feedback-to-students',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-8-envoyer-le-retour-aux-etudiants',
    },
  },
};

export const CompareTextCommentAnswer_ROUTE: Route = {
  path: 'comparetextcomment/:examid/:commentid',
  canActivate: [UserRouteAccessService],
  component: ComparestudentanswerComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'scanexam.comparecopie',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-6-correct-copies-question-by-question-or-student-by-student-or-any-other-combination',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-6-corriger-ses-copies-question-par-question-ou-etudiant-par-etudiant-ou-tout-autre-combinaison',
    },
  },
};
export const CompareGradedCommentAnswer_ROUTE: Route = {
  path: 'comparegradedcomment/:examid/:commentid',
  canActivate: [UserRouteAccessService],
  component: ComparestudentanswerComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'scanexam.comparecopie',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-6-correct-copies-question-by-question-or-student-by-student-or-any-other-combination',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-6-corriger-ses-copies-question-par-question-ou-etudiant-par-etudiant-ou-tout-autre-combinaison',
    },
  },
};

export const CompareHybridCommentAnswer_ROUTE: Route = {
  path: 'comparehybridcomment/:examid/:commentid/:stepValue',
  canActivate: [UserRouteAccessService],
  component: ComparestudentanswerComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'scanexam.comparecopie',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-6-correct-copies-question-by-question-or-student-by-student-or-any-other-combination',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-6-corriger-ses-copies-question-par-question-ou-etudiant-par-etudiant-ou-tout-autre-combinaison',
    },
  },
};

export const CompareMarkAnswer_ROUTE: Route = {
  path: 'comparemark/:examid/:respid',
  canActivate: [UserRouteAccessService],
  component: ComparestudentanswerComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'scanexam.comparecopie',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-6-correct-copies-question-by-question-or-student-by-student-or-any-other-combination',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-6-corriger-ses-copies-question-par-question-ou-etudiant-par-etudiant-ou-tout-autre-combinaison',
    },
  },
};

export const CompareAnswer_ROUTE: Route = {
  path: 'compareanswer/:examid/:qid',
  canActivate: [UserRouteAccessService],
  component: ComparestudentanswerComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'scanexam.comparecopie',
    documentation: {
      en: 'https://correctexam.readthedocs.io/en/latest/user.html#step-6-correct-copies-question-by-question-or-student-by-student-or-any-other-combination',
      fr: 'https://correctexam.readthedocs.io/fr/latest/user.html#etape-6-corriger-ses-copies-question-par-question-ou-etudiant-par-etudiant-ou-tout-autre-combinaison',
    },
  },
};

export const SCANEXAM_ROUTES = [
  CREERCOURS_ROUTE,
  COURSMAIN_ROUTE,
  REGISTERSTUDENT_ROUTE,
  CREEREXAM_ROUTE,
  EXAMDETAIL_ROUTE,
  ANNOTATETEMPLATE_ROUTE,
  CHARGERSCAN_ROUTE,
  AssocierCopiesEtudiants_ROUTE,
  AlignerCopiesEtudiants_ROUTE,
  CorrigerCopiesEtudiantsToQuestion_ROUTE,
  CorrigerCopiesEtudiants_ROUTE,
  AssocierCopiesEtudiantsToStudent_ROUTE,
  MarkingSummary_ROUTE,
  VoirCopieEtudiants_ROUTE,
  ShowResults_ROUTE,
  STATS_ROUTE,
  VoirReponseEtudiants_ROUTE,
  VoirReponsesstarunstar_ROUTE,
  CompareTextCommentAnswer_ROUTE,
  CompareGradedCommentAnswer_ROUTE,
  CompareMarkAnswer_ROUTE,
  CompareAnswer_ROUTE,
  EXPORTPDF_ROUTE,
  EXPORTPDFBYSHEET_ROUTE,
  CompareHybridCommentAnswer_ROUTE,
];
/*
@NgModule({
    imports: [
    CommonModule,
    BrowserAnimationsModule,
    CardModule,
    ButtonModule,
    ChartModule,
    KnobModule,
    DropdownModule,
    ToggleButtonModule,
    FontAwesomeModule,
    BlockUIModule,
    MenuModule,
    DockModule,
    TooltipModule,
    ToastModule,
    SliderModule,
    TableModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    SelectButtonModule,
    InputNumberModule,
    PaginatorModule,
    OrderListModule,
    ListboxModule,
    InputSwitchModule,
    RatingModule,
    InputTextareaModule,
    SplitterModule,
    DialogModule,
    ProgressSpinnerModule,
    InplaceModule,
    InputTextModule,
    GalleriaModule,
    RadioButtonModule,
    DynamicDialogModule,
    FileUploadModule,
    PickListModule,
    KeyFilterModule,
    PlatformModule,
    MessagesModule,
    MessageModule,
    OverlayPanelModule,
    SidebarModule,
    DragDropModule,
    ProgressBarModule,
    CheckboxModule,
    KeyboardShortcutsModule.forRoot(),
    RouterModule.forChild(),
    TabViewModule,
    MesCoursComponent,
    CreercoursComponent,
    CoursdetailsComponent,
    ImportStudentComponent,
    CreerexamComponent,
    ExamDetailComponent,
    AnnotateTemplateComponent,
    PaintComponent,
    GraphicalToolbarComponent,
    ColourPaletteComponent,
    FabricCanvasComponent,
    ThicknessSliderComponent,
    QuestionpropertiesviewComponent,
    ChargerscanComponent,
    AssocierCopiesEtudiantsComponent,
    AlignScanComponent,
    CorrigequestionComponent,
    GraphicalToolbarCorrectionComponent,
    VoirCopieComponent,
    ResultatStudentcourseComponent,
    StatsExamComponent,
    VoirReponseComponent,
    VoirReponsesStarUnstarComponent,
    SharecourseComponent,
    PreferencePageComponent,
    PartialAlignModalComponent,
    MarkingSummaryComponent,
    SummaryTemplateComponent,
    ComparestudentanswerComponent,
    CreateCommentsComponent,
    ClickDoubleDirective,
    KeyboardshortcutComponent,
    ExportanonymoupdfComponent,
    ViewandreorderpagesComponent,
    AllbindingsComponent,
    ColourPaletteComponent,
    FontsizeSliderComponent,
    CommentSortPipe,
    ArraySortPipe,
    SwipeDirective,
    SortByDirective
],
    exports: [
        MesCoursComponent,
        CreercoursComponent,
        CoursdetailsComponent,
        ImportStudentComponent,
        CorrigequestionComponent,
        KeyboardshortcutComponent,
        AssocierCopiesEtudiantsComponent,
        SortByDirective,
        ClickDoubleDirective,
    ],
    providers: [EventHandlerService, FabricShapeService, DataUtils],
})
export class ScanexamModule {}
*/
