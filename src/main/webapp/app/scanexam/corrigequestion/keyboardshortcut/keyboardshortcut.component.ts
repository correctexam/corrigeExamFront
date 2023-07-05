/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IKeyBoardShortCutPreferenceEntry, KeyboardShortcutService } from 'app/scanexam/preference-page/keyboardshortcut.service';
import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'jhi-keyboardshortcut',
  templateUrl: './keyboardshortcut.component.html',
  styleUrls: ['./keyboardshortcut.component.scss'],
})
export class KeyboardshortcutComponent implements AfterViewInit {
  @ViewChild('input') input: ElementRef | undefined;
  @ViewChild(KeyboardShortcutsComponent) keyboard!: KeyboardShortcutsComponent;

  @Input()
  examId = 0;
  @Input()
  questionindex = 0;

  @Output()
  toggleTCommentById: EventEmitter<number> = new EventEmitter();
  @Output()
  toggleGCommentById: EventEmitter<number> = new EventEmitter();

  public keyboardShortcuts: ShortcutInput[] = [];
  public shortcutLog = '';
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected keyboardShortcutService: KeyboardShortcutService,
    protected translateService: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this.installKeyBindings();
  }

  private installKeyBindings(): void {
    if (this.keyboardShortcutService.getShortCutPreference().shortcuts.has(this.examId + '_' + this.questionindex)) {
      const res: IKeyBoardShortCutPreferenceEntry[] = this.keyboardShortcutService
        .getShortCutPreference()
        .shortcuts.get(this.examId + '_' + this.questionindex)!;
      res
        .filter(e1 => e1.examId === +this.examId && e1.questionIndex === +this.questionindex)
        .forEach(entry => {
          const textComment = entry.textComment;
          this.keyboardShortcuts.push({
            key: entry.key,
            label: this.translateService.instant('gradeScopeIsticApp.comments.detail.title'),
            description: 'toggle ' + entry.description,
            command: () => {
              if (textComment) {
                this.toggleTCommentById.emit(entry.commentId);
              } else {
                this.toggleGCommentById.emit(entry.commentId);
              }
            },
            preventDefault: true,
          });
        });
    }
  }
}
