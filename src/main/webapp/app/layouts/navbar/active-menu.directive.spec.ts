import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActiveMenuDirective } from './active-menu.directive';

@Component({
  standalone: true,
  imports: [ActiveMenuDirective],
  template: '<li jhiActiveMenu="fr">fr</li>',
})
class HostComponent {}

describe('ActiveMenuDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HostComponent],
    }).compileComponents();
  });

  it('follows the current language', () => {
    const fixture = TestBed.createComponent(HostComponent);
    const translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
    const li: HTMLElement = fixture.nativeElement.querySelector('li');

    translate.use('fr');
    expect(li.classList.contains('active')).toBe(true);

    translate.use('en');
    expect(li.classList.contains('active')).toBe(false);
  });

  it('stops listening to language changes once destroyed', () => {
    const fixture = TestBed.createComponent(HostComponent);
    const translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
    const li: HTMLElement = fixture.nativeElement.querySelector('li');
    expect(li.classList.contains('active')).toBe(false);

    fixture.destroy();
    // a leaked subscription would still update the destroyed element
    translate.use('fr');

    expect(li.classList.contains('active')).toBe(false);
  });
});
