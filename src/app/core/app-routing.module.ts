import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { MyhashtagsComponent } from '../pages/myhashtags/myhashtags.component';
import { FaqComponent } from '../pages/faq/faq.component';
import { StoreComponent } from '../pages/store/store.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: '~/app/pages/home/home.module#HomeModule' },
  { path: 'settings', loadChildren: '~/app/pages/settings/settings.module#SettingsModule' },
  { path: 'store', component: StoreComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'myhashtags', component: MyhashtagsComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
