import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SharedModule} from '@shared/shared.module';
import {PortalModule} from '@portal/portal.module';
import {TranslateModule} from '@ngx-translate/core';
import {AppComponent} from '../../../app.component';
import {UserProfileComponent} from '@portal/components/user-profile/user-profile.component';
import {UserProfile} from '@shared/security/model';
import {clickOnDocumentBody} from '@shared/spec/utils.spec';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent,
    element: HTMLElement,
    fixture: ComponentFixture<UserProfileComponent>,
    testUserProfile: UserProfile;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), PortalModule, TranslateModule.forRoot()],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    testUserProfile = {name: 'Andreas Mustermann'}
  });

  beforeEach(() => {
    component.userProfile = testUserProfile;
    fixture.detectChanges();
  })

  it('shows user profile\'s name', () => {
    // then
    const spanElement = element.querySelector<HTMLSpanElement>('button.user-profile > span');
    expect(spanElement).toBeTruthy();
    expect(spanElement?.textContent).toBe(testUserProfile.name);
  });

  it('doesn\'t show options initially', () => {
    // then
    optionsOf(element).expect().notToBeShown();
  });

  it('shows options when clicked on user profile button', () => {
    // given
    const userProfileButtonElement = element.querySelector<HTMLButtonElement>('button.user-profile');
    // when
    userProfileButtonElement?.click();
    fixture.detectChanges();
    // then
    optionsOf(element).expect().toBeShown();
  });

  it('shows options when clicked on toggle button', () => {
    // when
    optionsOf(element).openClickingOnToggleButton();
    fixture.detectChanges();
    // then
    optionsOf(element).expect().toBeShown();
  });

  it('shows logout button among options', () => {
    // when
    optionsOf(element).openClickingOnToggleButton();
    fixture.detectChanges();
    // then
    optionsOf(element).expect().toContainLogoutButton();
  });

  it('notifies on logout click and closes options', (done) => {
    component.logout.subscribe(() => {
      // 3. then
      optionsOf(element).expect().toBeShown();
      setTimeout(() => { // execute it AFTER this subscription handler finishes
        fixture.detectChanges();
        optionsOf(element).expect().notToBeShown();
        done();
      });
    });
    // 1. given we open options
    optionsOf(element).openClickingOnToggleButton();
    fixture.detectChanges();
    // 2. when
    optionsOf(element).clickOnLogoutButton();
  });

  it('closes options after clicking out of user profile', () => {
    // given
    optionsOf(element).openClickingOnToggleButton();
    fixture.detectChanges();
    // when
    clickOnDocumentBody();
    fixture.detectChanges();
    // then
    optionsOf(element).expect().notToBeShown();
  })
});

export function optionsOf(userProfileElement: HTMLElement) {
  return {
    openClickingOnToggleButton() {
      const toggleButton = getToggleButton();
      if (toggleButton) {
        toggleButton.click();
      } else {
        fail('Toggle button not found');
      }
    },

    clickOnLogoutButton() {
      const logoutButton = getLogoutButton();
      if (logoutButton) {
        logoutButton.click();
      } else {
        fail('Logout button not found among optionsOf');
      }
    },

    expect() {
      const optionsContainerElement = getOptionsContainer();
      return {
        toBeShown() {
          expect(optionsContainerElement).toBeTruthy();
        },
        notToBeShown() {
          expect(optionsContainerElement).toBeNull();
        },

        toContainLogoutButton() {
          if (optionsContainerElement) {
            const logoutButton = getLogoutButton();
            expect(logoutButton).toBeTruthy();
          } else {
            fail('No optionsOf shown');
          }
        }
      }
    }
  }

  function getOptionsContainer() {
    return userProfileElement.querySelector<HTMLSpanElement>('div.options');
  }

  function getLogoutButton() {
    return getOptionsContainer()?.querySelector<HTMLButtonElement>('button.logout');
  }

  function getToggleButton() {
    return userProfileElement.querySelector<HTMLButtonElement>('button.drop-down-toggle');
  }
}
