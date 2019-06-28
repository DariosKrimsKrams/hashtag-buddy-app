import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MyhashtagsComponent } from "./pages/myhashtags/myhashtags.component";
import { FeedbackComponent } from "./pages/feedback/feedback.component";
import { FaqComponent } from "./pages/faq/faq.component";
import { StoreComponent } from "./pages/store/store.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
    { path: "settings", loadChildren: "~/app/pages/settings/settings.module#SettingsModule" },
    { path: "store", component: StoreComponent },
    { path: "faq", component: FaqComponent },
    // { path: "feedback", component: FeedbackComponent },
    { path: "myhashtags", component: MyhashtagsComponent },
    // { path: "error", loadChildren: "~/app/shared/error/error.module#ErrorModule" },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
