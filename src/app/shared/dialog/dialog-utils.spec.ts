import {ApiCallFn, createApiCallDeferrer} from '@shared/dialog/dialog-utils';
import createSpy = jasmine.createSpy;

describe('ApiCaller', () => {
  interface SomeTestApi {
    doSomething(): void
  }

  it('executes API calls after it is ready for use', () => {
    // given
    const gridApiCaller = createApiCallDeferrer<SomeTestApi>();
    const apiStub: SomeTestApi = jasmine.createSpyObj(['doSomething']);
    // when
    gridApiCaller.onApiReady(apiStub);
    // then
    gridApiCaller.execute(api => {
      expect(api).toBe(apiStub);
    });
  });

  it('defers API calls until it is ready for use', () => {
    // 1. given
    const gridApiCaller = createApiCallDeferrer<SomeTestApi>();
    const apiStub: SomeTestApi = jasmine.createSpyObj(['doSomething']);
    gridApiCaller.execute(api => {
      // 3. then
      expect(api).toBe(apiStub);
    });
    // 2. when
    gridApiCaller.onApiReady(apiStub);
  });

  it('does not execute API calls before it is ready for use', () => {
    // given
    const gridApiCaller = createApiCallDeferrer<SomeTestApi>();
    const gridApiAction = createSpy<ApiCallFn<SomeTestApi>>('action');
    // when
    gridApiCaller.execute(gridApiAction);
    // then
    expect(gridApiAction).not.toHaveBeenCalled();
  });
});
