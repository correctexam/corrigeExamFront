import { describe, expect, beforeEach, it } from '@jest/globals';
import { HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ConfirmationService, Confirmation } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@angular/cdk/platform';

import { EventHandlerService } from './event-handler.service';
import { FabricShapeService } from './shape.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { PreferenceService } from 'app/scanexam/preference-page/preference.service';
import { IQuestion } from 'app/entities/question/question.model';
import { PagedCanvas } from './fabric-canvas/PageHandler';
import { CustomZone } from './fabric-canvas/fabric-canvas.component';
import { DrawingTools } from './models';

describe('EventHandlerService.deleteQuestionZone', () => {
  let service: EventHandlerService;
  let zoneService: { countStudentResponseForZone: jest.Mock; delete: jest.Mock };
  let confirmAccept: boolean;
  let confirmations: Confirmation[];
  let canvasObjects: { id: string }[];
  let canvas: PagedCanvas;
  let zones: { [page: number]: CustomZone[] };

  const question: IQuestion = { id: 7, numero: 3, zoneId: 70 };

  beforeEach(() => {
    zoneService = {
      countStudentResponseForZone: jest.fn(() => of(new HttpResponse({ body: 0 }))),
      delete: jest.fn(() => of(new HttpResponse({}))),
    };
    const translate = { get: jest.fn((key: string) => of(key)) } as unknown as TranslateService;
    service = new EventHandlerService(
      {} as FabricShapeService,
      zoneService as unknown as ZoneService,
      {} as ExamService,
      {} as QuestionService,
      translate,
      {} as PreferenceService,
      {} as Platform,
    );

    confirmAccept = true;
    confirmations = [];
    service.setConfirmationService({
      confirm(c: Confirmation) {
        confirmations.push(c);
        if (confirmAccept) {
          c.accept?.();
        } else {
          c.reject?.();
        }
        return undefined;
      },
    } as unknown as ConfirmationService);

    zones = { 2: [{ id: 70, pageNumber: 2, type: DrawingTools.QUESTIONBOX }] };
    service.reinit({ id: 1 }, zones);
    service.questions.set(7, question);

    canvasObjects = [{ id: 'fabric-7' }, { id: 'fabric-other' }];
    canvas = {
      getObjects: () => canvasObjects,
      remove: jest.fn((o: { id: string }) => (canvasObjects = canvasObjects.filter(c => c !== o))),
      discardActiveObject: jest.fn(),
      requestRenderAll: jest.fn(),
    } as unknown as PagedCanvas;
    service.allcanvas.set(2, canvas);
    // Mapping between the fabric object and the zone (private in the service)
    (service as unknown as { modelViewpping: Map<string, number> }).modelViewpping.set('fabric-7', 70);
  });

  it('should delete the zone, the question and the rendered object once confirmed', async () => {
    const selected: (IQuestion | undefined)[] = [];
    service.getSelectedQuestion().subscribe(q => selected.push(q));
    service.selectQuestionView(question);

    await expect(service.deleteQuestionZone(question)).resolves.toBe(true);

    expect(zoneService.delete).toHaveBeenCalledWith(70);
    expect(confirmations[0].message).toBe('scanexam.removeZoneQuestion');
    expect(service.questions.has(7)).toBe(false);
    expect(canvasObjects.map(o => o.id)).toEqual(['fabric-other']);
    expect(zones[2]).toEqual([]);
    expect(selected).toEqual([question, undefined]);
  });

  it('should warn about existing corrections', async () => {
    zoneService.countStudentResponseForZone.mockReturnValue(of(new HttpResponse({ body: 4 })));
    await service.deleteQuestionZone(question);
    expect(confirmations[0].message).toBe('scanexam.removeAnnotationQuestion');
  });

  it('should keep everything when the user cancels', async () => {
    confirmAccept = false;
    await expect(service.deleteQuestionZone(question)).resolves.toBe(false);
    expect(zoneService.delete).not.toHaveBeenCalled();
    expect(service.questions.has(7)).toBe(true);
    expect(canvasObjects.length).toBe(2);
  });

  it('should keep the local state when the server deletion fails', async () => {
    zoneService.delete.mockReturnValue(throwError(() => new Error('500')));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(service.deleteQuestionZone(question)).resolves.toBe(false);
    expect(service.questions.has(7)).toBe(true);
    expect(canvasObjects.length).toBe(2);
    expect(zones[2].length).toBe(1);
  });
});
