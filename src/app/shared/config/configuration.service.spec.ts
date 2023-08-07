import {HttpClient} from '@angular/common/http';
import {ConfigurationService} from '@shared/config/configuration.service';
import {lastValueFrom, of} from 'rxjs';
import {TestBed} from '@angular/core/testing';
import {APP_INITIALIZER} from '@angular/core';
import {configurationInitializerFactory} from '@shared/config/configuration-initializer-factory';

describe('ConfigurationService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let appConfig: ConfigurationService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj<HttpClient>( ['get']);
    appConfig = new ConfigurationService(httpClientSpy);
  });

  it('fetches application configuration containing backend and IAM URLs', () => {
    // given
    const psmBackendUrl = 'https://psm.gedas.deutschepost.de';
    const iamIssuerUrl = 'https://iam.gedas.deutschepost.de/realms/gedas-dev';
    httpClientSpy.get.and.returnValue(of({psmBackendUrl, iamIssuerUrl}));
    return lastValueFrom(
      // when
      appConfig.fetch()
    ).then(() => {
      // then
      expect(appConfig.psmBackendUrl).toBe(psmBackendUrl);
      expect(appConfig.iamIssuerUrl).toBe(iamIssuerUrl);
    });
  });

  it('throws exception if fetching not executed at all', () => {
    // given
    const psmBackendUrl = 'https://psm.gedas.deutschepost.de';
    const iamIssuerUrl = 'https://iam.gedas.deutschepost.de/realms/gedas-dev';
    httpClientSpy.get.and.returnValue(of({psmBackendUrl, iamIssuerUrl}));
    // when appConfig.fetch() NOT executed
    // then
    expect(() => appConfig.psmBackendUrl).toThrowError();
    expect(() => appConfig.iamIssuerUrl).toThrowError();
  });

  it('throws exception if no config fetched', () => {
    // given
    httpClientSpy.get.and.returnValue(of(null));
    return lastValueFrom(
      // when
      appConfig.fetch()
    ).then(() => {
      fail('Error expected!');
    }, error => {
      // then
      expect(error.message).toBe('Empty application config!');
    });
  });

  it('throws exception if backend URL is missing', () => {
    // given
    const iamIssuerUrl = 'https://iam.gedas.deutschepost.de/realms/gedas-dev';
    httpClientSpy.get.and.returnValue(of(iamIssuerUrl));
    return lastValueFrom(
      // when
      appConfig.fetch()
    ).then(() => {
      fail('Error expected!');
    }, error => {
      // then
      expect(error.message).toBe('"psmBackendUrl" property is missing in the app config!');
    });
  });

  it('throws exception if IAM URL is missing', () => {
    // given
    const psmBackendUrl = 'https://psm.gedas.deutschepost.de';
    httpClientSpy.get.and.returnValue(of({psmBackendUrl}));
    return lastValueFrom(
      // when
      appConfig.fetch()
    ).then(() => {
      fail('Error expected!');
    }, error => {
      // then
      expect(error.message).toBe('"iamIssuerUrl" property is missing in the app config!');
    });
  });

  it('is initialized by app initializer', () => {
    // given
    const psmBackendUrl = 'https://psm.gedas.deutschepost.de';
    const iamIssuerUrl = 'https://iam.gedas.deutschepost.de/realms/gedas-dev';
    httpClientSpy.get.and.returnValue(of({psmBackendUrl, iamIssuerUrl}));
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: httpClientSpy},
        ConfigurationService,
        {
          provide: APP_INITIALIZER,
          useFactory: configurationInitializerFactory,
          deps: [ConfigurationService],
          multi: true
        }
      ]
    });
    // when
    const appConfig = TestBed.inject<ConfigurationService>(ConfigurationService);
    // then
    expect(appConfig.psmBackendUrl).toBe(psmBackendUrl);
    expect(appConfig.iamIssuerUrl).toBe(iamIssuerUrl);
  });
});

