import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import ApiClient from './ApiClient';

import Common from '../actions/Common';
import Company from '../actions/Company';
import Deal from '../actions/Deal';
import Gamification from '../actions/Gamification';
import Property from '../actions/Property';
import Upload from '../actions/Upload';
import User from '../actions/User';

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
    gamification: new Gamification({ apiClient: api }),
    image: new Upload({ apiClient: api }),
    property: new Property({ apiClient: api }),
    user: new User({ apiClient: api }),
  };
}

export default apiFactory({
  // baseURL: getConfigEnv.apiRoot,
  baseURL: 'http://localhost:46071/api/v3/',
  brixelator: getConfigEnv.brixelatorRoot,
});
