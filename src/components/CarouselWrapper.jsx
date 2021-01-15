/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import {
  BrixelButtonIcon,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import MarketCard from './MarketCard';

const CarouselWrapper = (props) => {
  // PROPS
  const {
    isLoading,
    items,
    type,
    title,
    className,
  } = props;

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: type === 'own' ? 2 : 4,
    centerPadding: '8px',
    slidesToScroll: 1,
    className,
    nextArrow: <BrixelButtonIcon icon="arrow-simple-right" className="pos-a" small ghost theme="dark" />,
    prevArrow: <BrixelButtonIcon icon="arrow-simple-left" className="pos-a" small ghost theme="dark" />,
  };

  return (
    <div className={`${className} carousel-wrapper pos-r`}>
      <h4 className={`mb-2 fweight-700 ${type === 'own' ? '' : 'fsize-500'}`}>{title}</h4>
      <Slider {...carouselSettings}>
        {
          items.length > 0 && items.map((item, i) => (
            <MarketCard type={type} key={i.toString()} item={item} />
          ))
        }
      </Slider>
    </div>
  );
};

CarouselWrapper.propTypes = {
  isLoading: PropTypes.bool,
  type: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

CarouselWrapper.defaultProps = {
  isLoading: false,
  type: '',
  title: '',
  className: '',
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(CarouselWrapper);
