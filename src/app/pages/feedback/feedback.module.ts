import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { FeedbackRoutingModule } from "./feedback-routing.module";
import { SmallHeaderModule } from "~/app/shared/small-header/small-header.module";
import { FeedbackComponent } from "~/app/pages/feedback/feedback.component";
import { ModalComponent } from './modal/modal.component';
import { FloatLabelModule } from "~/app/shared/float-label/float-label.module";
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { setStatusBarColors } from "~/app/shared/status-bar-util";
import { FeedbackRepositoryService } from "~/app/services/feedback-repository.service";
setStatusBarColors();

@NgModule({
  declarations: [
    FeedbackComponent,
    ModalComponent
  ],
  imports: [
    NativeScriptCommonModule,
    FeedbackRoutingModule,
    SmallHeaderModule,
    FloatLabelModule,
    NativeScriptLocalizeModule
  ],
  providers: [
    FeedbackRepositoryService
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    ModalComponent
  ]
})
export class FeedbackModule { }
