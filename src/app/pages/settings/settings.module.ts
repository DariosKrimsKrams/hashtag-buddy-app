import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { AboutComponent } from './about/about.component';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { setStatusBarColors } from '~/app/shared/status-bar-util';
import { FeedbackModule } from '../feedback/feedback.module';
setStatusBarColors();

@NgModule({
  declarations: [
    SettingsComponent,
    AboutComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    SettingsRoutingModule,
    NativeScriptLocalizeModule,
    FeedbackModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SettingsModule { }
