import ApiClient from './ApiClient';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';

import Common from '../actions/Common';
import Company from '../actions/Company';
import Gamification from '../actions/Gamification';
import Property from '../actions/Property';
import Upload from '../actions/Upload';
import User from '../actions/User';

function apiFactory(
  {
    baseURL, brixeletor,
  },
) {
  const api = new ApiClient({ baseURL, brixeletor });

  return {
    common: new Common({ apiClient: api }),
    company: new Company({ apiClient: api }),
    gamification: new Gamification({ apiClient: api }),
    image: new Upload({ apiClient: api }),
    property: new Property({ apiClient: api }),
    user: new User({ apiClient: api }),
  };
}

export default apiFactory({
  baseURL: getConfigEnv.apiRoot,
  brixeletor: getConfigEnv.brixelatorRoot,
});
