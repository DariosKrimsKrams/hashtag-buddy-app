import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ResultsComponent } from './results.component';
import { InsertHashtagsFormModule } from '~/app/shared/insert-hashtags-form/insert-hashtags-form.module';
import { FloatLabelModule } from '~/app/shared/float-label/float-label.module';
import { HashtagModule } from '~/app/shared/hashtag/hashtag.module';
import { ProgressBarModule } from '~/app/shared/progress-bar/progress-bar.module';
import { SelectionModule } from '~/app/shared/selection/selection.module';
import { SuggestionsModule } from '~/app/shared/suggestions/suggestions.module';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptCommonModule } from '@nativescript/angular';

@NgModule({
  declarations: [
    ResultsComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule,
    FloatLabelModule,
    InsertHashtagsFormModule,
    HashtagModule,
    ProgressBarModule,
    SelectionModule,
    SuggestionsModule
  ],
  exports: [
    ResultsComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ResultsModule { }
