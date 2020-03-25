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

const Page = Loadable({
  loader: () => import('../Listings/Page' /* webpackChunkName: "Page" */),
  loading: Loading,
});

const ListingsDashboard = (props) => {
  // PROPS
  const {
    formValue,
    history,
    match,
    windowDimensions,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const getFact = () => last(history.location.pathname.split('/'));

  const calcHeaderHeight = () => {
    const head = document.getElementsByClassName('hubDasHeader');
    const wrapper = document.getElementById('test');
    let paddingTop = 0;
    let paddingBottom = 0;
    if (wrapper) {
      paddingTop = document.defaultView.getComputedStyle(wrapper, "").getPropertyValue('padding-top').replace('px', '');
      paddingBottom = document.defaultView.getComputedStyle(wrapper, "").getPropertyValue('padding-bottom').replace('px', '');
    }
    return head[0].offsetHeight + +paddingTop + +paddingBottom;
  };

  const statusPage = () => {
    let label;
    let colorIcon;
    if (formValue.publishedReview) {
      label = 'Review';
      colorIcon = 'yellow';
    } else if (formValue.published) {
      label = 'Live';
      colorIcon = 'green';
    } else {
      label = 'Unpublished';
      colorIcon = 'red';
    }
    return {
      label,
      colorIcon,
    }
  };

  return (
    <div className="listings-container" id="test">
      <div className="dis-f h-perc-100">
        <div className="firstLevel">
          <div className="dis-f">
            <BrixelButtonBox
              verticalView
              bgTransparent
              icon="gallery"
              label="Brixel Page"
              subtitle={statusPage().label}
              className={`w-perc-100 mr-1 shadow-1dp brdPrimary400 ${getFact() === 'page' ? 'brdMedium bgWhite' : ''}`}
              colorIcon="primary700"
              backIcon="primary100 mr-1"
              onClick={() => history.push(`/${propID}/listings/page`)}
              status={statusPage().colorIcon}
            />
            <BrixelButtonBox
              verticalView
              bgTransparent
              icon="photo-list"
              label="Portals"
              subtitle="Offline"
              className={`w-perc-100 ml-1 shadow-1dp brdPrimary400 ${getFact() === 'portals' ? 'brdMedium bgWhite' : ''}`}
              colorIcon={'primary700'}
              backIcon="primary100 mr-1"
              onClick={() => history.push(`/${propID}/listings/portals`)}
              status="red"
              selected
            />
          </div>
          <div>
            <BrixelButtonBox
              bgTransparent
              icon="gallery"
              label="Showings"
              subtitle={`No showings`}
              className={`w-perc-100 mt-1 shadow-1dp brdPrimary400 ${getFact() === 'showings' ? 'brdMedium bgWhite' : ''}`}
              colorIcon={'primary700'}
              backIcon="primary100 mr-1"
              onClick={() => history.push(`/${propID}/listings/showings`)}
              selected
            />
          </div>
        </div>
        {
          getFact() !== 'listings' && (
            <div className="w-perc-100" style={{ height: windowDimensions.height - calcHeaderHeight() }}>
              <Route path="/:propId?/listings/showings" component={Showings} />
              <Route path="/:propId?/listings/page" component={Page} />
            </div>
          )
        }
      </div>
    </div>
  )
};

ListingsDashboard.propTypes = {
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

ListingsDashboard.defaultProps = {

};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(ListingsDashboard);
