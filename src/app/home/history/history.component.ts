import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { HISTORIES } from "~/app/home/data/histories";
import { Photo } from "~/app/models/photo";
import { UserStorageService } from "~/app/storages/user-storage.service";

@Component({
  selector: "ns-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
  moduleId: module.id
})
export class HistoryComponent implements OnInit {

  histories = HISTORIES;
  selected: Array<boolean> = [];
  photos: Photo[];

  @Input() isHistoryOpen: boolean;
  @Output() openCloseHistory = new EventEmitter();

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private userStorageService: UserStorageService
    ) {
  }

  ngOnInit() {
    this.photos = this.userStorageService.getPhotos();
  }

  deleteHistory(i) {
    this.selected[i] = false;
    this.photos.splice(i, 1);
  }

  clickOpenCloseHistory() {
    this.openCloseHistory.emit();
  }

}
