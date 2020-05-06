import { Component, OnInit } from '@angular/core';
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

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  moduleId: module.id
})
export class SearchComponent implements OnInit {

  public headerHeight: number = 0;
  public headerTop: number = 0;
  public isIOS: boolean;
  public searchInput: string = '';
  public lastSearch: string = '';
  public hashtagCategory: HashtagCategory = undefined;

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

  public dismissSoftKeybaord(): void {
    if (isIOS) {
      frame.Frame.topmost().nativeView.endEditing(true);
    }
    if (isAndroid) {
      utils.ad.dismissSoftInput();
    }
  }

  public search(): void {
    if (!this.searchInput || this.searchInput === this.lastSearch) {
      return;
    }
    const customerId = this.customerService.getCustomerId();
    if (!customerId) {
      new Toasty({ text: 'Customer error. Try restarting the app and be online.' })
      .setToastDuration(ToastDuration.LONG)
      .show();
    }
    this.lastSearch = this.searchInput;
    this.hashtagCategory = undefined;
    const data: SearchRequest = {
      customerId: customerId,
      keyword: this.searchInput
    };
    this.evaluationRepository.search(data).subscribe((httpResponse: IHttpResponse) => {
      const response = httpResponse as any;
      const hashtags = response.hashtags as HashtagResult[];
      if (hashtags.length === 0) {
        return;
      }
      this.hashtagCategory = HashtagCategory.fromHashtagResult(hashtags, 'search');
    });

  }

  private calcHeader(): void {
    const data = this.userService.calcHeader(1080, 416, 140);
    this.headerHeight = data.height;
    this.headerTop = data.top;
  }

}
