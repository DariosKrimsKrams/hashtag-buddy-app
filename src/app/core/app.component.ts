import { Component, OnInit, NgZone, ViewContainerRef } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { RouterExtensions } from 'nativescript-angular/router';
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';
import { PhotosCountService } from '../storages/photos-count.service';
import { CustomerService, CustomerCreateStatus } from '../storages/customer.service';
import * as Toast from 'nativescript-toast';
import { localize } from 'nativescript-localize/angular';
import * as application from 'tns-core-modules/application';
import { UserService } from '../storages/user.service';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { ModalComponent } from '../shared/modal/modal.component';
import { openUrl } from 'tns-core-modules/utils/utils';

@Component({
  moduleId: module.id,
  selector: 'ns-app',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  public menus: string[] = ['home', 'myhashtags', 'faq', 'store', 'settings'];
  public selected: boolean[] = [];

  private _sideDrawerTransition: DrawerTransitionBase;

  constructor(
    private readonly router: RouterExtensions,
    private readonly photosCountService: PhotosCountService,
    private readonly customerService: CustomerService,
    private readonly ngZone: NgZone,
    private readonly userService: UserService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly modalService: ModalDialogService
  ) {}

  public ngOnInit(): void {
    this._sideDrawerTransition = new SlideInOnTopTransition();
    this.selected[0] = true;
    this.customerService.createUserIdIfNotExist().subscribe(status => {
      if (status === CustomerCreateStatus.Failed) {
        setTimeout(() => {
          Toast.makeText(localize('toast_create_customer_failed'), 'long').show();
        }, 2000);
      }
    });
    this.photosCountService.initFreePhotos();

    if (this.allowShowingRateAppModal()) {
      this.showRateAppModal();
    }

    application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
      // this.ngZone.run(() => {
        args.cancel = true;
        const path = this.router.locationStrategy.path();
        const isResults = path.substring(0, 13) === '/home/results';
        console.log('path', path);
        if (path === '/') {
          // would be crashing otherwise
          return;
        }
        if (isResults) {
          this.router.navigate(['home'], { clearHistory: true });
        } else if (path === '/home') {
          this.ngZone.run(() => {
            this.userService.androidBackTriggered.emit(path);
          });
        } else if (path === '/home/loading-hashtags') {
          // do nothing
        } else {
          if (this.router.canGoBack()) {
            this.router.back();
          }
          // update SideMenu curStatus
        }
        // if old=results and before=home & before != "loading" -> open home History
        // this.userService.onAndroidBackTriggered(path);
      });
    // });
  }

  private showRateAppModal(): void {
    const okFunc = () => {
      this.userService.saveRateAppStatus('rated');
      const text = localize('link_playstore');
      openUrl(text);
    };
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {
        headline: 'rate_headline',
        desc: 'rate_desc',
        buttonOk: 'rate_yes',
        buttonCancel: 'rate_later',
        okFunc: okFunc
      }
    };
    setTimeout.bind(this)(() => {
      this.modalService.showModal(ModalComponent, options).then(() => {
        this.saveRateAppStatus();
      });
    }, 300);
  }

  private allowShowingRateAppModal(): boolean {
    const status = this.userService.getRateAppStatus();
    if (status === 'rated') {
      return false;
    } else if (status === undefined && this.userService.countPhotos() >= 1) {
      return true;
    } else if (status === 'later' && this.userService.countPhotos() >= 3) {
      return true;
    }
    return false;
  }

  private saveRateAppStatus(): void {
    const status = this.userService.getRateAppStatus();
    if (status === 'rated') {
      return;
    }
    this.userService.saveRateAppStatus('later');
  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  public openPage(index: number): void {
    this.selected = [];
    this.selected[index] = true;
    this.closeMenu();
    this.router.navigate(['/' + this.menus[index]], {
      transition: {
        name: 'fadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  public closeMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

}
