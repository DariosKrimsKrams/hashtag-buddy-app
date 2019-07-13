import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ProgressBarComponent } from '~/app/shared/progress-bar/progress-bar.component';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';

@NgModule({
  declarations: [
    ProgressBarComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule
  ],
  exports: [
    ProgressBarComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProgressBarModule { }