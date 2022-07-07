/* global Transifex */
export const translateTo = (word) => {
  if (typeof Transifex !== 'undefined') {
    if (Transifex && Transifex.live.getAllLanguages()) {
      return Transifex.live.translateText(word);
    }
  }
  return word;
};
