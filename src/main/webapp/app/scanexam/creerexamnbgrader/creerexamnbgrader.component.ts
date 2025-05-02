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
import { NgFor, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateDirective } from '../../shared/language/translate.directive';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import * as cheerio from 'cheerio';
import html2canvas from 'html2canvas';
import * as unzipit from 'unzipit';
import { v4 as uuidv4 } from 'uuid';
import { SheetSelectionComponent } from './sheetselection/sheetselection.component';
import { DialogService } from 'primeng/dynamicdialog';
import { PreferenceService } from '../preference-page/preference.service';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { IExam } from 'app/entities/exam/exam.model';
import { firstValueFrom, filter } from 'rxjs';
import { Template } from 'app/entities/template/template.model';
import { map } from 'rxjs/operators';
import { all } from '@tensorflow/tfjs';

unzipit.setOptions({ workerURL: 'js/unzipit-worker.module.js' });

class Response {
  public element: any[] = [];
}

@Component({
  selector: 'jhi-creerexamnbgrader',
  templateUrl: './creerexamnbgrader.component.html',
  styleUrls: ['./creerexamnbgrader.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService],
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
    NgFor,
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

  fileToAnalyse: string[] = [];

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
    public dialogService: DialogService,
    public preferenceService: PreferenceService,
    public cacheServiceImpl: CacheServiceImpl,
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
        const segments = s.split('/');
        const lastSegment = segments[segments.length - 1];
        const firstSegment = segments[0];
        const numberOfSegment = segments.length;
        let previousSegmentName = 0;
        if (firstSegment === 'feedback_generated' && numberOfSegment > 3) {
          previousSegmentName = numberOfSegment - 2;
        } else if (firstSegment !== 'feedback_generated' && numberOfSegment > 2) {
          previousSegmentName = numberOfSegment - 1;
        }

        if (lastSegment?.endsWith('.html') && lastSegment !== 'index.html' && lastSegment !== 'scores.html') {
          const s1 = segments.slice(previousSegmentName, numberOfSegment).join('/');
          if (!htmlfiles.includes(s1)) {
            htmlfiles.push(s1);
          }
        }
      }
      this.showListFiles(htmlfiles);
    }

    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) => {
        this.eventManager.broadcast(new EventWithContent<AlertError>('gradeScopeIsticApp.error', { ...err, key: 'error.file.' + err.key }));
      },
    });
  }

  addIDToDiv($: cheerio.CheerioAPI): void {
    const divs = $('div');
    divs.each((e, el) => {
      if (el.attribs['id'] === undefined || el.attribs['id'] === '') {
        el.attribs['id'] = uuidv4();
      }
    });
  }

  async loadFile(file: string): Promise<string> {
    const blob = await this.entries![file].blob('text/html');
    const text = await blob.text();
    return text;
  }

  async getNumberQuestion(text: string): Promise<number> {
    const $ = await cheerio.load(text);
    const questions = $('#toc')
      .find('li')
      .find('a')
      .filter((e, el) => el.next !== null && (el.next! as any).data !== undefined);

    return questions.length;
  }

  async checkFileAnswer(file: string, questions: any): Promise<void> {
    const text = await this.loadFile(file);
    const $ = await cheerio.load(text);

    const question = $('#toc').find('li').find('a');
    const questionNumber = question.length;
    //    const question = await this.getNumberQuestion(text);
    if (questionNumber === 0) {
      return questions;
    }
    this.addIDToDiv($);
    for (const el of question) {
      if (el.next !== null && (el.next! as any).data !== undefined) {
        const score = ((el.next! as any).data as string).replace(' (Score:', '').replace(')', '');
        const scoresplit = score.split('/');
        const q: any = {};
        q.notemax = Number(scoresplit[1]);
        q.note = Number(scoresplit[0]);
        q.anchor = el.attribs['href'].substring(1);
        questions.push(q);
      }
    }
  }

  async processFileAnswer(
    file: string,
    c: boolean,
    examId: number,
    sheetName: string,
    studentIndex: number,
    questionsDesc: any[],
  ): Promise<any> {
    const res: any = {
      examId,
      sheetName,
      questions: [],
    };

    const text = await this.loadFile(file);
    // const questionNumber = await this.getNumberQuestion(text);
    //    const question = await this.getNumberQuestion(text);
    /* if (questionNumber === 0) {
      return res;
    }*/

    const $ = await cheerio.load(text);
    this.addIDToDiv($);
    const anchors = questionsDesc.map(q => q.anchor);

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

    for (let questionIndex = 0; questionIndex < questionsDesc.length; questionIndex++) {
      const pageNumber = studentIndex * questionsDesc.length + questionIndex + 1;
      const textwithdiv = $.html();
      if (textwithdiv.includes(questionsDesc[questionIndex].anchor)) {
        const score = await this.processSection(questionIndex, responses, textwithdiv, c, examId, pageNumber);

        const note = score.substring(0, score.indexOf('/') - 1);
        const notemax = score.substring(score.indexOf('/') + 1);
        res.questions.push({
          numero: questionIndex + 1,
          note: Number(note),
          notemax: Number(notemax),
        });
      }
    }
    return res;
  }

  async processSection(
    index: number,
    responses: Response[],
    text: string,
    cache: boolean,
    examId: number,
    pageNumber: number,
  ): Promise<string> {
    const $ = await cheerio.load(text);

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

    $('#toc').closest('div.panel-heading').remove();

    document.getElementById('body')!.innerHTML = $.html();
    if (cache) {
      const canvas = await html2canvas(document.getElementById('body')!);

      let exportImageType = 'image/webp';
      if (
        this.preferenceService.getPreference().imageTypeExport !== undefined &&
        ['image/webp', 'image/png', 'image/jpg'].includes(this.preferenceService.getPreference().imageTypeExport)
      ) {
        exportImageType = this.preferenceService.getPreference().imageTypeExport;
      }

      const t = canvas.toDataURL(exportImageType);
      this.cacheServiceImpl.addAligneImage({
        examId,
        pageNumber,
        value: JSON.stringify(
          {
            pages: t!,
          },
          this.replacer,
        ),
      });
    }

    return res;
  }

  async save(): Promise<void> {
    //   this.blocked = true;
    this.isSaving = true;
    const template = new Template();
    template.name = `${String(this.editForm.get(['name'])!.value)}Template`;
    template.content = this.editForm.get(['content'])!.value;
    template.contentContentType = this.editForm.get(['contentContentType'])!.value;
    template.mark = false;
    template.autoMapStudentCopyToList = true;
    template.caseboxname = false;
    const template1 = await firstValueFrom(this.templateService.create(template));

    const exam: IExam = {
      courseId: Number(this.courseid),
      nbgrader: true,
      name: this.editForm.get(['name'])!.value,
      templateId: template1.body?.id,
    };
    const exam1 = await firstValueFrom(this.examService.create(exam));
    // template.content = this.editForm.get(['content'])!.value;
    // const t = await firstValueFrom( this.templateService.create(template))
    const htmlfilesToProcess: string[] = [];

    let feedbackGeneratedPrefix = false;
    for (const s of Object.keys(this.entries!)) {
      const segments = s.split('/');
      //      const lastSegment = segments[segments.length-1];
      const firstSegment = segments[0];
      const numberOfSegment = segments.length;
      let previousSegmentName = 0;
      if (firstSegment === 'feedback_generated' && numberOfSegment > 3) {
        feedbackGeneratedPrefix = true;
        previousSegmentName = numberOfSegment - 2;
      } else if (firstSegment !== 'feedback_generated' && numberOfSegment > 2) {
        feedbackGeneratedPrefix = false;
        previousSegmentName = numberOfSegment - 1;
      }
      const s1 = segments.slice(previousSegmentName, numberOfSegment).join('/');

      if (s1 !== undefined && this.fileToAnalyse.includes(s1)) {
        htmlfilesToProcess.push(s);
      }
    }
    if (htmlfilesToProcess.length === 0) {
      this.isSaving = false;
      return;
    } else {
      const maps = new Map();
      for (const s of htmlfilesToProcess) {
        const segments = s.split('/');
        if (feedbackGeneratedPrefix) {
          if (maps.has(segments[1])) {
            maps.set(segments[1], [...maps.get(segments[1]), segments.join('/')]);
          } else {
            maps.set(segments[1], [segments.join('/')]);
          }
        } else {
          if (maps.has(segments[0])) {
            maps.set(segments[0], [...maps.get(segments[0]), segments.join('/')]);
          } else {
            maps.set(segments[0], [segments.join('/')]);
          }
        }
      }

      // Ensure notebook order   fix by user

      const keys = Array.from(maps.keys());
      let questionMax = 0;
      for (const key of keys) {
        const value = maps.get(key);
        if (value !== undefined) {
          const prefixedMap = new Map(
            value.map((item: string) => {
              const segments = item.split('/');
              const firstSegment = segments[0];
              const numberOfSegment = segments.length;
              let previousSegmentName = 0;
              if (firstSegment === 'feedback_generated' && numberOfSegment > 3) {
                feedbackGeneratedPrefix = true;
                previousSegmentName = numberOfSegment - 2;
              } else if (firstSegment !== 'feedback_generated' && numberOfSegment > 2) {
                feedbackGeneratedPrefix = false;
                previousSegmentName = numberOfSegment - 1;
              }
              const s1 = segments.slice(previousSegmentName, numberOfSegment).join('/');
              return [s1, item];
            }),
          );

          const reordered = this.fileToAnalyse.map(item => prefixedMap.get(item)).filter(e1 => e1 !== undefined);
          maps.set(key, reordered);
        }
      }

      // Do a first pass on notebook to get the questions and the notes

      const maps1 = new Map<string, Array<any>>();
      for (const key of keys) {
        const value = maps.get(key);
        if (value !== undefined) {
          const questions: any = [];
          for (const e of value) {
            await this.checkFileAnswer(e, questions);
          }
          maps1.set(key, questions);
        }
      }

      // Find an order list of ids for questions

      const allIds: string[] = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      maps1.forEach((v, k) => {
        allIds.push(...v.map(c1 => c1.anchor));
        if (questionMax < v.length) {
          questionMax = v.length;
        }
      });
      const uniqueIds = [...new Set(allIds)];
      if (uniqueIds.length === questionMax) {
        const q = [...maps1.values()].find(e => e.length === questionMax);
        // TODO manage if q is undefined
        // Create Question
        if (q !== undefined) {
          let studentIndex = 0;
          const res: any = {};
          for (const key of keys) {
            const value = maps.get(key);
            if (value !== undefined) {
              for (const e of value) {
                const e1 = await this.processFileAnswer(e, true, exam1.body!.id!, key, studentIndex, q);
                if (res[key] === undefined) {
                  res[key] = e1;
                } else {
                  res[key].questions = [...res[key].questions, ...e1.questions];
                }
              }
            }
            studentIndex = studentIndex + 1;
          }
          // eslint-disable-next-line arrow-body-style
          /* const result = Array.from(new Map(Object.entries(res)), ([key, value]) => {
            return {
            name: key,
            value,
          }}); */
          //          console.error('result',res, new Map(Object.entries(res)), );
          const result = Array.from(new Map(Object.entries(res)).values());
          console.error('result', result);
          await firstValueFrom(this.examService.createNoteBookExamStructure(result));
          this.blocked = false;
          this.gotoUE();
        }
      } else {
        console.error(' no questionMax');
      }
      this.blocked = false;

      /*
       */
      document.getElementById('body')!.remove();
    }

    //    console.error('htmlfilesToProcess', htmlfilesToProcess);
  }

  showListFiles(filenames: string[]): void {
    this.translateService.get('scanexam.listfilesheader').subscribe(data1 => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ref = this.dialogService.open(SheetSelectionComponent, {
        data: {
          filenames: filenames.map(e => {
            const o = { filename: e };
            return o;
          }),
        },
        closable: true,
        closeOnEscape: true,
        maximizable: true,
        header: data1,
        width: '70%',
      });
      ref.onClose.subscribe((result: any[]) => {
        this.fileToAnalyse = result.map(e => e.filename);
      });
    });
  }
  replacer(key: any, value: any): any {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }
}
