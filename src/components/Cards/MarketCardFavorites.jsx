import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonText,
  BrixelIcon,
  FormatValue,
  Helpers,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import get from 'lodash/get';
import set from 'lodash/set';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../actions/CommonActions';
import api from '../../controllers/api/config';
import ModalPropertyCard from '../../Pages/Market/Buyer/ModalPropertyCard';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';
import Tags from '../Tags';

const MarketCardFavorites = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleProperty,
    handleSetModal,
    lang,
  } = props;
  const [dealDetail, setDealDetail] = useState(null);
  const [offerDetail, setOfferDetail] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSlideData, setShowSlideData] = useState(false);
  
  const settingSlider = {
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: '8px',
    arrows: false,
    dots: false,
    lazyLoad: 'progressive',
    beforeChange: (oldIndex, newIndex) => {
      setActiveSlide(newIndex);
    }
  };
  
  const imgSlide = useRef(null);
  
  useEffect(() => {
    if (activeSingleProperty.id) {
      api.deal.getBuyerDeal(activeSingleProperty.id)
        .then((res) => {
          setDealDetail(res.data);
        })
    }
  }, [activeSingleProperty]);
  
  useEffect(() => {
    if (get(dealDetail, 'id', null)) {
      const offerData = get(dealDetail, 'closing.stageOffer', {});
      if (!get(offerData, 'offer.status', null)) {
        set(offerData, 'offer.status', 'none');
      }
      setOfferDetail(offerData);
    }
  }, [dealDetail]);
  
  const slideImg = (e, act, slideIndex = 0) => {
    if (e) e.stopPropagation();
    if (imgSlide) {
      const slide = imgSlide.current;
      if (act === 'next') slide.slickNext();
      if (act === 'prev') slide.slickPrev();
      if (act === 'goTo') slide.slickGoTo(slideIndex);
    }
  }
  
  const onOpenCard = () => {
    if (get(activeSingleProperty, 'tags', []).includes('pre-market')) {
      const propsModal = {
        lang,
        property: activeSingleProperty,
        onClose: () => handleSetModal({state: false}),
      };
      handleSetModal({
        hideHeader: true,
        state: true,
        component: React.createElement(ModalPropertyCard, propsModal),
        small: true,
        layout: 'xlarge',
        bodyClassColor: 'white p-0',
        hideClose: true,
      })
    } else {
      window.open(`${baseByData.pageUrl}${activeSingleProperty.stub}`, '_blank');
    }
  }
  
  const isPreMarket = () => get(activeSingleProperty, 'tags', []).includes('pre-market');
  
  return (
    <div className="mb-3 marketCardFavorite">
      <div className="dis-f brdRadius brdSmall brdAltGrey200 ov-h">
        <div className="w-fix-flex-320 pos-r">
          
          {
            isPreMarket() && (
              <div className="pos-a-fix x-t-1 x-l-1 zIndex5">
                <Tags
                  lang={lang}
                  status="pre-market"
                  text="Offer"
                  message={{
                    'pre-market': 'Pre-market',
                  }}
                />
              </div>
            )
          }
          
          {
            get(activeSingleProperty, 'photos', []).length > 0 && dealDetail ? (
              <div
                className="h-perc-100"
                onClick={() => onOpenCard()}
                onMouseEnter={() => setShowSlideData(true)}
                onMouseLeave={() => setShowSlideData(false)}
              >
                <div className={showSlideData ? 'show' : ''}>
                  <BrixelIcon
                    rounded
                    background="white"
                    saturation={0}
                    icon="arrow-simple-left"
                    className="pos-a y-c zIndex2 ml-1"
                    onClick={(e) => slideImg(e, 'prev')}
                  />
                  <BrixelIcon
                    rounded
                    background="white"
                    saturation={0}
                    icon="arrow-simple-right"
                    className="pos-a y-c x-r zIndex2 mr-1"
                    onClick={(e) => slideImg(e, 'next')}
                  />
                  <ul
                    className="slick-dots pos-a x-c ta-c zIndex2 bt mb-1"
                  >
                    {
                      activeSingleProperty.photos.map((photo, i) => (
                        <li
                          key={`dots${i.toString()}`}
                          className={activeSlide === i ? 'slick-active' : ''}
                          onClick={(e) => slideImg(e, 'goTo', i)}
                        >
                          <button>1</button>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <Slider
                  ref={imgSlide}
                  {...settingSlider}
                >
                  {
                    activeSingleProperty.photos.map((photo, index) => (
                      <div
                        key={`itm_${index.toString()}`}
                        className={`${isPreMarket() ? 'pre-market' : ''} ${get(activeSingleProperty, 'tags', []).join(' ')} cover w-perc-100 h-fix-200 h-perc-100 pos-r`}
                      >
                        <img src={`${baseByData.shortPath}${photo.path}`} key={`photo${index.toString()}`} />
                      </div>
                    ))
                  }
                </Slider>
              </div>
            ) : (
              <CoverPropertyImage
                className={`${isPreMarket() ? 'pre-market' : ''} ${get(activeSingleProperty, 'tags', []).join(' ')} cover w-perc-100 h-perc-100 pos-r cur-poi`}
                coverPhoto={get(activeSingleProperty, 'coverPhoto.galleryThumbnailPath', undefined)}
                propertyType={get(activeSingleProperty, 'properties.propertyType', undefined)}
                onClick={() => onOpenCard()}
              />
            )
          }
        </div>
        
        <div className="w-perc-100 p-2">
          <div className="dis-f a-t jc-b">
            <div>
              <span className="fsize-300 txtAltGrey700 mb-1 ta-l">
                {get(activeSingleProperty, 'location.zip', '')} {get(activeSingleProperty, 'location.city', '')}
                {
                  get(activeSingleProperty, 'location.countryCode', 'CH') === 'CH' && (
                    <>
                      {` (${get(activeSingleProperty, 'location.stateCode', '')})`}
                    </>
                  )
                }
              </span>
              <h3
                className="cur-poi"
                onClick={() => onOpenCard()}
              >
                {translateTo(activeSingleProperty.title, lang)}
              </h3>
              <BrixelButtonText
                label={translateTo('View property page', lang)}
                iconRight="link-open"
                bgTransparent
              />
            </div>
            <div>
              <div className="dis-f a-c">
                {
                  get(offerDetail, 'offer.status', 'none') !== 'none' && get(offerDetail, 'offer.status', 'none') !== 'rejected' && !isPreMarket() && (
                    <Tags
                      lang={lang}
                      status={get(offerDetail, 'offer.status', '')}
                      text="Offer"
                      message={{
                        accepted: 'Offer accepted',
                        pending: 'Offer sent',
                        rejected: 'Offer rejected'
                      }}
                    />
                  )
                }
                <BrixelIcon
                  className="ml-2"
                  color="red"
                  icon="favorite-fill"
                />
              </div>
            </div>
          </div>
          
          <div className="dis-f jc-b a-b">
            <div className="fsize-300 pt-1 txtDark400 pb-1">
              <div className="dis-f a-c jc-fs flex-wrap w-perc-100">
  
                <div className="bottom a-c txtDark700 mt-2 mb-2 brdSmallRight brdAltGrey200 pr-6 mr-6">
                  <span className="fsize-300 dis-b txtAltGrey400">
                    {translateTo('Price', lang)}
                  </span>
                  {
                    activeSingleProperty && get(activeSingleProperty, 'price.total', 0) !== 0 && get(activeSingleProperty, 'status', null) === 'on-sale' ? (
                      <div className="txtGreen400 dis-f a-b">
                        <span className="fsize-300 ff-mono notranslate">
                          {get(activeSingleProperty, 'price.currency', '')}
                        </span>
                        <span className="fsize-500 ff-mono notranslate ml-1">
                          {Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))}
                        </span>
                      </div>
                    ) : (
                      <span className="txtGreen400 fsize-500">
                        {translateTo(get(activeSingleProperty, 'status', null) === 'sold' ? 'Sold' : 'On Request', lang)}
                      </span>
                    )
                  }
  
                </div>
              
                <div>
                  <span className="fsize-300 dis-b txtAltGrey400">
                    {translateTo('Rooms', lang)}
                  </span>
                  <span className="ff-mono fszie-400 txtBlack">
                    {FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH'))}
                  </span>
                </div>
                <div className="mx-4">
                  <span className="fsize-300 dis-b txtAltGrey400">
                    {translateTo('Size', lang)}
                  </span>
                  <span className="ff-mono fszie-400 txtBlack">
                    {get(activeSingleProperty, 'properties.typology.livingArea.value', 0)} m2
                  </span>
                </div>
                <div>
                  <span className="fsize-300 dis-b txtAltGrey400">
                    {translateTo('Year built', lang)}
                  </span>
                  <span className="ff-mono fszie-400 txtBlack">
                    {get(activeSingleProperty, 'properties.building.built', 0)}
                  </span>
                </div>
              </div>
            </div>
          
            <div>
              {
                (get(offerDetail, 'offer.status', false) === 'none' || get(offerDetail, 'offer.status', null) === 'rejected') && !isPreMarket() && (
                  <BrixelButtonPrimary
                    rounded
                    label={translateTo('Make an offer', lang)}
                    isLoading={!dealDetail.id}
                  />
                )
              }
              {
                (get(offerDetail, 'offer.status', null) === 'accepted' || get(offerDetail, 'offer.status', null) === 'pending') && !isPreMarket() && (
                  <BrixelButtonSecondary
                    rounded
                    label={translateTo('View offer', lang)}
                    isLoading={!dealDetail.id}
                    onClick={() => history.push(`/buyer/${activeSingleProperty.id}/closing/${dealDetail.id}`)}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MarketCardFavorites.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  wishlistProperties: get(state, 'market.wishlistProperties.data', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCardFavorites);
