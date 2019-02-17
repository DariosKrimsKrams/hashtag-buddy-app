import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "ui/page";
import { IMAGES } from './../mock-data/upload-images';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ModalComponent } from "./modal/modal.component";

@Component({
  selector: "ns-choose-image",
  templateUrl: "./choose-image.component.html",
  styleUrls: ["./choose-image.component.css"],
  moduleId: module.id,
  providers: [ModalDialogService]
})
export class ChooseImageComponent implements OnInit {
  constructor(
    private page: Page, 
    private router: RouterExtensions, 
    private modalService: ModalDialogService, 
    private viewContainerRef: ViewContainerRef
    ) {
    this.page.actionBarHidden = true;
  }

  images = IMAGES;
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  dialogOpen = false;
  currentImage = "";

  ngOnInit() {}

  showModal() {
    const options: ModalDialogOptions = {
        viewContainerRef: this.viewContainerRef,
        fullscreen: false,
        animated: true,
        context: {}
    };
    this.modalService.showModal(ModalComponent, options);
  }
}
