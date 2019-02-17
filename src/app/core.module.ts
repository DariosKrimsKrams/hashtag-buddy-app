import { NgModule } from '@angular/core';
import { UserStorageService } from './storages/user-storage.service';

// https://stackoverflow.com/questions/48186872/angular-lazy-loading-modules-with-services
// https://blog.angularindepth.com/avoiding-common-confusions-with-modules-in-angular-ada070e6891f
@NgModule({
    providers: [
      UserStorageService
    ]
})
export class CoreModule {}
