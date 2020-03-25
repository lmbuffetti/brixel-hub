import React  from 'react';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonBox } from '@brixel/brixel-components';
import get from 'lodash/get';
import last from 'lodash/last';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';

const Showings = Loadable({
  loader: () => import('../Listings/Showings' /* webpackChunkName: "Showings" */),
  loading: Loading,
});

const ListingsDashboard = (props) => {
  // PROPS
  const {
    history,
    match,
    windowDimensions,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const getFact = () => last(history.location.pathname.split('/'));

  const calcHeaderHeight = () => {
    const head = document.getElementsByClassName('dashboardHeaderHub');
    const wrapper = document.getElementById('test');
    let paddingTop = 0;
    let paddingBottom = 0;
    if (wrapper) {
      paddingTop = document.defaultView.getComputedStyle(wrapper, "").getPropertyValue('padding-top').replace('px', '');
      paddingBottom = document.defaultView.getComputedStyle(wrapper, "").getPropertyValue('padding-bottom').replace('px', '');
    }
    return head[0].offsetHeight + +paddingTop + +paddingBottom;
  };

  return (
    <div className="pt-5" id="test">
      <div className="dis-f h-perc-100">
        <div className="firstLevel px-2">
          <div className="dis-f">
            <BrixelButtonBox
              verticalView
              bgTransparent
              icon="gallery"
              label="Brixel Page"
              subtitle={`Draft`}
              className={`w-perc-100 mr-1 shadow-1dp brdPrimary400`}
              colorIcon={'red400'}
              backIcon="red100 mr-1"
              onClick={() => history.push(`/${propID}/listings/page`)}
              selected
            />
            <BrixelButtonBox
              verticalView
              bgTransparent
              icon="gallery"
              label="Showings"
              subtitle={`No showings`}
              className={`w-perc-100 ml-1 shadow-1dp brdPrimary400`}
              colorIcon={'red400'}
              backIcon="red100 mr-1"
              onClick={() => history.push(`/${propID}/listings/showings`)}
              selected
            />
          </div>
        </div>
        {
          getFact() !== 'listings' && (
            <div className="w-perc-100" style={{ height: windowDimensions.height - calcHeaderHeight() }}>
              <Route path="/:propId?/listings/showings" component={Showings} />
            </div>
          )
        }
      </div>
    </div>
  )
};

ListingsDashboard.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

ListingsDashboard.defaultProps = {

};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
  formValue: get(state, 'form.Property.values', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(ListingsDashboard);
