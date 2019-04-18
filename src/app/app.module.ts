import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core.module";
import { NativeScriptLocalizeModule } from "nativescript-localize/angular";
import { HistoryModule } from "~/app/home/history/history.module";
import { DeviceService } from "./services/device-photos.service";
import { ApplicationPipesModule } from "./shared/pipes/application-pipes.module";
import { ModalComponent } from "./pages/feedback/modal/modal.component";
import { ModalModule } from "./pages/feedback/modal/modal.module";
import { DataService } from "./storages/data.service";


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
        ApplicationPipesModule,
        ModalModule,
    ],
    declarations: [
        AppComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        DeviceService,
        DataService,
    ],
    exports: [
        NativeScriptLocalizeModule,
    ]
})
export class AppModule { }
