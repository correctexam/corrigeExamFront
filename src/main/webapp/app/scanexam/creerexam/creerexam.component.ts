import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faDownload, faLink } from '@fortawesome/free-solid-svg-icons';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { Exam } from 'app/entities/exam/exam.model';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CourseService } from '../../entities/course/service/course.service';
import { ExamService } from '../../entities/exam/service/exam.service';
import { TemplateService } from '../../entities/template/service/template.service';
import { ITemplate, Template } from '../../entities/template/template.model';
import { HttpResponse } from '@angular/common/http';
import { TranslateDirective, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'jhi-creerexam',
  templateUrl: './creerexam.component.html',
  styleUrls: ['./creerexam.component.scss'],
  providers: [MessageService, ConfirmationService],
  standalone: true,
  imports: [
    ToastModule,
    BlockUIModule,
    ProgressSpinnerModule,
    TranslateDirective,
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgxExtendedPdfViewerModule,
  ],
})
export class CreerexamComponent implements OnInit, AfterViewInit {
  blocked = false;
  courseid: string | undefined = undefined;
  isSaving = false;
  coursName = '';
  faDownload = faDownload;
  faLink = faLink;
  editForm: UntypedFormGroup;
  errorParsingPdf = false;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public confirmationService: ConfirmationService,
    private fb: UntypedFormBuilder,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected courseService: CourseService,
    protected examService: ExamService,
    protected templateService: TemplateService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
    private titleService: Title,
  ) {
    this.editForm = this.fb.group({
      name: [null, [Validators.required]],
      content: [],
      contentContentType: [null, [Validators.required]],
      mark: [true],
      caseBoxName: [true],
      autoMapStudentCopyToList: [true],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('courseid');
      if (id !== null) {
        this.courseid = id;
        this.courseService.find(+this.courseid).subscribe(c => {
          this.coursName = c.body?.name ?? '';
          this.updateTitle();
          this.translateService.onLangChange.subscribe(() => {
            this.updateTitle();
          });
        });
      }
    });
  }

  updateTitle(): void {
    this.activatedRoute.data.subscribe(data => {
      this.translateService.get(data['pageTitle'], { courseName: this.coursName }).subscribe(e1 => {
        this.titleService.setTitle(e1);
      });
    });
  }

  ngAfterViewInit(): void {
    // Forcing the message explaining the name of required.
    this.editForm.markAllAsTouched();
  }

  gotoUE(): void {
    if (this.courseid !== undefined) {
      this.router.navigateByUrl(`/course/${this.courseid}`);
    }
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) => {
        this.eventManager.broadcast(new EventWithContent<AlertError>('gradeScopeIsticApp.error', { ...err, key: 'error.file.' + err.key }));
      },
    });
  }

  save(): void {
    this.isSaving = true;
    const template = new Template();
    template.name = `${String(this.editForm.get(['name'])!.value)}Template`;
    template.content = this.editForm.get(['content'])!.value;
    template.contentContentType = this.editForm.get(['contentContentType'])!.value;
    template.mark = this.editForm.get(['mark'])!.value;
    template.autoMapStudentCopyToList = true;
    template.caseboxname = this.editForm.get(['caseBoxName'])!.value ? this.editForm.get(['caseBoxName'])!.value : true;

    this.templateService.create(template).subscribe({
      next: (res: HttpResponse<ITemplate>) => {
        const exam = new Exam();
        exam.name = this.editForm.get(['name'])!.value;
        exam.templateId = res.body?.id;
        exam.courseId = +this.courseid!;
        exam.nbgrader = false;
        this.examService.create(exam).subscribe({
          next: () => {
            this.isSaving = false;
            this.gotoUE();
          },
          error: () => {
            this.isSaving = false;
          },
        });
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }

  downloadTemplateWord(): void {
    window.open('content/templateWord.docx', '_blank');
  }

  downloadTemplateOdt(): void {
    window.open('content/templateExample.odt', '_blank');
  }

  downloadTemplateLatex(): void {
    window.open('https://github.com/correctexam/latextemplate/releases/', '_blank');
  }

  public onPdfError(): void {
    this.errorParsingPdf = true;
    this.editForm.patchValue({ content: null });
    this.editForm.patchValue({ contentContentType: null });
    // Certainly because of async, have to force the update to render the previous changes
    this.ref.detectChanges();
  }

  public onPdfLoaded(): void {
    this.errorParsingPdf = false;
  }

  gotToAsciiDoc(): void {
    window.open('https://correctexam.github.io/asciidoclive2pdf/', '_blank');
  }

  gotToMd(): void {
    window.open('https://correctexam.github.io//hackmd.io2pdf/', '_blank');
  }
}
