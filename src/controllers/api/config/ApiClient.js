import axios from 'axios';
import queryString from 'query-string';
import httpAdapter from 'axios/lib/adapters/http';
import Cookies from 'universal-cookie';
import { failureHandler, successHandler } from '../utils/api.helper';

const cookies = new Cookies();

// Axios instance setUp
axios.defaults.adapter = httpAdapter;

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

class ApiClient {
  constructor({ baseURL, brixeletor }) {
    this.baseURL = baseURL;
    this.brixeletor = brixeletor;
    this.token = cookies.get('brixelToken');
  }

  get(requestUrl, options = {}, params = {}, headers = {}, payload = {}) {
    const baseUrlType = options.baseUrlType ? options.baseUrlType : 'baseUrl';
    const type = options.type ? options.type : 'data';
    this.token = options.token || this.token;
    return this.request({
      url: requestUrl,
      method: 'get',
      data: payload,
      params,
      headers,
      type,
      baseUrlType,
    });
  }

  put(requestUrl, options = {}, payload = {}, headers = {}) {
    const baseUrlType = options.baseUrlType ? options.baseUrlType : 'baseUrl';
    const type = options.type ? options.type : 'data';
    this.token = options.token || this.token;
    return this.request({
      url: requestUrl,
      method: 'put',
      data: payload,
      headers,
      type,
      baseUrlType,
    });
  }

  post(requestUrl, options = {}, payload = {}, headers = {}) {
    const baseUrlType = options.baseUrlType ? options.baseUrlType : 'baseUrl';
    const type = options.type ? options.type : 'data';
    this.token = options.token || this.token;
    return this.request({
      url: requestUrl,
      method: 'post',
      data: payload,
      headers,
      type,
      baseUrlType,
    });
  }

  patch(requestUrl, payload = {}, headers = {}) {
    return this.request({
      url: requestUrl,
      method: 'patch',
      data: payload,
      headers,
    });
  }

  delete(requestUrl, headers = {}) {
    return this.request({
      url: requestUrl,
      method: 'delete',
      headers,
    });
  }

  request({
    url, method, params = {}, headers, data, type = 'data', baseUrlType = 'baseUrl',
  }) {
    let head;
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
      };
    } else {
      head = {
        'Content-Type': 'application/json; charset=utf-8',
        ...headers,
      };
    }

    const config = {
      url,
      method,
      baseURL: baseUrlType === 'baseUrl' ? this.baseURL : this.brixeletor,
      params,
      validateStatus: false,
      paramsSerializer(p) {
        return queryString.stringify(p, { encode: true });
      },
      headers: head,
      withCredentials: false,
      data,
    };

    return axios(config)
      .then(successHandler)
      .catch(failureHandler);
  }
}

export default ApiClient;
