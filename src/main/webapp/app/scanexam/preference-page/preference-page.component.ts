/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { PreferenceService } from './preference.service';

@Component({
  selector: 'jhi-preference-page',
  templateUrl: './preference-page.component.html',
  styleUrls: ['./preference-page.component.scss'],
})
export class PreferencePageComponent implements OnInit {
  editForm: UntypedFormGroup;

  dbOptions: any[] = [
    { label: 'indexdb', value: 'indexdb' },
    { label: 'sqlite', value: 'sqlite' },
  ];

  value: string = 'indexdb';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public preferenceService: PreferenceService,
    private fb: UntypedFormBuilder,
  ) {
    this.editForm = this.fb.group({
      pdfscale: [],
      cacheDb: [],
      imageTypeExport: [],
      exportImageCompression: [],
      qcm_min_width_shape: [],
      qcm_min_height_shape: [],
      qcm_epsilon: [],
      qcm_differences_avec_case_blanche: [],
      linelength: [],
      repairsize: [],
      dilatesize: [],
      morphsize: [],
      drawcontoursizeh: [],
      drawcontoursizev: [],
      minCircle: [],
      maxCircle: [],
      numberofpointToMatch: [],
      numberofgoodpointToMatch: [],
      defaultAlignAlgowithMarker: [true],
      removeHorizontalName: [true],
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.editForm.patchValue(this.preferenceService.getPreference());
  }

  clearToDefault(): void {
    this.editForm.patchValue(this.preferenceService.clearToDefault());
  }

  onSubmit(formValues: any): void {
    this.preferenceService.save(formValues);
    this.ref.close();
  }
}
