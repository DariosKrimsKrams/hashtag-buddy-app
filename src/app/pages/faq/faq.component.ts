import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { FAQ } from "~/app/pages/data/faq";
import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

@Component({
  selector: 'ns-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  moduleId: module.id,
})
export class FaqComponent implements OnInit {

  openmenu = false;
  faq = FAQ;
  current = 0;
  
  constructor(
    private page: Page, 
    private router: RouterExtensions,
    ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    // this.expandToggle(0);
  }

  openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeMenu() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  expandToggle(index: number) {
    if(index == this.current){
      this.faq[index].expand = !this.faq[index].expand;
    }else{
      //this.faq.map((item) => { item.expand = false; });
      this.faq[this.current].expand = false;
      this.faq[index].expand = true;
      this.current = index;
    }    
  }

}
