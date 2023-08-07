import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserProfile} from '@shared/security/model';

@Component({
  selector: 'psm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input()
  userProfile: UserProfile | undefined | null;

  @Output()
  logout = new EventEmitter<void>();

  @Output()
  mapEditorClick = new EventEmitter<void>();

  notifyOnLogout() {
    this.logout.emit();
  }

  notifyOnMapEditorClick() {
    this.mapEditorClick.next();
  }
}
