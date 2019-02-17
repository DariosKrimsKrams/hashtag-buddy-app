import { Component, OnInit } from "@angular/core";
import * as app from "application";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { AppService } from "~/app/app.service";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit { 

    private _sideDrawerTransition: DrawerTransitionBase;
    menus = ["home", "store", "faq", "feedback", "settings"];
    selected = [];

    constructor(
        private router: RouterExtensions,
        // public appservice: AppService
    ) {
    }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
        this.selected[0] = true;
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    openPage(index: number) {
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

    closeMenu() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    onDrawerOpened() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        // if(this.appservice.drawerLocation == "Left") {
            // sideDrawer.gesturesEnabled = true;
        // }else {
            // sideDrawer.gesturesEnabled = false;
        // }        
    }

    onDrawerClosed() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        // sideDrawer.gesturesEnabled = true;
    }

}
