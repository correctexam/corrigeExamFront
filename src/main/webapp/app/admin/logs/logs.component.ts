import { Component, OnInit } from '@angular/core';

import { Log, LoggersResponse, Level } from './log.model';
import { LogsService } from './logs.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SortByDirective } from '../../shared/sort/sort-by.directive';
import { SortDirective } from '../../shared/sort/sort.directive';
import { FormsModule } from '@angular/forms';
import { TranslateDirective } from '../../shared/language/translate.directive';
import { NgIf, NgFor, NgClass, SlicePipe } from '@angular/common';

@Component({
  selector: 'jhi-logs',
  templateUrl: './logs.component.html',
  standalone: true,
  imports: [NgIf, TranslateDirective, FormsModule, SortDirective, SortByDirective, FaIconComponent, NgFor, NgClass, SlicePipe],
})
export class LogsComponent implements OnInit {
  loggers?: Log[];
  filteredAndOrderedLoggers?: Log[];
  filter = '';
  orderProp: keyof Log = 'name';
  ascending = true;

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.findAndExtractLoggers();
  }

  changeLevel(name: string, level: Level): void {
    this.logsService.changeLevel(name, level).subscribe(() => this.findAndExtractLoggers());
  }

  filterAndSort(): void {
    this.filteredAndOrderedLoggers = this.loggers!.filter(
      logger => !this.filter || logger.name.toLowerCase().includes(this.filter.toLowerCase()),
    ).sort((a, b) => {
      if (a[this.orderProp] < b[this.orderProp]) {
        return this.ascending ? -1 : 1;
      } else if (a[this.orderProp] > b[this.orderProp]) {
        return this.ascending ? 1 : -1;
      } else if (this.orderProp === 'level') {
        return a.name < b.name ? -1 : 1;
      }
      return 0;
    });
  }

  private findAndExtractLoggers(): void {
    this.logsService.findAll().subscribe((response: LoggersResponse) => {
      this.loggers = Object.entries(response.loggers).map(([key, logger]) => new Log(key, logger.effectiveLevel));
      this.filterAndSort();
    });
  }
}
