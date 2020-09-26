import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { HistoryModule } from '~/app/pages/home/history/history.module';
import { DeviceService } from '~/app/services/device-photos.service';
import { ApplicationPipesModule } from '~/app/pipes/application-pipes.module';
import { ModalModule } from '~/app/shared/modal/modal.module';
import { LocalStorageService } from '~/app/storages/local-storage.service';
import { SearchModule } from '~/app/pages/search/search.module';
import { FaqModule } from '~/app/pages/faq/faq.module';
import { FeedbackModule } from '~/app/pages/feedback/feedback.module';
import { StoreModule } from '~/app/pages/store/store.module';
import { ErrorModule } from '../shared/error/error.module';
import { HistoryoverviewModule } from '../pages/historyoverview/historyoverview.module';
import { NativeScriptModule } from '@nativescript/angular';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptUISideDrawerModule,
    CoreModule,
    NativeScriptLocalizeModule,
    HistoryModule,
    ApplicationPipesModule,
    ModalModule,
    SearchModule,
    FaqModule,
    FeedbackModule,
    StoreModule,
    ErrorModule,
    HistoryoverviewModule
  ],
  declarations: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [DeviceService, LocalStorageService],
  exports: [NativeScriptLocalizeModule]
})
export class AppModule {}
