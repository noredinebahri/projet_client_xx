import {TestBed} from '@angular/core/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {enumTranslator} from '@shared/enum/enum-translator';
import {Component, Input} from '@angular/core';
import {TranslateEnumPipe} from '@shared/enum/translate-enum.pipe';

type Color = 'black' | 'red' | 'white'

@Component({
  selector: 'psm-translate-enum-pipe-test',
  template: `<span>{{color | psmTranslateEnum : 'color'}}</span>`,
})
class TranslateEnumPipeTestComponent {
  @Input()
  color: Color | undefined;
}

describe('Translation of enumeration types', () => {
  const enumLabels = {shared: {enums: {color: {black: 'schwarz', red: 'rot', white: 'weiß'}}}};
  const translateModuleConfig = {defaultLanguage: 'de', useDefaultLang: true};

  let translate: TranslateService;

  function setUpTranslations() {
    translate = TestBed.inject<TranslateService>(TranslateService);
    translate.setTranslation(translateModuleConfig.defaultLanguage, enumLabels);
  }

  describe('enumTranslator', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(translateModuleConfig)]
      })
      setUpTranslations();
    });

    it('translates enum', () => {
      // given
      translate.setTranslation('de', enumLabels);
      const color: Color = 'black';
      // when
      const translatedColor = enumTranslator(translate).translate(color, 'color');
      // then
      expect(translatedColor).toBe('schwarz');
    });

    it('returns empty string if no enum value passed', () => {
      // given
      const translator = enumTranslator(translate);
      // when
      const translatedNull = translator.translate(null, 'color');
      const translatedUndefined = translator.translate(undefined, 'color');
      const translatedEmptyString = translator.translate('', 'color');
      // then
      expect(translatedNull).toBe('');
      expect(translatedUndefined).toBe('');
      expect(translatedEmptyString).toBe('');
    });

    it('throws error if enum name empty', () => {
      // 1. given
      const translator = enumTranslator(translate);
      // 3. then
      expect(() => {
        // 2. when
        translator.translate('black', '');
      }).toThrowError();
    });
  });

  describe('TranslateEnumPipe', () => {
    it('translates enum', () => {
      // given
      TestBed.configureTestingModule({
        declarations: [TranslateEnumPipe, TranslateEnumPipeTestComponent],
        imports: [TranslateModule.forRoot({defaultLanguage: 'de', useDefaultLang: true})]
      });
      setUpTranslations();
      const fixture = TestBed.createComponent(TranslateEnumPipeTestComponent);
      const component = fixture.componentInstance;
      component.color = 'black';
      // when
      fixture.detectChanges();
      // then
      const element = fixture.nativeElement as HTMLElement;
      const spanElement = element.querySelector<HTMLSpanElement>('span');
      expect(spanElement?.textContent).toBe('schwarz');
    });
  });
});
