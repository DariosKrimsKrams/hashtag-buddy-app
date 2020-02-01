import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ErrorComponent } from '~/app/shared/error/error.component';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { BigHeaderModule } from '../big-header/big-header.module';

@NgModule({
  declarations: [
    ErrorComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule,
    BigHeaderModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ErrorModule { }
