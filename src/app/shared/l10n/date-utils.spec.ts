import {parseDateInIso, parseDatePropertiesForEachElementOf, parseDatePropertiesOf} from '@shared/l10n/date-utils';
import isEqual from 'date-fns/isEqual';

describe('Date Utils', () => {

  describe('parseDateInIso', () => {
    it('parses date from ISO format', () => {
      // given
      const now = new Date();
      // when
      const parsedDate = parseDateInIso(now.toISOString());
      // then
      expect(parsedDate).not.toBeNull();
      expect(isEqual(now, parsedDate!)).toBeTruthy();
    });

    it('returns null if ISO format wrong', () => {
      // when
      const parsedDate = parseDateInIso('wrong ISO format');
      // then
      expect(parsedDate).toBeNull();
    });
  });

  describe('parseDatePropertiesOf', () => {
    it('parses date property of object', () => {
      // given
      const dateOfBirth = new Date();
      const object = {
        name: 'Test',
        dateOfBirth: dateOfBirth.toISOString()
      }
      // when
      const {dateOfBirth: parsedDateOfBirth} = parseDatePropertiesOf(object, ['dateOfBirth']);
      // then
      expect(isEqual(dateOfBirth, parsedDateOfBirth)).toBeTruthy();
    });

    it('leaves date property as is, if it is falsy', () => {
      // given
      const object = {
        name: 'Test',
        dateOfBirth: '',
        graduationDate: null
      }
      // when
      const {dateOfBirth, graduationDate} = parseDatePropertiesOf(object, ['dateOfBirth', 'graduationDate']);
      // then
      expect(object.dateOfBirth).toBe(dateOfBirth);
      expect(object.graduationDate).toBe(graduationDate);
    });

    it('returns the same value, if it is falsy', () => {
      // when
      const parsedObject = parseDatePropertiesOf(null, []);
      // then
      expect(parsedObject).toBeNull();
    });
  });

  describe('parseDatePropertiesForEachElementOf', () => {
    it('parses date property for each object', () => {
      // given
      const dateOfBirth = new Date();
      const object = {
        name: 'Test',
        dateOfBirth: dateOfBirth.toISOString()
      }
      // when
      const [{dateOfBirth: parsedDateOfBirth}] = parseDatePropertiesForEachElementOf([object], ['dateOfBirth']);
      expect(isEqual(dateOfBirth, parsedDateOfBirth)).toBeTruthy();
    });

    it('returns the same value, if it is falsy', () => {
      // when
      const parsedObjects = parseDatePropertiesForEachElementOf(null!, []);
      // then
      expect(parsedObjects).toBeNull();
    });
  });
})
