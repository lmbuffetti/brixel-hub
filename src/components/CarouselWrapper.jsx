/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import MarketCard from './MarketCard';

const CarouselWrapper = (props) => {
  // PROPS
  const {
    isLoading,
    items,
  } = props;

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (
    <>
      <Slider {...carouselSettings}>
        {
          items.length > 0 && items.map((item, i) => (
            <MarketCard key={i.toString()} item={item} />
          ))
        }
      </Slider>
    </>
  );
};

CarouselWrapper.propTypes = {
  isLoading: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

CarouselWrapper.defaultProps = {
  isLoading: false,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(CarouselWrapper);
