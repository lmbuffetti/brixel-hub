import axios from 'axios';
import queryString from 'query-string';
import { failureHandler, successHandler } from '../utils/api.helper';
import { articlesQuery, bannersQuery } from './query.costants';

class ApiClient {
  constructor({ baseURL }) {
    this.baseURL = baseURL;
  }
  
  post(requestUrl, payload = {}) {
    return this.request({
      url: '/graphql',
      method: 'post',
      data: payload,
    });
  }
  
  request({
    url,
    method,
    data,
  }) {
    const siteHandle = `${ data.partner }${ data.language[ 0 ].toUpperCase() }${ data.language.slice( 1 ).toLowerCase() }`;
    const { placementSlug, queryType } = data;
    let baseUrl = this.baseURL;
    let query = articlesQuery;
    switch (queryType) {
      case 'banners':
        query = bannersQuery;
        break;
      default:
        query = articlesQuery;
    }
    const body = JSON.stringify( {
      query,
      variables: {
        siteHandle,
        placementSlug,
        bannerSlug: placementSlug,
      },
    } );
    const config = {
      url,
      method,
      baseURL: baseUrl,
      params : {},
      validateStatus: false,
      paramsSerializer(p) {
        return queryString.stringify(p, {
          encode: true,
        });
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: body,
    };
    return axios(config)
      .then((res) => successHandler(res))
      .catch(failureHandler);
  }
}

export default ApiClient;
