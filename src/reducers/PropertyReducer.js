import { handleActions } from 'redux-actions';
import {
  SET_ESTIMATION,
  SET_PROPERTY,
} from '../actions/types/PropertyTypes';

export const defaultState = {
  estimation: {},
  property: {},
};

export default handleActions(
  {
    [SET_ESTIMATION]: (state, action) => ({
      ...state,
      estimation: action.payload,
    }),
    [SET_PROPERTY]: (state, action) => ({
      ...state,
      property: action.payload,
    }),
  },
  defaultState,
);
