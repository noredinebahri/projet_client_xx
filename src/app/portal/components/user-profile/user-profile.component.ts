import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {UserProfile} from '@shared/security/model';
import {DropDownToggleButtonComponent} from '@shared/dialog/drop-down-toggle-button/drop-down-toggle-button.component';

@Component({
  selector: 'psm-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  @ViewChild('toggleBtn')
  toggleButton: DropDownToggleButtonComponent | undefined;

  @ViewChild('toggleBtn', {read: ElementRef})
  toggleButtonElement: ElementRef | undefined;

  @Input()
  userProfile: UserProfile | undefined | null;

  @Output()
  readonly logout = new EventEmitter<void>();

  optionsOpened = false;

  constructor(private readonly element: ElementRef) {
  }

  @HostListener("document:click", ['$event.target'])
  closeOptionsIfClickedOutside(clickedElement: HTMLElement) {
    if (this.optionsOpened
      && this.notClickedOnWithinThisComponent(clickedElement) // this works only for native elements (and not for custom ones)
      && this.notClickedOnToggleButton(clickedElement)) { // this check is necessary as the toggle button is a custom component
      this.toggleButton?.close();
    }
  }

  notifyOnLogout() {
    this.logout.emit();
    this.toggleButton?.close();
  }

  openOptions() {
    this.optionsOpened = true;
  }

  closeOptions() {
    this.optionsOpened = false;
  }

  private notClickedOnWithinThisComponent(clickedElement: HTMLElement): boolean {
    return !this.element.nativeElement.contains(clickedElement)
  }

  private notClickedOnToggleButton(clickedElement: HTMLElement) {
    return !this.toggleButtonElement?.nativeElement.contains(clickedElement);
  }
}
