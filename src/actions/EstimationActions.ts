import {createActions} from 'redux-actions';
import {CREATE_ESTIMATION, GENERATE_ESTIMATION, SEND_PROESTIMATION_NOTIFICATION} from './types/EstimationTypes';

export const {
  createEstimation,
  generateEstimation,
  sendProestimationNotification,
} = createActions({
  [CREATE_ESTIMATION]: (payload) => payload,
  [GENERATE_ESTIMATION]: (payload) => payload,
  [SEND_PROESTIMATION_NOTIFICATION]: (payload) => payload,
});
