import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpHeaders, HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ExamSheetService } from '../service/exam-sheet.service';

import { ExamSheetComponent } from './exam-sheet.component';

describe('ExamSheet Management Component', () => {
  let comp: ExamSheetComponent;
  let fixture: ComponentFixture<ExamSheetComponent>;
  let service: ExamSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExamSheetComponent],
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        provideRouter([{ path: 'exam-sheet', component: ExamSheetComponent }]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
          },
        },
      ],
    })
      .overrideTemplate(ExamSheetComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExamSheetComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExamSheetService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.examSheets?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  it('should load a page', () => {
    // WHEN
    comp.loadPage(1);

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.examSheets?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  it('should calculate the sort attribute for an id', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalledWith(expect.objectContaining({ sort: ['id,desc'] }));
  });

  it('should calculate the sort attribute for a non-id attribute', () => {
    // INIT
    comp.ngOnInit();

    // GIVEN
    comp.predicate = 'name';

    // WHEN
    comp.loadPage(1);

    // THEN
    expect(service.query).toHaveBeenLastCalledWith(expect.objectContaining({ sort: ['name,desc', 'id'] }));
  });
});
