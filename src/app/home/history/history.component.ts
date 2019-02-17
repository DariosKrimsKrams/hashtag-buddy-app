import { Component, OnInit, Input, Output } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { HISTORIES } from "~/app/home/mock-data/histories";
import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

@Component({
  selector: "ns-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
  moduleId: module.id
})
export class HistoryComponent implements OnInit {

  histories = HISTORIES;
  selected: Array<boolean> = [];
  @Output() isHistoryOpen: boolean;

  constructor(private page: Page, private router: RouterExtensions) {
    //this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  openCloseHistory() {
    this.isHistoryOpen = !this.isHistoryOpen;
  }

  deleteHistory(i) {
    this.selected[i] = false;
    this.histories.splice(i, 1);    
  }
}
