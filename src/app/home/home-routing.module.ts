import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HomeComponent } from "./home.component";
import { HistoryComponent } from './history/history.component';
import { ResultsComponent } from './results/results.component';
import { LeaveFeedbackComponent } from './leave-feedback/leave-feedback.component';
import { LoadingHashtagsComponent } from './loading-hashtags/loading-hashtags.component';
import { ConfirmImageComponent } from "./confirm-image/confirm-image.component";

const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "history", component: HistoryComponent },
    { path: "results/:id", component: ResultsComponent },
    { path: "leavefeedback/:id", component: LeaveFeedbackComponent },
    { path: "loading-hashtags", component: LoadingHashtagsComponent },
    { path: "confirm-image", component: ConfirmImageComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
