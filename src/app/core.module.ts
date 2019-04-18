import { NgModule } from '@angular/core';
import { UserService } from './storages/user.service';
import { PhotosCountService } from './storages/photos-count.service';

// https://stackoverflow.com/questions/48186872/angular-lazy-loading-modules-with-services
// https://blog.angularindepth.com/avoiding-common-confusions-with-modules-in-angular-ada070e6891f
@NgModule({
    providers: [
      UserService,
      PhotosCountService,
    ]
})
export class CoreModule {}
