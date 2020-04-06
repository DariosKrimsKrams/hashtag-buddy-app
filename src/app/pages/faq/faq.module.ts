import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { FaqComponent } from '~/app/pages/faq/faq.component';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { setStatusBarColors } from '~/app/shared/status-bar-util';
setStatusBarColors();

@NgModule({
  declarations: [
    FaqComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FaqModule { }
