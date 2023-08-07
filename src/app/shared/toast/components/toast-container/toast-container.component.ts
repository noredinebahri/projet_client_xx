import {Component, HostBinding, TemplateRef} from '@angular/core';
import {ToastService} from '@shared/toast/toast.service';
import {Toast} from '@shared/toast/toast-model';
import {Observable} from 'rxjs';

@Component({
  selector: 'psm-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
})
export class ToastContainerComponent {
  @HostBinding('class') classes = 'toast-container';
  @HostBinding('attr.aria-live') live = 'polite';
  @HostBinding('attr.aria-atomic') atomic = true;

  readonly toasts$: Observable<Toast[]>;

  constructor(readonly toastService: ToastService) {
    this.toasts$ = toastService.values$;
  }

  toastContentIsTemplate(toast: Toast) {
    return toast.content instanceof TemplateRef;
  }

  getTemplateContentOf(toast: Toast) {
    return toast.content as TemplateRef<any>;
  }
}
