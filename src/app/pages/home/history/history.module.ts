import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HistoryComponent } from './history.component';
import { HashtagModule } from '~/app/shared/hashtag/hashtag.module';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptCommonModule } from '@nativescript/angular';

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