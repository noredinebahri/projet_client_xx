import {ToastService} from '@shared/toast/toast.service';
import {ToastContent, ToastOptions} from '@shared/toast/toast-model';

describe('ToastService', () => {
  let toastService: ToastService;

  beforeEach(() => toastService = new ToastService());

  it('has an empty toast list initially', (done) => {
    // then
    toastService.values$.subscribe(toasts => {
      expect(toasts).toBeTruthy();
      expect(toasts.length).toBe(0);
      done();
    });
  });

  it('adds a new toast', (done) => {
    // given
    const toastContent: ToastContent = 'Hello...';
    const toastOptions: ToastOptions = {delayInMillis: 7777};
    // when
    toastService.show(toastContent, toastOptions);
    // then
    toastService.values$.subscribe(toasts => {
      expect(toasts).toBeTruthy();
      expect(toasts.length).toBe(1);
      const toast = toasts[0];
      expect(toast.content).toBe(toastContent);
      expect(toast.delayInMillis).toBe(toastOptions.delayInMillis);
      expect(toast.autoHide).toBeUndefined();
      expect(toast.className).toBeUndefined();
      done();
    });
  });

  it('adds a new toast without any options', (done) => {
    // given
    const toastContent: ToastContent = 'Hello...';
    // when
    toastService.show(toastContent);
    // then
    toastService.values$.subscribe(toasts => {
      expect(toasts).toBeTruthy();
      expect(toasts.length).toBe(1);
      const toast = toasts[0];
      expect(toast.content).toBe(toastContent);
      expect(toast.delayInMillis).toBeUndefined();
      expect(toast.autoHide).toBeUndefined();
      expect(toast.className).toBeUndefined();
      done();
    });
  });

  it('clears a toast list', (done) => {
    // given
    const toastContent: ToastContent = 'Hello...';
    const toastOptions: ToastOptions = {delayInMillis: 7777};
    toastService.show(toastContent, toastOptions);
    // when
    toastService.clear();
    // then
    toastService.values$.subscribe(toasts => {
      expect(toasts).toBeTruthy();
      expect(toasts.length).toBe(0);
      done();
    });

  });

  it('removes a toast just added', (done) => {
    // given
    const toastContent: ToastContent = 'Hello...';
    const toastOptions: ToastOptions = {delayInMillis: 7777};
    toastService.show(toastContent, toastOptions);
    toastService.values$.subscribe(toasts => {
      expect(toasts).toBeTruthy();
      const toastJustAdded = toasts.length > 0;
      if (toastJustAdded) {
        const addedToast = toasts[0];
        toastService.remove(addedToast);
      } else {
        expect(toasts.length).toBe(0);
        done();
      }
    });
  });
});
