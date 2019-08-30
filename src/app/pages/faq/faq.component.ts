import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Faq } from '~/app/models/faq';
import { localize } from 'nativescript-localize/angular';

@Component({
  selector: 'ns-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  moduleId: module.id,
})
export class FaqComponent implements OnInit {

  public openmenu = false;
  public faqs: Faq[];
  public current = 0;

  constructor(
    private readonly page: Page,
  ) {
    this.page.actionBarHidden = true;
  }

  public ngOnInit(): void {
    // this.faq = FAQ;
    this.faqs = [
      new Faq({
        expand: false,
        title: localize('faq_headline_stats1'),
        content: this.getMultipleDiduknowText([3, 7, 9, 10, 11]),
      }),
      new Faq({
        expand: false,
        title: localize('faq_headline_stats2'),
        content: this.getMultipleDiduknowText([8, 13, 20, 21]),
      }),
      new Faq({
        expand: false,
        title: localize('faq_headline_stats3'),
        content: this.getMultipleDiduknowText([1, 2, 4, 5, 6, 12, 22]),
      }),
      new Faq({
        expand: false,
        title: localize('faq_headline_stats4'),
        content: this.getMultipleDiduknowText([14, 15, 16, 17, 18, 19]),
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
    if (index === this.current) {
      this.faqs[index].expand = !this.faqs[index].expand;
    } else {
      this.faqs[this.current].expand = false;
      this.faqs[index].expand = true;
      this.current = index;
    }
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

}
