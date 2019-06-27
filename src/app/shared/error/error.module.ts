import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ErrorComponent } from "~/app/shared/error/error.component";

@NgModule({
  declarations: [
    ErrorComponent,
  ],
  imports: [
    NativeScriptCommonModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ErrorModule { }
