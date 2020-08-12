import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { SuggestionsComponent } from './suggestions.component';
import { HashtagModule } from '../hashtag/hashtag.module';

@NgModule({
  declarations: [
    SuggestionsComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule,
    HashtagModule
  ],
  exports: [
    SuggestionsComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SuggestionsModule { }
