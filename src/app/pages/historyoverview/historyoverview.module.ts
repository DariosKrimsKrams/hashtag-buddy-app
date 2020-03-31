import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { SmallHeaderModule } from '~/app/shared/small-header/small-header.module';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { setStatusBarColors } from '~/app/shared/status-bar-util';
import { HistoryoverviewComponent } from './historyoverview.component';
import { HistoryModule } from './../home/history/history.module';
setStatusBarColors();

@NgModule({
  declarations: [
    HistoryoverviewComponent
  ],
  imports: [
    NativeScriptCommonModule,
    SmallHeaderModule,
    NativeScriptLocalizeModule,
    HistoryModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HistoryoverviewModule { }
