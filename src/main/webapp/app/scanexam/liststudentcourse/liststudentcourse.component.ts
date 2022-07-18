/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'jhi-liststudentcourse',
  templateUrl: './liststudentcourse.component.html',
  styleUrls: ['./liststudentcourse.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ListstudentcourseComponent implements OnInit {
  blocked = false;
  courseid: string | undefined = undefined;
  students: any[] = [];

  constructor(
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
    private translate: TranslateService,
    private messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('courseid') !== null) {
        this.courseid = params.get('courseid')!;
        this.loadEtudiants();
      }
    });
  }

  reset(): void {
    this.confirmationService.confirm({
      message: "Etes vous sur de vouloir supprimer ces listes d'étudiants",
      accept: () => {
        this.blocked = true;

        this.http.delete(this.applicationConfigService.getEndpointFor('api/deletegroupstudents/' + this.courseid)).subscribe(() => {
          this.loadEtudiants();
          this.blocked = false;
        });
      },
    });
  }

  updateStudent(student: any): void {
    this.http.put(this.applicationConfigService.getEndpointFor('api/updatestudent/' + this.courseid), student).subscribe(() => {});
  }

  updateStudentINE(student: any): void {
    this.http.put(this.applicationConfigService.getEndpointFor('api/updatestudentine/' + this.courseid), student).subscribe(() => {});
  }
  updateStudentgroup(student: any): void {
    this.http.put(this.applicationConfigService.getEndpointFor('api/updatestudentgroup/' + this.courseid), student).subscribe(() => {});
  }
  removeSt(student: any): void {
    this.confirmationService.confirm({
      message: 'Etes vous sur de vouloir supprimer cet étudiant',
      accept: () => {
        this.blocked = true;

        this.http.put(this.applicationConfigService.getEndpointFor('api/deletestudentgroup/' + this.courseid), student).subscribe(() => {
          this.loadEtudiants();
          this.blocked = false;
        });
      },
    });
  }

  gotoUE(): void {
    this.router.navigateByUrl('course/' + this.courseid);
  }
  loadEtudiants(): void {
    this.http.get(this.applicationConfigService.getEndpointFor('api/getstudentcours/' + this.courseid)).subscribe(s => {
      this.students = s as any;
    });
  }
}
