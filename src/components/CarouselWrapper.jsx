/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import Slider from 'react-slick';
import {
  BrixelButtonIcon, BrixelButtonText,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setWindowDimensions } from '../actions/CommonActions';
import MarketCard from './MarketCard';

const CarouselWrapper = (props) => {
  // PROPS
  const {
    className,
    history,
    items,
    match,
    onSetActiveProperty,
    title,
    total,
    type,
    windowDimensions,
  } = props;

  const [preventClick, setPreventClick] = useState(false);
  const [btnAlignment, setBtnAlignment] = useState(false);

  const sliderInstance = useRef(null);
  let slideToShow = type === 'own' ? 1 : 2;
  if (windowDimensions.width > 1024) slideToShow = type === 'own' ? 2 : 4;
  const numCard = [...Array(slideToShow)];

  const settingsSlick = () => {
    let carouselSettings = {};
    if (windowDimensions.width <= 1024) {
      carouselSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        swipeToSlide: true,
        slidesToShow: slideToShow,
        // slidesToScroll: type === 'own' ? 2 : 4,
        responsive: [
          {
            breakpoint: 590,
            settings: {
              slidesToShow: 1,
              swipeToSlide: true,
              centerMode: type !== 'own',
              centerPadding: type === 'own' ? '8px' : '10%',
            },
          },
        ],
        centerPadding: '8px',
        className,
        onSwipe: () => setPreventClick(true),
        afterChange: () => setPreventClick(false),
        nextArrow: <BrixelButtonIcon icon="arrow-simple-right" className="pos-a" small secondary theme="light" themeSat={500} />,
        prevArrow: <BrixelButtonIcon icon="arrow-simple-left" className="pos-a" small secondary theme="light" themeSat={500} />,
      };
    } else if (windowDimensions.width > 1024) {
      carouselSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: slideToShow,
        slidesToScroll: type === 'own' ? 2 : 4,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: type === 'own' ? 1 : slideToShow,
            },
          },
        ],
        draggable: false,
        centerPadding: '8px',
        className,
        onSwipe: () => setPreventClick(true),
        afterChange: () => setPreventClick(false),
        nextArrow: <BrixelButtonIcon icon="arrow-simple-right" className="pos-a" small secondary theme="light" themeSat={500} />,
        prevArrow: <BrixelButtonIcon icon="arrow-simple-left" className="pos-a" small secondary theme="light" themeSat={500} />,
      };
    }
    return carouselSettings;
  };

  useEffect(() => {
    window.addEventListener('resize', () => {
      settingsSlick();
    });
  }, []);

  // eslint-disable-next-line consistent-return
  const showAll = () => {
    switch (type) {
      case 'own': {
        history.push(`${match.url}/own`);
        break;
      }
      case 'favorite': {
        history.push(`${match.url}/favorites`);
        break;
      }
      case 'new': {
        history.push(`${match.url}/radar`);
        break;
      }
      case 'premium': {
        history.push(`${match.url}/premium`);
        break;
      }
      case 'preMarket': {
        history.push(`${match.url}/preMarket`);
        break;
      }
      default:
        // history.push('/home');
    }
  };

  /* if (items && ((items.length > 0 && type !== 'own' && windowDimensions.width <= 600) || (items.length > 0 && type !== 'own' && windowDimensions.width > 1024) ||
   (items.length > 0 && type !== 'own' && windowDimensions.width <= 1024) || (items.length > 0 && type === 'own' && windowDimensions.width <= 1024) || (items.length > 0 && type === 'own' && windowDimensions.width > 1024))) {
     return true;
   }
   return false; */

  return (
    <div className={`${className} carousel-wrapper pos-r`}>
      <div className="mb-3 dis-fl-col dis-fl-row-sm a-c-sm jc-b">
        <h4 className={`fweight-700 ${type === 'own' || type === 'favorite' ? 'fsize-600' : 'fsize-400'}`}>{title}</h4>
        <div className="mt-1 mt-sm-0">
          <BrixelButtonText
            className="fsize-300 show-all pos-r"
            label={`<span>Show all</span> <span class="ml-1">(${total})</span>`}
            onClick={() => showAll()}
          />
        </div>

      </div>
      <Slider ref={sliderInstance} {...settingsSlick()}>
        {
          !items && numCard.map((card, i) => (
            <MarketCard
              type={type}
              key={i.toString()}
              item={card}
              preventClick={preventClick}
              onSetActiveProperty={(id) => onSetActiveProperty(id)}
            />
          ))
        }
        {
          items && items.length > 0 && items.map((item, i) => (
            <MarketCard
              type={type}
              key={i.toString()}
              item={item}
              preventClick={preventClick}
              onSetActiveProperty={(id) => onSetActiveProperty(id)}
            />
          ))
        }
      </Slider>
    </div>
  );
};

CarouselWrapper.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  match: PropTypes.object.isRequired,
  onSetActiveProperty: PropTypes.func,
  title: PropTypes.string,
  total: PropTypes.number,
  type: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

CarouselWrapper.defaultProps = {
  className: '',
  items: null,
  onSetActiveProperty: () => '',
  title: '',
  total: 0,
  type: '',
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
