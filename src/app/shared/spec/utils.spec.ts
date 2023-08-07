export function clickOnDocumentBody() {
  const bodyElement = document.querySelector<HTMLBodyElement>('body');
  if (bodyElement) {
    bodyElement.click();
  } else {
    fail('Document body not found');
  }
}
