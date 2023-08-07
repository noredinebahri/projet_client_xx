import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {PortalModule} from '@portal/portal.module';
import {HttpClientModule} from '@angular/common/http';
import {TaskModule} from '@task/task.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {labelsDe} from './labels-de';
import {routes} from './routes';
import {SharedModule} from '@shared/shared.module';
import {ConfigurationService} from '@shared/config/configuration.service';
import {configurationInitializerFactory} from '@shared/config/configuration-initializer-factory';
import {OAuthModule} from 'angular-oauth2-oidc';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['https://psm.gedas.test.azure.deutschepost.de'],
        sendAccessToken: true
      }
    }),
    SharedModule.forRoot(),
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({defaultLanguage: 'de', useDefaultLang: true}),
    TaskModule.forRoot(),
    PortalModule
  ],
    providers: [
      {
        provide: APP_INITIALIZER,
        useFactory: configurationInitializerFactory,
        deps: [ConfigurationService],
        multi: true
      }
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.setTranslation('de', labelsDe)
  }
}
