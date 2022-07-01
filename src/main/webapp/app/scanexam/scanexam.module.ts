import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesCoursComponent } from './mes-cours/mes-cours.component';
import { CreercoursComponent } from './creercours/creercours.component';
import { CoursdetailsComponent } from './coursdetail/coursdetails.component';
import { ImportStudentComponent } from './import-student/import-student.component';
import { ListstudentcourseComponent } from './liststudentcourse/liststudentcourse.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { BlockUIModule } from 'primeng/blockui';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { DockModule } from 'primeng/dock';
import { HotTableModule } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
import { SliderModule } from 'primeng/slider';
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
import { FormsModule } from '@angular/forms';
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
import { StatsExampleComponent } from './stats-example/stats-example.component';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

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

export const LISTESTUDENT_ROUTE: Route = {
  path: 'liststudents/:courseid',
  canActivate: [UserRouteAccessService],
  component: ListstudentcourseComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.liststudents',
  },
};

export const STATS_ROUTE: Route = {
  path: 'statistiques/:examid',
  canActivate: [UserRouteAccessService],
  component: StatsExamComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.stats',
  },
};

export const STATS_EXAMPLE_ROUTE: Route = {
  path: 'statexample',
  canActivate: [UserRouteAccessService],
  component: StatsExampleComponent,
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

export const ShowResults_ROUTE: Route = {
  path: 'showresults/:examid',
  canActivate: [UserRouteAccessService],
  component: ResultatStudentcourseComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.voircopie',
  },
};

@NgModule({
  declarations: [
    MesCoursComponent,
    CreercoursComponent,
    CoursdetailsComponent,
    ImportStudentComponent,
    ListstudentcourseComponent,
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
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    CardModule,
    ButtonModule,
    ChartModule,
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

    RouterModule.forChild([
      CREERCOURS_ROUTE,
      COURSMAIN_ROUTE,
      REGISTERSTUDENT_ROUTE,
      LISTESTUDENT_ROUTE,
      CREEREXAM_ROUTE,
      EXAMDETAIL_ROUTE,
      ANNOTATETEMPLATE_ROUTE,
      CHARGERSCAN_ROUTE,
      AssocierCopiesEtudiants_ROUTE,
      AlignerCopiesEtudiants_ROUTE,
      CorrigerCopiesEtudiantsToQuestion_ROUTE,
      CorrigerCopiesEtudiants_ROUTE,
      AssocierCopiesEtudiantsToStudent_ROUTE,
      VoirCopieEtudiants_ROUTE,
      ShowResults_ROUTE,
      STATS_ROUTE,
      STATS_EXAMPLE_ROUTE,
    ]),
  ],
  exports: [
    MesCoursComponent,
    CreercoursComponent,
    CoursdetailsComponent,
    ImportStudentComponent,
    ListstudentcourseComponent,
    CorrigequestionComponent,
    AssocierCopiesEtudiantsComponent,
    SortByDirective,
  ],
  providers: [EventHandlerService, FabricShapeService],
})
export class ScanexamModule {}
