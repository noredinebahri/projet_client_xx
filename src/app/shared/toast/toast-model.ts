import {TemplateRef} from '@angular/core';

export type ToastContent = string | TemplateRef<unknown>;

export interface ToastOptions {
  className?: string;
  autoHide?: boolean;
  delayInMillis?: number;
}

export interface Toast extends ToastOptions {
  content: ToastContent;
}
