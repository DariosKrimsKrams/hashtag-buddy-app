import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MyhashtagsComponent } from './myhashtags.component';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { SmallHeaderModule } from '~/app/shared/small-header/small-header.module';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { FloatLabelModule } from '~/app/shared/float-label/float-label.module';
import { setStatusBarColors } from '~/app/shared/status-bar-util';
import { HashtagModule } from '~/app/shared/hashtag/hashtag.module';
import { InsertHashtagsFormModule } from '~/app/shared/insert-hashtags-form/insert-hashtags-form.module';
setStatusBarColors();

@NgModule({
  declarations: [
    MyhashtagsComponent
  ],
  imports: [
    NativeScriptCommonModule,
    SmallHeaderModule,
    NativeScriptLocalizeModule,
    FloatLabelModule,
    HashtagModule,
    InsertHashtagsFormModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MyhashtagsModule { }
