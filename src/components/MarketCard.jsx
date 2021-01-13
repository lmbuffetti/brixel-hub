/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
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
    <div className="market-card h-fix-200 dis-fl-col brdRadius px-1">
      <CoverPropertyImage
        className="cover"
        coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
        propertyType={get(item, 'properties.propertyType', undefined)}
      />
    </div>
  );
};

MarketCard.propTypes = {
  isLoading: PropTypes.bool,
  item: PropTypes.arrayOf(PropTypes.object).isRequired,
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
