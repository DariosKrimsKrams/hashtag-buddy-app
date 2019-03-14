import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { UserStorageService } from "./storages/user-storage.service";
import { CoreModule } from "./core.module";
import { NativeScriptLocalizeModule } from "nativescript-localize/angular";
// import { AppService } from "./app.service";

import { HistoryModule } from "~/app/home/history/history.module";
import { HttpClientModule } from "@angular/common/http";


@NgModule({
    bootstrap: [
        AppComponent,
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptUISideDrawerModule,
        TNSFontIconModule.forRoot({
            'fa': './assets/fontawesome-free-5.6.3-web/css/all.min.css'
        }),
        CoreModule,
        NativeScriptLocalizeModule,
        HistoryModule,
        HttpClientModule 
    ],
    declarations: [
        AppComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        UserStorageService,
        // AppService
    ],
    exports: [
        NativeScriptLocalizeModule,
    ]
})
export class AppModule { }
