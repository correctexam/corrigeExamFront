import { Component, OnInit } from '@angular/core';

import { ConfigurationService } from './configuration.service';
import { Bean, PropertySource } from './configuration.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SortByDirective } from '../../shared/sort/sort-by.directive';
import { SortDirective } from '../../shared/sort/sort.directive';
import { FormsModule } from '@angular/forms';
import { TranslateDirective } from '../../shared/language/translate.directive';
import { NgIf, NgFor, JsonPipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'jhi-configuration',
  templateUrl: './configuration.component.html',
  standalone: true,
  imports: [NgIf, TranslateDirective, FormsModule, SortDirective, SortByDirective, FaIconComponent, NgFor, JsonPipe, KeyValuePipe],
})
export class ConfigurationComponent implements OnInit {
  allBeans!: Bean[];
  beans: Bean[] = [];
  beansFilter = '';
  beansAscending = true;
  propertySources: PropertySource[] = [];

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    this.configurationService.getBeans().subscribe(beans => {
      this.allBeans = beans;
      this.filterAndSortBeans();
    });

    this.configurationService.getPropertySources().subscribe(propertySources => (this.propertySources = propertySources));
  }

  filterAndSortBeans(): void {
    const beansAscendingValue = this.beansAscending ? -1 : 1;
    const beansAscendingValueReverse = this.beansAscending ? 1 : -1;
    this.beans = this.allBeans
      .filter(bean => !this.beansFilter || bean.prefix.toLowerCase().includes(this.beansFilter.toLowerCase()))
      .sort((a, b) => (a.prefix < b.prefix ? beansAscendingValue : beansAscendingValueReverse));
  }
}
