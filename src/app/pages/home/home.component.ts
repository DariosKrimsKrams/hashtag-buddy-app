import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { screen } from 'tns-core-modules/platform';
import { SelectPhotoService } from '../../services/business-logic/select-photo.service';
import { UserService } from '~/app/storages/user.service';
import { Photo } from '~/app/models/photo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'Home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HomeComponent implements OnInit, OnDestroy {

  public isHistoryOpen: number;
  public historyHeight: number;
  public historyDefaultTransform: number;
  public openConfirmImage: boolean;
  public hasAnyPhotosUploaded: boolean;
  @ViewChild('history', { read: ElementRef, static: false }) public historyElement: ElementRef;
  @ViewChild('mainContainer', { read: ElementRef, static: false }) public mainContainerElement: ElementRef;

  private photoAddedSubscription: Subscription;

  constructor(
    private readonly page: Page,
    private readonly selectPhotoService: SelectPhotoService,
    private readonly userService: UserService,
  ) {
    this.page.actionBarHidden = true;
    this.openConfirmImage = false;
  }

  ngOnInit() {
    this.historyHeight = screen.mainScreen.heightDIPs - 90;
    this.historyDefaultTransform = this.historyHeight - 130;

    this.hasAnyPhotosUploaded = this.userService.countPhotos() !== 0;
    if (!this.hasAnyPhotosUploaded) {
      this.photoAddedSubscription = this.userService.photoAdded.subscribe((photos: Photo[]) => {
        this.hasAnyPhotosUploaded = true;
        this.photoAddedSubscription.unsubscribe();
      });
    }
  }
  
  ngOnDestroy() {
    if (this.photoAddedSubscription !== undefined) {
      this.photoAddedSubscription.unsubscribe();
    }
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
    this.isHistoryOpen = this.isHistoryOpen !== 1 ? 1 : 2;
    let posY = this.isHistoryOpen === 1 ? 0 : this.historyDefaultTransform;
    let bgColor = this.isHistoryOpen === 1 ? '#fff' : '#fcfcfc';
    this.historyElement.nativeElement.animate({
      translate: { x: 0, y: posY},
      backgroundColor: bgColor,
      duration: 600
    });
  }

  public onClickCancel(): void {
    this.openConfirmImage = false;
  }

}
