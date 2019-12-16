import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { TipsAndTricks } from '~/app/models/tips-and-tricks';
import { localize } from 'nativescript-localize/angular';
import * as frame from 'tns-core-modules/ui/frame';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ModalComponent } from '~/app/shared/modal/modal.component';
// IAP
import * as purchase from 'nativescript-purchase';
import { Product } from 'nativescript-purchase/product';
import { Transaction, TransactionState } from 'nativescript-purchase/transaction';
import { PLAN } from '~/app/data/plans';
import { Plan } from '~/app/models/plan';
import { ToastDuration, Toasty } from 'nativescript-toasty';
import { isAndroid } from 'tns-core-modules/platform';
import { UserService } from '~/app/storages/user.service';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  moduleId: module.id,
})
export class FaqComponent implements OnInit {

  @ViewChild('scrollView', { read: ElementRef, static: false }) public scrollView: ElementRef;
  public openmenu = false;
  public faqs: TipsAndTricks[];
  public current: number = -1;
  public plans: Plan[] = PLAN;
  public hasTipsTricksUnlocked: boolean;
  private price: string = '1 €';

  constructor(
    private readonly page: Page,
    private readonly modalService: ModalDialogService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly userService: UserService,
    private readonly router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
    disableIosSwipe(this.page, frame);
  }

  public ngOnInit(): void {
    this.faqs = [];
    const maxItem = 11;
    const lockedNumbers = [4, 5, 7, 8, 10, 11];
    for (let i = 1; i <= maxItem; i++) {
      const faq = new TipsAndTricks({
        expand: false,
        title: localize(`faq_${i}_headline`),
        content: localize(`faq_${i}_desc`),
        locked: !!lockedNumbers.find(x => x === i) ? true : false,
      });
      this.faqs.push(faq);
    }

    this.configureIap();
    this.hasTipsTricksUnlocked = this.userService.hasTipsTricksUnlocked();
  }

  private getPlanById(id: string): Plan {
    return this.plans.filter(x => x.id === id)[0];
  }

  public expandToggle(index: number): void {
    const entry = this.faqs[index];
    if (entry.locked && !this.hasTipsTricksUnlocked) {
      this.openUnlockModal(entry);
    } else {
      this.toogle(index, entry);
    }
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  private toogle(index: number, entry: TipsAndTricks): void {
    if (index === this.current) {
      entry.expand = !entry.expand;
      this.current = -1;
    } else {
      if (this.current !== -1) {
        this.faqs[this.current].expand = false;
      }
      entry.expand = true;
      this.current = index;
      this.scrollToIndex(index);
    }
  }

  private scrollToIndex(index: number): void {
    const posY = 63 * index;
    setTimeout.bind(this)(() => {
      this.scrollView.nativeElement.scrollToVerticalOffset(posY, false);
    }, 1);
  }

  private openUnlockModal(faq: TipsAndTricks): void {
    const that = this;
    const okFunc = () => {
      console.log('clicked CTA');
      const plan = this.getPlanById('tipstricks');
      that.buyProduct(plan);
    };
    const desc = localize('faq_buy_desc', faq.title, this.price);
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {
        icon: 'cart',
        headline: 'faq_buy_headline',
        desc: desc,
        buttonOk: 'faq_buy_cta',
        buttonCancel: 'faq_buy_cancel',
        okFunc: okFunc
      }
    };
    this.modalService.showModal(ModalComponent, options);
  }

  /************* SHOP LOGIC IAP **************/

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
              if (plan.id === 'tipstricks') {
                this.price = this.minifyPrice(plan.product.priceFormatted);
              }
            });
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

  private onTransactionFailed(transaction: Transaction): void {
    console.log(`Purchase of ${transaction.productIdentifier} was canceled!`);
    const text = localize('iap_purchase_failed');
    new Toasty({ text: text })
      .setToastDuration(ToastDuration.LONG)
      .show();
  }

  private buyProduct(plan: Plan): void {
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
    const title = localize('iap_purchase_successful_title');
    const msg = localize('iap_purchase_successful_msg', plan.title);
    const btn = localize('iap_purchase_successful_btn');
    this.showPopup(title, msg, btn);
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
    console.log('Bought over FAQ ' + plan.product.productIdentifier);
    this.hasTipsTricksUnlocked = true;
    this.userService.unlockedTipsTricks();
    this.router.navigate([`/faq`], {
      transition: {
        name: 'FadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

}
