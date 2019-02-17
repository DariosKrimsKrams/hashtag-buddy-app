import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { StoreRoutingModule } from "./store-routing.module";
import { SmallHeaderModule } from "~/app/shared/small-header/small-header.module";

import { StoreComponent } from "~/app/pages/store/store.component";
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';

@NgModule({
  declarations: [
    StoreComponent
  ],
  imports: [
    NativeScriptCommonModule,
    StoreRoutingModule,
    SmallHeaderModule,
    NativeScriptLocalizeModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class StoreModule { }
