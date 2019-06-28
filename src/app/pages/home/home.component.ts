import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { screen } from "tns-core-modules/platform";
import { SelectPhotoService } from "../../services/business-logic/select-photo.service";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HomeComponent implements OnInit {

  public isHistoryOpen: number;
  public historyHeight: number;
  public historyDefaultTransform: number;
  public openConfirmImage: boolean;
  @ViewChild("history", { static: false }) public historyElement: ElementRef;
  @ViewChild("mainContainer", { static: false }) public mainContainerElement: ElementRef;

  constructor(
    private readonly page: Page,
    private readonly selectPhotoService: SelectPhotoService,
  ) {
    this.page.actionBarHidden = true;
    this.openConfirmImage = false;
  }

  ngOnInit() {
    this.historyHeight = screen.mainScreen.heightDIPs - 90;
    this.historyDefaultTransform = this.historyHeight - 130;
  }

  public clickUpload(): void {
    this.selectPhotoService.pickImage().subscribe(() => {
      this.openConfirmImage = true;
    });
  }

  public openMenu(): void {
    // timeout needed or sidemenu will be visible for one frame before fading in
    setTimeout(() => {
      const sideDrawer = <RadSideDrawer>app.getRootView();
      sideDrawer.showDrawer();
      sideDrawer.drawerContentSize = 250;
    }, 10);
  }

  public closeMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  public clickHistory(): void {
    this.isHistoryOpen = this.isHistoryOpen != 1 ? 1 : 2;
    var posY = this.isHistoryOpen === 1 ? 0 : this.historyDefaultTransform;
    var bgColor = this.isHistoryOpen === 1 ? '#fff' :'#fcfcfc';
    this.historyElement.nativeElement.animate({
      translate: { x: 0, y: posY},
      backgroundColor: bgColor,
      duration: 600
    });
  }

  public onClickCancel(): void {
    this.openConfirmImage = false
  }

}
