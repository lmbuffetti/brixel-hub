/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import Slider from 'react-slick';
import {
  BrixelButtonIcon,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setWindowDimensions } from '../actions/CommonActions';
import MarketCard from './MarketCard';

const CarouselWrapper = (props) => {
  // PROPS
  const {
    items,
    type,
    title,
    className,
    windowDimensions,
  } = props;

  const [preventClick, setPreventClick] = useState(false);

  const settingsSlick = () => {
    let carouselSettings = {};
    if (windowDimensions.width <= 1024) {
      carouselSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        swipeToSlide: true,
        slidesToShow: type === 'own' ? 1 : 2,
        // slidesToScroll: type === 'own' ? 2 : 4,
        responsive: [
          {
            breakpoint: 590,
            settings: {
              slidesToShow: 1,
              swipeToSlide: true,
              centerMode: true,
              centerPadding: '10%',
            },
          },
        ],
        centerPadding: '8px',
        className,
        onSwipe: () => setPreventClick(true),
        afterChange: () => setPreventClick(false),
        nextArrow: <BrixelButtonIcon icon="arrow-simple-right" className="pos-a" small ghost theme="dark" />,
        prevArrow: <BrixelButtonIcon icon="arrow-simple-left" className="pos-a" small ghost theme="dark" />,
      };
    } else if (windowDimensions.width > 1024) {
      carouselSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: type === 'own' ? 2 : 4,
        slidesToScroll: type === 'own' ? 2 : 4,
        draggable: false,
        centerPadding: '8px',
        className,
        onSwipe: () => setPreventClick(true),
        afterChange: () => setPreventClick(false),
        nextArrow: <BrixelButtonIcon icon="arrow-simple-right" className="pos-a" small ghost theme="dark" />,
        prevArrow: <BrixelButtonIcon icon="arrow-simple-left" className="pos-a" small ghost theme="dark" />,
      };
    }
    return carouselSettings;
  };

  /* const carouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: type === 'own' ? 2 : 4,
    slidesToScroll: type === 'own' ? 2 : 4,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: type === 'own' ? 1 : 2,
          slidesToScroll: type === 'own' ? 1 : 2,
        },
      },
      {
        breakpoint: 590,
        settings: {
          slidesToShow: 1,
          swipeToSlide: true,
          centerMode: true,
          centerPadding: '10%',
        },
      },
    ],
    centerPadding: '8px',
    className,
    onSwipe: () => setPreventClick(true),
    afterChange: () => setPreventClick(false),
    nextArrow: <BrixelButtonIcon icon="arrow-simple-right" className="pos-a" small ghost theme="dark" />,
    prevArrow: <BrixelButtonIcon icon="arrow-simple-left" className="pos-a" small ghost theme="dark" />,
  };
*/
  return (
    <div className={`${className} carousel-wrapper pos-r`}>
      <h4 className={`mb-2 fweight-700 ${type === 'own' ? '' : 'fsize-500'}`}>{title}</h4>
      <Slider {...settingsSlick()}>
        {
          items.length > 0 && items.map((item, i) => (
            <MarketCard
              type={type}
              key={i.toString()}
              item={item}
              preventClick={preventClick}
            />
          ))
        }
      </Slider>
    </div>
  );
};

CarouselWrapper.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

CarouselWrapper.defaultProps = {
  type: '',
  title: '',
  className: '',
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(CarouselWrapper);
