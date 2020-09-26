import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchComponent } from './search.component';
import { FloatLabelModule } from '~/app/shared/float-label/float-label.module';
import { setStatusBarColors } from '~/app/shared/status-bar-util';
import { HashtagModule } from '~/app/shared/hashtag/hashtag.module';
import { InsertHashtagsFormModule } from '~/app/shared/insert-hashtags-form/insert-hashtags-form.module';
import { SelectionModule } from '~/app/shared/selection/selection.module';
import { CircularProgressBarModule } from '~/app/shared/circular-progress-bar/circular-progress-bar.module';
import { SuggestionsModule } from '~/app/shared/suggestions/suggestions.module';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptCommonModule } from '@nativescript/angular';
setStatusBarColors();

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptLocalizeModule,
    FloatLabelModule,
    HashtagModule,
    InsertHashtagsFormModule,
    CircularProgressBarModule,
    SelectionModule,
    SuggestionsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SearchModule { }
