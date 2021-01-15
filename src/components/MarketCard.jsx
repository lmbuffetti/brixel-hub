/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  Helpers, BrixelIcon,
} from '@brixel/brixel-components';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import BrixelButtonIcon from '@brixel/brixel-components/dist/components/BrixelButtonIcon';
import CoverPropertyImage from './CoverPropertyImage';
import CardImageText from './Skeleton/CardImageText';

const MarketCard = (props) => {
  // PROPS
  const {
    isLoading,
    item,
    type,
    skeleton,
  } = props;

  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.

  if (skeleton.section === type) {
    return (
      <CardImageText />
    );
  }

  return (
    <div className={`market-card h-perc-100 ${type === 'own' ? 'dis-f' : 'dis-fl-col'} brdRadius px-1`}>
      {
        type === 'own' ? (
          <>
            <CoverPropertyImage
              className="cover brdRadius mb-1 h-fix-200 w-fix-200"
              coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
              propertyType={get(item, 'properties.propertyType', undefined)}
            />
            <div className="info dis-fl-col pl-2">
              <div className="top dis-fl-col">
                <h6 className="fweight-700 txtDark700 ellipsis one w-perc-100 max-w-fix-400">{get(item, 'title', '')}</h6>
                <span className="fsize-300 txtDark700">{get(item, 'location.address', '')}</span>
              </div>
              <div className="mid dis-fl-row a-c fsize-300 txtDark400">
                <span>{get(item, 'properties.propertyType', '')} </span> <span className="px-1"> &middot; </span>
                <span><span>{get(item, 'properties.typology.bedrooms', 0)}</span> <span>bedrooms</span></span> <span className="px-1"> &middot; </span>
                <span><span>{get(item, 'properties.typology.livingArea.value', 0)}</span><span>m2</span></span>
              </div>
              <div className="dis-f py-1">
                <BrixelIcon className="fsize-200 txtDark700" icon="favorite-fill" /> <span className="fsize-200 txtDark700">&nbsp;  17</span>
              </div>
              <div className="bottom dis-f a-c fsize-300 py-1">
                <div className="p-2 mr-1 brdRadius bgGreen100">
                  <span className="fweight-500 txtDark200">Your bestimate</span>
                </div>
                <div className="p-2 brdRadius bgLight100">
                  <span className="fweight-500 txtDark200">Facts</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <CoverPropertyImage
              className="cover brdRadius mb-1 w-perc-100 h-perc-100 h-fix-200"
              coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
              propertyType={get(item, 'properties.propertyType', undefined)}
            />
            <div className="info dis-fl-col jc-b">
              <div className="top dis-fl-col">
                <span className="fweight-600 fsize-300 txtDark700 ellipsis one">{get(item, 'title', '')}</span>
                <span className="fsize-300 txtDark700">{get(item, 'location.address', '')}</span>
              </div>
              <div className="mid dis-fl-row a-c fsize-300 txtDark400">
                <span>{get(item, 'properties.propertyType', '')} </span> <span className="px-1"> &middot; </span>
                <span><span>{get(item, 'properties.typology.bedrooms', 0)}</span> <span>bedrooms</span></span> <span className="px-1"> &middot; </span>
                <span><span>{get(item, 'properties.typology.livingArea.value', 0)}</span><span>m2</span></span>
              </div>
              <div className="bottom dis-fl-row a-c txtDark700 pt-1">
                <span className="fsize-300 fweight-600">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
                <span className="fsize-300 fweight-600"> &nbsp; {get(item, 'price.currency', '')}</span>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

MarketCard.propTypes = {
  isLoading: PropTypes.bool,
  item: PropTypes.object.isRequired,
  type: PropTypes.string,
  skeleton: PropTypes.object.isRequired,
};

MarketCard.defaultProps = {
  isLoading: true,
  type: '',
};

const mapStateToProps = (state) => ({
  skeleton: get(state, 'common.skeleton', {}),
});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCard);
