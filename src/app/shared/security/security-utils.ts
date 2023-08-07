export function getAdditionalStateFrom(state: string): string | null {
  if (state) {
    const nonceAndAdditionalState = state.split(';');
    if (nonceAndAdditionalState.length > 1) {
      return nonceAndAdditionalState[nonceAndAdditionalState.length - 1];
    }
  }
  return null;
}
