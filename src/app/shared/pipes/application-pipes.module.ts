import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ReversePipe } from './reverse.pipe';

@NgModule({
  declarations: [
    ReversePipe
  ],
  imports: [
    NativeScriptCommonModule
  ],
  exports: [
    ReversePipe
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ApplicationPipesModule { }
