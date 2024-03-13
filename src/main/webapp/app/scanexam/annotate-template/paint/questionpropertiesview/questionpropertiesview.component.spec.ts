import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionpropertiesviewComponent } from './questionpropertiesview.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FabricShapeService } from '../shape.service';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { SidebarModule } from 'primeng/sidebar';
import { PreferenceService } from 'app/scanexam/preference-page/preference.service';
import { CreateCommentsComponent } from '../../create-comments/create-comments.component';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { EventHandlerService } from '../event-handler.service';
import { Observable, Subject, of } from 'rxjs';
import { IQuestion } from 'app/entities/question/question.model';
import { setImmediate } from 'timers';
import { QuestionService } from 'app/entities/question/service/question.service';
import { HttpResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ListboxModule } from 'primeng/listbox';
import { TooltipModule } from 'primeng/tooltip';
import { AlertErrorComponent } from 'app/shared/alert/alert-error.component';
import { ButtonModule } from 'primeng/button';
import { QuestionTypeService } from 'app/entities/question-type/service/question-type.service';
import { IQuestionType } from 'app/entities/question-type/question-type.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MockComponent, ngMocks, MockProvider } from 'ng-mocks';

const flushPromises = (): Promise<void> => new Promise(resolve => setImmediate(resolve));

describe('QuestionpropertiesviewComponent', () => {
  let component: QuestionpropertiesviewComponent;
  let fixture: ComponentFixture<QuestionpropertiesviewComponent>;
  let mockEvtHandler: EventHandlerService;
  let mockQuestionService: QuestionService;
  let mockQuestionTypeService: QuestionTypeService;
  let mockPrefService: PreferenceService;
  let selectedQuestion: Subject<IQuestion | undefined>;

  function getPanel(): DebugElement {
    return fixture.debugElement.query(By.css('#panel'));
  }

  async function waitForAll(): Promise<void> {
    jest.runAllTimers();
    await flushPromises();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionpropertiesviewComponent, MockComponent(CreateCommentsComponent), AlertErrorComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
        SidebarModule,
        ListboxModule,
        TooltipModule,
        ButtonModule,
        BrowserAnimationsModule,
        MessageModule,
        InputTextModule,
        KeyFilterModule,
      ],
      providers: [
        FabricShapeService,
        MockProvider(EventHandlerService),
        MockProvider(LocalStorageService),
        MockProvider(PreferenceService),
        MockProvider(QuestionService),
        MockProvider(QuestionTypeService),
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(QuestionpropertiesviewComponent);
    component = fixture.componentInstance;
    jest.useFakeTimers();

    selectedQuestion = new Subject();

    mockPrefService = TestBed.inject(PreferenceService);
    mockPrefService.getPreferenceForQuestion = jest.fn(() => ({
      point: 2,
      step: 4,
      gradeType: GradeType.DIRECT,
      typeId: 2,
      defaultpoint: undefined,
      randomHorizontalCorrection: false,
    }));
    mockPrefService.savePref4Question = jest.fn();

    mockEvtHandler = TestBed.inject(EventHandlerService);
    component.eventHandler = mockEvtHandler;

    mockEvtHandler.getSelectedQuestion = jest.fn(() => selectedQuestion);
    mockEvtHandler.updateQuestion = jest.fn();
    mockQuestionService = TestBed.inject(QuestionService);
    mockQuestionTypeService = TestBed.inject(QuestionTypeService);

    mockQuestionTypeService.query = jest.fn(
      (): Observable<HttpResponse<IQuestionType[]>> => of(new HttpResponse({ body: [{ algoName: 'foo' }, { algoName: 'bar' }] })),
    );

    await waitForAll();
  });

  it('should create with default values', () => {
    expect(component.isSaving).toBeFalsy();
    expect(component.layoutsidebarVisible).toBeFalsy();
    expect(component.questions).toHaveLength(0);
    expect(component.questiontypes).toStrictEqual([{ algoName: 'foo' }, { algoName: 'bar' }]);
    expect(component.editForm).toBeDefined();
    expect(getPanel()).toBeNull();
  });

  describe('with one question selected', () => {
    let selectedQ: IQuestion;
    let otherQ: IQuestion;

    beforeEach(async () => {
      selectedQ = {
        id: 1,
        numero: 2,
        point: 3,
        step: 2,
        examId: 10,
        examName: 'foo',
        gradedcomments: [],
        gradeType: GradeType.NEGATIVE,
        typeId: undefined,
        zoneId: 100,
        defaultpoint: undefined,
        randomHorizontalCorrection: false,
      };

      otherQ = {
        id: 12,
        numero: 3,
        point: 31,
        step: 4,
        examId: 10,
        examName: 'foo',
        gradedcomments: [],
        gradeType: GradeType.POSITIVE,
        typeId: undefined,
        zoneId: 1002,
        defaultpoint: undefined,
        randomHorizontalCorrection: false,
      };

      jest.spyOn(component.editForm, 'patchValue');
      jest.spyOn(component.updatenumero, 'next');
      mockEvtHandler.setCurrentQuestionNumber = jest.fn();
      mockQuestionService.update = jest.fn((): Observable<HttpResponse<IQuestion>> => of(new HttpResponse({ body: selectedQ })));
      mockQuestionService.query = jest.fn((): Observable<HttpResponse<Array<IQuestion>>> => of(new HttpResponse({ body: [selectedQ] })));

      selectedQuestion.next(selectedQ);
      await waitForAll();
    });

    it('should update on new selection composed of one question', () => {
      expect(component.questions).toStrictEqual([selectedQ]);
      expect(component.editForm.patchValue).toHaveBeenCalledTimes(1);
      expect(component.editForm.patchValue).toHaveBeenCalledWith(
        {
          numero: selectedQ.numero,
          point: selectedQ.point,
          step: selectedQ.step,
          validExpression: selectedQ.validExpression,
          gradeType: selectedQ.gradeType,
          typeId: selectedQ.typeId,
          randomHorizontalCorrection: false,
        },
        { emitEvent: false },
      );
      expect(component.isSaving).toBeFalsy();
      expect(mockEvtHandler.setCurrentQuestionNumber).not.toHaveBeenCalled();
      expect(component.updatenumero.next).not.toHaveBeenCalled();
      expect(getPanel()).not.toBeNull();
    });

    it('should update on cleared selection', async () => {
      selectedQuestion.next(undefined);
      await waitForAll();

      expect(component.questions).toHaveLength(0);
      expect(component.editForm.patchValue).toHaveBeenCalledTimes(1);
      expect(component.isSaving).toBeFalsy();
      expect(mockEvtHandler.setCurrentQuestionNumber).not.toHaveBeenCalled();
      expect(component.updatenumero.next).not.toHaveBeenCalled();
      expect(getPanel()).toBeNull();
    });

    it('updates the selected question when clicking for changing its number while other question exist', async () => {
      const input = fixture.debugElement.query(By.css('#field_numero')).nativeElement;
      const q1b = { ...selectedQ };
      q1b.numero = 3;
      const q1c = { ...otherQ, id: 1, zoneId: 100, libelle: undefined };
      mockQuestionService.query = jest.fn((): Observable<HttpResponse<Array<IQuestion>>> => of(new HttpResponse({ body: [q1b, otherQ] })));
      mockQuestionService.update = jest
        .fn()
        .mockReturnValueOnce(of(new HttpResponse({ body: q1b })))
        .mockReturnValueOnce(of(new HttpResponse({ body: q1c })));

      component.editForm.patchValue({ numero: 3 }, { emitEvent: false });
      input.value = 3;
      input.dispatchEvent(new Event('change'));
      input.dispatchEvent(new Event('input'));

      await waitForAll();

      expect(mockQuestionService.update).toHaveBeenCalledTimes(2);
      expect(mockQuestionService.query).toHaveBeenCalledTimes(1);
      expect(component.questions).toHaveLength(2);
      expect(component.questions[0]).toStrictEqual(q1c);
      expect(component.questions[1]).toStrictEqual(otherQ);
      expect(mockEvtHandler.setCurrentQuestionNumber).toHaveBeenCalledTimes(1);
      expect(mockEvtHandler.setCurrentQuestionNumber).toHaveBeenCalledWith(3);
      expect(component.updatenumero.next).toHaveBeenCalledTimes(1);
      expect(component.updatenumero.next).toHaveBeenCalledWith(3);
    });
  });

  describe('with two questions selected', () => {
    let qs: Array<IQuestion>;

    beforeEach(async () => {
      qs = [
        {
          id: 11,
          numero: 21,
          point: 31,
          step: 1,
          examId: 101,
          examName: 'efoo',
          gradedcomments: [],
          gradeType: GradeType.POSITIVE,
          zoneId: 1001,
          typeId: 2,
          randomHorizontalCorrection: false,
        },
        {
          id: 12,
          numero: 21,
          point: 31,
          step: 1,
          examId: 101,
          examName: 'efoo',
          gradedcomments: [],
          gradeType: GradeType.POSITIVE,
          zoneId: 1002,
          typeId: 2,
          randomHorizontalCorrection: false,
        },
      ];

      jest.spyOn(component.editForm, 'patchValue');
      jest.spyOn(component.updatenumero, 'next');
      mockEvtHandler.setCurrentQuestionNumber = jest.fn();
      mockQuestionService.query = jest.fn((): Observable<HttpResponse<Array<IQuestion>>> => of(new HttpResponse({ body: qs })));

      selectedQuestion.next(qs[0]);
      await waitForAll();
    });

    it('should update on new selection using the first question', () => {
      expect(component.questions).toStrictEqual(qs);
      expect(component.editForm.patchValue).toHaveBeenCalledTimes(1);
      expect(component.editForm.patchValue).toHaveBeenCalledWith(
        {
          numero: qs[0].numero,
          point: qs[0].point,
          step: qs[0].step,
          validExpression: qs[0].validExpression,
          gradeType: qs[0].gradeType,
          typeId: qs[0].typeId,
          randomHorizontalCorrection: false,
        },
        { emitEvent: false },
      );
      expect(component.isSaving).toBeFalsy();
      expect(mockEvtHandler.setCurrentQuestionNumber).not.toHaveBeenCalled();
      expect(component.updatenumero.next).not.toHaveBeenCalled();
      expect(getPanel()).not.toBeNull();
    });

    it('clicking for changing the mark, changes all the questions, value % 1 === 0', async () => {
      const qs2: Array<IQuestion> = qs.map(q => ({ ...q }));
      const input = fixture.debugElement.query(By.css('#field_point')).nativeElement;
      qs2.forEach(q => (q.point = 42));
      mockQuestionService.update = jest
        .fn()
        .mockReturnValueOnce(of(new HttpResponse({ body: qs2[0] })))
        .mockReturnValueOnce(of(new HttpResponse({ body: qs2[1] })));

      input.value = 42;
      component.editForm.patchValue({ point: 42 }, { emitEvent: false });
      input.dispatchEvent(new Event('change'));
      input.dispatchEvent(new Event('input'));

      await waitForAll();

      expect(mockQuestionService.update).toHaveBeenCalledTimes(2);
      expect(mockPrefService.savePref4Question).toHaveBeenCalledTimes(1);
      expect(mockPrefService.savePref4Question).toHaveBeenCalledWith({
        point: 42,
        step: 1,
        gradeType: GradeType.POSITIVE,
        typeId: 2,
      });

      expect(component.questions.map(q => q.point)).toStrictEqual([42, 42]);
      expect(component.pasPointResponseOptions).toStrictEqual([
        { name: '1', value: 1 },
        { name: '0,5 pt ', value: 2 },
        { name: '0,25 pt', value: 4 },
        { name: '0, 125 pt', value: 8 },
        { name: '0,0625 pt', value: 16 },
      ]);
      expect(component.editForm.get(['step'])!.value).toStrictEqual(1);

      expect(mockEvtHandler.updateQuestion).toHaveBeenCalledTimes(2);
      expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(1, component.questions[0]);
      expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(2, component.questions[1]);
    });

    it('clicking for changing the mark, changes all the questions, value % 0.5 === 0', async () => {
      mockQuestionService.update = jest
        .fn()
        .mockReturnValueOnce(of(new HttpResponse({ body: component.questions[0] })))
        .mockReturnValueOnce(of(new HttpResponse({ body: component.questions[1] })));

      const input = fixture.debugElement.query(By.css('#field_point')).nativeElement;
      input.value = 40.5;
      component.editForm.patchValue({ point: 40.5 }, { emitEvent: false });
      input.dispatchEvent(new Event('change'));
      input.dispatchEvent(new Event('input'));

      await waitForAll();

      expect(component.questions.map(q => q.point)).toStrictEqual([40.5, 40.5]);
      expect(component.pasPointResponseOptions).toStrictEqual([
        { name: '0,5 pt ', value: 2 },
        { name: '0,25 pt', value: 4 },
        { name: '0, 125 pt', value: 8 },
        { name: '0,0625 pt', value: 16 },
      ]);
      expect(component.editForm.get(['step'])!.value).toStrictEqual(2);
      expect(mockEvtHandler.updateQuestion).toHaveBeenCalledTimes(2);
      expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(1, component.questions[0]);
      expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(2, component.questions[1]);
    });

    it('clicking for changing the mark, changes all the questions, value % 0.25 === 0', async () => {
      mockQuestionService.update = jest
        .fn()
        .mockReturnValueOnce(of(new HttpResponse({ body: component.questions[0] })))
        .mockReturnValueOnce(of(new HttpResponse({ body: component.questions[1] })));

      const input = fixture.debugElement.query(By.css('#field_point')).nativeElement;
      input.value = 40.25;
      component.editForm.patchValue({ point: 40.25 }, { emitEvent: false });
      input.dispatchEvent(new Event('change'));
      input.dispatchEvent(new Event('input'));

      await waitForAll();

      expect(component.questions.map(q => q.point)).toStrictEqual([40.25, 40.25]);

      expect(component.pasPointResponseOptions).toStrictEqual([
        { name: '0,25 pt', value: 4 },
        { name: '0, 125 pt', value: 8 },
        { name: '0,0625 pt', value: 16 },
      ]);
      expect(component.editForm.get(['step'])!.value).toStrictEqual(4);
      expect(mockEvtHandler.updateQuestion).toHaveBeenCalledTimes(2);
      expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(1, component.questions[0]);
      expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(2, component.questions[1]);
    });

    // it('clicking for changing the mark two times, still updates', async () => {
    //   const input = fixture.debugElement.query(By.css("#field_point")).nativeElement;
    //   input.value = 40.25;
    //   component.editForm.patchValue({'point': 40.25}, {emitEvent: false});
    //   input.dispatchEvent(new Event("change"));
    //   input.dispatchEvent(new Event('input'));
    //   await waitForAll();
    //   input.value = 41;
    //   component.editForm.patchValue({'point': 41}, {emitEvent: false});
    //   input.dispatchEvent(new Event("change"));
    //   input.dispatchEvent(new Event('input'));
    //   await waitForAll();

    //   expect(component.questions.map(q => q.point)).toStrictEqual([41, 41]);

    //   // expect(component.pasPointResponseOptions).toStrictEqual([
    //   //   { name: '0,25 pt', value: 4 },
    //   //   { name: '0, 125 pt', value: 8 },
    //   //   { name: '0,0625 pt', value: 16 },
    //   // ]);
    //   // expect(component.editForm.get(['step'])!.value).toStrictEqual(4);
    //   expect(mockEvtHandler.updateQuestion).toHaveBeenCalledTimes(2);
    //   expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(1, component.questions[0]);
    //   expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(2, component.questions[1]);
    // });

    it('updates the selected question when clicking for changing its number while no other question exists with this number', async () => {
      const input = fixture.debugElement.query(By.css('#field_numero')).nativeElement;
      const q1b = { ...qs[0] };
      q1b.numero = 22;
      mockQuestionService.query = jest.fn((): Observable<HttpResponse<Array<IQuestion>>> => of(new HttpResponse({ body: [q1b] })));
      mockQuestionService.update = jest.fn().mockReturnValue(of(new HttpResponse({ body: q1b })));

      component.editForm.patchValue({ numero: 22 }, { emitEvent: false });
      input.value = 22;
      input.dispatchEvent(new Event('change'));
      input.dispatchEvent(new Event('input'));

      await waitForAll();

      expect(mockQuestionService.update).toHaveBeenCalledTimes(1);
      expect(mockQuestionService.query).toHaveBeenCalledTimes(1);
      expect(component.questions).toHaveLength(1);
      expect(component.questions[0]).toStrictEqual(q1b);
      expect(mockEvtHandler.setCurrentQuestionNumber).toHaveBeenCalledTimes(1);
      expect(mockEvtHandler.setCurrentQuestionNumber).toHaveBeenCalledWith(22);
      expect(component.updatenumero.next).toHaveBeenCalledTimes(1);
      expect(component.updatenumero.next).toHaveBeenCalledWith(22);
    });

    it('clicking for changing the step, changes all the questions', async () => {
      const qs2: Array<IQuestion> = qs.map(q => ({ ...q }));
      const listStep = ngMocks.find('#field_step1');

      qs2.forEach(q => (q.step = 4));
      mockQuestionService.update = jest
        .fn()
        .mockReturnValueOnce(of(new HttpResponse({ body: qs2[0] })))
        .mockReturnValueOnce(of(new HttpResponse({ body: qs2[1] })));

      component.editForm.patchValue({ step: 4 }, { emitEvent: false });
      ngMocks.output(listStep, 'onChange').emit();

      await waitForAll();

      expect(mockQuestionService.update).toHaveBeenCalledTimes(2);
      expect(mockPrefService.savePref4Question).toHaveBeenCalledTimes(1);
      expect(mockPrefService.savePref4Question).toHaveBeenCalledWith({
        point: 31,
        step: 4,
        gradeType: GradeType.POSITIVE,
        typeId: 2,
      });
      expect(component.questions.map(q => q.step)).toStrictEqual([4, 4]);
      expect(mockEvtHandler.updateQuestion).toHaveBeenCalledTimes(2);
      expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(1, qs2[0]);
      expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(2, qs2[1]);
    });

    it('clicking for changing the grade type, changes all the questions', async () => {
      const qs2: Array<IQuestion> = qs.map(q => ({ ...q }));
      const typeWidget = ngMocks.find('#field_gradeType');

      qs2.forEach(q => (q.gradeType = GradeType.DIRECT));
      mockQuestionService.update = jest
        .fn()
        .mockReturnValueOnce(of(new HttpResponse({ body: qs2[0] })))
        .mockReturnValueOnce(of(new HttpResponse({ body: qs2[1] })));

      component.editForm.patchValue({ gradeType: GradeType.DIRECT }, { emitEvent: false });
      typeWidget.nativeElement.value = GradeType.DIRECT;
      typeWidget.nativeElement.dispatchEvent(new Event('change'));

      await waitForAll();

      expect(mockQuestionService.update).toHaveBeenCalledTimes(2);
      expect(mockPrefService.savePref4Question).toHaveBeenCalledTimes(1);
      expect(mockPrefService.savePref4Question).toHaveBeenCalledWith({
        point: 31,
        step: 1,
        gradeType: GradeType.DIRECT,
        typeId: 2,
      });
      expect(component.questions.map(q => q.gradeType)).toStrictEqual([GradeType.DIRECT, GradeType.DIRECT]);
      expect(mockEvtHandler.updateQuestion).toHaveBeenCalledTimes(2);
      expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(1, qs2[0]);
      expect(mockEvtHandler.updateQuestion).toHaveBeenNthCalledWith(2, qs2[1]);
    });

    it('shows correct things on QCM type', async () => {
      qs.forEach(q => (q.typeId = 3));
      component.editForm.patchValue({ typeId: 3 }, { emitEvent: false });
      await waitForAll();

      expect(fixture.debugElement.query(By.css('#field_gradeType'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#sidebar-show-button'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#validexp'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('#field_step1'))).not.toBeNull();
    });

    it('shows correct thing on manual type', () => {
      expect(fixture.debugElement.query(By.css('#field_gradeType'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('#field_step1'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('#sidebar-show-button'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('#validexp'))).toBeNull();
    });

    it('sets manualid correctly', () => {
      component.manualid = 0;
      component.qcmid = 0;
      mockQuestionTypeService.query = jest.fn(
        (): Observable<HttpResponse<IQuestionType[]>> => of(new HttpResponse({ body: [{ algoName: 'manual', id: 11 }] })),
      );

      component.ngOnInit();

      expect(component.manualid).toStrictEqual(11);
      expect(component.qcmid).toStrictEqual(0);
    });

    it('sets qcmid correctly', () => {
      component.manualid = 0;
      component.qcmid = 0;
      mockQuestionTypeService.query = jest.fn(
        (): Observable<HttpResponse<IQuestionType[]>> => of(new HttpResponse({ body: [{ algoName: 'QCM', id: 12 }] })),
      );

      component.ngOnInit();

      expect(component.qcmid).toStrictEqual(12);
      expect(component.manualid).toStrictEqual(0);
    });
  });
});
