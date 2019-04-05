import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Photo } from "~/app/models/photo";
import { UserService } from "../../storages/user.service";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
  selector: "ns-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
  moduleId: module.id
})
export class HistoryComponent implements OnInit {

  selected: Array<boolean> = [];
  photos: Photo[] = [];

  @Input() isHistoryOpen: boolean;
  @Output() openCloseHistory = new EventEmitter();

  constructor(
    private userService: UserService,
    private router: RouterExtensions,
    ) { }

  ngOnInit() {
    this.photos = this.userService.getPhotos();
  }

  public deleteHistory(i): void {
    this.selected[i] = false;
    this.photos.splice(i, 1);
  }

  public clickOpenCloseHistory(): void {
    this.openCloseHistory.emit();
  }

  public selectElement(photo: Photo): void {
    var id = photo.id;
    this.router.navigate([`/home/results/${id}`], {
      transition: {
        name: "FadeIn",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

}
