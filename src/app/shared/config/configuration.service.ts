import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';

interface AppConfiguration {
  psmBackendUrl: string;
  iamIssuerUrl: string;
}

@Injectable()
export class ConfigurationService {
  private config: AppConfiguration | undefined;

  constructor(private readonly http: HttpClient) {
  }

  get psmBackendUrl() {
    if (this.config) {
      return this.config.psmBackendUrl;
    }
    throw new Error('App config not initialized!');
  }

  get iamIssuerUrl() {
    if (this.config) {
      return this.config.iamIssuerUrl;
    }
    throw new Error('App config not initialized!');
  }

  fetch(): Observable<void> {
    return this.http.get<AppConfiguration>('config.json')
      .pipe(
        map(config => {
          if (!config) {
            throw new Error('Empty application config!');
          }
          if (!config.psmBackendUrl) {
            throw new Error('"psmBackendUrl" property is missing in the app config!');
          }
          if (!config.iamIssuerUrl) {
            throw new Error('"iamIssuerUrl" property is missing in the app config!');
          }
          this.config = config;
          return undefined;
        }));
  }
}
