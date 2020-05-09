import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FloatLabelModule } from '../float-label/float-label.module';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { SelectionComponent } from './selection.component';

@NgModule({
  declarations: [
    SelectionComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule,
    FloatLabelModule,
  ],
  exports: [
    SelectionComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SelectionModule { }
