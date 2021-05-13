/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useRef, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import Slider from 'react-slick';
import {
  BrixelButtonIcon,
  BrixelButtonText,
  BrixelButtonPrimary,
  Helpers,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setWindowDimensions } from '../actions/CommonActions';
import MarketCard from './MarketCard';

const CarouselWrapper = (props) => {
  // PROPS
  const {
    className,
    companyListings,
    history,
    items,
    layout,
    loggedInUser,
    match,
    onSetActiveProperty,
    title,
    total,
    type,
    windowDimensions,
  } = props;

  const [activeSlide, setActiveSlide] = useState(0);
  const [preventClick, setPreventClick] = useState(false);
  const [teaserPrice, setTeaserPrice] = useState({});

  const sliderInstance = useRef(null);
  let slideToShow = 1;
  if (windowDimensions.width > 767) slideToShow = type === 'own' ? 1 : 2;
  if (windowDimensions.width > 1024) slideToShow = type === 'own' ? 1 : 4;
  const numCard = [...Array(slideToShow)];

  const settingSlider = useCallback(() => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slideToShow,
    arrows: false,
    slidesToScroll: type === 'own' ? 1 : 4,
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
    onSwipe: () => setPreventClick(true),
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

  const bookNow = () => {
    localStorage.setItem('backUrl', '/sell');
    history.push(`/${items[activeSlide].id}/trialRequest`);
  };

  // eslint-disable-next-line consistent-return
  const showAll = useCallback(() => {
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
  }, [type]);

  useEffect(() => {
    if (layout === 'singleOwnCard') {
      const activeCompanyId = items[activeSlide].company;
      const activeCompanyDetail = companyListings.find((item) => item.id === activeCompanyId);
      if (activeCompanyDetail) {
        setTeaserPrice({
          price: get(activeCompanyDetail, 'meta.teaserPackage.price', ''),
          currency: get(activeCompanyDetail, 'meta.teaserPackage.currency', ''),
        });
      }
    }
  }, [activeSlide, companyListings]);

  if (layout === 'singleOwnCard') {
    return (
      <div className={`${className} carousel-wrapper pos-r`}>
        <div className="mb-3 dis-fl-col dis-fl-row-sm a-c-sm jc-b">
          <h4 className={`fweight-700 ${type === 'own' || type === 'favorite' ? 'fsize-600' : 'fsize-400'}`}>{title}</h4>
          <div className="mt-1 mt-sm-0 dis-f a-c">
            <BrixelButtonText
              className="fsize-300 show-all pos-r mr-1"
              label={`<span>Show all</span> <span class="ml-1">(${total})</span>`}
              onClick={() => showAll()}
            />
            <BrixelButtonText
              className="fsize-300 show-all pos-r"
              label="+ Add new"
              onClick={() => history.push(`/packageFlow/getStarted?company=${get(loggedInUser, 'user.company.stub', '')}`)}
            />
          </div>
        </div>

        <div className="marketSellBanner pt-8 ta-c">
          <h4 className="fweight-700 mb-2">Test drive our service. No strings attached.</h4>
          <h5 className="fSizePx18 mb-2">
            {
              get(teaserPrice, 'price', 0) > 0 ? (
                <>
                  <span>Get the full Brixel experience worth</span>
                  <span className="ml-small-4">{get(teaserPrice, 'currency', '')} {Helpers.formatNumberValue(get(teaserPrice, 'price', ''), get(teaserPrice, 'currency', ''))}.</span>
                </>
              ) : (
                <span>Get the full Brixel experience</span>
              )
            }
          </h5>
          <BrixelButtonPrimary
            rounded
            label="Request now"
            onClick={() => bookNow()}
            className="ml-a mr-a mb-2"
          />
          <p className="fsize-100 mb-5">No commission. No hidden terms.</p>

        </div>
        <div className="carouselContainer pos-r max-w-fix-768 ml-a mr-a px-2 px-sm-0">
          <div className="p-2 px-sm-3 brdRadius bgWhite shadow-2dp min-h-fix-240">
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
          </div>
          {
            items.length > 1 && (
              <div className="dis-f a-c jc-c mt-4">
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
      <div className="mb-3 dis-fl-col dis-fl-row-sm a-c-sm jc-b">
        <h4 className={`fweight-700 ${type === 'own' || type === 'favorite' ? 'fsize-600' : 'fsize-400'}`}>{title}</h4>
        <div className="mt-1 mt-sm-0 dis-f a-c">
          <BrixelButtonText
            className="fsize-300 show-all pos-r"
            label={`<span>Show all</span> <span class="ml-1">(${total})</span>`}
            onClick={() => showAll()}
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
  companyListings: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  layout: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
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
  layout: null,
  onSetActiveProperty: () => '',
  title: '',
  total: 0,
  type: '',
};

const mapStateToProps = (state) => ({
  companyListings: get(state, 'companies.companyListings.data', []),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(CarouselWrapper);
