import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {enumTranslator} from './enum-translator';

@Pipe({
  name: 'psmTranslateEnum'
})
export class TranslateEnumPipe implements PipeTransform {
  private readonly enumTranslator;

  constructor(translate: TranslateService) {
    this.enumTranslator = enumTranslator(translate);
  }

  transform(enumValue: string | undefined | null, enumName: string): string {
    return this.enumTranslator.translate(enumValue, enumName);
  }
}
