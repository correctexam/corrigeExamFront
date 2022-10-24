/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { IPreference } from '../services/align-images.service';

@Injectable({
  providedIn: 'root',
})
export class PreferenceService {
  constructor(public localStorageService: LocalStorageService) {}

  getPreference(): IPreference {
    let pref: IPreference | null = this.localStorageService.retrieve('preferences');
    if (pref === null) {
      const defaultvalue: IPreference = {
        qcm_min_width_shape: 10,
        qcm_min_height_shape: 10,
        qcm_epsilon: 0.0145, // 0.03
        qcm_differences_avec_case_blanche: 0.22,
        linelength: 15,
        repairsize: 3,
        dilatesize: 3,
        morphsize: 3,
        drawcontoursizeh: 4,
        drawcontoursizev: 4,
        minCircle: 6,
        maxCircle: 20,
        numberofpointToMatch: 5,
        numberofgoodpointToMatch: 0,
        defaultAlignAlgowithMarker: true,
      };
      this.localStorageService.store('preferences', defaultvalue);
      pref = defaultvalue;
    }
    return pref;
  }

  save(pref: IPreference): void {
    this.localStorageService.store('preferences', pref);
  }

  clearToDefault(): IPreference {
    const defaultvalue = {
      qcm_min_width_shape: 10,
      qcm_min_height_shape: 10,
      qcm_epsilon: 0.0145, // 0.03
      qcm_differences_avec_case_blanche: 0.22,
      linelength: 15,
      repairsize: 3,
      dilatesize: 3,
      morphsize: 3,
      drawcontoursizeh: 4,
      drawcontoursizev: 4,
      minCircle: 6,
      maxCircle: 20,
      numberofpointToMatch: 5,
      numberofgoodpointToMatch: 0,
      defaultAlignAlgowithMarker: true,
    };
    this.localStorageService.store('preferences', defaultvalue);
    return defaultvalue;
  }
}
