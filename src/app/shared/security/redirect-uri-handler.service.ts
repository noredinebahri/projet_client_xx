const urlKeyPrefix = 'gedasRedirectPath-'

export class RedirectUriHandlerService {

  getRedirectUri(): string {
    return `${window.location.origin}/`;
  }

  storeCurrentPathAndReturnKey(): string {
    const urlKey = `${urlKeyPrefix}${Date.now()}`;
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    localStorage.setItem(urlKey, currentPath);

    return urlKey;
  }

  retrievePathAndClear(key: string): string | null {
    if (key) {
      const path = localStorage.getItem(key);
      clearUrlKeys();
      return path;
    }
    return null;

    function clearUrlKeys() {
      const urlKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(urlKeyPrefix)){
          urlKeys.push(key);
        }
      }
      urlKeys.forEach(urlKey => localStorage.removeItem(urlKey));
    }
  }
}
