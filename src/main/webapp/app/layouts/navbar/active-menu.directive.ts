import { Directive, OnInit, ElementRef, Renderer2, Input, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Directive({
  selector: '[jhiActiveMenu]',
  standalone: true,
})
export class ActiveMenuDirective implements OnInit {
  @Input() jhiActiveMenu?: string;

  // completes the subscriptions to application-wide observables when the component is destroyed
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: LangChangeEvent) => {
      this.updateActiveFlag(event.lang);
    });

    this.updateActiveFlag(this.translateService.currentLang);
  }

  updateActiveFlag(selectedLanguage: string): void {
    if (this.jhiActiveMenu === selectedLanguage) {
      this.renderer.addClass(this.el.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'active');
    }
  }
}
