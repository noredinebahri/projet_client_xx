import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'psm-drop-down-toggle-button',
  templateUrl: './drop-down-toggle-button.component.html',
  styleUrls: ['./drop-down-toggle-button.component.scss']
})
export class DropDownToggleButtonComponent {
  open = false;

  @Output()
  openClick = new EventEmitter<void>();

  @Output()
  closeClick = new EventEmitter<void>();

  close() {
    this.open = false;
    this.closeClick.next();
  }

  toggle() {
    this.open = !this.open;
    const emitter = this.open ? this.openClick : this.closeClick;
    emitter.next();
  }
}
