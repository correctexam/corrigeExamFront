import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faDownload, faLink } from '@fortawesome/free-solid-svg-icons';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CourseService } from '../../entities/course/service/course.service';
import { ExamService } from '../../entities/exam/service/exam.service';
import { TemplateService } from '../../entities/template/service/template.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateDirective } from '../../shared/language/translate.directive';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import * as cheerio from 'cheerio';
import html2canvas from 'html2canvas';
import * as unzipit from 'unzipit';
import { v4 as uuidv4 } from 'uuid';

unzipit.setOptions({ workerURL: 'js/unzipit-worker.module.js' });

class Response {
  public element: any[] = [];
}

@Component({
  selector: 'jhi-creerexamnbgrader',
  templateUrl: './creerexamnbgrader.component.html',
  styleUrls: ['./creerexamnbgrader.component.scss'],
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
export class CreerexamComponentNbGrader implements OnInit, AfterViewInit {
  blocked = false;
  courseid: string | undefined = undefined;
  isSaving = false;
  coursName = '';
  faDownload = faDownload;
  faLink = faLink;
  editForm: UntypedFormGroup;
  errorParsingPdf = false;
  entries?: { [key: string]: unzipit.ZipEntry };

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

  async setFileData(event: Event, field: string, isImage: boolean): Promise<void> {
    const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;

    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      const { entries } = await unzipit.unzip(file);
      this.entries = entries;
      const htmlfiles: string[] = [];
      for (const s of Object.keys(entries)) {
        // console.error(s,    entries[s].size);
        const lastSegment = s.split('/').pop();
        if (
          lastSegment?.endsWith('.html') &&
          lastSegment !== 'index.html' &&
          lastSegment !== 'scores.html' &&
          !htmlfiles.includes(lastSegment)
        ) {
          htmlfiles.push(lastSegment);
        }
      }
      console.error(htmlfiles);
    }

    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) => {
        this.eventManager.broadcast(new EventWithContent<AlertError>('gradeScopeIsticApp.error', { ...err, key: 'error.file.' + err.key }));
      },
    });
  }

  async processFiles(filename: string): Promise<void> {
    for (const s of Object.keys(this.entries!)) {
      // console.error(s,    entries[s].size);
      const lastSegment = s.split('/').pop();
      if (lastSegment?.endsWith('.html') && lastSegment !== 'index.html' && lastSegment !== 'scores.html' && lastSegment === filename) {
        // TODO
        console.error('processFiles', s, lastSegment);
      }
    }
  }

  addIDToDiv($: cheerio.CheerioAPI): void {
    const divs = $('div');
    divs.each((e, el) => {
      if (el.attribs['id'] === undefined || el.attribs['id'] === '') {
        el.attribs['id'] = uuidv4();
      }
    });
  }

  async processFile(file: string, questionIndex: number, c: boolean): Promise<string> {
    // TODO load file
    const $ = await cheerio.load('');
    this.addIDToDiv($);

    const question = $('#toc').find('li').find('a');
    const nbrQuestion = question.length;
    if (questionIndex < 0 || questionIndex >= nbrQuestion) {
      return 'no score';
    }

    const anchors = question.map((e, el) => el.attribs['href'].substring(1)).toArray();

    const idsWithAnswer = $('div.cell a')
      .filter((e, el) => el.attribs['name'] !== undefined && anchors.includes(el.attribs['name']))
      .closest('div.cell')
      .map((e, el) => (el as any).attribs['id'])
      .toArray();

    const notbook = $('#notebook-container').find('div.cell');
    const responses: Response[] = [];
    let currentResponse: Response | undefined = undefined;
    for (const cell of notbook) {
      if (currentResponse === undefined) {
        currentResponse = new Response();
        responses.push(currentResponse);
      }

      currentResponse.element.push(cell.attribs['id']);

      if (idsWithAnswer.includes(cell.attribs['id'])) {
        currentResponse = undefined;
      }
    }

    const score = this.processSection(questionIndex, responses, $);

    $('#toc').closest('div.panel-heading').remove();

    document.getElementById('body')!.innerHTML = $.html();
    if (c) {
      html2canvas(document.getElementById('body')!).then(function (canvas) {
        document.getElementById('body')!.parentNode!.insertBefore(canvas, document.getElementById('body'));
        document.getElementById('body')!.remove();
      });
    }
    const note = score.substring(0, score.indexOf('/') - 1);
    const notemax = score.substring(score.indexOf('/') + 1);
    document.getElementById('snote')!.innerHTML = '' + note;
    document.getElementById('snotemax')!.innerHTML = '' + notemax;

    return score;
  }

  processSection(index: number, responses: Response[], $: cheerio.CheerioAPI): string {
    let res = '';
    responses.forEach((e, i) => {
      if (i === index) {
        e.element.forEach(e2 => {
          const e1 = $('[id="' + e2 + '"]').find('span.pull-right');
          if (e1.get().length > 0) {
            const e5 = e1.get()[0].children.filter(e4 => (e4 as any).data && (e4 as any).data.includes('Score'));
            if (e5.length > 0) {
              const start = (e5[0] as any).data.indexOf(': ');
              res = (e5[0] as any).data.substring(start + 1, (e5[0] as any).data.length);
            }
          }
        });
      } else {
        e.element.forEach(e2 => {
          const query = '[id="' + e2 + '"]';
          $(query).remove();
        });
      }
    });
    return res;
  }

  save(): void {
    this.isSaving = true;
    const template: any = {};
    template.name = `${String(this.editForm.get(['name'])!.value)}Template`;
    template.content = this.editForm.get(['content'])!.value;
  }
}
