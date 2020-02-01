import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { TipsAndTricks } from '~/app/models/tips-and-tricks';
import { localize } from 'nativescript-localize/angular';
import * as frame from 'tns-core-modules/ui/frame';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ModalComponent } from '~/app/shared/modal/modal.component';
import { UserService } from '~/app/storages/user.service';
import { Subscription } from 'rxjs';
import { StoreService } from '~/app/storages/store.service';
import { PLANS } from '~/app/data/plans';

@Component({
  selector: 'ns-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  moduleId: module.id,
})
export class FaqComponent implements OnInit, OnDestroy {

  @ViewChild('scrollView', { read: ElementRef, static: false }) public scrollView: ElementRef;
  public openmenu = false;
  public faqs: TipsAndTricks[];
  public current: number = -1;
  public hasTipsTricksUnlocked: boolean;
  private price: string = '1 €';
  private purchaseSuccessfulSub: Subscription;

  constructor(
    private readonly page: Page,
    private readonly modalService: ModalDialogService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly storeService: StoreService,
    private readonly userService: UserService,
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

    this.hasTipsTricksUnlocked = this.userService.hasTipsTricksUnlocked();

    this.purchaseSuccessfulSub = this.storeService.onPurchaseSuccessful.subscribe((item: string) => {
      if (item === 'tipstricks') {
        this.hasTipsTricksUnlocked = true;
      }
    });

    this.price = PLANS.find(x => x.id === 'tipstricks').priceShort;
  }

  public ngOnDestroy(): void {
    this.purchaseSuccessfulSub.unsubscribe();
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
    const okFunc = () => {
      console.log('openUnlockModal');
      const item = 'tipstricks';
      this.storeService.onBuyProduct.emit(item);
    };
    const headline = localize('faq_buy_headline', faq.title);
    const desc = localize('faq_buy_desc', this.price);
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

}
