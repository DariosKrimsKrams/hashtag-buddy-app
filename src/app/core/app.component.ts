import { Component, OnInit, NgZone } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { RouterExtensions } from 'nativescript-angular/router';
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';
import { PhotosCountService } from '../storages/photos-count.service';
import { CustomerService, CustomerCreateStatus } from '../storages/customer.service';
import * as Toast from 'nativescript-toast';
import { localize } from 'nativescript-localize/angular';
import * as application from 'tns-core-modules/application';
import { UserService } from '../storages/user.service';

@Component({
  moduleId: module.id,
  selector: 'ns-app',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  private _sideDrawerTransition: DrawerTransitionBase;
  menus = ['home', 'myhashtags', 'faq', 'store', 'settings'];
  selected = [];

  constructor(
    private readonly router: RouterExtensions,
    private readonly photosCountService: PhotosCountService,
    private readonly customerService: CustomerService,
    private readonly ngZone: NgZone,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
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

    application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
      this.ngZone.run(() => {
        args.cancel = true;
        const path = this.router.locationStrategy.path();
        const isResults = path.substring(0, 13) === '/home/results';
        if (isResults) {
          // const that = this;
          // ToDo only direct when user is not already coming from home - otherwise History state will be reseted
          this.router.navigate(['home'], {clearHistory: true});
          // .then(function() {
            // that.userService.onAndroidBackTriggered(path);
          // });
        } else if (path === '/home') {
          this.userService.onAndroidBackTriggered(path);
          // do nothing
        } else if (path === '/home/loading-hashtags') {
          // do nothing
        } else {
          this.router.back();
          // update SideMenu curStatus
        }

        // if old=results and before=home & before != "loading" 
        // this.userService.onAndroidBackTriggered(path);
      });
      // this.router.navigate(['home']);
      // if (this.router.canGoBack()) {

      //   args.cancel = true;
      //   this.router.back();
      // } else {
      //   args.cancel = false;
      //   this.router.navigate(['page2']);
      // }
    });
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
