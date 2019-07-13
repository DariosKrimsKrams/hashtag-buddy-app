import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { FloatLabelComponent } from './float-label.component';

@NgModule({
  declarations: [
    FloatLabelComponent,
  ],
  imports: [
    NativeScriptCommonModule,
  ],
  exports: [
    FloatLabelComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FloatLabelModule { }