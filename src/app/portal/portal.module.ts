import {NgModule} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {SharedModule} from '@shared/shared.module';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {NotFoundDialogComponent} from './components/not-found-dialog/not-found-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    HeaderComponent,
    DashboardComponent,
    UserProfileComponent,
    NotFoundDialogComponent
  ],
  imports: [
    SharedModule, NgbModule
  ],
  exports: [HeaderComponent]
})
export class PortalModule {
}
