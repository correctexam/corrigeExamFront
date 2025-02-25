/* eslint-disable @typescript-eslint/member-ordering */
// Create new file: queue-coordination.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueueCoordinationService {
  private externalProcessing = new BehaviorSubject<boolean>(false);
  externalProcessing$ = this.externalProcessing.asObservable();

  pauseQueue(): void {
    // eslint-disable-next-line no-console
    console.log('Pausing queue'); // Add this
    this.externalProcessing.next(true);
  }

  resumeQueue(): void {
    // eslint-disable-next-line no-console
    console.log('Resuming queue'); // Add this
    this.externalProcessing.next(false);
  }
}
