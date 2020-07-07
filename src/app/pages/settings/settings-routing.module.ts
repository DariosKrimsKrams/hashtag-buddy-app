import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { SettingsComponent } from './settings.component';
import { MyhashtagsComponent } from '../../pages/myhashtags/myhashtags.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
    { path: '', component: SettingsComponent },
    { path: 'myhashtags', component: MyhashtagsComponent },
    { path: 'feedback', component: FeedbackComponent },
    { path: 'about', component: AboutComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class SettingsRoutingModule { }