import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommentsService } from '../service/comments.service';
import { Comments } from '../comments.model';

import { CommentsUpdateComponent } from './comments-update.component';

describe('Comments Management Update Component', () => {
  let comp: CommentsUpdateComponent;
  let fixture: ComponentFixture<CommentsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commentsService: CommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommentsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CommentsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommentsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commentsService = TestBed.inject(CommentsService);

    comp = fixture.componentInstance;
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Comments>>();
      const comments = { id: 123 };
      jest.spyOn(commentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comments }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(commentsService.update).toHaveBeenCalledWith(comments);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Comments>>();
      const comments = new Comments();
      jest.spyOn(commentsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comments }));
      saveSubject.complete();

      // THEN
      expect(commentsService.create).toHaveBeenCalledWith(comments);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Comments>>();
      const comments = { id: 123 };
      jest.spyOn(commentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commentsService.update).toHaveBeenCalledWith(comments);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
