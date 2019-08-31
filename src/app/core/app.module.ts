import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { HistoryModule } from '~/app/pages/home/history/history.module';
import { DeviceService } from '~/app/services/device-photos.service';
import { ApplicationPipesModule } from '~/app/pipes/application-pipes.module';
import { ModalModule } from '~/app/shared/modal/modal.module';
import { LocalStorageService } from '~/app/storages/local-storage.service';
import { MyhashtagsModule } from '~/app/pages/myhashtags/myhashtags.module';
import { FaqModule } from '~/app/pages/faq/faq.module';
import { FeedbackModule } from '~/app/pages/feedback/feedback.module';
import { StoreModule } from '~/app/pages/store/store.module';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptUISideDrawerModule,
    TNSFontIconModule.forRoot({
      // 'fa': './assets/fontawesome-free-5.6.3-web/css/all.min.css'
    }),
    CoreModule,
    NativeScriptLocalizeModule,
    HistoryModule,
    ApplicationPipesModule,
    ModalModule,
    MyhashtagsModule,
    FaqModule,
    FeedbackModule,
    StoreModule
  ],
  declarations: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [DeviceService, LocalStorageService],
  exports: [NativeScriptLocalizeModule]
})
export class AppModule {}
