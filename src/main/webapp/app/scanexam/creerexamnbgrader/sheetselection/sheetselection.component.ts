import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UserService } from '../../../entities/user/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { PrimeTemplate } from 'primeng/api';
import { PickListModule } from 'primeng/picklist';
import { TranslateDirective } from 'app/shared/language/translate.directive';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'jhi-sharecourse',
  templateUrl: './sheetselection.component.html',
  styleUrls: ['./sheetselection.component.scss'],
  standalone: true,
  imports: [PickListModule, PrimeTemplate, TranslateModule, TranslateDirective, ButtonModule],
})
export class SheetSelectionComponent implements OnInit {
  list1: any[] = [];

  list2: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.list1 = this.config.data.filenames;
  }

  closeDialog(value: boolean, list2: string[]): void {
    if (value) {
      this.ref.close(list2);
    } else {
      this.ref.close([]);
    }
  }
}
