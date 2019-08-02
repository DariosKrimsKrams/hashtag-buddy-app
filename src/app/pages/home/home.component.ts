import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {

  public isHistoryOpen: number;
  public historyHeight: number;
  public historyDefaultTransform: number;
  public headerDefaultTransform: number;
  public openConfirmImage: boolean;
  @ViewChild('history', { read: ElementRef, static: false }) public historyElement: ElementRef;
  @ViewChild('header', { read: ElementRef, static: false }) public headerElement: ElementRef;
  @ViewChild('mainContainer', { read: ElementRef, static: false }) public mainContainerElement: ElementRef;
  @Output() public historyOpenChanged: EventEmitter<boolean> = new EventEmitter();

  private photoAddedSubscription: Subscription;

  constructor(
    private readonly page: Page,
    private readonly selectPhotoService: SelectPhotoService,
    private readonly userService: UserService,
    private readonly cd: ChangeDetectorRef
  ) {
    this.cd.detach();
    this.page.actionBarHidden = true;
    this.openConfirmImage = false;
  }

  ngOnInit() {
    this.historyHeight = screen.mainScreen.heightDIPs - 90;
    this.historyDefaultTransform = this.historyHeight - 130;
    this.headerDefaultTransform = -70;

    this.photoAddedSubscription = this.userService.photoAdded.subscribe((photos: Photo[]) => {
      this.cd.detectChanges();
    });
    this.cd.detectChanges();
  }
  
  ngOnDestroy() {
      this.photoAddedSubscription.unsubscribe();
  }

  public clickSelectPhoto(): void {
    this.selectPhotoService.pickImage().subscribe(() => {
      this.openConfirmImage = true;
      this.cd.detectChanges();
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
    this.cd.reattach();
    this.isHistoryOpen = this.isHistoryOpen !== 1 ? 1 : 2;
    this.historyOpenChanged.emit(this.isHistoryOpen === 1);
    this.animateHistory();
    this.animateHeader();
  }

  private animateHistory(): void {
    let posY = this.isHistoryOpen === 1 ? 0 : this.historyDefaultTransform;
    let bgColor = this.isHistoryOpen === 1 ? '#fff' : '#fcfcfc';
    const that = this;
    this.historyElement.nativeElement.animate({
      translate: { x: 0, y: posY},
      backgroundColor: bgColor,
      duration: 600
    }).then(function () {
      that.cd.detach();
    });
  }

  private animateHeader(): void {
    let posY = this.isHistoryOpen === 1 ? this.headerDefaultTransform : 0;
    // let bgColor = this.isHistoryOpen === 1 ? '#fff' : '#fcfcfc';
    // const that = this;
    this.headerElement.nativeElement.animate({
      translate: { x: 0, y: posY},
      // backgroundColor: bgColor,
      duration: 600
    }).then(function () {
      // that.cd.detach();
    });
  }

  public clickCancel(): void {
    this.openConfirmImage = false;
    this.cd.detectChanges();
  }

}
