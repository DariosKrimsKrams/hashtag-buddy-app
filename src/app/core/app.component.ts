import { Component, OnInit, NgZone, ViewContainerRef, OnDestroy } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { RouterExtensions } from 'nativescript-angular/router';
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';
import { PhotosCountService } from '../storages/photos-count.service';
import { CustomerService, CustomerCreateStatus } from '../storages/customer.service';
import { localize } from 'nativescript-localize/angular';
import * as application from 'tns-core-modules/application';
import { UserService } from '../storages/user.service';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { ModalComponent } from '../shared/modal/modal.component';
import { openUrl } from 'tns-core-modules/utils/utils';
import { Subscription } from 'rxjs';
import { Page } from 'tns-core-modules/ui/page';
import { ToastDuration, Toasty } from 'nativescript-toasty';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
// IAP
import * as purchase from 'nativescript-purchase';
import { Product } from 'nativescript-purchase/product';
import { Transaction, TransactionState } from 'nativescript-purchase/transaction';
import { Plan } from '~/app/models/plan';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { StoreService } from '../storages/store.service';
import { PLANS } from '../data/plans';
import { CurrencyPipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'ns-app',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  public menus: string[] = [];
  public selected: boolean[] = [];
  public plans: Plan[] = PLANS;

  private _sideDrawerTransition: DrawerTransitionBase;
  private createUserFailedSubscription: Subscription;
  private openFeedbackModalSubscription: Subscription;
  private openTipsAndTricksPageSubscription: Subscription;
  private buyProductSubscription: Subscription;

  constructor(
    private readonly router: RouterExtensions,
    private readonly photosCountService: PhotosCountService,
    private readonly customerService: CustomerService,
    private readonly ngZone: NgZone,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly modalService: ModalDialogService,
    private readonly currencyPipe: CurrencyPipe,
    private readonly page: Page
  ) {}

  public ngOnInit(): void {
    this.menus = ['home', 'myhashtags', 'faq', 'store', 'settings'];
    if (isIOS) {
      this.menus.splice(1, 0, 'history');
    }

    this._sideDrawerTransition = new SlideInOnTopTransition();
    this.selected[0] = true;
    this.createUserFailedSubscription = this.customerService.createUserIdIfNotExist().subscribe(status => {
      if (status === CustomerCreateStatus.Failed) {
        setTimeout(() => {
          const text = localize('toast_create_customer_failed');
          new Toasty({ text: text })
            .setToastDuration(ToastDuration.LONG)
            .show();
        }, 2000);
      }
    });
    this.photosCountService.initFreePhotos();

    if (this.isNowGoodTimeToShowRateAppModalOnStartup()) {
      this.showRateAppModal();
    }

    this.openFeedbackModalSubscription = this.userService.openFeedbackModal.subscribe(x => {
      const status = this.userService.getRateAppStatus();
      if (status === 'rated' || status === 'never') {
        return;
      }
      this.showRateAppModal();
    });

    if (isAndroid) {
      application.android.on(application.AndroidApplication.activityBackPressedEvent, this.handleBackButtonPressed, this);
    }

    this.openTipsAndTricksPageSubscription = this.userService.openTipsAndTricksPage.subscribe(() => {
      this.selected = [];
      this.selected[2] = true;
    });

    this.buyProductSubscription = this.storeService.onBuyProduct.subscribe((x: string) => this.buyProduct(x));
    this.configureIap();
  }

  public ngOnDestroy(): void {
    if (!!this.createUserFailedSubscription) {
      this.createUserFailedSubscription.unsubscribe();
    }
    if (!!this.openFeedbackModalSubscription) {
      this.openFeedbackModalSubscription.unsubscribe();
    }
    if (!!this.openTipsAndTricksPageSubscription) {
      this.openTipsAndTricksPageSubscription.unsubscribe();
    }
    if (!!this.buyProductSubscription) {
      this.buyProductSubscription.unsubscribe();
    }
    if (isAndroid) {
      application.android.off(application.AndroidApplication.activityBackPressedEvent, this.handleBackButtonPressed, this);
    }
  }

  private handleBackButtonPressed(args: any): void {
    args.cancel = true;
    const path = this.router.locationStrategy.path();
    const isResults = path.substring(0, 13) === '/home/results';
    console.log('path', path, isResults);
    if (path === '/') {
      // otherwise it would result in a crash if no "return"
      return;
    }
    if (isResults) {
      this.ngZone.run(() => {
        this.router.navigate(['home'], { clearHistory: true });
      });
    } else if (path === '/home') {
      this.ngZone.run(() => {
        this.userService.androidBackTriggered.emit(path);
      });
    } else if (path === '/home/loading-hashtags') {
      // do nothing
    } else {
      if (this.router.canGoBack()) {
        this.router.back();
      }
      // update SideMenu curStatus
    }
    // if old=results and before=home & before != "loading" -> open home History
    // this.userService.onAndroidBackTriggered(path);
  }

  private showRateAppModal(): void {
    const okFunc = () => {
      this.userService.saveRateAppStatus('rated');
      this.userService.appRatedTriggered.emit();
      const text = localize('feedback_successful_headline');
      new Toasty({ text: text })
        .setToastDuration(ToastDuration.LONG)
        .show();
      const link = isAndroid ? localize('link_playstore') : localize('link_appstore');
      openUrl(link);
    };
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {
        headline: 'rate_headline',
        headline2: 'rate_stars',
        desc: 'rate_desc',
        buttonOk: 'rate_yes',
        buttonCancel: 'rate_later',
        okFunc: okFunc
      }
    };
    setTimeout.bind(this)(() => {
      this.modalService.showModal(ModalComponent, options).then(() => {
        this.saveRateAppStatus();
      });
    }, 300);
  }

  private isNowGoodTimeToShowRateAppModalOnStartup(): boolean {
    const status = this.userService.getRateAppStatus();
    if (status === 'rated' || status === 'never') {
      return false;
    } else if (status === undefined && this.userService.countPhotos() >= 2) {
      return true;
    } else if (status === 'later' && this.userService.countPhotos() >= 3) {
      return false;
    }
    return false;
  }

  private saveRateAppStatus(): void {
    const status = this.userService.getRateAppStatus();
    if (status === 'rated') {
      return;
    }
    this.userService.saveRateAppStatus('later');
  }

  public get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  public openPage(index: number): void {
    this.selected = [];
    this.selected[index] = true;
    this.closeMenu();
    let route = this.menus[index];
    if (route === 'history') {
      route = 'historyoverview';
    }
    this.router.navigate(['/' + route], {
      transition: {
        name: 'fadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  public closeMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }


  /************* SHOP LOGIC IAP **************/

  private getPlanById(id: string): Plan {
    return this.plans.filter(x => x.id === id)[0];
  }

  private configureIap(): void {
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
              plan.priceShort = this.minifyPrice(plan.product.priceFormatted);
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

  private minifyPrice(price: string): string {
    let parts = price.split('.00');
    if (parts.length === 2) {
      return parts.join('');
    } else {
      parts = price.split(',00');
      if (parts.length === 2) {
        return parts.join('');
      }
    }
    return price;
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

  private onTransactionFailed(transaction: Transaction): void {
    console.log(`Purchase of ${transaction.productIdentifier} was canceled!`);
    const text = localize('iap_purchase_failed');
    new Toasty({ text: text })
      .setToastDuration(ToastDuration.LONG)
      .show();
  }

  private buyProduct(item: string): void {
    const plan = this.getPlanById(item);
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
    const desc = localize('iap_purchase_successful_msg', plan.title);

    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {
        icon: 'copied',
        headline: 'iap_purchase_successful_title',
        desc: desc,
        buttonOk: 'iap_purchase_successful_btn'
      }
    };
    this.modalService.showModal(ModalComponent, options);
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
    dialogs.alert({
      title: title,
      message: msg,
      okButtonText: btn
    });
  }

  private savePurchase(transaction: Transaction): void {
    this.userService.addPurchase(transaction);
    const plan = this.getPlanById(transaction.productIdentifier);
    console.log('Product bought: ' + plan.product.productIdentifier);
    if (plan.amount !== 0) {
      this.photosCountService.addPayedPhotos(plan.amount);
    }
    if (plan.tipstrick) {
      this.userService.unlockedTipsTricks();
    }
  }

}
