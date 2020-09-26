import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FloatLabelModule } from '../float-label/float-label.module';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { InsertHashtagsFormComponent } from './insert-hashtags-form.component';

@NgModule({
  declarations: [
    InsertHashtagsFormComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule,
    FloatLabelModule,
  ],
  exports: [
    InsertHashtagsFormComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class InsertHashtagsFormModule { }
