import {Component, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ToastContainerComponent} from '@shared/toast/components/toast-container/toast-container.component';
import {ToastComponent} from '@shared/toast/components/toast/toast.component';
import {ToastService} from '@shared/toast/toast.service';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';

const testTemplateContentText = 'Test text content';

@Component({
  selector: 'psm-toast-container-test',
  template: `
    <psm-toast-container></psm-toast-container>
    <ng-template #testTemplateContent>
      <span class="test-template">${testTemplateContentText}</span>
    </ng-template>`,
})
class ToastContainerTestComponent {
  @ViewChild('testTemplateContent')
  testTemplate: TemplateRef<unknown> | undefined
}

describe('Toast Container', () => {
  let fixture: ComponentFixture<ToastContainerTestComponent>;
  let element: HTMLElement;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgbToastModule],
      declarations: [ToastComponent, ToastContainerComponent, ToastContainerTestComponent],
      providers: [ToastService]
    });

    fixture = TestBed.createComponent<ToastContainerTestComponent>(ToastContainerTestComponent);
    element = fixture.nativeElement as HTMLElement;
    toastService = TestBed.inject<ToastService>(ToastService);
  });

  it('shows a toast containing template in the container', () => {
    // given
    fixture.detectChanges();
    if(!fixture.componentInstance.testTemplate) {
      fail('Test toast template content not found');
    }
    // when
    toastService.show(fixture.componentInstance.testTemplate!, {autoHide: false});
    fixture.detectChanges();
    // then
    const toastContent = element.querySelector('psm-toast-container psm-toast div.content-container span');
    expect(toastContent).not.toBeNull();
    expect(toastContent?.textContent).toBe(testTemplateContentText);
  });

  it('shows a toast containing text in the container', () => {
    // given
    const textContent = 'Test me';
    // when
    toastService.show(textContent, {autoHide: false});
    fixture.detectChanges();
    // then
    const toastContent = element.querySelector('psm-toast-container psm-toast div.content-container');
    expect(toastContent).not.toBeNull();
    expect(toastContent?.textContent).toBe(textContent);
  });

  it('removes a toast when its close button clicked', () => {
    // given
    const textContent = 'Test me';
    toastService.show(textContent, {autoHide: false});
    fixture.detectChanges();
    const toastCloseButton = element.querySelector<HTMLButtonElement>('psm-toast-container psm-toast button');
    if (!toastCloseButton) {
      fail('No toast close button found');
    }
    // when
    toastCloseButton?.click();
    fixture.detectChanges();
    // then
    const toast = element.querySelector('psm-toast-container psm-toast');
    expect(toast).toBeNull();
  });
});
