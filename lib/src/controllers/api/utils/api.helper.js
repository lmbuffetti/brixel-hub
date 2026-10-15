import { statuses } from './httpErrors.constant';
import { diff } from 'deep-object-diff';
import get from 'lodash/get';
import { configureStore } from '../../../store';
import { SET_FEATURE_FLAGS } from '../../../actions/types/CommonTypes';
export const httpStatusNormalizer = ({ status = 0, }) => {
    let normalizedStatus = status;
    if (status >= 200 && status < 300) {
        normalizedStatus = 200;
    }
    if (status >= 300 && status < 400) {
        normalizedStatus = 300;
    }
    if (status >= 400 && status < 405) {
        normalizedStatus = 400;
    }
    if (status > 405 && status < 500) {
        normalizedStatus = 400;
    }
    if (status >= 500) {
        normalizedStatus = 500;
    }
    return normalizedStatus;
};
export const httpErrorHandler = ({ status = 0, }) => {
    const unhandledStatus = 0;
    const normalizedStatus = status;
    return statuses[normalizedStatus]
        ? statuses[normalizedStatus]
        : statuses[unhandledStatus];
};
export const successHandler = (response, id) => {
    const { data, status, } = response;
    const meta = {
        status,
        normalizedStatus: httpStatusNormalizer({
            status,
        }),
        statusText: response.statusText,
    };
    const store = configureStore;
    const currentFeatureFlags = get(store.getState(), 'common.featureFlags');
    if (response.headers['feature-flags']) {
        const requestFlags = JSON.parse(response.headers['feature-flags'], (_key, value) => value === 'true' ? true : value === 'false' ? false : value);
        const checkDiff = diff(currentFeatureFlags, requestFlags);
        if (Object.keys(checkDiff).length > 0) {
            store.dispatch({
                type: SET_FEATURE_FLAGS,
                payload: requestFlags,
            });
        }
    }
    return Promise.resolve({
        data,
        id,
        meta,
    });
};
export const validationErrorNormalizr = (data) => {
    const nData = {};
    Object.keys(data)
        .forEach((error) => {
        nData[error] = data[error];
    });
    return nData;
};
export const failureHandler = (error) => {
    const { data, status, } = error;
    const errorResponse = data || error;
    const meta = {
        status,
        normalizedStatus: httpStatusNormalizer({
            status,
        }),
        statusText: errorResponse,
    };
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
        data,
        meta,
    });
};
