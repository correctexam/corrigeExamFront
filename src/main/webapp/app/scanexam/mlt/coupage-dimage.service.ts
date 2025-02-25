import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AlignImagesService } from '../services/align-images.service';

@Injectable({
  providedIn: 'root',
})
export class CoupageDimageService {
  constructor(private alignImagesService: AlignImagesService) {}
  runScript(imageSrc: ImageData): Observable<any> {
    return this.alignImagesService.getLinesFromImage({ image: imageSrc });
  }
}
