import getConfigEnv from '@brixel/brixel-components/dist/configuration/Settings';
import axios, {AxiosRequestConfig} from 'axios';
import get from 'lodash/get';
import Cookies from 'universal-cookie';
import {failureHandler, successHandler} from '../utils/api.helper';

const cookies = new Cookies();

// Add a request interceptor
axios.interceptors.request.use(
  (request) => request,
  (error) => Promise.reject(error),
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

type optionsType = {
  baseUrlType?: string;
  type?: string;
  token?: string;
}

type requestType = {
  url: string;
  method: string;
  type?: string;
  baseUrlType?: string;
  params?: object;
  headers?: object;
  data?: {
    username?: string;
    password?: string;
  };
}

class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor({ baseURL }: {baseURL: string;}) {
    this.baseURL = baseURL;
    this.token = cookies.get('brixelToken') || window.localStorage.getItem('brixelToken');
  }

  get(requestUrl: string, options: optionsType = {}, params = {}, headers = {}, payload: requestType['data'] = {}) {
    const baseUrlType = options.baseUrlType ? options.baseUrlType : 'baseUrl';
    const type = options.type ? options.type : 'data';
    this.token = options.token || this.token || window.localStorage.getItem('brixelToken');
    return this.request({
      url: requestUrl,
      method: 'get',
      data: payload,
      params,
      headers,
      type,
      baseUrlType,
      options,
    });
  }

  put(requestUrl: string, options: optionsType = {}, payload: requestType['data'] = {}, headers = {}) {
    const baseUrlType = options.baseUrlType ? options.baseUrlType : 'baseUrl';
    const type = options.type ? options.type : 'data';
    this.token = options.token || this.token || window.localStorage.getItem('brixelToken');
    return this.request({
      url: requestUrl,
      method: 'put',
      data: payload,
      headers,
      type,
      baseUrlType,
      options,
    });
  }

  post(requestUrl: string, options: optionsType = {}, payload: requestType['data'] = {}, headers = {}) {
    const baseUrlType = options.baseUrlType ? options.baseUrlType : 'baseUrl';
    const type = options.type ? options.type : 'data';
    this.token = options.token || this.token || window.localStorage.getItem('brixelToken');
    return this.request({
      url: requestUrl,
      method: 'post',
      data: payload,
      headers,
      type,
      baseUrlType,
      options,
    });
  }

  patch(requestUrl: string, options: optionsType = {}, payload = {}, headers = {}) {
    return this.request({
      url: requestUrl,
      method: 'patch',
      data: { ...payload, url: get(window, 'location.href', '')},
      headers,
      options,
    });
  }

  delete(requestUrl: string, options: optionsType = {}, payload = {}, headers = {}) {
    const baseUrlType = options.baseUrlType ? options.baseUrlType : 'baseUrl';
    const type = options.type ? options.type : 'data';
    this.token = options.token || this.token || window.localStorage.getItem('brixelToken');
    return this.request({
      url: requestUrl,
      method: 'delete',
      data: payload,
      headers,
      type,
      baseUrlType,
      options,
    });
  }

  request({
    url, options, method, params = {}, headers, data, type = 'data', baseUrlType = 'baseUrl',
  }) {
    let head;
    const id = get(options, 'id', null);
    if (type === 'login') {
      const auth = btoa(`${data.username}:${data.password}`);
      head = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Basic ${auth}`,
        ...headers,
      };
    } else if (type === 'data') {
      head = {
        'x-brixel-token': this.token || '',
        ...headers,
      };
    } else if (headers['Content-Type']) {
      head = {
        ...headers,
      };
    } else {
      head = {
        'Content-Type': 'application/json; charset=utf-8',
        ...headers,
      };
    }
    let baseUrl = '';
    switch (baseUrlType) {
      case 'baseUrl':
        baseUrl = this.baseURL;
        break;
      case 'self':
        baseUrl = getConfigEnv.shortPath;
        break;
      default:
        baseUrl = this.baseURL;
    }

    const config: AxiosRequestConfig = {
      url,
      method,
      baseURL: baseUrl,
      params,
      headers: head,
      withCredentials: false,
      data,
    };
    return axios(config)
      .then((res) => successHandler(res, id))
      .catch(failureHandler);
  }
}

export default ApiClient;
