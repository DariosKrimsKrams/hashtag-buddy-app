import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { FloatLabel } from './float-label.component';

@NgModule({
  declarations: [
    FloatLabel,
  ],
  imports: [
    NativeScriptCommonModule,
  ],
  exports: [
    FloatLabel
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FloatLabelModule { }