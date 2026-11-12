import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { DeleteQuestionRequest, SummaryTemplateComponent } from './summary-template.component';
import { TranslateModule } from '@ngx-translate/core';
import { Question } from 'app/entities/question/question.model';

describe('SummaryTemplateComponent', () => {
  let component: SummaryTemplateComponent;
  let fixture: ComponentFixture<SummaryTemplateComponent>;

  const question = (id: number, numero: number): Question => {
    const q = new Question(id);
    q.numero = numero;
    q.point = 2;
    q.zoneId = id * 10;
    return q;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryTemplateComponent, TranslateModule.forRoot()],
    }).compileComponents();
    TestBed.inject(FaIconLibrary).addIcons(faTrashAlt);

    fixture = TestBed.createComponent(SummaryTemplateComponent);
    component = fixture.componentInstance;
    component.questions = new Map([
      [1, question(1, 1)],
      [2, question(2, 2)],
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display one delete button per question zone', () => {
    const buttons = fixture.nativeElement.querySelectorAll('[data-cy="summaryDeleteZoneButton"]');
    expect(buttons.length).toBe(2);
  });

  it('should emit a delete request and block the button until done', () => {
    const requests: DeleteQuestionRequest[] = [];
    component.deleteQ.subscribe(r => requests.push(r));

    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('[data-cy="summaryDeleteZoneButton"]')[1];
    button.click();
    fixture.detectChanges();

    expect(requests.length).toBe(1);
    expect(requests[0].question.id).toBe(2);
    expect(button.disabled).toBe(true);

    // A second click while the deletion is pending is ignored
    component.deleteQuestion(requests[0].question);
    expect(requests.length).toBe(1);

    requests[0].done();
    fixture.detectChanges();
    expect(button.disabled).toBe(false);
  });

  it('should not navigate to the question when clicking on delete', () => {
    const goto = jest.fn();
    component.gotoQ.subscribe(goto);
    fixture.nativeElement.querySelector('[data-cy="summaryDeleteZoneButton"]').click();
    expect(goto).not.toHaveBeenCalled();
  });
});
