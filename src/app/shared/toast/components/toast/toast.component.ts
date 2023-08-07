import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'psm-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  @Output()
  close = new EventEmitter<void>();

  notifyOnClose(): void {
    this.close.emit();
  }
}
