import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import ApiClient from './ApiClient';

import Common from '../actions/Common';
import Company from '../actions/Company';
import Deal from '../actions/Deal';
import Gamification from '../actions/Gamification';
import History from '../actions/History';
import Lead from '../actions/Lead';
import Note from '../actions/Note';
import Property from '../actions/Property';
import Upload from '../actions/Upload';
import User from '../actions/User';
import SearchProfile from '../actions/SearchProfile';

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
    history: new History({ apiClient: api }),
    image: new Upload({ apiClient: api }),
    lead: new Lead({ apiClient: api }),
    note: new Note({ apiClient: api }),
    property: new Property({ apiClient: api }),
    user: new User({ apiClient: api }),
    searchProfile: new SearchProfile({ apiClient: api }),
  };
}

export default apiFactory({
  baseURL: getConfigEnv.apiRoot,
  // baseURL: 'http://localhost:46071/api/v3/',
  brixelator: getConfigEnv.brixelatorRoot,
});
