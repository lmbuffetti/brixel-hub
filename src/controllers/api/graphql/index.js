import getConfigEnv from '@brixel/brixel-components/dist/configuration/Settings';
import CraftCMS from '../actions/CraftCMS';
import ApiClient from './APIQuery.js';
const getConfigEnvWeb = require('@brixel/brixel-components/dist/configuration/SettingsWebpack');

function apiFactory(
  {
    baseURL,
  },
) {
  const api = new ApiClient({ baseURL });

  return {
    craftCMS: new CraftCMS({ apiClient: api }),
  };
}

const url = process.env.NODE_ENV;
let env;
let domain;

let getCurDom = 'io';
if (typeof window !== 'undefined') {
  getCurDom = window.location.origin.split('.')[window.location.origin.split('.').length - 1];
  domain = getCurDom;
  if (getCurDom.length > 3) domain = 'io';
}

if (url.indexOf('dev') !== -1 || url.indexOf('localhost') !== -1) env = 'DEV';
else if (url.indexOf('stag') !== -1) env = 'STAGING';
else env = 'PROD';
let configUrl = getConfigEnvWeb(env, domain);

if (typeof window !== 'undefined') {
  configUrl = getConfigEnv;
}

export default apiFactory({
  baseURL: configUrl.craftCMS,
});
