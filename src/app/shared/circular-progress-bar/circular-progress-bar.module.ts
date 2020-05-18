import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { CircularProgressBarComponent } from './circular-progress-bar.component';

@NgModule({
  declarations: [
    CircularProgressBarComponent
  ],
  imports: [
    NativeScriptCommonModule
  ],
  exports: [
    CircularProgressBarComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CircularProgressBarModule { }
