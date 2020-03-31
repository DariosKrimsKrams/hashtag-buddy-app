import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { PLANS } from '~/app/data/plans';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as purchase from 'nativescript-purchase';
import { Plan } from '~/app/models/plan';
import { localize } from 'nativescript-localize/angular';
import { isAndroid } from 'tns-core-modules/platform';
import * as frame from 'tns-core-modules/ui/frame';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { StoreService } from '~/app/storages/store.service';

@Component({
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  moduleId: module.id
})
export class StoreComponent implements OnInit {
  public plans: Plan[] = PLANS;

  constructor(
    private readonly page: Page,
    private readonly storeService: StoreService,
  ) {
    this.page.actionBarHidden = true;
    disableIosSwipe(this.page, frame);
  }

  public ngOnInit(): void {
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  public buyProduct(plan: Plan): void {
    this.storeService.onBuyProduct.emit(plan.id);
  }

  public restore(): void {
    purchase.restorePurchases();
  }

  public getOutroText(): string {
    const key = 'store_outro_' + (isAndroid ? 'google' : 'apple');
    const company = localize(key);
    return localize('store_outro', company);
  }

}
