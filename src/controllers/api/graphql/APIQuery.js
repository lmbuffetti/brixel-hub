import axios from 'axios';
import queryString from 'query-string';
import { failureHandler, successHandler } from '../utils/api.helper';

// const CONTENT_API_URL = `https://${ process.env.NEXT_PUBLIC_APP_HOSTNAME }/graphql`

const query = `
  query HubContentQuery(
    $siteHandle: String!
    $placementSlug: String!
  ) {
    placementEntries(
      site: [$siteHandle]
      slug: [$placementSlug]
    ) {
      ...on placement_default_Entry {
        slug
        title
        placementContent {
          ...on pages_default_Entry {
            id
            slug
            url
            title
            previewCopy
            mainImage {
              url
              width
              height
              alt
            }
          }
        }
      }
    }
  }
`;

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
    const placementSlug = 'example-hub-screen';
    let baseUrl = this.baseURL;
    const body = JSON.stringify( {
      query,
      variables: {
        siteHandle,
        placementSlug,
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
