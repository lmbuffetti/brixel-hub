import getConfigEnv from '@brixel/brixel-components/dist/configuration/Settings';
import CraftCMS from '../actions/CraftCMS';
import ApiClient from './APIQuery';
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
    craftCMS: new CraftCMS(apiData),
  };
}

const url = process.env.NODE_ENV;
let env;
if (url.indexOf('dev') !== -1 || url.indexOf('localhost') !== -1) env = 'PROD';
else if (url.indexOf('stag') !== -1) env = 'STAGING';
else env = 'PROD';
let configUrl = getConfigEnvWeb(env);

if (typeof window !== 'undefined') {
  configUrl = getConfigEnv;
}

export default apiFactory({
  baseURL: configUrl.craftCMS,
});
