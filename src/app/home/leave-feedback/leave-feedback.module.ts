import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ModalComponent } from '~/app/pages/feedback/modal/modal.component';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { LeaveFeedbackComponent } from './leave-feedback.component';
import { HashtagModule } from '~/app/shared/hashtag/hashtag.module';
import { ModalModule } from '~/app/pages/feedback/modal/modal.module';
import { FloatLabelModule } from '~/app/shared/float-label/float-label.module';

@NgModule({
  declarations: [
    LeaveFeedbackComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    HashtagModule,
    NativeScriptLocalizeModule,
    ModalModule,
    FloatLabelModule
  ],
  exports: [
    LeaveFeedbackComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LeaveFeedbackModule { }
