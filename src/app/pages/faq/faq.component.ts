import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Faq } from '~/app/models/faq';
import { localize } from 'nativescript-localize/angular';

@Component({
  selector: 'ns-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  moduleId: module.id,
})
export class FaqComponent implements OnInit {

  public openmenu = false;
  public faq: Faq[];
  public current = 0;
  
  constructor(
    private readonly page: Page, 
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    // this.faq = FAQ;
    this.faq = [
      new Faq({
        id: 0,
        expand: false,
        title: "Statistiken",
        content: this.getMultipleDiduknowText([1,2,3,4,5]),
      }),
      new Faq({
        id: 1,
        expand: false,
        title: "Fun Facts",
        content: this.getMultipleDiduknowText([11,12,13,14,15]),
      })
    ]
  }

  private getMultipleDiduknowText(ids: number[]): string {
    var text = "";
    ids.map(id => text += this.getDiduknowText(id) + ".\n\n");
    return 
  }

  private getDiduknowText(id: number): string {
    return localize('diduknow_fact' + id);
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  public closeMenu() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  public expandToggle(index: number) {
    if(index == this.current){
      this.faq[index].expand = !this.faq[index].expand;
    }else{
      this.faq[this.current].expand = false;
      this.faq[index].expand = true;
      this.current = index;
    }    
  }

}
