import {Toast, ToastContent, ToastOptions} from '@shared/toast/toast-model';
import {BehaviorSubject, Observable} from 'rxjs';

export class ToastService {
  private readonly toasts = new BehaviorSubject<Toast[]>([]);
  readonly values$: Observable<Toast[]> = this.toasts.asObservable();

  show(content: ToastContent, options: ToastOptions = {}) {
    const currentToasts = this.toasts.value;
    this.toasts.next([...currentToasts, {content, ...options}])
  }

  remove(toastToRemove: Toast) {
    const currentToasts = this.toasts.value;
    this.toasts.next(currentToasts.filter(toast => toast !== toastToRemove));
  }

  clear() {
    this.toasts.next([]);
  }
}
