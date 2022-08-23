import isObject from 'lodash/isObject';
import Cookies from 'universal-cookie';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import { isEmptyWithBool } from '@brixel/brixel-components/dist/utils/helper';
import { translateTo } from '@brixel/brixel-components';
import has from 'lodash/has';
import { configureStore } from '../store';
import { InputSheets } from '../resources/SingleProperty/inputSheets';
import { BestimateQuestions } from '../resources/Flows/Bestimate';

const cookies = new Cookies();

export const calcPercentageFacts = (form = 'Property', value = {}) => {
  let countTotal = 0;
  let countDone = 0;
  const formValue = get(configureStore.getState(), `brixelForm[${form}].values`, value);
  const Questions = InputSheets(formValue);
  Questions.map((val) => {
    val.inputs.map((item) => {
      const name = get(item, 'condition.name', '');
      const valA = get(formValue, name, 'a');
      if (item.conditions) {
        item.conditions.map((cond) => {
          const valB = get(formValue, cond.name, 'a');
          if (valB === cond.value && (get(formValue, item.name, 'ayc') !== 'ayc' || get(formValue, item.name, 'ayc') !== null)) {
            countTotal += 1;
            countDone += 1;
          }
          return null;
        });
      } else if (!item.condition || (item.condition && valA === item.condition.value)) {
        if (get(formValue, `inputSheet.skipSection[${item.name}]`, false)) {
          countTotal += 1;
          countDone += 1;
        } else if (get(formValue, item.name, 'ayc') !== 'ayc' && get(formValue, item.name, 'ayc') !== null) {
          countTotal += 1;
          countDone += 1;
        } else {
          countTotal += 1;
        }
      }
      return null;
    });
    return null;
  });
  // const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
  const calPerc = Math.floor((countDone * 100) / countTotal);
  const savedPerc = Math.floor(get(formValue, 'inputSheet.totalComplete', 0) || 0);
  return {
    realPerc: Math.round((countDone * 100) / countTotal),
    calcPerc: calPerc,
    savedPerc,
    countTotal,
    countDone,
  };
};

export const calcPercentageProEstimation = (form = 'Property', value = {}) => {
  let countTotal = 0;
  let countDone = 0;
  const questList = [];
  const formValue = get(configureStore.getState(), `brixelForm[${form}].values`, value);
  InputSheets('proEstimation').forEach((singleQuest) => {
    singleQuest.inputs.forEach((input) => {
      if (input.isProEstimation) {
        let mergeCondition = [];
        if (input.condition && input.condition.name && input.condition.value) {
          mergeCondition = [{ name: input.condition.name, value: input.condition.value }];
        } else if (input.condition && input.condition.name && input.condition.noValue) {
          mergeCondition = [{ name: input.condition.name, noValue: input.condition.noValue }];
        } else if (input.condition) {
          mergeCondition = input.condition;
        }
        if (input.proEstimationConditions) {
          mergeCondition = mergeCondition.concat(input.proEstimationConditions);
        }
        let isValid = true;
        if (mergeCondition.length > 0) {
          mergeCondition.forEach((item) => {
            if (isValid) {
              if (item.value && item.value !== get(formValue, item.name, null)) {
                isValid = false;
              } else if (item.noValue && item.noValue === get(formValue, item.name, null)) {
                isValid = false;
              }
            }
          });
        }
        if (isValid) questList.push(input);
      }
    });
  });
  const Questions = questList;
  Questions.forEach((val) => {
    if (get(formValue, `inputSheet.skipSection[${val.name}]`, false)) {
      countTotal += 1;
      countDone += 1;
    } else if (get(formValue, val.name, 'ayc') !== 'ayc' && get(formValue, val.name, 'ayc') !== null) {
      if (isArray(get(formValue, val.name, 'ayc'))) {
        if (get(formValue, val.name, []).length > 0) {
          countTotal += 1;
          countDone += 1;
        } else {
          countTotal += 1;
        }
      } else {
        countTotal += 1;
        countDone += 1;
      }
    } else if (get(val, 'component.type.defaultProps.startFrom', null) !== null) {
      countDone += 1;
      countTotal += 1;
    } else {
      countTotal += 1;
    }
  });
  
  // const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
  const calPerc = Math.floor((countDone * 100) / countTotal);
  const savedPerc = Math.floor(get(formValue, 'inputSheet.totalComplete', 0) || 0);
  return {
    realPerc: Math.ceil((countDone * 100) / countTotal),
    calcPerc: calPerc,
    savedPerc,
    countTotal,
    countDone,
  };
};

export const formatPrice = (value, lang) => {
  if (typeof value !== 'number' && !value) return '';
  return Number(value).toLocaleString(lang);
};

export const cutValue = (val) => {
  let formatVal = val;
  if (val > 10000) {
    formatVal = val / 10000;
    formatVal = formatVal % 1 !== 0 ? formatVal.toFixed(2) : formatVal;
    formatVal = `${formatVal}K`;
  }
  if (val > 100000) {
    formatVal = val / 1000000;
    formatVal = formatVal % 1 !== 0 ? formatVal.toFixed(2) : formatVal;
    formatVal = `${formatVal}M`;
  }

  return formatVal;
};

export function formatNum(num, separator, fraction, localeString = 'de-CH') {
  const convNum = +num;
  const str = convNum.toLocaleString(localeString);
  // str = str.replace(/\./g, separator);
  // str = str.replace(/,/g, fraction);
  return str;
}

export function roundHundred(value) {
  return Math.round(value / 100) * 100;
}

export function roundThousand(value) {
  return Math.round(value / 1000) * 1000;
}
export function roundFiveThousand(value) {
  return Math.round(value / 5000) * 5000;
}

export function roundFifty(value) {
  return Math.round(value / 50) * 50;
}

export const loadScript = (src) => {
  const tag = document.createElement('script');
  tag.async = false;
  tag.src = src;
  document.getElementsByTagName('body').appendChild(tag);
};

export const formatDistance = (val) => {
  let newVal = `${val}m`;
  if (+val >= 1000) {
    newVal = `${parseFloat((+val / 1000).toFixed(1))}km`;
  }
  return newVal;
};

export const convertColorToHue = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  const newVal = (hex.replace('#', '0x'));
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  let l = (max + min) / 2;

  if (max === min) {
    s = 0;
    h = s; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        // do nothng
    }
    h /= 6;
  }

  s *= 100;
  s = Math.round(s);
  l *= 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  const colorInHSL = `hsl(${h},${s}%,${l}%)`;
  return {
    hex: newVal,
    hsl: colorInHSL,
  };
};

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const clearUrl = (string) => string.replace(/\/\//g, '/');

export const arrayMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const formatDate = (date, type = 'extended') => {
  let formattedDate;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  if (type === 'short') {
    const realMonth = date.getMonth() + 1;
    const monthNum = realMonth < 10 ? `0${realMonth}` : realMonth;
    formattedDate = `${day}-${monthNum}-${year}`;
  } else {
    formattedDate = `${day} ${translateTo(arrayMonth[month])} ${year}`;
  }
  return formattedDate;
};

export const isTablet = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth > 1024) {
      return false;
    }
    return true;
  }
  return false;
};

export const isMobile = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth > 1024) {
      return false;
    }
    return true;
  }
  return false;
};

export const compareArray = (array1, array2, action = false) => {
  if (array1 && array2) {
    if (action === false) {
      const array = [];
      array1.map((val) => {
        const checkSameValue = val.types.some((r) => array2.includes(r));
        if (checkSameValue === action) {
          array.push(val);
        }
        return null;
      });
      return array;
    }
  }
  return [];
};

const maxPrice = 5000000;
export const maxPriceRatio = maxPrice / 100;

const maxPriceM2 = 15000;
export const maxPriceM2Ratio = maxPriceM2 / 100;

const maxLivingSpace = 300;
export const maxLivingSpaceRatio = maxLivingSpace / 100;

export const getLocalObject = (obj, el) => {
  if (typeof localStorage !== 'undefined') {
    const allObj = JSON.parse(localStorage.getItem(obj));
    if (isObject(allObj)) {
      return allObj[el];
    }
  }
  return '';
};

export const setLocalObject = (obj, el, val) => {
  if (typeof localStorage !== 'undefined') {
    let allObj = JSON.parse(localStorage.getItem(obj));
    if (isObject(allObj)) {
      allObj[el] = val;
    } else {
      allObj = { [el]: val };
    }
    localStorage.setItem(obj, JSON.stringify(allObj));
  }
  return '';
};

export const getNumElArray = (arr) => {
  let num = 0;
  arr.map((item) => {
    if (Object.keys(item).length > num) {
      num = Object.keys(item).length;
    }
    return null;
  });
  return num;
};

export const getQueryVariableUrl = (url, variable, action = 'normal') => {
  let query;
  if (action === 'full') {
    query = url.split('?');
    if (query[1]) query = query[1];
    else query = query[0];
  } else {
    query = url.replace('?', '');
  }
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return variable;
};

export const sortObjByKey = (obj, key, isBool = false) => {
  let orderedObj = obj;
  if (isBool) {
    orderedObj = obj.sort((a, b) => b[key] - a[key]);
  }
  // eslint-disable-next-line no-nested-ternary
  orderedObj.sort((a, b) => ((a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0)));
  return orderedObj;
};

export const imageExists = (imageUrl) => {
  if (typeof window !== 'undefined' && !imageUrl.includes('undefined')) {
    const http = new XMLHttpRequest();

    http.open('HEAD', imageUrl, false);
    http.send();

    return http.status !== 404;
  }
  return false;
};

export const getDevMode = () => {
  if (typeof window !== 'undefined') {
    // const url = window.location.href;
    // let query = queryString.parse(url.split('?')[1]);
    // console.log(query);
    return true;
  }
  return false;
};

export const setCookie = (key, val) => {
  const host = get(window, 'location.host', '').split('.');
  const localhost = host[0].match(/localhost/gi);
  const localip = host[0].match(/0/gi);
  let domain;
  if (localhost) {
    domain = 'localhost';
  } else if (localip) {
    domain = '0.0.0.0';
  } else {
    const curDomain = get(document, 'location.hostname', '').split('.')[get(document, 'location.hostname', '').split('.').length - 1];
    domain = `.brixel.${curDomain}`;
  }
  const options = {
    domain,
    path: '/',
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    sameSite: 'strict',
  };
  cookies.set(key, val, options);
};

export const getCookie = (key) => {
  const host = get(window, 'location.host', '').split('.');
  const localhost = host[0].match(/localhost/gi);
  const localip = host[0].match(/0/gi);
  let domain;
  if (localhost) {
    domain = 'localhost';
  } else if (localip) {
    domain = '0.0.0.0';
  } else {
    const curDomain = get(document, 'location.hostname', '').split('.')[get(document, 'location.hostname', '').split('.').length - 1];
    domain = `.brixel.${curDomain}`;
  }
  const options = {
    domain,
    path: '/',
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    sameSite: 'strict',
  };
  return cookies.get(key, options);
};

export const removeCookie = (key) => {
  const host = get(window, 'location.host', '').split('.');
  const localhost = host[0].match(/localhost/gi);
  const localip = host[0].match(/0/gi);
  let domain;
  if (localhost) {
    domain = 'localhost';
  } else if (localip) {
    domain = '0.0.0.0';
  } else {
    const curDomain = get(document, 'location.hostname', '').split('.')[get(document, 'location.hostname', '').split('.').length - 1];
    domain = `.brixel.${curDomain}`;
  }
  const options = {
    domain,
    path: '/',
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    sameSite: 'strict',
  };
  cookies.remove(key, options);
};

export const getCalcSectionInputSheets = (Questions, initialValues, accordion, act, fixSection) => {
  const getSkippedSection = fixSection || get(initialValues, 'Property.skipSection', {});
  const getSectionFilt = {};
  const getSectionDone = {};
  const getAccordion = accordion || {};
  const allSection = {};
  if (initialValues.id) {
    Questions.map((quest) => {
      let doneSection = true;
      let curAccordion = false;
      quest.inputs.map((inp) => {
        if (inp.validation && inp.validation[0]) {
          const curVal = get(initialValues, inp.name, null);
          if (isEmptyWithBool(curVal)) {
            doneSection = false;
            curAccordion = true;
          }
        }
        return null;
      });
      getSectionFilt[quest.history] = getSkippedSection[quest.history] ? getSkippedSection[quest.history] : doneSection;
      getSectionDone[quest.history] = doneSection;
      allSection[quest.history] = true;
      if (typeof accordion[quest.history] === 'undefined') {
        getAccordion[quest.history] = getSectionFilt[quest.history] ? false : curAccordion;
      } else {
        getAccordion[quest.history] = accordion[quest.history];
      }
      return null;
    });
    const newTotalDone = Object.keys(getSectionFilt).filter((keySkip) => getSectionFilt[keySkip] === true);
    const total = Object.keys(Questions).length;
    if (act === 'getPercentage') return Math.ceil((newTotalDone.length * 100) / total);

    return ({
      accordion: getAccordion,
      accordionAnimated: getAccordion,
      section: {
        allSection: true,
        percComplete: Math.ceil((newTotalDone.length * 100) / total),
        section: getSectionFilt,
        sectionComplete: getSectionDone,
        total,
        totalComplete: newTotalDone.length,
        totalUncomplete: total - newTotalDone.length,
      },
    });
  }
  return {};
};

export const calculateAge = (date) => { // birthday is a date
  const ageDifMs = Date.now() - date;
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const calculateAgeByYear = (year) => { // birthday is a date
  const today = new Date();
  return today.getFullYear() - year;
};

export const sortObject = (key, order = 'asc') => function innerSort(a, b) {
  // eslint-disable-next-line no-prototype-builtins
  if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
    // property doesn't exist on either object
    return 0;
  }

  const varA = (typeof a[key] === 'string')
    ? a[key].toUpperCase() : a[key];
  const varB = (typeof b[key] === 'string')
    ? b[key].toUpperCase() : b[key];

  let comparison = 0;
  if (varA > varB) {
    comparison = 1;
  } else if (varA < varB) {
    comparison = -1;
  }
  return (
    (order === 'desc') ? (comparison * -1) : comparison
  );
};

export const Truncate = (text, limit, showAllDescription = false) => {
  let txt = text;
  if (txt.length > limit && !showAllDescription) {
    txt = `${txt.substr(0, limit).replace(/\s+$/, '')}...`;
  } else if (txt.length > limit && showAllDescription) {
    txt = `${txt}`;
  }
  return txt;
};

export const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve({
    file: reader.result,
    name: file.name,
  });
  reader.onerror = (error) => reject(error);
});

export const tobase64Handler = async (files, user, action, pageID, imgType, docType = '') => {
  const filePathsPromises = [];
  await files.forEach((file) => {
    filePathsPromises.push(toBase64(file));
  });
  const filePaths = await Promise.all(filePathsPromises);
  const mappedFiles = filePaths.map((base64File) => {
    if (action === 'documents') {
      let name = get(base64File, 'name', Date.now() / 1000);
      return {
        name,
        user,
        type: docType,
        isBrochure: false,
        file: base64File.file,
        pageID,
        smallLoader: 'upload',
      };
    }
    return {
      name: Date.now() / 1000,
      file: base64File.file,
      user,
      imageType: imgType,
      pageID,
      uploadAction: action,
      smallLoader: 'upload',
    };
  });
  return mappedFiles;
};

export const keyify = (object) => {
  const result = [];
  function iter(o, p) {
    if (Array.isArray(o)) { return; }
    if (o && typeof o === 'object') {
      const keys = Object.keys(o);
      if (keys.length) {
        keys.forEach((k) => { iter(o[k], p.concat(k)); });
      }
      return;
    }
    result.push(p.join('.'));
  }
  iter(object, []);
  return result;
};

export const isEligible = (activeSingleProperty) => {
  const hasPackage = get(activeSingleProperty, 'servicePackages', []).filter((pkg) => pkg.type === 'premium' || pkg.type === 'plus' || pkg.type === 'one');
  if (hasPackage.length > 0) return false;
  if (has(activeSingleProperty, 'location.countryCode') && activeSingleProperty.location.countryCode === 'CH') {
    return true;
  }
  if (has(activeSingleProperty, 'location.countryCode') && activeSingleProperty.location.countryCode === 'PT') {
    if (has(activeSingleProperty, 'location.state')) {
      if (activeSingleProperty.location.state === 'Lisboa' ||
        activeSingleProperty.location.state === 'Porto' ||
        activeSingleProperty.location.state === 'Setúbal') {
        return true;
      }
      return false;
    }
    return false;
  }
  return false;
};

export const checkBrowser = () => {
  let rv = -1; // Return value assumes failure.

  if (navigator.appName === 'Microsoft Internet Explorer') {
    const ua = navigator.userAgent;
    // eslint-disable-next-line prefer-regex-literals
    const re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');

    if (re.exec(ua) !== null) {
      rv = parseFloat(RegExp.$1);
    }
  } else if (navigator.appName === 'Netscape') {
    /// in IE 11 the navigator.appVersion says 'trident'
    /// in Edge the navigator.appVersion does not say trident
    if (navigator.appVersion.indexOf('Trident') === -1) rv = -1;
    else rv = 11;
  }

  return rv;
};

export const arrayMove = (arr, oldIndex, newIndex) => {
  if (newIndex >= arr.length) {
    let k = oldIndex - arr.length + 1;
    // eslint-disable-next-line no-cond-assign
    while (k -= 1) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr; // for testing
};

export const completedBestimate = (formValue) => {
  const location = get(formValue, 'location.countryCode', '');
  const propertyType = get(formValue, 'properties.propertyType', '');
  const BestimateQuest = BestimateQuestions(null, location, propertyType);
  let isValid = true;
  BestimateQuest.forEach((inputs) => {
    if (inputs.inputs) {
      inputs.inputs.forEach((input) => {
        if (input.validation) {
          input.validation.forEach((validation) => {
            if (validation.name === 'required') {
              if (input.condition) {
                input.condition.forEach((cond) => {
                  if (get(formValue, cond.name, null) === cond.value) {
                    if (get(formValue, input.name, null) === null) isValid = false;
                  } else if (get(formValue, cond.name, null) !== cond.noValue) {
                    if (get(formValue, input.name, null) === null) isValid = false;
                  }
                });
              } else if (get(formValue, input.name, null) === null) {
                isValid = false;
              }
            }
          });
        }
      });
    }
  });
  return isValid;
};

export const transformInternalLink = (url, {activeSingleProperty}) => {
  const mapObj = {
    DOMAIN_HUB: '',
    'DOMAIN.HUB': '',
    PAGE_ID: activeSingleProperty.id,
    'http://': '',
    'https://': '',
  };
  if (!url.includes('PAGE_ID') && !url.includes('DOMAIN_HUB')) {
    return url
  } else {
    const internalLink = url.replace(/PAGE_ID|DOMAIN_HUB|DOMAIN.HUB|http:\/\/|https:\/\//gi, function(matched){
      return mapObj[matched];
    });
    return internalLink;
  }
}
