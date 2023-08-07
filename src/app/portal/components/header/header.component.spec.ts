import {HeaderComponent} from '@portal/components/header/header.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UserProfileComponent} from '@portal/components/user-profile/user-profile.component';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {UserProfile} from '@shared/security/model';
import {DropDownToggleButtonComponent} from '@shared/dialog/drop-down-toggle-button/drop-down-toggle-button.component';
import {optionsOf} from '@portal/components/user-profile/user-profile.component.spec';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>,
    component: HeaderComponent,
    element: HTMLElement,
    testUserProfile: UserProfile;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [HeaderComponent, UserProfileComponent, DropDownToggleButtonComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    testUserProfile = {name: 'Andreas Mustermann'};
  });

  it('renders navigation links to dialogs', () => {
    // then
    const linkToStartPage = element.querySelector<HTMLAnchorElement>('a.gedas-link-start-page');
    expect(linkToStartPage).not.toBeNull();
    const linkToTasks = element.querySelector<HTMLAnchorElement>('a.gedas-link-tasks');
    expect(linkToTasks).not.toBeNull();
    const linkToTaskDetails = element.querySelector<HTMLAnchorElement>('a.gedas-link-task-details');
    expect(linkToTaskDetails).not.toBeNull();
    const linkToEditor = element.querySelector<HTMLAnchorElement>('a.gedas-link-editor');
    expect(linkToEditor).not.toBeNull();
  });

  it('notifies upon click on the editor link', (done) => {
    // 1. given
    const linkToEditor = element.querySelector<HTMLAnchorElement>('a.gedas-link-editor');
    component.mapEditorClick.subscribe(() => {
      // 3. then
      expect(true).toBeTruthy(); // just to have an assertion
      done();
    })
    // when
    linkToEditor?.click();
  });

  it('does not render user profile component if no user data passed', () => {
    // when
    fixture.detectChanges();
    // then
    const userProfileComponent = element.querySelector<HTMLElement>('psm-user-profile');
    expect(userProfileComponent).toBeNull();
  });

  it('renders user profile component if user data passed', () => {
    // given
    component.userProfile = testUserProfile;
    // when
    fixture.detectChanges();
    // then
    const userProfileComponent = element.querySelector<HTMLElement>('psm-user-profile');
    expect(userProfileComponent).not.toBeNull();
  });

  it('notifies upon click on the logout button', (done) => {
    // 1. given
    component.userProfile = testUserProfile;
    component.logout.subscribe(() => {
      // 3. then
      expect(true).toBeTruthy(); // just to have an assertion
      done();
    });
    // when
    fixture.detectChanges();
    const userProfileComponent = element.querySelector<HTMLElement>('psm-user-profile');
    if (userProfileComponent) {
      optionsOf(userProfileComponent).openClickingOnToggleButton();
      fixture.detectChanges();
      optionsOf(userProfileComponent).clickOnLogoutButton();
    } else {
      fail('No user profile component found!');
    }
  });
});
