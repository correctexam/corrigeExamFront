import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreferenceService } from './preference.service';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PrimeTemplate } from 'primeng/api';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { ITouchNavigationPreference, NavigationPadMode, NavigationPadSide } from './touch-navigation.preference';

@Component({
  selector: 'jhi-preference-page',
  templateUrl: './preference-page.component.html',
  styleUrls: ['./preference-page.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SelectButtonModule, TooltipModule, PrimeTemplate, TranslateDirective, TranslatePipe],
})
export class PreferencePageComponent implements OnInit {
  editForm: UntypedFormGroup;

  dbOptions: any[] = [
    { label: 'indexdb', value: 'indexdb' },
    { label: 'sqlite', value: 'sqlite' },
  ];

  value: string = 'indexdb';

  /** Navigation tactile (issue #657), stockée à part des paramètres de traitement d'image. */
  readonly padModeOptions: { label: string; value: NavigationPadMode }[] = [
    { label: 'scanexam.touchnavigation.padauto', value: 'auto' },
    { label: 'scanexam.touchnavigation.padalways', value: 'always' },
    { label: 'scanexam.touchnavigation.padnever', value: 'never' },
  ];
  readonly padSideOptions: { label: string; value: NavigationPadSide }[] = [
    { label: 'scanexam.touchnavigation.sideleft', value: 'left' },
    { label: 'scanexam.touchnavigation.sideright', value: 'right' },
  ];
  readonly touchNavigationForm: UntypedFormGroup;

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
      maxNumberOfPredictionToShow: [],
      warpPerspective: [false],
    });
    this.touchNavigationForm = this.fb.group({
      swipeOnPage: [true],
      pad: ['auto'],
      padSide: ['right'],
    });
  }

  ngOnInit(): void {
    this.editForm.patchValue(this.preferenceService.getPreference());
    this.touchNavigationForm.patchValue(this.preferenceService.getTouchNavigation());
  }

  clearToDefault(): void {
    this.editForm.patchValue(this.preferenceService.clearToDefault());
    this.touchNavigationForm.patchValue({ swipeOnPage: true, pad: 'auto', padSide: 'right' });
  }

  onSubmit(formValues: any): void {
    this.preferenceService.save(formValues);
    const touch: Pick<ITouchNavigationPreference, 'swipeOnPage' | 'pad' | 'padSide'> = this.touchNavigationForm.value;
    this.preferenceService.saveTouchNavigation({ ...this.preferenceService.getTouchNavigation(), ...touch });
    this.ref.close();
  }
}
