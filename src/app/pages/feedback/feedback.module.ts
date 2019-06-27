import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { SmallHeaderModule } from "~/app/shared/small-header/small-header.module";
import { FeedbackComponent } from "~/app/pages/feedback/feedback.component";
import { FloatLabelModule } from "~/app/shared/float-label/float-label.module";
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { setStatusBarColors } from "~/app/shared/status-bar-util";
import { ModalModule } from './modal/modal.module';
import { FeedbackRepository } from '~/app/services/repositories/feedback-repository.service';
setStatusBarColors();

@NgModule({
  declarations: [
    FeedbackComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    SmallHeaderModule,
    FloatLabelModule,
    NativeScriptLocalizeModule,
    ModalModule,
  ],
  providers: [
    FeedbackRepository
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FeedbackModule { }
