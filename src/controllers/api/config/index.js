import ApiClient from './ApiClient';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';

import User from '../actions/User';
import Upload from '../actions/Upload';
import Common from '../actions/Common';

function apiFactory(
  {
    baseURL, brixeletor,
  },
) {
  const api = new ApiClient({ baseURL, brixeletor });

  return {
    image: new Upload({ apiClient: api }),
    user: new User({ apiClient: api }),
    common: new Common({ apiClient: api }),
  };
}

export default apiFactory({
  baseURL: getConfigEnv.apiRoot,
  brixeletor: getConfigEnv.brixelatorRoot,
});
