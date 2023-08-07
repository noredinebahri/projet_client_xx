import {TranslateService} from '@ngx-translate/core';

export function enumTranslator(translate: TranslateService) {
  return {
    translate(enumValue: string | undefined | null, enumName: string): string {
      if (!enumValue) {
        return '';
      }
      if (!enumName) {
        throw new Error('Please provide enum name as a pipe argument!');
      }
      return translate.instant(`shared.enums.${enumName}.${enumValue}`);
    }
  }
}
