import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { FaqComponent } from '../pages/faq/faq.component';
import { StoreComponent } from '../pages/store/store.component';
import { ErrorComponent } from '../shared/error/error.component';
import { HistoryoverviewComponent } from '../pages/historyoverview/historyoverview.component';
import { SearchComponent } from '../pages/search/search.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: '~/app/pages/home/home.module#HomeModule' },
  { path: 'historyoverview', component: HistoryoverviewComponent },
  { path: 'settings', loadChildren: '~/app/pages/settings/settings.module#SettingsModule' },
  { path: 'store', component: StoreComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'search', component: SearchComponent },
  { path: 'error', component: ErrorComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
