import { Component, OnInit, EventEmitter, Output, ViewContainerRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { isIOS } from 'tns-core-modules/platform';
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
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/common';
import { StoreService } from '~/app/storages/store.service';
import { PLANS } from '~/app/data/plans';
import { ModalComponent } from '~/app/shared/modal/modal.component';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  moduleId: module.id
})
export class SearchComponent implements OnInit, OnDestroy {

  @Output() public hashtagsChanged: EventEmitter<void> = new EventEmitter();
  @ViewChild('textField', { read: ElementRef, static: false }) public textField: ElementRef;
  @ViewChild('searchContainer', { read: ElementRef, static: false }) public searchContainer: ElementRef;
  public headerHeight: number = 0;
  public headerTop: number = 0;
  public isIOS: boolean;
  public isLoading: boolean;
  public nothingFound: boolean;
  public isError: boolean;
  public searchInput: string = '';
  public lastSearch: string = '';
  public hashtagCategory: HashtagCategory = undefined;
  public selectedHashtags: string[] = [];
  public excludedHashtags: string[] = [];
  public hasUnlocked: boolean;
  private price: string = '1,09 €';
  private purchaseSuccessfulSub: Subscription;
  private intervalId: number = 0;
  private placeholder: string[] = [];
  private placeholderIndex: number = 0;

  constructor(
    private readonly page: Page,
    private readonly evaluationRepository: EvaluationRepository,
    private readonly customerService: CustomerService,
    private readonly modalService: ModalDialogService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly storeService: StoreService,
    private readonly userService: UserService
  ) {
    this.page.actionBarHidden = true;
    this.isIOS = isIOS;
    disableIosSwipe(this.page, frame);
    this.calcHeader();
  }

  public ngOnInit(): void {
    this.price = PLANS.find(x => x.id === 'hashtagsunlimited').priceShort;
    this.hasUnlocked = this.userService.hasHashtagInspectorUnlocked();
    this.purchaseSuccessfulSub = this.storeService.onPurchasedSuccessful.subscribe(() => {
      this.hasUnlocked = true;
    });
    this.placeholder = ['summer', 'couple', 'pizza', 'girlfriend', 'cats', 'vegan', 'festival', 'travel', 'sports'];
    this.startAnimatedPlaceholder();
  }

  public ngOnDestroy(): void {
    this.stopAnimatedPlaceholder();
    if (!!this.purchaseSuccessfulSub) {
      this.purchaseSuccessfulSub.unsubscribe();
    }
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
    this.searchInput = this.searchInput.replace(/[^a-zA-Z ]/g, '').toLowerCase();
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
    this.isError = false;
    this.nothingFound = false;
    this.lastSearch = this.searchInput;
    this.hashtagCategory = undefined;
    this.selectedHashtags = [];
    this.excludedHashtags = [];
    const data: SearchRequest = {
      customerId,
      keyword: this.searchInput
    };
    this.stopAnimatedPlaceholder();
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
      const hasPurchase = this.userService.hasHashtagInspectorUnlocked();
      if (!hasPurchase) {
        this.hashtagCategory.censorHashtags();
      }
      this.setExcludedHashtags();
      this.searchContainer.nativeElement.animate({
        translate: { x: 0, y: 10 },
        height: 50
      });
    }, (_error: IHttpResponse) => {
      this.isError = true;
      this.isLoading = false;
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
    const hasPurchase = this.userService.hasPurchase();
    if (!hasPurchase) {
      text += ' ' + localize('search_paywall_locked');
    } else {
      text += ' ' + localize('search_paywall_unlocked');
    }
    return text;
  }

  public openUnlockModal(): void {
    const okFunc = () => {
      console.log('openUnlockModal');
      const item = 'tipstricks';
      this.storeService.onBuyProduct.emit(item);
    };
    const headline = PLANS.find(x => x.id === 'hashtagsunlimited').title;
    const desc = localize('search_iap_desc', this.price);
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {
        icon: 'cart',
        headline: headline,
        desc: desc,
        buttonOk: 'faq_buy_cta',
        buttonCancel: 'faq_buy_cancel',
        okFunc: okFunc
      }
    };
    this.modalService.showModal(ModalComponent, options);
  }

  public onTextFieldChange(): void {
    this.searchInput = this.textField.nativeElement.text;
  }

  // Prevent the first textfield from receiving focus on Android
  // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
  public handleAndroidFocus(textField: any, container: any): void {
    if (!!container.android) {
      container.android.setFocusableInTouchMode(true);
      container.android.setFocusable(true);
      textField.android.clearFocus();
    }
  }

  public onTextFieldFocus(): void {
    if (this.placeholder.indexOf(this.textField.nativeElement.text) !== -1) {
      this.setTextAreaText('');
    }
    this.stopAnimatedPlaceholder();
  }

  public onTextFieldBlur(): void {
    if (!this.textField.nativeElement.text) {
      this.startAnimatedPlaceholder();
    }
  }

  private setTextAreaText(text: string): void {
    this.textField.nativeElement.text = text;

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

  private startAnimatedPlaceholder(): void {
    setTimeout.bind(this)(() => {
      this.setTextAreaText(this.placeholder[this.placeholderIndex]);
    });
    this.intervalId = setInterval.bind(this)(() => {
      this.placeholderIndex++;
      if (this.placeholderIndex === this.placeholder.length) {
        this.placeholderIndex = 0;
      }
      this.setTextAreaText(this.placeholder[this.placeholderIndex]);
    }, 2000);
  }

  private stopAnimatedPlaceholder(): void {
    clearInterval(this.intervalId);
  }

}
