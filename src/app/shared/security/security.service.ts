import {BehaviorSubject} from 'rxjs';
import {UserProfile} from '@shared/security/model';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {Injectable} from '@angular/core';
import {ConfigurationService} from '@shared/config/configuration.service';

interface OAuthUserProfile {
  info: {
    preferred_username: string;
    name: string
  }
}

@Injectable()
export class SecurityService {
  private readonly userProfile = new BehaviorSubject<UserProfile | null>(null);
  readonly userProfile$ = this.userProfile.asObservable();

  private readonly oauthConfig: AuthConfig = {
    clientId: 'psm-client',
    scope: 'openid profile email offline_access osm-compatible-api',
    responseType: 'code',
    showDebugInformation: true
  }

  constructor(
    private readonly oauth: OAuthService,
    appConfig: ConfigurationService
  ) {
    this.oauthConfig.issuer = appConfig.iamIssuerUrl;
  }

  tryToLogin(redirectUri: string, state?: string): Promise<void> {
    this.oauth.configure({...this.oauthConfig, redirectUri});
    return this.oauth.loadDiscoveryDocumentAndLogin(state ? {state} : {})
      .then(this.setupSilentRefreshAndLoadUserProfileIfTokensAreValid)
      .catch(error => console.error('Tokens valid, but likely revoked...', error));
  }

  logout() {
    this.oauth.logOut();
    this.userProfile.next(null);
  }

  private readonly setupSilentRefreshAndLoadUserProfileIfTokensAreValid = (tokensValid: boolean): Promise<void> => {
    if (tokensValid) {
      this.oauth.setupAutomaticSilentRefresh();
      return this.oauth.loadUserProfile()
        .then(oauthUserProfile => fromOAuthUserProfileToPsmOne(oauthUserProfile as OAuthUserProfile))
        .then(userProfile => this.userProfile.next(userProfile))
    } // else: redirects to login page
    return Promise.resolve();

    function fromOAuthUserProfileToPsmOne(oauthUserProfile: OAuthUserProfile): UserProfile {
      return {name: (oauthUserProfile.info.name || oauthUserProfile.info.preferred_username)};
    }
  }
}
