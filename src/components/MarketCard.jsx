/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  Helpers,
} from '@brixel/brixel-components';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import CoverPropertyImage from './CoverPropertyImage';

const MarketCard = (props) => {
  // PROPS
  const {
    isLoading,
    item,
  } = props;

  return (
    <div className="market-card h-perc-100 dis-fl-col brdRadius px-1">
      <CoverPropertyImage
        className="cover brdRadius mb-1 w-perc-100 h-perc-100 max-h-fix-200"
        coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
        propertyType={get(item, 'properties.propertyType', undefined)}
      />
      <div className="info dis-fl-col jc-b">
        <div className="top dis-fl-col">
          <span className="fsize-300">{get(item, 'title', '')}</span>
          <span className="fsize-300">{get(item, 'location.address', '')}</span>
        </div>
        <div className="mid dis-fl-row a-c">
          <span className="fsize-300 mr-1">{get(item, 'properties.propertyType', '')}</span>
          <p className="fsize-300 mr-1"><span>{get(item, 'properties.typology.bedrooms', 0)}</span><span>bedrooms</span></p>
          <p className="fsize-300 mr-1"><span>{get(item, 'properties.typology.livingArea.value', 0)}</span><span>m2</span></p>
        </div>
        <div className="bottom dis-fl-row a-c">
          <span className="fsize-100 pb-small-2">{get(item, 'price.currency', '')}&nbsp;</span>
          <span>{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
        </div>
      </div>
    </div>
  );
};

MarketCard.propTypes = {
  isLoading: PropTypes.bool,
  item: PropTypes.object.isRequired,
};

MarketCard.defaultProps = {
  isLoading: false,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCard);
