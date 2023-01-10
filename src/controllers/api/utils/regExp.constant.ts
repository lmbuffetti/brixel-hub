/* eslint-disable no-useless-escape */

// noinspection Annotator
export default {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  phone: /^[\d\(\) +-]+$/,
  text: /^'*[a-zA-Z\s][a-zA-Z'\s]*$/,
  url: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
  twoDecimal: /^\d+(\.\d{1,2})?$/,
  personName: /^[a-zA-Z0-9.'_]{2,}$/,
  password: /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])((?=.*[a-zA-Z])|(?=.*\d+)).*$/,
  image: /\.(gif|jpg|jpeg|tiff|png)$/i,
  thousandsDelimiter: /\B(?=(\d{3})+(?!\d))/g,
  browserLangDelimiter: /[_-]+/,
  positiveNumber: /^\+?(0|[1-9]\d*)$/,
  characterAndNumber: /^[a-zA-Z0-9]+$/,
  number: /^\d+$/,
  isHighlighted: /<em>.+<\/em>/i,
  upperCaseAndNumber: /^[A-Z0-9]*$/,
  allSymbols: /^.+$/,
  fourDigits: /^\d{4}$/,
  postcode: /(^([A-Z]{1,2})([0-9]{2,3})([A-Z]{2})$)|(^([A-Z]{1,2})([0-9])([A-Z])([0-9])([A-Z]{2})$)|(^GIR0AA$)/i,
  hasNumber: /\d/,
  hasUppercaseLetter: /\w*[A-Z]\w*/,
  hasLowercaseLetter: /\w*[a-z]\w*/,
  hasSpecialCharacter: /[!@#$%^&*(),.?":{}|<>]/,
  nin: /^[A-CEGHJ-NOPR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D\s]{1}/i,
  nin_exp: /(^GB)|(^BG)|(^NK)|(^KN)|(^TN)|(^NT)|(^ZZ).+/i,
};
