/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  BrixelButtonSecondary,
  BrixelIcon,
} from '@brixel/brixel-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

const DashboardPropertyCardSold = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSingleProperty,
    loggedInUser,
  } = props;

  return (
    <>
      <div
        className="p-2 p-sm-5 mb-3 brdRadius min-h-fix-304 h-fix-sm-440 ov-h imgCover imgCenter imgOverGreen"
        style={{ backgroundImage: `url(${baseByData.shortPath}${get(activeSingleProperty, 'coverPhoto.path', undefined)})` }}
      >
        <div className="pos-r zIndex2 h-perc-100 dis-fl-col jc-b">
          <h2 className="mb-3 txtWhite fweight-600 fsize-900">
            <span>Congratulations on your sale</span>
            <span>, {loggedInUser && (<>{loggedInUser.firstName}</>)} 🎉 </span>
          </h2>

          <div className="bgWhite brdRadius p-2 max-w-fix-256">
            <h6 className="fweight-600">{get(activeSingleProperty, 'title', '')}</h6>

            <div className="dis-f a-c mt-3">
              <BrixelButtonSecondary
                rounded
                bgTransparent
                onClick={() => history.push(`/${get(activeSingleProperty, 'id', '')}/property/tour`)}
                label="3D-Tour"
                className="mr-2"
              />
              <BrixelIcon
                color="red"
                rounded
                saturationTxt={400}
                background="white"
                saturation={0}
                icon="photos"
                padding="p-small-10 brdSmall brdRed400"
                onClick={() => history.push(`/${get(activeSingleProperty, 'id', '')}/property/photos`)}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

DashboardPropertyCardSold.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(DashboardPropertyCardSold);
