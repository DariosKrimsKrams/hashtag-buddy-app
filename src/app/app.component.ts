import { Component, OnInit } from "@angular/core";
import * as app from "application";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { UserService } from "./storages/user.service";

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
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
        this.selected[0] = true;
        this.userService.onStartup();
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
