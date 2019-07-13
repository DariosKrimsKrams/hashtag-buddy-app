import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { SettingsComponent } from './settings.component';
import { AuthComponent } from './auth/auth.component';
import { LegalComponent } from './legal/legal.component';
import { TermsComponent } from './terms/terms.component';
import { AboutComponent } from './about/about.component';
import { FeedbackComponent } from '../feedback/feedback.component';

const routes: Routes = [
    { path: '', component: SettingsComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'legal', component: LegalComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'about', component: AboutComponent },
    { path: 'feedback', component: FeedbackComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class SettingsRoutingModule { }