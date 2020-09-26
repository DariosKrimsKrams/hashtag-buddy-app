import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalComponent } from './modal.component';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptCommonModule } from '@nativescript/angular';

@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [

  ],
  entryComponents: [
    ModalComponent
  ],
  exports: [
    ModalComponent
  ]
})
export class ModalModule { }
