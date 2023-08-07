import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {PortalModule} from '@portal/portal.module';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '@shared/shared.module';
import {SecurityService} from '@shared/security/security.service';
import {of} from 'rxjs';

describe('AppComponent', () => {
  let securityServiceMock: any;

  beforeEach(() => {
    securityServiceMock = {
      userProfile$: of(null),
      tryToLogin() {
        return Promise.resolve();
      },
      logout() {
      }
    };
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), PortalModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AppComponent
      ],
      providers: [{provide: SecurityService, useValue: securityServiceMock}]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
