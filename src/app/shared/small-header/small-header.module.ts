import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { SmallHeaderComponent } from '~/app/shared/small-header/small-header.component';

@NgModule({
  declarations: [
    SmallHeaderComponent,
  ],
  imports: [
    NativeScriptCommonModule,
  ],
  exports: [
    SmallHeaderComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SmallHeaderModule { }
