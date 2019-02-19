import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { HISTORIES } from "~/app/home/mock-data/histories";

@Component({
  selector: "ns-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
  moduleId: module.id
})
export class HistoryComponent implements OnInit {

  histories = HISTORIES;
  selected: Array<boolean> = [];
  @Input() isHistoryOpen: boolean;
  @Output() openCloseHistory = new EventEmitter();

  constructor(private page: Page, private router: RouterExtensions) {
  }

  ngOnInit() {
  }

  deleteHistory(i) {
    this.selected[i] = false;
    this.histories.splice(i, 1);    
  }

  clickOpenCloseHistory() {
    this.openCloseHistory.emit();
  }

}
