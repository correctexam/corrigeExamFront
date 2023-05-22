import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'jhi-usable-text-input',
  templateUrl: './usable-text-input.component.html',
  styleUrls: ['./usable-text-input.component.scss'],
})
export class UsableTextInputComponent {
  public textIsEditing = false;

  @Input()
  public name = '';

  @Input()
  public tooltip = '';

  @Input()
  public placeholder = '';

  @Output()
  private newValue = new EventEmitter<string>();

  public onToggleButton(textInput: HTMLInputElement): void {
    if (this.textIsEditing && this.name !== textInput.value) {
      this.newValue.next(textInput.value);
    }

    this.textIsEditing = !this.textIsEditing;
  }

  public cancelEdit(textInput: HTMLInputElement): void {
    this.textIsEditing = false;
    textInput.value = this.name;
    // Dirty, but required to launch the validation
    textInput.dispatchEvent(new Event('input'));
  }
}
