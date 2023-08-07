import {ConfigurationService} from '@shared/config/configuration.service';
import {Observable} from 'rxjs';

export function configurationInitializerFactory(config: ConfigurationService) {
  return function configurationInitializer(): Observable<void> {
    return config.fetch();
  };
}
