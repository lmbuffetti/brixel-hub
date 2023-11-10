import {mandatory} from '../utils/validation.helper';

class Base {
  apiClient: {
    post: (url: string, options?: object, data?: object, headers?: object, payload?: object) => Promise<{ data: any; meta: any }>;
    patch: (url: string, options?: object, data?: object, headers?: object, payload?: object) => Promise<{ data: any; meta: any }>;
    get: (url: string, object?, data?: object, headers?: object, payload?: object) => Promise<{ data: any; meta: any }>;
    put: (url: string, object?, data?: object, headers?: object, payload?: object) => Promise<{ data: any; meta: any }>;
    delete: (url: string, object?, data?: object, headers?: object, payload?: object) => Promise<{ data: any; meta: any }>;
  };
  constructor({ apiClient = mandatory('apiClient') }) {
    this.apiClient = apiClient;
  }
}

export default Base;
