import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { SettingsRoutingModule } from "./settings-routing.module";
import { SmallHeaderModule } from "~/app/shared/small-header/small-header.module";

import { SettingsComponent } from "./settings.component";
import { AuthComponent } from './auth/auth.component';
import { LanguageComponent } from './language/language.component';
import { LegalComponent } from './legal/legal.component';
import { TermsComponent } from './terms/terms.component';
import { AboutComponent } from './about/about.component';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';


@NgModule({
  declarations: [
    SettingsComponent,
    AuthComponent,
    LanguageComponent,
    LegalComponent,
    TermsComponent,
    AboutComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    SettingsRoutingModule,
    SmallHeaderModule,
    NativeScriptLocalizeModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SettingsModule { }
