import { Component, OnInit, signal } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { PreferenceService } from '../../preference-page/preference.service';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TextareaModule } from 'primeng/textarea';
import { TranslateDirective } from 'app/shared/language/translate.directive';
import { TooltipModule } from 'primeng/tooltip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'jhi-customsvgiconloader',
  templateUrl: './customsvgiconloader.component.html',
  styleUrls: ['./customsvgiconloader.component.scss'],
  standalone: true,
  imports: [
    TooltipModule,
    TextareaModule,
    TranslateDirective,
    TranslateModule,
    FileUploadModule,
    FormsModule,
    NgIf,
    NgFor,
    KeyValuePipe,
    AvatarGroupModule,
    OverlayBadgeModule,
  ],
})
export class CustomSvgIconLoaderComponent implements OnInit {
  value?: string;
  customcomments = signal<Map<string, string>>(new Map());
  constructor(
    protected translateService: TranslateService,
    private _sanitizer: DomSanitizer,
    private preferenceService: PreferenceService,
  ) {}

  ngOnInit(): void {
    this.customcomments.set(this.preferenceService.getAllDefaultSVGCustomComments());
  }

  importSvg(): void {
    if (this.value && this.value !== '') {
      this.preferenceService.addDefaultSVGCustomComment(this.value!);
      this.customcomments.set(this.preferenceService.getAllDefaultSVGCustomComments());
    }
  }

  removeCustomSVG(key: string): void {
    if (key && key !== '') {
      this.preferenceService.removeDefaultSVGCustomComment(key);
      this.customcomments.set(this.preferenceService.getAllDefaultSVGCustomComments());
    }
  }
  getSVGImageUrl(image: string): SafeResourceUrl {
    const base64string = btoa(image);
    return this._sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${base64string}`);
  }

  async onUpload(event: any, fileUpload: FileUpload): Promise<void> {
    const s = await event.files[0].text();
    if (s && s !== '') {
      this.value = s;
      this.preferenceService.addDefaultSVGCustomComment(s);
      this.customcomments.set(this.preferenceService.getAllDefaultSVGCustomComments());
    }
    fileUpload.clear();
  }

  exportSVG(): void {
    const s: string[] = [];
    this.preferenceService.getAllDefaultSVGCustomComments().forEach(v => {
      s.push(v);
    });

    return saveAs(new Blob([JSON.stringify(s, null, 2)], { type: 'JSON' }), 'correctexamCustomSVG.json');
  }

  async onImport(event: any, fileUpload: FileUpload): Promise<void> {
    const svgs = JSON.parse(await event.files[0].text()) as string[] | undefined | null;
    if (svgs && svgs.length > 0) {
      svgs.forEach(svg => {
        this.preferenceService.addDefaultSVGCustomComment(svg);
      });
      this.customcomments.set(this.preferenceService.getAllDefaultSVGCustomComments());
    }
    fileUpload.clear();
  }
}
