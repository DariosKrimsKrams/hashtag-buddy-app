import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { FeedbackComponent } from '~/app/pages/feedback/feedback.component';
import { FloatLabelModule } from '~/app/shared/float-label/float-label.module';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { setStatusBarColors } from '~/app/shared/status-bar-util';
import { ModalModule } from '~/app/shared/modal/modal.module';
import { FeedbackRepository } from '~/app/services/repositories/feedback-repository.service';
setStatusBarColors();

@NgModule({
  declarations: [
    FeedbackComponent,
  ],
  exports: [
    FeedbackComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    FloatLabelModule,
    NativeScriptLocalizeModule,
    ModalModule
  ],
  providers: [
    FeedbackRepository
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FeedbackModule { }
