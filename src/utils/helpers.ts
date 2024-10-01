import Cookies from 'universal-cookie';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import has from 'lodash/has';
import {configureStore} from '../store';
import {InputSheets} from '../resources/SingleProperty/inputSheets';
import {BestimateQuestions} from '../resources/Flows/Bestimate';
import {QuestionInputType, QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import {FactsOptions, Helpers} from '@brixel-io/brixel-components';

const { factsOptions } = FactsOptions;

const cookies = new Cookies();

export const calcPercentageFacts = (form = 'Property', value = {}) => {
  let countTotal = 0;
  let countDone = 0;
  const formValue = get(configureStore.getState(), `brixelForm[${form}].values`, value);
  const lang = get(configureStore.getState(), 'user.loggedInUser.user.language', 'en');
  const Questions: QuestionsListType[] = InputSheets(formValue, lang, () => '');
  Questions.forEach((val) => {
    if (val.inputs) {
      val.inputs.forEach((item) => {
        const name = get(item, 'condition.name', '');
        const valA = get(formValue, name, 'a');
        if (item.conditions) {
          item.conditions.forEach((cond) => {
            let valB;
            if (cond.name) valB = get(formValue, cond.name, 'a');
            if (item.name && valB === cond.value && (get(formValue, item.name, 'ayc') !== 'ayc' || get(formValue, item.name, 'ayc') !== null)) {
              countTotal += 1;
              countDone += 1;
            }
          });
        } else if (!item.condition || (item.condition && valA === get(item, 'condition.value', null))) {
          if (get(formValue, `inputSheet.skipSection[${item.name}]`, false)) {
            countTotal += 1;
            countDone += 1;
          } else if (item.name && get(formValue, item.name, 'ayc') !== 'ayc' && get(formValue, item.name, 'ayc') !== null) {
            countTotal += 1;
            countDone += 1;
          } else {
            countTotal += 1;
          }
        }
      });
    }
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
  const questList: QuestionsListType['inputs'] = [];
  const formValue = get(configureStore.getState(), `brixelForm[${form}].values`, value);
  const lang = get(configureStore.getState(), 'user.loggedInUser.user.language', 'en');
  const QuestionsData: QuestionsListType[] = InputSheets('proEstimation', lang, () => '');
  QuestionsData.forEach((singleQuest) => {
    if (singleQuest.inputs) {
      singleQuest.inputs.forEach((input) => {
        if (input.isProEstimation) {
          let mergeCondition: QuestionInputType['condition'] = [];
          if (input.condition && get(input, 'condition.name', null) && get(input, 'condition.value', null)) {
            mergeCondition = [{name: get(input, 'condition.name', ''), value: get(input, 'condition.value', '')}];
          } else if (input.condition && get(input, 'condition.name', null) && get(input, 'condition.noValue', '')) {
            mergeCondition = [{name: get(input, 'condition.name', ''), noValue: get(input, 'condition.noValue', '')}];
          } else if (input.condition) {
            mergeCondition = [...input.condition];
          }
          if (input.proEstimationConditions) {
            mergeCondition = mergeCondition.concat(input.proEstimationConditions);
          }
          let isValid = true;
          if (mergeCondition.length > 0) {
            mergeCondition.forEach((item) => {
              if (isValid) {
                if (item.name && item.value && item.value !== get(formValue, item.name, null)) {
                  isValid = false;
                } else if (item.name && item.noValue && item.noValue === get(formValue, item.name, null)) {
                  isValid = false;
                }
              }
            });
          }
          if (isValid && input) {
            questList.push(input);
          }
        }
      });
    }
  });
  const Questions = questList;
  Questions.forEach((val) => {
    if (get(formValue, `inputSheet.skipSection[${val.name}]`, false)) {
      countTotal += 1;
      countDone += 1;
    } else if (val.name && get(formValue, val.name, 'ayc') !== 'ayc' && get(formValue, val.name, 'ayc') !== null) {
      if (val.name && isArray(get(formValue, val.name, 'ayc'))) {
        if (val.name && get(formValue, val.name, []).length > 0) {
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
  const convertLang = lang || 'de';
  if (typeof value !== 'number' && !value) return '';
  return Number(value).toLocaleString(convertLang);
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
  };
  cookies.set(key, val, options);
};

export const getCookie = (key) => {
  return cookies.get(key);
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
  };
  cookies.remove(key, options);
};

export const Truncate = (text, limit, showAllDescription = false) => {
  let txt = text;
  if (txt && txt.length > 0) {
    if (txt.length > limit && !showAllDescription) {
      txt = Helpers.sanitizeText(`${(txt.substr(0, limit).replace(/\s$/, ''))}...`);
    } else if (txt.length > limit && showAllDescription) {
      txt = `${Helpers.sanitizeText(txt)}`;
    }
  } else { txt = ''; }
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

export const tobase64Handler = async (files, user, action, pageID, imgType = '', docType = '') => {
  const filePathsPromises = [];
  await files.forEach((file) => {
    // @ts-ignore
    filePathsPromises.push(toBase64(file));
  });
  const filePaths = await Promise.all(filePathsPromises);
  const mappedFiles = filePaths.map((base64File) => {
    if (action === 'documents' && base64File) {
      const name = get(base64File, 'name', Date.now() / 1000);
      return {
        name,
        user,
        type: docType,
        isBrochure: false,
        file: get(base64File, 'file', ''),
        pageID,
        smallLoader: 'upload',
      };
    }
    return {
      name: Date.now() / 1000,
      file: get(base64File, 'file', ''),
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
    // @ts-ignore
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
  const propertyType = get(formValue, 'properties.propertyType', '');
  const lang = get(configureStore.getState(), 'user.loggedInUser.user.language', 'en');
  const BestimateQuest = BestimateQuestions('', propertyType, lang);
  let isValid = true;
  BestimateQuest.forEach((inputs) => {
    if (inputs.inputs) {
      inputs.inputs.forEach((input) => {
        if (input.validation) {
          input.validation.forEach((validation) => {
            if (validation.name === 'required') {
              if (input.condition) {
                input.condition.forEach((cond) => {
                  if (cond.name && get(formValue, cond.name, null) === cond.value) {
                    if (input.name && get(formValue, input.name, null) === null) isValid = false;
                  } else if (cond.name && get(formValue, cond.name, null) !== cond.noValue) {
                    if (input.name && get(formValue, input.name, null) === null) isValid = false;
                  }
                });
              } else if (input.name && get(formValue, input.name, null) === null) {
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
    'domain.hub': '',
    PAGE_ID: activeSingleProperty.id,
    'http://': '',
    'https://': '',
  };
  if (!url.includes('PAGE_ID') && !url.includes('DOMAIN_HUB')) {
    return url
  } else {
    const internalLink = url.replace(/PAGE_ID|DOMAIN_HUB|DOMAIN.HUB|domain.hub|http:\/\/|https:\/\//gi, function(matched){
      return mapObj[matched];
    });
    return internalLink;
  }
}

export const convertLabel = (curVal, field, type: string | null = 'label') => {
  if (factsOptions[field]) {
    const fact = factsOptions[field].find((val) => val.value === curVal);
    if (fact && type) return fact[type];
    return fact
  }
  return '';
}

export const redirectUrl = (link, options) => {
  let url = localStorage.getItem('backUrl');
  localStorage.removeItem('backUrl');
  const {
    propID,
    dealID,
    isBuyer,
    userType,
  } = options;
  if (url) return url;
  if (link.toLowerCase().includes('packageflow/brixelboutique')) {
    return 'https://boutique.brixel.ch';
  } else if (
    link.toLowerCase().includes('getstartedbuyer') ||
    link.toLowerCase().includes('visitfeedback')
  ) {
    return '/buy';
  } else if (link.toLowerCase().includes('makeoffer') || link.toLowerCase().includes('closing')) {
    if (userType === 'buyer' || link.toLowerCase().includes('buyer')) {
      return `/buyer/${propID}/closing`;
    } else {
      return `/${propID}/closing/${dealID}`;
    }
  } else if (link.toLowerCase().includes('contactflow')) {
    const BASEURL = isBuyer ? '/buyer' : '';
    return `${BASEURL}/${propID}/home`;
  } else if (link.toLowerCase().includes('completeprofileflow')) {
    const BASEURL = isBuyer ? '/buyer' : '';
    return `${BASEURL}/${propID}/scheduleVisit`;
  } else if (link.toLowerCase().includes('termsconditionpage')) {
    const BASEURL = isBuyer ? '/buyer' : '';
    return `${BASEURL}/${propID}/marketing`;
  } else if (link.toLowerCase().includes('buyer')) {
    return `/buyer/${propID}/home`;
  } else {
    url = localStorage.getItem('backUrlBis');
    const urlBuyer = localStorage.getItem('backUrlBuyerEstimations');
    if (url) {
      localStorage.removeItem('backUrlBis');
    }
    else {
      if (urlBuyer) {
        url = urlBuyer;
      } else {
        url = localStorage.getItem('backUrl');
      }
      localStorage.removeItem('backUrl');
      localStorage.removeItem('backUrlBuyerEstimations');
    }
    return url || '/sell';
  }
}
