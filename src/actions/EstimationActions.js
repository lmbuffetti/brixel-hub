import {
  createActions,
} from 'redux-actions';
import {
  CREATE_ESTIMATION,
  GENERATE_ESTIMATION,
  SAVE_ACTIVE_SINGLE_ESTIMATION,
  DELETE_ACTIVE_SINGLE_ESTIMATION,
} from './types/EstimationTypes';

export const {
  createEstimation,
  generateEstimation,
  saveActiveSingleEstimation,
  deleteActiveSingleEstimation,
} = createActions({
  [CREATE_ESTIMATION]: (payload) => payload,
  [GENERATE_ESTIMATION]: (payload) => payload,
  [SAVE_ACTIVE_SINGLE_ESTIMATION]: (payload) => payload,
  [DELETE_ACTIVE_SINGLE_ESTIMATION]: (payload) => payload,
});
