import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { HistoryComponent } from './history.component';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { HashtagModule } from '~/app/shared/hashtag/hashtag.module';

@NgModule({
  declarations: [
    HistoryComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule,
    HashtagModule,
  ],
  exports: [
    HistoryComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HistoryModule { }