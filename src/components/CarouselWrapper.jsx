/* global Transifex */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useRef, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import Slider from 'react-slick';
import {
  BrixelButtonIcon,
  BrixelButtonText,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setWindowDimensions } from '../actions/CommonActions';
import MarketCard from './MarketCard';

const CarouselWrapper = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    className,
    items,
    lang,
    layout,
    loggedInUser,
    onSetActiveProperty,
    setActiveSingleCompany,
    setPropertyId,
    slideToGo,
    subtitle,
    theme,
    title,
    total,
    type,
    windowDimensions,
  } = props;

  const [activeSlide, setActiveSlide] = useState(0);
  const [preventClick, setPreventClick] = useState(false);

  const sliderInstance = useRef(null);
  let slideToShow = 1;
  if (windowDimensions.width > 767) slideToShow = type === 'own' ? 1 : 2;
  if (windowDimensions.width > 1024) slideToShow = type === 'own' ? 1 : 3;
  const numCard = [...Array(slideToShow)];

  const settingSlider = useCallback(() => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slideToShow,
    arrows: false,
    slidesToScroll: type === 'own' ? 1 : 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: slideToShow,
          slidesToScroll: 1,
          swipeToSlide: true,
          draggable: true,
        },
      },
      {
        breakpoint: 590,
        settings: {
          slidesToShow: slideToShow,
          slidesToScroll: 1,
          swipeToSlide: true,
          centerMode: type !== 'own',
          centerPadding: type === 'own' ? '8px' : '10%',
          draggable: true,
        },
      },
    ],
    draggable: false,
    centerPadding: '8px',
    className,
    onSwipe: () => {
      setPreventClick(true);
      setTimeout(() => setPreventClick(false), 1000);
    },
    afterChange: () => setPreventClick(false),
    beforeChange: (prev, next) => {
      setActiveSlide(next);
    },
  }), [type, windowDimensions.width]);

  const moveSlide = (action) => {
    const slider = sliderInstance.current;
    if (slider) {
      if (action === 'next') slider.slickNext();
      else slider.slickPrev();
    }
  };

  // eslint-disable-next-line consistent-return
  const showAll = useCallback(() => {
    const baseUrl = history.location.pathname.includes('sell') ? 'sell' : 'buy';
    switch (type) {
      case 'own': {
        history.push(`/${baseUrl}/own`);
        break;
      }
      case 'wishlist': {
        history.push(`/${baseUrl}/wishlist`);
        break;
      }
      case 'favorite': {
        history.push(`/${baseUrl}/favorites`);
        break;
      }
      case 'new': {
        history.push(`/${baseUrl}/radar`);
        break;
      }
      case 'premium': {
        history.push(`/${baseUrl}/premium`);
        break;
      }
      case 'preMarket': {
        history.push(`/${baseUrl}/preMarket`);
        break;
      }
      default:
        // history.push('/home');
    }
  }, [type]);

  useEffect(() => {
    if (slideToGo > -1 && sliderInstance.current) {
      sliderInstance.current.slickGoTo(+slideToGo);
    }
  }, [sliderInstance.current, slideToGo]);

  useEffect(() => {
    if (sliderInstance.current) {
      if (typeof Transifex !== 'undefined') Transifex.live.translateTo(lang);
    }
  }, [sliderInstance.current]);

  useEffect(() => {
    if (layout === 'singleOwnCard') {
      const activeCompanyId = items[activeSlide].company;
      if (activeCompanyId && (activeSlide > 0 || slideToGo < 0)) {
        setActiveSingleCompany(activeCompanyId);
        setPropertyId(items[activeSlide].id);
      }
    }
  }, [activeSlide]);

  if (layout === 'singleOwnCard') {
    return (
      <div className={`${className} carousel-wrapper pos-r`}>

        <div className="carouselContainer pos-r max-w-fix-768 ml-a mr-a px-2 px-md-0">
          <div className="py-2 px-0 pt-sm-3 pb-sm-1 px-sm-3 brdRadius brdSmall brdLight200 bgWhite shadow-2dp min-h-fix-240 pos-r">
            <Slider ref={sliderInstance} {...settingSlider()}>
              {
                !items && numCard.map((card, i) => (
                  <MarketCard
                    layout={layout}
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
                    layout={layout}
                    type={type}
                    key={i.toString()}
                    item={item}
                    preventClick={preventClick}
                    onSetActiveProperty={(id) => onSetActiveProperty(id)}
                  />
                ))
              }
            </Slider>

            {
              items.length > 1 && (
                <>
                  <BrixelButtonIcon
                    onClick={() => moveSlide('prev')}
                    className={`txtLight500 icnLight500 brdLight500 slick-arrow secondary small pos-a y-c ml-7-neg ${activeSlide < 1 ? 'slick-disabled' : ''}`}
                    icon="arrow-simple-left"
                    theme="light"
                    saturation={500}
                    secondary
                  />
                  <BrixelButtonIcon
                    onClick={() => moveSlide('next')}
                    className={`mr-1 txtLight500 icnLight500 brdLight500 slick-arrow secondary small pos-a y-c mr-7-neg x-r ${activeSlide >= items.length - 1 ? 'slick-disabled' : ''}`}
                    icon="arrow-simple-right"
                    theme="light"
                    saturation={500}
                    secondary
                  />
                </>
              )
            }
          </div>
          <div className={`mt-1 dis-fl-col-sm a-c jc-c ${has(items[activeSlide], 'published') && items[activeSlide].published === false ? '' : ''}`}>

            <div className="dis-fl-row-sm hide a-c jc-c pt-1">
              <BrixelButtonText
                className="fsize-300 show-all pos-r mr-1"
                label="+ Add new"
                theme="blue"
                themeSat={700}
                onClick={() => history.push(`/packageFlow/getStarted?company=${get(loggedInUser, 'company.stub', '')}`)}
              />
              <BrixelButtonText
                theme="blue"
                themeSat={700}
                className="fsize-300 show-all pos-r"
                label={`<span>View all</span> <span class="ml-1">(${total})</span>`}
                onClick={() => showAll()}
              />
            </div>

          </div>
          {
            items.length > 1 && (
              <div className="dis-f a-c jc-c mt-2 hide-sm w-perc-100">
                <BrixelButtonIcon
                  onClick={() => moveSlide('prev')}
                  className={`txtLight500 icnLight500 brdLight500 slick-arrow secondary small ${activeSlide < 1 ? 'slick-disabled' : ''}`}
                  icon="arrow-simple-left"
                  theme="light"
                  saturation={500}
                  secondary
                />
                <div className="fsize-300 txtPrimary400 ml-3 mr-3">
                  <span>{activeSlide + 1}</span>
                  <span className="ml-small-4 mr-small-4">of</span>
                  <span>{total}</span>
                </div>
                <BrixelButtonIcon
                  onClick={() => moveSlide('next')}
                  className={`mr-1 txtLight500 icnLight500 brdLight500 slick-arrow secondary small ${activeSlide >= items.length - 1 ? 'slick-disabled' : ''}`}
                  icon="arrow-simple-right"
                  theme="light"
                  saturation={500}
                  secondary
                />
              </div>
            )
          }
        </div>
      </div>
    );
  }
  return (
    <div className={`${className} carousel-wrapper pos-r`}>
      <div className={`${subtitle ? '' : 'mb-3'} dis-fl-col dis-fl-row-sm a-c-sm jc-b`}>
        <h4 className={`title fweight-600 fsize-600 ${theme === 'light' ? 'txtWhite' : ''}`}>{title}</h4>
        <div className="mt-1 mt-sm-0 dis-f a-c">
          <BrixelButtonText
            className="fsize-300 show-all pos-r mr-1"
            label={`<span>Show all</span> <span class="ml-1">(${total})</span>`}
            onClick={() => showAll()}
            theme={theme === 'light' ? 'white' : null}
            themeSat={0}
          />
          {
            items && items.length > slideToShow && (
              <>
                <BrixelButtonIcon
                  onClick={() => moveSlide('prev')}
                  className={`mr-1 txtLight500 icnLight500 brdLight500 slick-arrow secondary small ${activeSlide < 1 ? 'slick-disabled' : ''}`}
                  icon="arrow-simple-left"
                  theme="light"
                  saturation={500}
                  secondary
                />
                <BrixelButtonIcon
                  onClick={() => moveSlide('next')}
                  className={`mr-1 txtLight500 icnLight500 brdLight500 slick-arrow secondary small ${activeSlide >= items.length - 1 ? 'slick-disabled' : ''}`}
                  icon="arrow-simple-right"
                  theme="light"
                  saturation={500}
                  secondary
                />
              </>
            )
          }
        </div>
      </div>
      {
        subtitle && (
          <h6 className={`${theme === 'light' ? 'txtWhite' : ''} mb-3`}>
            {subtitle}
          </h6>
        )
      }
      <Slider ref={sliderInstance} {...settingSlider()}>
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
  items: PropTypes.arrayOf(PropTypes.object),
  lang: PropTypes.string.isRequired,
  layout: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  onSetActiveProperty: PropTypes.func,
  setActiveSingleCompany: PropTypes.func,
  setPropertyId: PropTypes.func,
  slideToGo: PropTypes.number,
  subtitle: PropTypes.string,
  theme: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
  type: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

CarouselWrapper.defaultProps = {
  className: '',
  items: null,
  layout: null,
  onSetActiveProperty: () => '',
  setActiveSingleCompany: () => '',
  setPropertyId: () => '',
  slideToGo: 0,
  subtitle: null,
  theme: null,
  title: '',
  total: 0,
  type: '',
};

const mapStateToProps = (state) => ({
  lang: get(state, 'user.loggedInUser.user.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(CarouselWrapper);
