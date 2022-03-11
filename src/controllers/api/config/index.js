import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import get from 'lodash/get';
import ApiClient from './ApiClient';

import Common from '../actions/Common';
import Company from '../actions/Company';
import Deal from '../actions/Deal';
import History from '../actions/History';
import Lead from '../actions/Lead';
import Note from '../actions/Note';
import Property from '../actions/Property';
import Upload from '../actions/Upload';
import User from '../actions/User';
import SearchProfile from '../actions/SearchProfile';
import Estimation from '../actions/Estimation';
import Market from '../actions/Market';

const getConfigEnvWeb = require('@brixel/brixel-configuration-partner/src/SettingsWebpack');

function apiFactory(
  {
    baseURL, brixelator,
  },
) {
  const api = new ApiClient({ baseURL, brixelator });

  return {
    common: new Common({ apiClient: api }),
    company: new Company({ apiClient: api }),
    deal: new Deal({ apiClient: api }),
    history: new History({ apiClient: api }),
    image: new Upload({ apiClient: api }),
    lead: new Lead({ apiClient: api }),
    note: new Note({ apiClient: api }),
    property: new Property({ apiClient: api }),
    user: new User({ apiClient: api }),
    searchProfile: new SearchProfile({ apiClient: api }),
    estimation: new Estimation({ apiClient: api }),
    market: new Market({ apiClient: api }),
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

if (url.indexOf('dev') !== -1 || url.indexOf('localhost')) env = 'DEV';
else if (url.indexOf('stag') !== -1) env = 'STAGING';
else env = 'PROD';

let configUrl = getConfigEnvWeb(env, domain);

if (typeof window !== 'undefined') {
  const urlAddress = get(window, 'location.href', '');
  if (urlAddress.includes('dev-') || urlAddress.includes('stage-') || urlAddress.includes('localhost')) {
    configUrl = getConfigEnv;
  }
}

export default apiFactory({
  baseURL: configUrl.apiRoot,
  // baseURL: 'http://localhost:46071/api/v3/',
  brixelator: configUrl.brixelatorRoot,
});
