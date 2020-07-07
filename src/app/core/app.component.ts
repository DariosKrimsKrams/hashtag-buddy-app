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
import { ToastDuration, Toasty } from 'nativescript-toasty';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
// IAP
import * as purchase from 'nativescript-purchase';
import { Product } from 'nativescript-purchase/product';
import { Transaction, TransactionState } from 'nativescript-purchase/transaction';
import { Plan } from '~/app/models/plan';
import { StoreService } from '../storages/store.service';
import { PLANS } from '../data/plans';
import { CurrencyPipe } from '@angular/common';

@Component({
  moduleId: module.id,
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  public menus: string[] = [];
  public selected: boolean[] = [];
  public plans: Plan[] = PLANS;

  private _sideDrawerTransition: DrawerTransitionBase;
  private createUserFailedSubscription: Subscription;
  private openFeedbackModalSubscription: Subscription;
  private openPageSubscription: Subscription;
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
    private readonly currencyPipe: CurrencyPipe
  ) {}

  public ngOnInit(): void {
    this.menus = ['home', 'faq', 'search', 'myhashtags', 'store', 'settings'];
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

    this.openPageSubscription = this.userService.openPage.subscribe((page: string) => {
      this.selected = [];
      switch (page) {
        case 'tipstricks':
          if (isIOS) {
            this.selected[2] = true;
          } else {
            this.selected[1] = true;
          }
          break;
        case 'search':
          if (isIOS) {
            this.selected[3] = true;
          } else {
            this.selected[2] = true;
          }
          break;
      }
    });

    this.buyProductSubscription = this.storeService.onBuyProduct.subscribe((x: string) => this.buyProduct(x));
    this.buyProductSubscription = this.storeService.onRestorePurchases.subscribe(() => this.restorePurchases());
    this.configureIap();
  }

  public ngOnDestroy(): void {
    if (!!this.createUserFailedSubscription) {
      this.createUserFailedSubscription.unsubscribe();
    }
    if (!!this.openFeedbackModalSubscription) {
      this.openFeedbackModalSubscription.unsubscribe();
    }
    if (!!this.openPageSubscription) {
      this.openPageSubscription.unsubscribe();
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
    this.calcDiscount();
    const productIds = [
      'tipstricks',
      'small',
      'medium',
      'large',
      'hashtagsunlimited'
    ];
    (global as any).purchaseInitPromise = purchase.init(productIds);

    (global as any).purchaseInitPromise
      .then(() => {
        purchase
          .getProducts()
          .then((products: Array<Product>) => {
            products.forEach((product: Product) => {
              let plan = this.getPlanById(product.productIdentifier);
              if (!!plan) {
                plan.product = product;
              } else {
                plan = new Plan({
                  id: product.productIdentifier,
                  product: product
                });
                this.plans.push(plan);
              }
              plan.priceShort = this.minifyPrice(plan.product.priceFormatted);
            });
            this.calcDiscount();
            // this.calcLocas();
            this.calcBought();
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });

      purchase.on(purchase.transactionUpdatedEvent,
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
    this.plans.forEach((plan) => {
      if (plan.id === 'medium' || plan.id === 'large') {
        plan.discount = this.getDiscountPrice(plan.product);
      }
    });
  }

  // private calcLocas(): void {
  //   this.plans.forEach(plan => {
  //     if (!!plan.product) {
  //       if (!!plan.product.localizedTitle) {
  //         plan.title = plan.product.localizedTitle;
  //       }
  //       if (!!plan.product.localizedDescription) {
  //         plan.desc = plan.product.localizedDescription;
  //       }
  //     }
  //   });
  // }

  private calcBought(): void {
    this.plans.forEach(plan => {
      plan.bought = this.userService.hasPurchaseWithId(plan.id);
    });
  }

  private getDiscountPrice(product: Product): string {
    if (!product) {
      return '';
    }
    const lastPrice = product.priceAmount * 1.4;
    const diff = lastPrice % 1;
    const newPrice = lastPrice - diff + 0.49;
    const currencyCode = product.priceCurrencyCode;
    return this.currencyPipe.transform(newPrice, currencyCode);
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

  private restorePurchases(): void {
    purchase.restorePurchases();
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
          console.error(err);
          alert(`Failed to consume: ${err}`);
        });
    } else {
      this.buyingProductSuccessful(transaction);
    }
  }

  private buyingProductSuccessful(transaction: Transaction): void {
    this.savePurchase(transaction);
    const plan = this.getPlanById(transaction.productIdentifier);
    this.ngZone.run(() => {
      const title = localize(plan.title);
      this.showBoughtPopup(title);
      this.storeService.onPurchasedSuccessful.emit();
    });
  }

  private onProductRestored(transaction: Transaction): void {
    this.savePurchase(transaction);
    const plan = this.getPlanById(transaction.productIdentifier);
    this.ngZone.run(() => {
      this.showRestorePopup(plan.title);
    });
  }

  private savePurchase(transaction: Transaction): void {
    this.userService.addPurchase(transaction);
    const plan = this.getPlanById(transaction.productIdentifier);
    plan.bought = true;
    console.log('Product bought: ' + plan.product.productIdentifier);
    if (plan.amount > 0) {
      this.photosCountService.addPayedPhotos(plan.amount);
    }
    if (plan.tipstrick) {
      this.userService.unlockTipsTricks();
    }
    if (plan.hashtagInspector) {
      this.userService.unlockHashtagInspector();
    }
  }

  private showBoughtPopup(planTitle: string): void {
    const desc = localize('iap_purchase_successful_msg', planTitle);
    this.displayModal('iap_purchase_successful_title', desc, 'iap_purchase_successful_btn');
  }

  private showRestorePopup(planTitle: string): void {
    const title = localize('iap_restored_successful_title');
    const desc = localize('iap_restored_successful_msg', planTitle);
    const btn = localize('iap_restored_successful_btn');
    this.displayModal(title, desc, btn);
  }

  private displayModal(headline: string, desc: string, btn: string): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {
        icon: 'copied',
        headline: headline,
        desc: desc,
        buttonOk: btn
      }
    };
    this.modalService.showModal(ModalComponent, options);
  }

}
