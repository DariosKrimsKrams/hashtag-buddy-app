import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { BigHeaderComponent } from '~/app/shared/big-header/big-header.component';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';

@NgModule({
  declarations: [
    BigHeaderComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule
  ],
  exports: [
    BigHeaderComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BigHeaderModule { }
