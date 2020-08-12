import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
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
  selector: 'ns-suggestions',
  templateUrl: './suggestions.component.html'
})
export class SuggestionsComponent implements OnInit, OnDestroy {

  @Input() public selectedHashtags: string[];
  @Input() public excludedHashtags: string[];
  @Input() public hashtagsChanged: EventEmitter<void>;
  @Output() public onClickCensoredHashtag: EventEmitter<void> = new EventEmitter<void>();
  public suggestedHashtags: HashtagCategory = new HashtagCategory();
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

  public toggleHashtag(title: string): void {
    const index = this.selectedHashtags.indexOf(title);
    if (index > -1) {
      this.selectedHashtags.splice(index, 1);
    } else {
      this.selectedHashtags.push(title);
    }
    this.doAutoSuggestion();
  }

  public clickCensoredHashtag(): void {
    this.onClickCensoredHashtag.emit();
  }

  private doAutoSuggestion(): void {
    if (this.selectedHashtags.length < 5) {
      this.suggestedHashtags.tags = [];
      return;
    }
    const customerId = this.customerService.getCustomerId();
    if (!customerId) {
      new Toasty({ text: localize('error_desc3') })
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
    const newSuggestions = HashtagCategory.fromHashtagResult(hashtags, 'search');

    newSuggestions.tags.forEach(tag => {
      const exist = this.suggestedHashtags.tags.filter(x => x.title === tag.title)[0] !== undefined;
      const limit = 20;
      if (!exist && this.suggestedHashtags.tags.length < limit) {
        this.suggestedHashtags.tags.push(tag);
      }
    });

    const hasPurchase = this.userService.hasPurchase();
    if (!hasPurchase) {
      this.suggestedHashtags.censorHashtags();
    }
  }

}
