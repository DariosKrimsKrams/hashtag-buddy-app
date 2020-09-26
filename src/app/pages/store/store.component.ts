import { Component, OnInit } from '@angular/core';
import { PLANS } from '~/app/data/plans';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Plan } from '~/app/models/plan';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { StoreService } from '~/app/storages/store.service';
import { UserService } from '~/app/storages/user.service';
import { isAndroid, isIOS, Application, Page } from '@nativescript/core';
import { localize } from '@nativescript/localize';

@Component({
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  moduleId: module.id
})
export class StoreComponent implements OnInit {
  public plans: Plan[] = PLANS;
  public headerHeight: number = 0;
  public headerTop: number = 0;
  public isIOS: boolean;

  constructor(
    private readonly page: Page,
    private readonly storeService: StoreService,
    private readonly userService: UserService
  ) {
    this.page.actionBarHidden = true;
    this.isIOS = isIOS;
    disableIosSwipe(this.page);
    this.calcHeader();
  }

  public ngOnInit(): void {
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  public buyProduct(plan: Plan): void {
    this.storeService.onBuyProduct.emit(plan.id);
  }

  public restore(): void {
    this.storeService.onRestorePurchases.emit();
  }

  public getOutroText(): string {
    const key = 'store_outro_' + (isAndroid ? 'google' : 'apple');
    const company = localize(key);
    return localize('store_outro', company);
  }

  public getPrice(plan: Plan): string {
    return !!plan.product ? plan.product.priceFormatted : plan.priceFallback;
  }

  private calcHeader(): void {
    const data = this.userService.calcHeader(1080, 416, 140);
    this.headerHeight = data.height;
    this.headerTop = data.top;
  }

}
