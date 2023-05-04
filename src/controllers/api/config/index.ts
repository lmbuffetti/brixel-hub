import getConfigEnv from '@brixel/brixel-components/dist/configuration/Settings';

import Common from '../actions/Common';
import Company from '../actions/Company';
import Deal from '../actions/Deal';
import Estimation from '../actions/Estimation';
import History from '../actions/History';
import Lead from '../actions/Lead';
import Market from '../actions/Market';
import Note from '../actions/Note';
import Property from '../actions/Property';
import SearchProfile from '../actions/SearchProfile';
import Upload from '../actions/Upload';
import User from '../actions/User';
import ApiClient from './ApiClient';

import getConfigEnvWeb from '@brixel/brixel-components/dist/configuration/SettingsWebpack';

declare let process : {
  env: {
    NODE_ENV: string
  }
}

function apiFactory({ baseURL }: {baseURL: string}) {
  const api = new ApiClient({ baseURL });
  const apiData: { apiClient: any } = { apiClient: api };

  return {
    common: new Common(apiData),
    company: new Company(apiData),
    deal: new Deal(apiData),
    estimation: new Estimation(apiData),
    history: new History(apiData),
    image: new Upload(apiData),
    lead: new Lead(apiData),
    market: new Market(apiData),
    note: new Note(apiData),
    property: new Property(apiData),
    searchProfile: new SearchProfile(apiData),
    user: new User(apiData),
  };
}

const url = typeof window !== 'undefined' ? window.location.href : process.env.NODE_ENV || 'dev';

let env;

if (url.indexOf('dev') !== -1 || url.indexOf('localhost') !== -1 || url.indexOf('127') !== -1) env = 'DEV';
else if (url.indexOf('stag') !== -1) env = 'STAGING';
else env = 'PROD';
let configUrl = getConfigEnvWeb(env);

if (typeof window !== 'undefined') {
  configUrl = getConfigEnv;
}

export default apiFactory({
  baseURL: configUrl.apiRoot,
  //baseURL: 'http://localhost:46071/api/v3/',
});
