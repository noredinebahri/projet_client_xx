import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AgGridModule} from 'ag-grid-angular';
import {DialogIconComponent} from './dialog/dialog-icon/dialog-icon.component';
import {NgbAccordionModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '@shared/toast/toast.service';
import {ToastContainerComponent} from '@shared/toast/components/toast-container/toast-container.component';
import {ToastComponent} from '@shared/toast/components/toast/toast.component';
import {TranslateEnumPipe} from '@shared/enum/translate-enum.pipe';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {MapViewerComponent} from './map/map-viewer/map-viewer.component';
import {ConfigurationService} from '@shared/config/configuration.service';
import {SecurityService} from '@shared/security/security.service';
import {RedirectUriHandlerService} from '@shared/security/redirect-uri-handler.service';
import {DropDownToggleButtonComponent} from './dialog/drop-down-toggle-button/drop-down-toggle-button.component';
import {MapEditorService} from '@shared/map/map-editor.service';
import {PsmFormatDateTimePipe} from './l10n/format-date-time.pipe';


@NgModule({
  declarations: [
    DialogIconComponent,
    ToastContainerComponent,
    ToastComponent,
    TranslateEnumPipe,
    MapViewerComponent,
    DropDownToggleButtonComponent,
    PsmFormatDateTimePipe
  ],
  imports: [
    CommonModule, RouterModule, NgbToastModule, LeafletModule
  ],
  exports: [
    // re-exported modules
    CommonModule, RouterModule, TranslateModule, ReactiveFormsModule, AgGridModule, NgbAccordionModule, NgbToastModule,
    // shared components
    DialogIconComponent, ToastContainerComponent, ToastComponent, TranslateEnumPipe, MapViewerComponent,
    DropDownToggleButtonComponent, PsmFormatDateTimePipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [ToastService, ConfigurationService, SecurityService, RedirectUriHandlerService, MapEditorService]
    };
  }

}
