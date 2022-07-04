import CraftCMS from '../actions/CraftCMS';
import ApiClient from './APIQuery.js';

function apiFactory(
  {
    baseURL, brixelator,
  },
) {
  const api = new ApiClient({ baseURL, brixelator });

  return {
    craftCMS: new CraftCMS({ apiClient: api }),
  };
}

export default apiFactory({
  baseURL: 'https://dev-cms.brixel.ch',
});
