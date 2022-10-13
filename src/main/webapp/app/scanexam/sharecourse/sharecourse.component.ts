/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UserService } from '../../entities/user/user.service';

@Component({
  selector: 'jhi-sharecourse',
  templateUrl: './sharecourse.component.html',
  styleUrls: ['./sharecourse.component.scss'],
})
export class SharecourseComponent implements OnInit {
  courseid = '';
  list1: any[] = [];

  list2: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.courseid = this.config.data.courseid;
    this.http.get<any>(this.applicationConfigService.getEndpointFor('api/getUsers/' + this.courseid)).subscribe(s => {
      this.list1 = s.availables;
      this.list2 = s.shared;
    });
  }

  moveToTarget(event: any): void {
    this.http
      .put<any>(this.applicationConfigService.getEndpointFor('api/updateProfs/' + this.courseid), { availables: event.items })
      .subscribe(() => {});
  }
  moveToSource(event: any): void {
    this.http
      .put<any>(this.applicationConfigService.getEndpointFor('api/updateProfs/' + this.courseid), { shared: event.items })
      .subscribe(() => {});
  }
}
