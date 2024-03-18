/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IKeyBoardShortCutPreferenceEntry, KeyboardShortcutService } from 'app/scanexam/preference-page/keyboardshortcut.service';
import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { IGradedComment } from '../../../entities/graded-comment/graded-comment.model';
import { ITextComment } from '../../../entities/text-comment/text-comment.model';
import { IHybridGradedComment } from 'app/entities/hybrid-graded-comment/hybrid-graded-comment.model';

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

  @Input()
  textcomments?: Signal<ITextComment>[];
  @Input()
  gradedcomments?: Signal<IGradedComment>[];

  @Input()
  hybridgradedcomments?: Signal<IHybridGradedComment>[];

  @Output()
  toggleTCommentById: EventEmitter<number> = new EventEmitter();
  @Output()
  toggleGCommentById: EventEmitter<number> = new EventEmitter();

  @Output()
  toggleHCommentById: EventEmitter<number> = new EventEmitter();

  public keyboardShortcuts: ShortcutInput[] = [];
  public shortcutLog = '';
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected keyboardShortcutService: KeyboardShortcutService,
    protected translateService: TranslateService,
  ) {}

  ngAfterViewInit(): void {
    this.installKeyBindings();
  }

  private installKeyBindings(): void {
    const toRemove: number[] = [];
    const comments: (IGradedComment | ITextComment | IHybridGradedComment)[] = [];
    if (this.gradedcomments) {
      comments.push(...this.gradedcomments.map(e => e()));
    }
    if (this.textcomments) {
      comments.push(...this.textcomments.map(e => e()));
    }
    if (this.hybridgradedcomments) {
      comments.push(...this.hybridgradedcomments.map(e => e()));
    }

    if (this.keyboardShortcutService.getShortCutPreference().shortcuts.has(this.examId + '_' + this.questionindex)) {
      const res: IKeyBoardShortCutPreferenceEntry[] = this.keyboardShortcutService
        .getShortCutPreference()
        .shortcuts.get(this.examId + '_' + this.questionindex)!;
      res
        .filter(e1 => e1.examId === +this.examId && e1.questionIndex === +this.questionindex)
        .forEach(entry => {
          const textComment = entry.textComment;
          const hybridcomment = entry.hybridComment;
          toRemove.push(entry.commentId);
          this.keyboardShortcuts.push({
            key: entry.key,
            label: this.translateService.instant('gradeScopeIsticApp.comments.detail.title'),
            description: 'toggle ' + entry.description,
            command: () => {
              if (textComment) {
                this.toggleTCommentById.emit(entry.commentId);
              } else if (hybridcomment) {
                this.toggleHCommentById.emit(entry.commentId);
              } else {
                this.toggleGCommentById.emit(entry.commentId);
              }
            },
            preventDefault: true,
          });
        });
    }
    for (const { index, comment } of comments.map((c1, i) => ({ index: i, comment: c1 }))) {
      if (!toRemove.includes(comment.id!)) {
        let sh = '' + (index + 1);
        let createShortcut = true;
        if (index + 1 > 9 && index + 1 < 36) {
          sh = String.fromCharCode(87 + index + 1);
        } else if (index + 1 >= 36) {
          createShortcut = false;
        }
        if (createShortcut) {
          this.keyboardShortcuts.push({
            key: ['ctrl + ' + sh, 'cmd + ' + sh],
            label: this.translateService.instant('gradeScopeIsticApp.comments.detail.title'),
            description: 'toggle ' + comment.text,
            command: () => {
              if ('step' in comment) {
                this.toggleHCommentById.emit(comment.id);
              } else if ('grade' in comment) {
                this.toggleGCommentById.emit(comment.id);
              } else {
                this.toggleTCommentById.emit(comment.id);
              }
            },
            preventDefault: true,
          });
        }
      }
    }
  }
}
