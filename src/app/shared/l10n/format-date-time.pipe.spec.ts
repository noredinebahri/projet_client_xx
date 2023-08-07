import {PsmFormatDateTimePipe} from '@shared/l10n/format-date-time.pipe';
import format from 'date-fns/format';
import {dateFormat, dateTimeFormat, timeFormat} from '@shared/l10n/date-utils';
import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

@Component({
  selector: 'psm-format-date-time-pipe-test',
  template: `<span>{{date | psmFormatDateTime}}</span>`,
})
class FormatDateTimePipeTestComponent {
  @Input()
  date: Date | undefined;
}

describe('PsmFormatDateTimePipe', () => {
  describe('(class tests)', () => {
    const psmFormatDateTime = new PsmFormatDateTimePipe();

    it('formats date and time', () => {
      // given
      const now = new Date();
      // when
      const formattedDate = psmFormatDateTime.transform(now);
      // then
      expect(formattedDate).toBe(format(now, dateTimeFormat));
    });

    it('formats date', () => {
      // given
      const now = new Date();
      // when
      const formattedDate = psmFormatDateTime.transform(now, 'date');
      // then
      expect(formattedDate).toBe(format(now, dateFormat));
    });

    it('formats time', () => {
      // given
      const now = new Date();
      // when
      const formattedDate = psmFormatDateTime.transform(now, 'time');
      // then
      expect(formattedDate).toBe(format(now, timeFormat));
    });

    it('returns empty string for undefined', () => {
      // when
      const formattedDate = psmFormatDateTime.transform(undefined);
      // then
      expect(formattedDate).toBe('');
    });

    it('returns empty string for null', () => {
      // when
      const formattedDate = psmFormatDateTime.transform(null);
      // then
      expect(formattedDate).toBe('');
    });
  });

  describe('(component tests)', () => {
    let fixture: ComponentFixture<FormatDateTimePipeTestComponent>,
      component: FormatDateTimePipeTestComponent,
      element: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        declarations: [PsmFormatDateTimePipe, FormatDateTimePipeTestComponent]
      }).createComponent(FormatDateTimePipeTestComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    })

    it('formats date and time', () => {
      // given
      const now = new Date();
      component.date = now;
      // when
      fixture.detectChanges();
      // then
      const spanElement = element.querySelector<HTMLSpanElement>('span');
      expect(spanElement).not.toBeNull();
      expect(spanElement?.textContent).toBe(format(now, dateTimeFormat));
    });
  });
});
