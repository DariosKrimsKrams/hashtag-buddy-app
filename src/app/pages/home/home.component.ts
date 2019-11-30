import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { screen } from 'tns-core-modules/platform';
import { SelectPhotoService } from '../../services/business-logic/select-photo.service';
import { UserService } from '~/app/storages/user.service';
import { Photo } from '~/app/models/photo';
import { Subscription } from 'rxjs';
import { exit } from 'nativescript-exit';
import { ToastDuration, Toasty } from 'nativescript-toasty';
import { localize } from 'nativescript-localize/angular';
import * as frame from 'tns-core-modules/ui/frame';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { RouterExtensions } from 'nativescript-angular/router';

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
  public showConfirmImage: boolean;
  @ViewChild('history', { read: ElementRef, static: false }) public historyElement: ElementRef;
  @ViewChild('historShadow', { read: ElementRef, static: false }) public historShadowElement: ElementRef;
  @ViewChild('header', { read: ElementRef, static: false }) public headerElement: ElementRef;
  @ViewChild('mainContainer', { read: ElementRef, static: false }) public mainContainerElement: ElementRef;
  @Output() public historyOpenChanged: EventEmitter<boolean> = new EventEmitter();

  private photoAddedSubscription: Subscription;
  private androidBackTriggeredSubscription: Subscription;
  private backTriggeredForExit: boolean;

  constructor(
    private readonly page: Page,
    private readonly selectPhotoService: SelectPhotoService,
    private readonly userService: UserService,
    private readonly cd: ChangeDetectorRef,
    private readonly router: RouterExtensions
  ) {
    this.cd.detach();
    this.page.actionBarHidden = true;

    // leads to Crash in latest NativeScript 6.2 etc.
    // disableIosSwipe(this.page, frame);
  }

  public ngOnInit(): void {
    this.historyHeight = screen.mainScreen.heightDIPs - 90;
    this.historyDefaultTransform = this.historyHeight - 140;
    this.headerDefaultTransform = -70;

    this.photoAddedSubscription = this.userService.photoAdded.subscribe((photos: Photo[]) => {
      this.cd.detectChanges();
    });
    this.androidBackTriggeredSubscription = this.userService.androidBackTriggered.subscribe((path: string) => this.onAndroidBackTriggered(path));
    this.cd.detectChanges();
  }

  public ngOnDestroy(): void {
    this.photoAddedSubscription.unsubscribe();
    this.androidBackTriggeredSubscription.unsubscribe();
  }

  public clickSelectPhoto(): void {
    this.selectPhotoService.pickImage().subscribe(() => {
      this.showConfirmImage = true;
      this.cd.detectChanges();
    });
    this.backTriggeredForExit = false;
  }

  public clickTipsAndTricks(): void {
    this.router.navigate([`/faq`], {
      transition: {
        name: 'FadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  public openMenu(): void {
    // timeout needed or sidemenu will be visible for one frame before fading in
    setTimeout(() => {
      const sideDrawer = <RadSideDrawer>app.getRootView();
      sideDrawer.showDrawer();
      sideDrawer.drawerContentSize = 250;
    }, 10);
    this.backTriggeredForExit = false;
  }

  public clickHistory(): void {
    this.cd.reattach();
    this.isHistoryOpen = this.isHistoryOpen !== 1 ? 1 : 2;
    this.historyOpenChanged.emit(this.isHistoryOpen === 1);
    const time = 600;
    this.animateHistory(time);
    this.animateHistoryShadow(time);
    this.animateHeader(time);
    this.backTriggeredForExit = false;
  }

  private animateHistory(time: number): void {
    const posY = this.isHistoryOpen === 1 ? 0 : this.historyDefaultTransform;
    const bgColor = this.isHistoryOpen === 1 ? '#fff' : '#fcfcfc';
    const that = this;
    this.historyElement.nativeElement.animate({
      translate: { x: 0, y: posY},
      backgroundColor: bgColor,
      duration: time
    }).then(function(): void {
      that.cd.detach();
    });
  }

  private animateHistoryShadow(time: number): void {
    const value = this.isHistoryOpen === 1 ? 0 : 1;
    this.historShadowElement.nativeElement.animate({
      opacity: value,
      duration: time
    });
  }

  private animateHeader(time: number): void {
    const posY = this.isHistoryOpen === 1 ? this.headerDefaultTransform : 0;
    this.headerElement.nativeElement.animate({
      translate: { x: 0, y: posY},
      duration: time
    });
  }

  public clickCancelConfirmImage(): void {
    this.showConfirmImage = false;
    this.cd.detectChanges();
  }

  private onAndroidBackTriggered(path: string): void {
    if (path === '/home') {
      if (this.isHistoryOpen === 1) {
        this.clickHistory();
      } else if (this.showConfirmImage) {
        this.clickCancelConfirmImage();
      } else {
        if (!this.backTriggeredForExit) {
          this.backTriggeredForExit = true;
          const text = localize('exit_warning');
          new Toasty({ text: text })
            .setToastDuration(ToastDuration.LONG)
            .show();
        } else {
          exit();
        }
      }
    }
  }

}
