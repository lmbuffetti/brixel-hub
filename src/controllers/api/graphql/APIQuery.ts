import axios, {AxiosRequestConfig} from 'axios';
import {failureHandler, successHandler} from '../utils/api.helper';
import {articlesQuery, bannersQuery} from './query.costants';

class ApiClient {
  private baseURL: string;
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
    const { bannerSlug, placementSlug, queryType } = data;
    const baseUrl = this.baseURL;
    let query = articlesQuery;
    switch (queryType) {
      case 'banners':
        query = bannersQuery;
        break;
      default:
        query = articlesQuery;
    }
    const head: any = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    let body = JSON.stringify( {
      query,
      variables: {
        siteHandle,
        placementSlug,
      },
    } );
    if (bannerSlug) {
      body = JSON.stringify( {
        query,
        variables: {
          siteHandle,
          bannerSlug,
        },
      } );
    }
    const config: AxiosRequestConfig = {
      url,
      method,
      baseURL: baseUrl,
      params : {},
      headers: head,
      data: body,
    };
    return axios(config)
      .then((res) => successHandler(res, null))
      .catch(failureHandler);
  }
}

export default ApiClient;
