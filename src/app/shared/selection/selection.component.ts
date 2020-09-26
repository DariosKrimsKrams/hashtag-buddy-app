import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
const clipboard = require('nativescript-clipboard');
import { localize } from '@nativescript/localize';
import { UserService } from '~/app/storages/user.service';
import { ToastDuration, Toasty } from 'nativescript-toasty';

@Component({
  selector: 'ns-selection',
  templateUrl: './selection.component.html'
})
export class SelectionComponent implements OnInit {

  @Input() public selectedHashtags: string[];
  @Input() public excludedHashtags: string[];
  @Output() public onCopied: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDeselect: EventEmitter<string> = new EventEmitter<string>();
  @Output() public onHashtagToggled: EventEmitter<string> = new EventEmitter<string>();
  @Output() public onClickCensoredHashtag: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly userService: UserService
  ) { }

  public ngOnInit(): void {
  }

  public deselectHashtag(title: string): void {
    this.onDeselect.emit(title);
  }

  public copyToClipboard(title: string): void {
    if (this.showToastIfHasNoSelectedHashtags()) {
      return;
    }
    let text = this.getHashtagsAsText();
    if (!this.userService.hasPurchase()) {
      text += localize('results_made_with_app');
    }
    clipboard
      .setText(text)
      .then(() => {
        this.onCopied.emit();
      })
      .catch(function(): void {
        new Toasty({ text: localize('copy_failed') })
          .setToastDuration(ToastDuration.LONG)
          .show();
      });
  }

  public toggleHashtag(title: string): void {
    const index = this.selectedHashtags.indexOf(title);
    if (index > -1) {
      this.selectedHashtags.splice(index, 1);
    } else {
      this.selectedHashtags.push(title);
    }
    this.onHashtagToggled.emit(title);
  }

  public clickCensoredHashtag(): void {
    this.onClickCensoredHashtag.emit();
  }

  private showToastIfHasNoSelectedHashtags(): boolean {
    const hasSelectedHashtags = this.selectedHashtags.length > 0;
    if (!hasSelectedHashtags) {
      new Toasty({ text: localize('toast_no_hashtags_selected') })
        .setToastDuration(ToastDuration.LONG)
        .show();
    }
    return !hasSelectedHashtags;
  }

  private getHashtagsAsText(): string {
    let text = '';
    for (let i = 0; i < this.selectedHashtags.length; i++) {
      text += `#${this.selectedHashtags[i]} `;
    }
    return text;
  }

}
