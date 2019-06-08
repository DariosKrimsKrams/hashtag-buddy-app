import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
    { path: "settings", loadChildren: "~/app/pages/settings/settings.module#SettingsModule" },
    { path: "store", loadChildren: "~/app/pages/store/store.module#StoreModule" },
    { path: "faq", loadChildren: "~/app/pages/faq/faq.module#FaqModule" },
    { path: "feedback", loadChildren: "~/app/pages/feedback/feedback.module#FeedbackModule" },
    // { path: "error", loadChildren: "~/app/shared/error/error.module#ErrorModule" },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
