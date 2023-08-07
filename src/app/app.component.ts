import {Component, OnDestroy} from '@angular/core';
import {SecurityService} from '@shared/security/security.service';
import {UserProfile} from '@shared/security/model';
import {map, Observable, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {RedirectUriHandlerService} from '@shared/security/redirect-uri-handler.service';
import {getAdditionalStateFrom} from '@shared/security/security-utils';
import {MapEditorService} from '@shared/map/map-editor.service';

@Component({
  selector: 'psm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  readonly userProfile$: Observable<UserProfile | null>;
  private urlToNavigateTo: string | null = null;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly currentRoute: ActivatedRoute,
    private readonly security: SecurityService,
    private readonly redirectUriHandler: RedirectUriHandlerService,
    private readonly mapEditor: MapEditorService
  ) {
    this.userProfile$ = security.userProfile$;
    this.keepRedirectUrlFromStatePassedAfterLogin();
    this.security
      .tryToLogin(redirectUriHandler.getRedirectUri(), redirectUriHandler.storeCurrentPathAndReturnKey())
      .then(() => this.navigateToRedirectUrlIfAny());
  }

  logout() {
    this.security.logout();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private keepRedirectUrlFromStatePassedAfterLogin() {
    this.currentRoute.queryParams
      .pipe(
        map(params => params['state']),
        map(state => getAdditionalStateFrom(state)),
        map(urlKey => urlKey ? this.redirectUriHandler.retrievePathAndClear(urlKey) : null),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(path => {
        if (path) {
          this.urlToNavigateTo = path;
        }
      });
  }

  private navigateToRedirectUrlIfAny(): Promise<void> {
    if (this.urlToNavigateTo) {
      return this.router.navigateByUrl(this.urlToNavigateTo)
        .then(() => {
          this.urlToNavigateTo = null;
          return;
        });
    } else {
      return Promise.resolve();
    }
  }

  goToMapEditor() {
    this.mapEditor.open();
  }
}
