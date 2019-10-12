import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { SmallHeaderModule } from '~/app/shared/small-header/small-header.module';
import { StoreComponent } from '~/app/pages/store/store.component';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { setStatusBarColors } from '~/app/shared/status-bar-util';
import { CurrencyPipe } from '@angular/common';
setStatusBarColors();

@NgModule({
  declarations: [
    StoreComponent
  ],
  imports: [
    NativeScriptCommonModule,
    SmallHeaderModule,
    NativeScriptLocalizeModule
  ],
  providers: [
    CurrencyPipe
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class StoreModule { }
