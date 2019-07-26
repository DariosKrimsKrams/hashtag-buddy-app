import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { PLAN } from '~/app/data/plans';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as purchase from 'nativescript-purchase';
import { Product } from 'nativescript-purchase/product';
import { Transaction, TransactionState } from 'nativescript-purchase/transaction';
import { Plan } from '~/app/models/plan';
import * as Toast from 'nativescript-toast';
import { localize } from 'nativescript-localize/angular';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { isAndroid } from 'tns-core-modules/platform';
import { UserService } from '~/app/storages/user.service';
import { PhotosCountService } from '~/app/storages/photos-count.service';

@Component({
  selector: 'ns-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  moduleId: module.id
})
export class StoreComponent implements OnInit {
  openmenu = false;
  plans: Plan[] = PLAN;

  constructor(
    private readonly page: Page,
    private readonly userService: UserService,
    private readonly photosCountService: PhotosCountService
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    console.log('ngOnInit');
    let products = [
      'small',
      'medium',
      'large',
      'unlimited1month',
      'unlimited3months'
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
    let cheapestSubs: Plan;
    this.plans.map(x => {
      if (x.product === undefined) {
        return;
      }
      x.desc = x.product.localizedDescription;
      if (
        x.product.productType === 'inapp' &&
        (cheapestInApp === undefined ||
          x.product.priceAmount < cheapestInApp.product.priceAmount)
      ) {
        cheapestInApp = x;
      } else if (
        x.product.productType === 'subs' &&
        (cheapestSubs === undefined ||
          x.product.priceAmount * x.amount < cheapestSubs.product.priceAmount)
      ) {
        cheapestSubs = x;
      }
    });
    cheapestInApp.pricePerPhoto =
      cheapestInApp.product.priceAmount / cheapestInApp.amount;
    cheapestSubs.pricePerPhoto =
      cheapestSubs.product.priceAmount / cheapestSubs.amount;
    this.plans.forEach(x => {
      if (x.product === undefined) {
        return;
      }
      if (x.product.productType === 'inapp' && x.id !== cheapestInApp.id) {
        x.pricePerPhoto = x.product.priceAmount / x.amount;
        let discount =
          (1 - x.pricePerPhoto / cheapestInApp.pricePerPhoto) * 100;
        x.discount = Math.round(discount);
      } else if (x.product.productType === 'subs' && x.id !== cheapestSubs.id) {
        x.pricePerPhoto = x.product.priceAmount;
        let discount = (1 - x.pricePerPhoto / cheapestSubs.pricePerPhoto) * 100;
        x.discount = Math.round(discount);
      }
    });
  }

  openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeMenu() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  buyProduct(plan: Plan) {
    let product = plan.product;
    if (purchase.canMakePayments()) {
      purchase.buyProduct(product);
    } else {
      Toast.makeText(localize('store_buy_failed')).show();
    }
  }

  restore() {
    purchase.restorePurchases();
  }

  private onProductBought(transaction: Transaction): void {
    if (isAndroid) {
      let plan = this.getPlanById(transaction.productIdentifier);
      if (plan.type === 'inapp') {
        purchase
          .consumePurchase(transaction.transactionReceipt)
          .then(responseCode => {
            console.log('responseCode: ' + responseCode); // If responseCode === 0 the purchase has been successfully consumed
            if (responseCode === 0) {
              this.buyingProductSuccessful(transaction);
            } else {
              console.log(`Failed to consume with code: ${responseCode}`);
              // alert(`Failed to consume with code: ${responseCode}! :'(`);
            }
          })
          .catch(e => {
            console.log(e);
            alert(`Failed to consume: ${e}`);
          });
      } else {
        this.buyingProductSuccessful(transaction);
      }
    } else {
      this.buyingProductSuccessful(transaction);
    }
  }

  private buyingProductSuccessful(transaction: Transaction): void {
    this.savePurchase(transaction);
    this.showBoughtPopup(transaction);
  }

  private showBoughtPopup(transaction: Transaction): void {
    let plan = this.getPlanById(transaction.productIdentifier);
    let title = localize('iap_purchase_successful_title');
    let msg = localize('iap_purchase_successful_msg', plan.title);
    let btn = localize('iap_purchase_successful_btn');
    this.showPopup(title, msg, btn);
  }

  private onProductRestored(transaction: Transaction): void {
    this.savePurchase(transaction);
    this.showRestorePopup(transaction);
  }

  private showRestorePopup(transaction: Transaction): void {
    let plan = this.getPlanById(
      transaction.originalTransaction.productIdentifier
    );
    let title = localize('iap_restored_successful_title');
    let msg = localize('iap_restored_successful_msg', plan.title);
    let btn = localize('iap_restored_successful_btn');
    this.showPopup(title, msg, btn);
  }

  private onTransactionFailed(transaction: Transaction): void {
    console.log(`Purchase of ${transaction.productIdentifier} was canceled!`);
    Toast.makeText(localize('iap_purchase_failed')).show();
  }

  private showPopup(title: string, msg: string, btn: string): void {
    dialogs.alert({
      title: title,
      message: msg,
      okButtonText: btn
    });
  }

  private savePurchase(transaction: Transaction): void {
    console.log('addPurchase');
    this.userService.addPurchase(transaction);

    let plan = this.getPlanById(transaction.productIdentifier);
    if (plan.type === 'inapp') {
      let amount = plan.amount;
      this.photosCountService.addPayedPhotos(amount);
    } else {
      // is ABO
    }
  }
}
