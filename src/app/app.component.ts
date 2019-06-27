import { Component, OnInit } from "@angular/core";
import * as app from "tns-core-modules/application";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { PhotosCountService } from "./storages/photos-count.service";
import { CustomerService, CustomerCreateStatus } from "./storages/customer.service";
import * as Toast from 'nativescript-toast';
import { localize } from 'nativescript-localize/angular';

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit { 

    private _sideDrawerTransition: DrawerTransitionBase;
    menus = ["home", "myhashtags", "store", "faq", "feedback", "settings"];
    selected = [];

    constructor(
        private readonly router: RouterExtensions,
        private readonly photosCountService: PhotosCountService,
        private readonly customerService: CustomerService,
    ) { }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
        this.selected[0] = true;
        this.customerService.createUserIdIfNotExist().subscribe((status) => {  
            if(status == CustomerCreateStatus.Failed) {
                setTimeout(() => {
                    Toast.makeText(localize('toast_create_customer_failed'), "long").show();
                }, 2000);
            }
        });
        this.photosCountService.initFreePhotos();
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    public openPage(index: number): void {
        this.selected = [];
        this.selected[index] = true;
        this.closeMenu();
        this.router.navigate(["/" + this.menus[index]], {
            transition: {
                name: "fadeIn",
                duration: 500,
                curve: "easeOut"
            }
        });
    }

    public closeMenu(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

}
