import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as frame from 'tns-core-modules/ui/frame';
import * as utils from 'tns-core-modules/utils/utils';
import { UserService } from '~/app/storages/user.service';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { CustomerService } from '~/app/storages/customer.service';
import { EvaluationRepository } from '~/app/services/repositories/evaluation-repository.service';
import { SearchRequest } from '~/app/models/request/search-request';
import { IHttpResponse } from '~/app/models/request/http-response';
import { Toasty, ToastDuration } from 'nativescript-toasty';
import { HashtagResult } from '~/app/models/hashtag-result';
import { HashtagCategory } from '~/app/models/hashtag-category';
import { localize } from 'nativescript-localize/angular';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  moduleId: module.id
})
export class SearchComponent implements OnInit {

  @Output() public hashtagsChanged: EventEmitter<void> = new EventEmitter();
  public headerHeight: number = 0;
  public headerTop: number = 0;
  public isIOS: boolean;
  public isLoading: boolean;
  public nothingFound: boolean;
  public searchInput: string = '';
  public lastSearch: string = '';
  public hashtagCategory: HashtagCategory = undefined;
  public selectedHashtags: string[] = [];
  public excludedHashtags: string[] = [];

  constructor(
    private readonly page: Page,
    private readonly evaluationRepository: EvaluationRepository,
    private readonly customerService: CustomerService,
    private readonly userService: UserService
  ) {
    this.page.actionBarHidden = true;
    this.isIOS = isIOS;
    disableIosSwipe(this.page, frame);
    this.calcHeader();
  }

  public ngOnInit(): void {
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  public dismissSoftKeyboard(): void {
    if (isIOS) {
      frame.Frame.topmost().nativeView.endEditing(true);
    } else {
      utils.ad.dismissSoftInput();
    }
  }

  public search(): void {
    this.searchInput = this.searchInput.replace(/[^a-zA-Z ]/g, '');
    if (!this.searchInput || this.searchInput === this.lastSearch) {
      return;
    }
    const customerId = this.customerService.getCustomerId();
    if (!customerId) {
      new Toasty({ text: 'Customer error. Try restarting the app and be online.' })
      .setToastDuration(ToastDuration.LONG)
      .show();
    }
    this.isLoading = true;
    this.nothingFound = false;
    this.lastSearch = this.searchInput;
    this.hashtagCategory = undefined;
    this.selectedHashtags = [];
    this.excludedHashtags = [];
    const data: SearchRequest = {
      customerId,
      keyword: this.searchInput
    };
    this.evaluationRepository.search(data).subscribe((httpResponse: IHttpResponse) => {
      const response = httpResponse as any;
      const hashtags = response.hashtags as HashtagResult[];
      if (hashtags.length === 0) {
        const lastChar = this.searchInput.substr(this.searchInput.length - 1);
        if (lastChar === 's') {
          this.searchInput = this.searchInput.substring(0, this.searchInput.length - 1);
          this.search();
          return;
        }
        this.nothingFound = true;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      this.hashtagCategory = HashtagCategory.fromHashtagResult(hashtags, 'search');
      const hasPurchase = this.userService.hasPurchase();
      if (!hasPurchase) {
        this.hashtagCategory.censorHashtags();
      }
      this.setExcludedHashtags();
    });
    this.dismissSoftKeyboard();
  }

  public toggleHashtag(title: string): void {
    const index = this.selectedHashtags.indexOf(title);
    if (index > -1) {
      this.selectedHashtags.splice(index, 1);
    } else {
      this.selectedHashtags.push(title);
    }
    this.hashtagsChanged.emit();
    this.setExcludedHashtags();
  }

  public copyToClipboard(): void {
    const text = localize('copy_successful');
    new Toasty({ text: text })
      .setToastDuration(ToastDuration.LONG)
      .show();
  }

  public deselectHashtag(title: string): void {
    for (let i = 0; i < this.selectedHashtags.length; i++) {
      if (this.selectedHashtags[i].toLowerCase() === title.toLowerCase()) {
        this.selectedHashtags.splice(i, 1);
        return;
      }
    }
    this.setExcludedHashtags();
  }

  public get introText(): string {
    let text = localize('search_intro');
    text += ' ' + localize('search_paywall_info');
    return text;
  }

  private calcHeader(): void {
    const data = this.userService.calcHeader(1080, 416, 140);
    this.headerHeight = data.height;
    this.headerTop = data.top;
  }

  private setExcludedHashtags(): void {
    this.excludedHashtags = [];
    this.hashtagCategory.tags.forEach(tag => {
      this.excludedHashtags.push(tag.title);
    });
    this.excludedHashtags.push(this.searchInput);
  }

}
