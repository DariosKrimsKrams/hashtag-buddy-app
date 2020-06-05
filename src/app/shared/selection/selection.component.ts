import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
const clipboard = require('nativescript-clipboard');
import { localize } from 'nativescript-localize/angular';
import { UserService } from '~/app/storages/user.service';
import { ToastDuration, Toasty } from 'nativescript-toasty';
import { EvaluationRepository } from '~/app/services/repositories/evaluation-repository.service';
import { SearchMultipleRequest } from '~/app/models/request/search-multiple-request';
import { CustomerService } from '~/app/storages/customer.service';
import { IHttpResponse } from '~/app/models/request/http-response';
import { HashtagResult } from '~/app/models/hashtag-result';
import { HashtagCategory } from '~/app/models/hashtag-category';
import { Subscription } from 'rxjs';
import { Hashtag } from '~/app/models/hashtag';

@Component({
  selector: 'ns-selection',
  templateUrl: './selection.component.html'
})
export class SelectionComponent implements OnInit, OnDestroy {

  @Input() public selectedHashtags: string[];
  @Input() public excludedHashtags: string[];
  @Input() public hashtagsChanged: EventEmitter<void>;
  @Output() public onCopied: EventEmitter<void> = new EventEmitter();
  @Output() public onDeselect: EventEmitter<string> = new EventEmitter<string>();
  public suggestedHashtags: HashtagCategory = undefined;
  private subscription: Subscription;

  constructor(
    private readonly evaluationRepository: EvaluationRepository,
    private readonly customerService: CustomerService,
    private readonly userService: UserService
  ) { }

  public ngOnInit(): void {
    if (!!this.hashtagsChanged) {
      this.subscription = this.hashtagsChanged.subscribe(() => this.doAutoSuggestion());
    }
  }

  public ngOnDestroy(): void {
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
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
    this.doAutoSuggestion();
  }

  private showToastIfHasNoSelectedHashtags(): boolean {
    const hasSelectedHashtags = this.selectedHashtags.length > 0;
    if (!hasSelectedHashtags) {
      const text = localize('toast_no_hashtags_selected');
      new Toasty({ text: text })
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

  private doAutoSuggestion(): void {
    if (this.selectedHashtags.length < 3) {
      this.suggestedHashtags = undefined;
      return;
    }
    const customerId = this.customerService.getCustomerId();
    if (!customerId) {
      new Toasty({ text: 'Customer error. Try restarting the app and be online.' })
      .setToastDuration(ToastDuration.LONG)
      .show();
    }
    const data: SearchMultipleRequest = {
      customerId: customerId,
      keywords: this.selectedHashtags,
      excludeHashtags: this.excludedHashtags
    };
    this.evaluationRepository.searchMultiple(data).subscribe((httpResponse: IHttpResponse) => {
      const response = httpResponse as any;
      const hashtags = response.hashtags as HashtagResult[];
      this.processSearchResults(hashtags);
    }, (_error) => {
    });
  }

  private processSearchResults(hashtags: HashtagResult[]): void {
    if (hashtags.length === 0) {
      return;
    }
    hashtags = hashtags.slice(0, 15);
    this.suggestedHashtags = HashtagCategory.fromHashtagResult(hashtags, 'search');

    const selectedHashtags: Hashtag[] = [];
    this.selectedHashtags.forEach(selectedHashtag => {
      if (this.excludedHashtags.indexOf(selectedHashtag) === -1) {
        const exist = this.suggestedHashtags.tags.filter(x => x.title === selectedHashtag).length[0] !== undefined;
        if (!exist) {
          selectedHashtags.push(new Hashtag(selectedHashtag));
        }
      }
    });
    const hasPurchase = this.userService.hasPurchase();
    if (!hasPurchase) {
      this.suggestedHashtags.censorHashtags();
    }
    this.suggestedHashtags.tags = selectedHashtags.concat(this.suggestedHashtags.tags);
  }

}
