import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { AboutComponent } from './about/about.component';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { setStatusBarColors } from '~/app/shared/status-bar-util';
import { FeedbackModule } from '../feedback/feedback.module';
import { MyhashtagsModule } from '~/app/pages/myhashtags/myhashtags.module';
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
    MyhashtagsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SettingsModule { }
