import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { HashtagComponent } from './hashtag.component';

@NgModule({
  declarations: [
    HashtagComponent
  ],
  imports: [
    NativeScriptCommonModule
  ],
  exports: [
    HashtagComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HashtagModule { }
