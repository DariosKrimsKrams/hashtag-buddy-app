import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { TipsAndTricks } from '~/app/models/tips-and-tricks';
import { localize } from 'nativescript-localize/angular';
import * as frameModule from 'tns-core-modules/ui/frame';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ModalComponent } from '~/app/shared/modal/modal.component';

@Component({
  selector: 'ns-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  moduleId: module.id,
})
export class FaqComponent implements OnInit {

  public openmenu = false;
  public faqs: TipsAndTricks[];
  public current: number = -1;

  constructor(
    private readonly page: Page,
    private readonly modalService: ModalDialogService,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this.page.actionBarHidden = true;
    disableIosSwipe(this.page, frameModule);
  }

  public ngOnInit(): void {


    // this.faq = FAQ;
    this.faqs = [
      new TipsAndTricks({
        expand: false,
        title: localize('faq_headline_stats1'),
        content: this.getMultipleDiduknowText([3, 7, 9, 10, 11]),
        locked: false,
      }),
      new TipsAndTricks({
        expand: false,
        title: localize('faq_headline_stats2'),
        content: this.getMultipleDiduknowText([8, 13, 20, 21]),
        locked: true,
      }),
      new TipsAndTricks({
        expand: false,
        title: localize('faq_headline_stats3'),
        content: this.getMultipleDiduknowText([1, 2, 4, 5, 6, 12, 22]),
        locked: false,
      }),
      new TipsAndTricks({
        expand: false,
        title: localize('faq_headline_stats4'),
        content: this.getMultipleDiduknowText([14, 15, 16, 17, 18, 19]),
        locked: false,
      })
    ];
  }

  private getMultipleDiduknowText(ids: number[]): string {
    let text = '';
    ids.map(id => text += this.getDiduknowText(id) + '.\n\n');
    return text.slice(0, text.length - 2);
  }

  private getDiduknowText(id: number): string {
    return localize('diduknow_fact' + id);
  }

  public expandToggle(index: number): void {
    const entry = this.faqs[index];
    if (entry.locked) {
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
    }
  }

  private openUnlockModal(faq: TipsAndTricks): void {
    const okFunc = () => {
      console.log('clicked CTA');
    };
    const price = '€ 1';
    const desc = localize('faq_buy_desc', faq.title, price);
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

}
