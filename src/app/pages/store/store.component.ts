import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { PLAN } from '~/app/data/plans';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as purchase from 'nativescript-purchase';
import { Product } from 'nativescript-purchase/product';
import { Transaction, TransactionState } from 'nativescript-purchase/transaction';
import { Plan } from '~/app/models/plan';
import { ToastDuration, Toasty } from 'nativescript-toasty';
import { localize } from 'nativescript-localize/angular';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { isAndroid } from 'tns-core-modules/platform';
import { UserService } from '~/app/storages/user.service';
import { PhotosCountService } from '~/app/storages/photos-count.service';
import { CurrencyPipe } from '@angular/common';
import * as frame from 'tns-core-modules/ui/frame';
import { disableIosSwipe } from '~/app/shared/status-bar-util';

@Component({
  selector: 'ns-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  moduleId: module.id
})
export class StoreComponent implements OnInit {
  public openmenu = false;
  public plans: Plan[] = PLAN;

  constructor(
    private readonly page: Page,
    private readonly userService: UserService,
    private readonly photosCountService: PhotosCountService,
    private readonly currencyPipe: CurrencyPipe
  ) {
    this.page.actionBarHidden = true;
    disableIosSwipe(this.page, frame);
  }

  public ngOnInit(): void {
    const products = [
      'tipstricks',
      'small',
      'medium',
      'large',
    ];
    (global as any).purchaseInitPromise = purchase.init(products);

    (global as any).purchaseInitPromise
      .then(() => {
        purchase
          .getProducts()
          .then((products: Array<Product>) => {
            products.forEach((product: Product) => {
              let plan = this.getPlanById(product.productIdentifier);
              if (plan !== undefined) {
                plan.product = product;
              } else {
                plan = new Plan({
                  id: product.productIdentifier,
                  image: '~/app/assets/images/0.png',
                  product: product
                });
                this.plans.push(plan);
              }
              plan.title = product.localizedTitle.split(' (')[0];
            });
            this.calcDiscount();
            this.calcLocas();
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });

    purchase.on(
      purchase.transactionUpdatedEvent,
      (transaction: Transaction) => {
        console.log('IAP event: ' + transaction.transactionState);
        console.log(transaction);

        switch (transaction.transactionState) {
          case TransactionState.Purchased:
            this.onProductBought(transaction);
            break;
          case TransactionState.Restored:
            this.onProductRestored(transaction);
            break;
          case TransactionState.Failed:
            this.onTransactionFailed(transaction);
            break;
          case TransactionState.Purchasing:
            break;
        }
      }
    );
  }

  private getPlanById(id: string): Plan {
    return this.plans.filter(x => x.id === id)[0];
  }

  private calcDiscount(): void {
    let cheapestInApp: Plan;
    this.plans.map(x => {
      if (x.product === undefined) {
        return;
      }
      x.desc = x.product.localizedDescription;
      if (
        x.product.productType === 'inapp' &&
        x.product.productIdentifier !== 'tipstricks' &&
        (cheapestInApp === undefined ||
          x.product.priceAmount < cheapestInApp.product.priceAmount)
      ) {
        cheapestInApp = x;
      }
    });
    cheapestInApp.pricePerPhoto =
      cheapestInApp.product.priceAmount / cheapestInApp.amount;
    this.plans.forEach(plan => {
      if (plan.product === undefined) {
        return;
      }
      if (plan.product.productType === 'inapp' && plan.id !== cheapestInApp.id) {
        plan.pricePerPhoto = plan.product.priceAmount / plan.amount;
        const discount =
          (1 - plan.pricePerPhoto / cheapestInApp.pricePerPhoto) * 100;
        plan.discount = Math.round(discount);
      }
    });
  }

  private calcLocas(): void {
    this.plans.forEach(plan => {
      if (plan.amount !== 0) {
        const formattedPrice = this.currencyPipe.transform(plan.pricePerPhoto, plan.product.priceCurrencyCode);
        const text = '(' + localize('store_price_per_photo', formattedPrice) + ')';
        plan.desc2 = text;
      }
    });
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  public buyProduct(plan: Plan): void {
    const product = plan.product;
    if (purchase.canMakePayments()) {
      purchase.buyProduct(product);
    } else {
      const text = localize('store_buy_failed');
      new Toasty({ text: text })
        .setToastDuration(ToastDuration.LONG)
        .show();
    }
  }

  public restore(): void {
    purchase.restorePurchases();
  }

  public getOutroText(): string {
    const key = 'store_outro_' + (isAndroid ? 'google' : 'apple');
    const company = localize(key);
    return localize('store_outro', company);
  }

  private onProductBought(transaction: Transaction): void {
    if (isAndroid) {
      purchase.consumePurchase(transaction.transactionReceipt)
        .then(responseCode => {
          console.log('responseCode: ' + responseCode);
          if (responseCode === 0) {
            this.buyingProductSuccessful(transaction);
          } else {
            console.log(`Failed to consume with code: ${responseCode}`);
          }
        })
        .catch(err => {
          console.log(err);
          alert(`Failed to consume: ${err}`);
        });
    } else {
      this.buyingProductSuccessful(transaction);
    }
  }

  private buyingProductSuccessful(transaction: Transaction): void {
    this.savePurchase(transaction);
    this.showBoughtPopup(transaction);
  }

  private showBoughtPopup(transaction: Transaction): void {
    const plan = this.getPlanById(transaction.productIdentifier);
    const title = localize('iap_purchase_successful_title');
    const msg = localize('iap_purchase_successful_msg', plan.title);
    const btn = localize('iap_purchase_successful_btn');
    this.showPopup(title, msg, btn);
  }

  private onProductRestored(transaction: Transaction): void {
    this.savePurchase(transaction);
    this.showRestorePopup(transaction);
  }

  private showRestorePopup(transaction: Transaction): void {
    const plan = this.getPlanById(
      transaction.originalTransaction.productIdentifier
    );
    const title = localize('iap_restored_successful_title');
    const msg = localize('iap_restored_successful_msg', plan.title);
    const btn = localize('iap_restored_successful_btn');
    this.showPopup(title, msg, btn);
  }

  private onTransactionFailed(transaction: Transaction): void {
    console.log(`Purchase of ${transaction.productIdentifier} was canceled!`);
    const text = localize('iap_purchase_failed');
    new Toasty({ text: text })
      .setToastDuration(ToastDuration.LONG)
      .show();
  }

  private showPopup(title: string, msg: string, btn: string): void {
    dialogs.alert({
      title: title,
      message: msg,
      okButtonText: btn
    });
  }

  private savePurchase(transaction: Transaction): void {
    this.userService.addPurchase(transaction);
    const plan = this.getPlanById(transaction.productIdentifier);
    if (plan.amount !== 0) {
      this.photosCountService.addPayedPhotos(plan.amount);
    }
    if (plan.tipstrick) {
      this.userService.unlockedTipsTricks();
    }
  }
}
