export function parseUrlParamBooleanValue(booleanToParse: string | null | undefined): boolean {
  return booleanToParse === 'true';
}

export type ApiCallFn<A> = (api: A) => void;

export type ApiCaller<A> = {
  execute(apiCallFn: ApiCallFn<A>): void
  onApiReady(newApi: A): void
};

export function createApiCallDeferrer<A>(): ApiCaller<A> {
  let api: A | null = null;
  let callsToDeferUntilApiReady: ApiCallFn<A>[] = [];

  return {
    execute(apiCallFn: ApiCallFn<A>) {
      if (isApiReadyToUse()) {
        apiCallFn(api!);
      } else {
        callsToDeferUntilApiReady.push(apiCallFn);
      }
    },

    onApiReady(newApi: A) {
      api = newApi;
      callsToDeferUntilApiReady.forEach(apiCallFn => apiCallFn(api!));
    }
  }

  function isApiReadyToUse() {
    return api != null;
  }
}

