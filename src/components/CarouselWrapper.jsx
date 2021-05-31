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

// images
import testdrive from '../images/Market/testdrive.svg';

const CarouselWrapper = (props) => {
  // PROPS
  const {
    className,
    titleClass,
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
    const baseUrl = match.url.includes('sell') ? 'sell' : 'buy';
    switch (type) {
      case 'own': {
        history.push(`/${baseUrl}/own`);
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
        {/* <div className="mb-3 dis-fl-col dis-fl-row-sm a-c-sm jc-b">
          <h4 className={`fweight-700 ${type === 'own' || type === 'favorite' ? 'fsize-600' : 'fsize-400'}`}>{title}</h4>
        </div> */}
        <div className="actionTop bgWhite pos-r zIndex2 py-1 px-1 dis-f hide-sm a-c jc-b">
          <BrixelButtonText
            className="fsize-300 show-all pos-r mr-1"
            label={`<span>View all properties</span> <span class="ml-1">(${total})</span>`}
            onClick={() => showAll()}
          />
          <BrixelButtonText
            className="fsize-300 show-all pos-r"
            label="+ Add new"
            onClick={() => history.push(`/packageFlow/getStarted?company=${get(loggedInUser, 'user.company.stub', '')}`)}
          />
        </div>
        <div className="marketSellBanner dis-fl-col dis-fl-row-sm a-c jc-c pb-2 mt-2-neg mt-sm-0">
          <div className="max-w-fix-144 min-h-fix-200 min-h-fix-sm-360 max-w-fix-sm-264 w-perc-100">
            <img src={testdrive} alt="testdrive" />
          </div>
          <div className="max-w-fix-360 ml-sm-5 pt-sm-8 ta-c ta-l-sm">
            <h3 className="fweight-600 fsize-600 fsize-sm-800 mb-1 pt-2 pt-sm-5">Test drive our service. <br /> No strings attached.</h3>
            <h5 className="fSizePx18 fsize-sm-500 fweight-400 mb-3 px-2 px-sm-0">
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
              theme="green"
              themeSat="600"
              label="Request now"
              onClick={() => bookNow()}
              className="mb-2 ml-a ml-sm-0 mr-sm-0 mr-a"
            />
            {/* <p className="fsize-100 mb-5">No commission. No hidden terms.</p> */}

          </div>

        </div>
        <div className="carouselContainer pos-r max-w-fix-768 ml-a mr-a px-2 px-md-0">
          <div className="p-2 px-sm-3 brdRadius brdSmall brdLight200 bgWhite shadow-2dp min-h-fix-240">
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
                    className={`txtLight500 icnLight500 brdLight500 slick-arrow secondary small pos-a y-c ml-7-neg transY-100 ${activeSlide < 1 ? 'slick-disabled' : ''}`}
                    icon="arrow-simple-left"
                    theme="light"
                    saturation={500}
                    secondary
                  />
                  {/* <div className="fsize-300 txtPrimary400 ml-3 mr-3">
                    <span>{activeSlide + 1}</span>
                    <span className="ml-small-4 mr-small-4">of</span>
                    <span>{total}</span>
                  </div> */}
                  <BrixelButtonIcon
                    onClick={() => moveSlide('next')}
                    className={`mr-1 txtLight500 icnLight500 brdLight500 slick-arrow secondary small pos-a y-c mr-7-neg x-r transY-100 ${activeSlide >= items.length - 1 ? 'slick-disabled' : ''}`}
                    icon="arrow-simple-right"
                    theme="light"
                    saturation={500}
                    secondary
                  />
                </>
              )
            }
          </div>
          <div className="mt-1 dis-fl-row-sm hide a-c jc-c">

            <BrixelButtonText
              className="fsize-300 show-all pos-r"
              label="+ Add new"
              onClick={() => history.push(`/packageFlow/getStarted?company=${get(loggedInUser, 'user.company.stub', '')}`)}
            />
            <BrixelButtonText
              className="fsize-300 show-all pos-r mr-1"
              label={`<span>View all</span> <span class="ml-1">(${total})</span>`}
              onClick={() => showAll()}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`${className} carousel-wrapper pos-r`}>
      <div className="mb-3 dis-fl-col dis-fl-row-sm a-c-sm jc-b">
        <h4 className={`title fweight-600 ${titleClass || (type === 'own' || type === 'favorite' ? 'fsize-600' : 'fsize-400')}`}>{title}</h4>
        <div className="mt-1 mt-sm-0 dis-f a-c">
          <BrixelButtonText
            className="fsize-300 show-all pos-r mr-1"
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
  titleClass: PropTypes.string,
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
  titleClass: '',
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
