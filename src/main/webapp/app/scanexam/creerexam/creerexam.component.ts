/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { Exam } from 'app/entities/exam/exam.model';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CourseService } from '../../entities/course/service/course.service';
import { ExamService } from '../../entities/exam/service/exam.service';
import { TemplateService } from '../../entities/template/service/template.service';
import { Template } from '../../entities/template/template.model';

@Component({
  selector: 'jhi-creerexam',
  templateUrl: './creerexam.component.html',
  styleUrls: ['./creerexam.component.scss'],
  providers:[MessageService,ConfirmationService]
})
export class CreerexamComponent implements OnInit {

  blocked = false;
  courseid: string | undefined = undefined
  isSaving = false;
  coursName ='';
  editForm = this.fb.group({
    name: [null, [Validators.required]],
    content: [],
    contentContentType: [null, [Validators.required]],

  });

  constructor(private http: HttpClient, private translate: TranslateService, private messageService: MessageService,protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public confirmationService:ConfirmationService,     private fb: FormBuilder,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected courseService:CourseService,
    protected examService : ExamService,
    protected templateService :TemplateService
    ) { }




  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('courseid') !== null) {
        this.courseid = params.get('courseid')!;
          this.courseService.find(+this.courseid).subscribe(c=> this.coursName  = c.body?.name!)
      }});
  }

  gotoUE(): void {
    this.router.navigateByUrl('/course/'+ this.courseid);

  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('gradeScopeIsticApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  save():void{
    this.isSaving = true;

    const template = new Template();
    template.name =this.editForm.get(['name'])!.value + 'Template'
    template.content= this.editForm.get(['content'])!.value;
    template.contentContentType= this.editForm.get(['contentContentType'])!.value;
    this.templateService.create(template).subscribe((res)=> {
      const exam = new Exam();
      exam.name = this.editForm.get(['name'])!.value
      exam.templateId = res.body?.id;
      exam.courseId = +this.courseid!;
      this.examService.create(exam).subscribe(()=> {
        this.isSaving =false;
        // TODO
        this.router.navigateByUrl("/course/"+ this.courseid)
      }, ()=> {
        // TODO add error message
        this.isSaving =false;
      })



    },()=>{
        // TODO add error message
        this.isSaving =false;
    });




  }

}
