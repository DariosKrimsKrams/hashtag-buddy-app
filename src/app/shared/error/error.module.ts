import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ErrorComponent } from '~/app/shared/error/error.component';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptCommonModule } from '@nativescript/angular';

@NgModule({
  declarations: [
    ErrorComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ErrorModule { }
