import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesCoursComponent } from './mes-cours/mes-cours.component';
import { CreercoursComponent } from './creercours/creercours.component';
import { CoursdetailsComponent } from './coursdetail/coursdetails.component';
import { ImportStudentComponent } from './import-student/import-student.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { BlockUIModule } from 'primeng/blockui';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { DockModule } from 'primeng/dock';
import { HotTableModule } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
import { SliderModule } from 'primeng/slider';
import { KeyFilterModule } from 'primeng/keyfilter';

import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { CreerexamComponent } from './creerexam/creerexam.component';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';
import { AnnotateTemplateComponent } from './annotate-template/annotate-template.component';
import { PaintComponent } from './annotate-template/paint/paint.component';
import { GraphicalToolbarComponent } from './annotate-template/paint/toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventHandlerService } from './annotate-template/paint/event-handler.service';
import { FabricShapeService } from './annotate-template/paint/shape.service';
import { ColourPaletteComponent } from './annotate-template/paint/toolbar/colour-palette/colour-palette.component';
import { FabricCanvasComponent } from './annotate-template/paint/fabric-canvas/fabric-canvas.component';
import { ThicknessSliderComponent } from './annotate-template/paint/toolbar/thickness-slider/thickness-slider.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { QuestionpropertiesviewComponent } from './annotate-template/paint/questionpropertiesview/questionpropertiesview.component';
import { ChargerscanComponent } from './chargerscan/chargerscan.component';
import { AssocierCopiesEtudiantsComponent } from './associer-copies-etudiants/associer-copies-etudiants.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AlignScanComponent } from './alignscan/alignscan.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { OrderListModule } from 'primeng/orderlist';
import { ListboxModule } from 'primeng/listbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CorrigequestionComponent } from './corrigequestion/corrigequestion.component';
import { RatingModule } from 'primeng/rating';
import { GraphicalToolbarCorrectionComponent } from './corrigequestion/toolbar/toolbar.component';
import { InplaceModule } from 'primeng/inplace';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ArraySortPipe } from './sort';
import { SortByDirective } from '../shared/sort/sort-by.directive';
import { VoirCopieComponent } from './voircopie/voircopie.component';
import { ResultatStudentcourseComponent } from './resultatstudentcourse/resultatstudentcourse.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { GalleriaModule } from 'primeng/galleria';
import { StatsExamComponent } from './statsexam/statsexam.component';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { VoirReponseComponent } from './voirreponse/voirreponse.component';
import { VoirReponsesStarUnstarComponent } from './voirreponsesstarunstarexam/voirreponsesstarunstarexam.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SharecourseComponent } from './sharecourse/sharecourse.component';
import { PickListModule } from 'primeng/picklist';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressBarModule } from 'primeng/progressbar';
import { PreferencePageComponent } from './preference-page/preference-page.component';
import { PartialAlignModalComponent } from './alignscan/partial-align-modal/partial-align-modal.component';
import { MarkingSummaryComponent } from './marking-summary/marking-summary.component';
import { TabViewModule } from 'primeng/tabview';
import { SummaryTemplateComponent } from './annotate-template/summary/summary-template.component';
import { ComparestudentanswerComponent } from './comparestudentanswer/comparestudentanswer.component';
import { SidebarModule } from 'primeng/sidebar';
// set the location of the OpenCV files
registerAllModules();

export const COURSMAIN_ROUTE: Route = {
  path: 'course/:courseid',
  component: CoursdetailsComponent,
  canActivate: [UserRouteAccessService],
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.coursmain',
  },
};

export const CREERCOURS_ROUTE: Route = {
  path: 'creercours',
  canActivate: [UserRouteAccessService],
  component: CreercoursComponent,
  data: {
    pageTitle: 'home.creercours',
  },
};

export const REGISTERSTUDENT_ROUTE: Route = {
  path: 'registerstudents/:courseid',
  canActivate: [UserRouteAccessService],
  component: ImportStudentComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.registerstudents',
  },
};

export const STATS_ROUTE: Route = {
  path: 'statistics/:examid',
  canActivate: [UserRouteAccessService],
  component: StatsExamComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.stats',
  },
};

export const CREEREXAM_ROUTE: Route = {
  path: 'creerexam/:courseid',
  canActivate: [UserRouteAccessService],
  component: CreerexamComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.creerexam',
  },
};

export const CHARGERSCAN_ROUTE: Route = {
  path: 'loadscan/:examid',
  canActivate: [UserRouteAccessService],
  component: ChargerscanComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.loadscan',
  },
};

export const EXAMDETAIL_ROUTE: Route = {
  path: 'exam/:examid',
  canActivate: [UserRouteAccessService],
  component: ExamDetailComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.exam',
  },
};

export const ANNOTATETEMPLATE_ROUTE: Route = {
  path: 'exam/annotate/:examid',
  canActivate: [UserRouteAccessService],
  component: AnnotateTemplateComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.annotate',
  },
};

export const AlignerCopiesEtudiants_ROUTE: Route = {
  path: 'imagealign/:examid',
  canActivate: [UserRouteAccessService],
  component: AlignScanComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.imagealign',
  },
};

export const AssocierCopiesEtudiants_ROUTE: Route = {
  path: 'studentbindings/:examid',
  canActivate: [UserRouteAccessService],
  component: AssocierCopiesEtudiantsComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.studentbindings',
  },
};

export const MarkingSummary_ROUTE: Route = {
  path: 'marking-summary/:examid',
  canActivate: [UserRouteAccessService],
  component: MarkingSummaryComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.answer',
  },
};

export const AssocierCopiesEtudiantsToStudent_ROUTE: Route = {
  path: 'studentbindings/:examid/:currentStudent',
  canActivate: [UserRouteAccessService],
  component: AssocierCopiesEtudiantsComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.studentbindings',
  },
};

export const CorrigerCopiesEtudiantsToQuestion_ROUTE: Route = {
  path: 'answer/:examid/:questionno/:studentid',
  canActivate: [UserRouteAccessService],
  component: CorrigequestionComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.answer',
  },
};

export const CorrigerCopiesEtudiants_ROUTE: Route = {
  path: 'answer/:examid',
  canActivate: [UserRouteAccessService],
  component: CorrigequestionComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.answer',
  },
};

export const VoirCopieEtudiants_ROUTE: Route = {
  path: 'copie/:uuid/:questionno',
  component: VoirCopieComponent,
  data: {
    pageTitle: 'home.voircopie',
  },
};

export const VoirReponseEtudiants_ROUTE: Route = {
  path: 'reponse/:base64uuid',
  component: VoirReponseComponent,
  data: {
    pageTitle: 'home.voirreponse',
  },
};

export const VoirReponsesstarunstar_ROUTE: Route = {
  path: 'voirreponsesstarunstar/:examId',
  component: VoirReponsesStarUnstarComponent,
  data: {
    pageTitle: 'home.voirreponsesstarunstar',
  },
};

export const ShowResults_ROUTE: Route = {
  path: 'showresults/:examid',
  canActivate: [UserRouteAccessService],
  component: ResultatStudentcourseComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.voircopie',
  },
};

export const CompareTextCommentAnswer_ROUTE: Route = {
  path: 'comparetextcomment/:examid/:commentid',
  canActivate: [UserRouteAccessService],
  component: ComparestudentanswerComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'scanexam.comparecopie',
  },
};
export const CompareGradedCommentAnswer_ROUTE: Route = {
  path: 'comparegradedcomment/:examid/:commentid',
  canActivate: [UserRouteAccessService],
  component: ComparestudentanswerComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'scanexam.comparecopie',
  },
};

export const CompareMarkAnswer_ROUTE: Route = {
  path: 'comparemark/:examid/:respid',
  canActivate: [UserRouteAccessService],
  component: ComparestudentanswerComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'scanexam.comparecopie',
  },
};

@NgModule({
  declarations: [
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
    ArraySortPipe,
    StatsExamComponent,
    VoirReponseComponent,
    VoirReponsesStarUnstarComponent,
    SharecourseComponent,
    PreferencePageComponent,
    PartialAlignModalComponent,
    MarkingSummaryComponent,
    SummaryTemplateComponent,
    ComparestudentanswerComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    CardModule,
    ButtonModule,
    ChartModule,
    KnobModule,
    DropdownModule,
    ToggleButtonModule,
    SharedModule,
    FontAwesomeModule,
    BlockUIModule,
    MenuModule,
    DockModule,
    TooltipModule,
    ToastModule,
    SliderModule,
    HotTableModule,
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
    DialogModule,
    InplaceModule,
    InputTextModule,
    GalleriaModule,
    DynamicDialogModule,
    PickListModule,
    KeyFilterModule,
    MessagesModule,
    MessageModule,
    OverlayPanelModule,
    SidebarModule,
    ProgressBarModule,
    RouterModule.forChild([
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
    ]),
    TabViewModule,
  ],
  exports: [
    MesCoursComponent,
    CreercoursComponent,
    CoursdetailsComponent,
    ImportStudentComponent,
    CorrigequestionComponent,
    AssocierCopiesEtudiantsComponent,
    SortByDirective,
  ],
  providers: [EventHandlerService, FabricShapeService],
})
export class ScanexamModule {}
