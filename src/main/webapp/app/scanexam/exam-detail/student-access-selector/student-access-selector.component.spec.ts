import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

import { StudentAccess } from 'app/entities/enumerations/student-access.model';
import { IExam } from 'app/entities/exam/exam.model';
import { StudentAccessSelectorComponent } from './student-access-selector.component';

describe('StudentAccessSelectorComponent', () => {
  let http: HttpTestingController;
  let messages: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentAccessSelectorComponent, TranslateModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    http = TestBed.inject(HttpTestingController);
    messages = TestBed.inject(MessageService);
  });

  afterEach(() => http.verify());

  function create(exam: IExam): StudentAccessSelectorComponent {
    const fixture = TestBed.createComponent(StudentAccessSelectorComponent);
    fixture.componentRef.setInput('exam', exam);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('shows SHEET for an exam without value and saves the new access', async () => {
    const component = create({ id: 7, name: 'Partiel' });
    expect((component as any).access()).toBe(StudentAccess.SHEET);
    const emitted: IExam[] = [];
    component.changed.subscribe(e => emitted.push(e));

    const done = component.change(StudentAccess.GRADED);
    const req = http.expectOne(r => r.method === 'PUT' && r.url.endsWith('api/exams/7/student-access/GRADED'));
    req.flush({ id: 7, name: 'Partiel', studentAccess: StudentAccess.GRADED });
    await done;

    expect(emitted).toEqual([{ id: 7, name: 'Partiel', studentAccess: StudentAccess.GRADED }]);
  });

  it('does nothing when the access does not change', async () => {
    const component = create({ id: 7, studentAccess: StudentAccess.HIDDEN });
    await component.change(StudentAccess.HIDDEN);
    http.expectNone(() => true);
  });

  it('goes back to the former access and tells the user when saving fails', async () => {
    const component = create({ id: 7, studentAccess: StudentAccess.SHEET });
    const added: unknown[] = [];
    const spy = jest.spyOn(messages, 'add').mockImplementation(m => added.push(m));

    const done = component.change(StudentAccess.GRADED);
    http.expectOne(r => r.method === 'PUT').flush(null, { status: 403, statusText: 'Forbidden' });
    await done;

    expect((component as any).access()).toBe(StudentAccess.SHEET);
    expect(added).toHaveLength(1);
    spy.mockRestore();
  });
});
