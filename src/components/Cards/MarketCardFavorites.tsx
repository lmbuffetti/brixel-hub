import React, {useEffect, useRef, useState} from 'react';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelImage,
  BrixelButtonText,
  BrixelIcon,
  FormatValue,
  Helpers,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import get from 'lodash/get';
import set from 'lodash/set';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import Slider from 'react-slick';
import {bindActionCreators, compose} from 'redux';
import {setModal} from '../../actions/CommonActions';
import {updateFavorite} from '../../actions/UserActions';
import api from '../../controllers/api/config';
import ModalPropertyCard from '../../Pages/Market/Buyer/ModalPropertyCard';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';
import Tags from '../Tags';
import type {MarketCardFavoritesType} from '../../@types/components/Cards/MarketCardFavorites';
import {convertLabel} from '../../utils/helpers';

const MarketCardFavorites = (props: MarketCardFavoritesType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleProperty,
    handleSetModal,
    handleUpdateFavorites,
    isSmallLoading,
    lang,
    loggedInUser,
  } = props;
  const [dealDetail, setDealDetail] = useState(null);
  const [offerDetail, setOfferDetail] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSlideData, setShowSlideData] = useState(false);
  const [isUnFavorite, setIsUnFavorite] = useState(false);

  const isPreMarket: () => boolean = () => activeSingleProperty.tags ? activeSingleProperty.tags.includes('pre-market') : false;

  const settingSlider = {
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    beforeChange: (oldIndex, newIndex) => {
      setActiveSlide(newIndex);
    },
  };

  const imgSlide = useRef() as React.MutableRefObject<Slider>;

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
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (imgSlide) {
      const slide = imgSlide.current;
      if (act === 'next') slide.slickNext();
      if (act === 'prev') slide.slickPrev();
      if (act === 'goTo') slide.slickGoTo(slideIndex);
    }
    return false;
  }

  const onOpenCard = () => {
    if (isPreMarket()) {
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
        layout: 'xxlarge',
        bodyClassColor: 'white p-0 preMarketModal',
        className: 'test',
        hideClose: true,
      })
    } else {
      history.push(`/buyer/${activeSingleProperty.id}/home`);
    }
  }

  const onChangeFavorite = () => {
    setIsUnFavorite(!isUnFavorite);
    const data = {
      act: 'remove',
      id: activeSingleProperty.id,
      property: activeSingleProperty,
      data: {
        email: get(loggedInUser, 'email', ''),
        language: get(loggedInUser, 'lang', 'en'),
      },
    };
    if (isUnFavorite) {
      data.act = 'add';
    }
    handleUpdateFavorites(data);
    handleSetModal({ state: false });
  }

  return (
    <div className="mb-3 marketCardFavorite">
      <div className="dis-fl-col dis-fl-row-md dis-f brdRadius brdSmall brdText100 ov-h h-perc-100">
        <div className="w-fix-md-304 pos-r h-perc-100 ov-h">
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
            !isPreMarket() && get(activeSingleProperty, 'photos', []).length > 1 && dealDetail ? (
              <div
                className="h-perc-100 scaleFix"
                /* onClick={() => onOpenCard()} */
                onMouseEnter={() => setShowSlideData(true)}
                onMouseLeave={() => setShowSlideData(false)}
              >
                <div>
                  <div className={`sliderControl ${showSlideData ? 'show' : ''}`}>
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
                  </div>
                  <ul
                    className="slick-dots pos-a x-c ta-c zIndex2 bt mb-1"
                  >
                    {
                      get(activeSingleProperty, 'photos', []).slice(0, 5).map((photo, i) => (
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
                    get(activeSingleProperty, 'photos', []).slice(0, 5).map((photo, index) => (
                      <React.Fragment key={`itm_${index.toString()}`}>
                        {
                          photo.path && (
                            <div
                              key={`itm_${index.toString()}`}
                              className={`${isPreMarket() ? 'pre-market' : ''} ${get(activeSingleProperty, 'tags', []).join(' ')} cover h-fix-208 h-fix-sm-304 h-fix-lg-208 pos-r`}
                            >
                              <BrixelImage
                                className="cover h-perc-100"
                                url={photo.path}
                                size="M"
                                alt={`Property Photos ${index.toString()}`}
                              />
                            </div>
                          )
                        }
                      </React.Fragment>
                    ))
                  }
                </Slider>
              </div>
            ) : (
              <CoverPropertyImage
                className={`${isPreMarket() ? 'pre-market' : ''} ${get(activeSingleProperty, 'tags', []).join(' ')} cover w-perc-100 h-fix-208 h-fix-sm-304 h-fix-lg-208 pos-r cur-poi`}
                coverPhoto={isPreMarket() ? undefined : get(activeSingleProperty, 'coverPhoto.path', undefined)}
                propertyType={get(activeSingleProperty, 'properties.propertyType', undefined)}
                onClick={() => onOpenCard()}
                size="M"
              />
            )
          }
        </div>

        <div className="dis-fl-col p-2 flex-1">
          <div className="dis-fl-col-rev dis-fl-row-sm a-t jc-b">
            <div className="w-perc-100 w-auto-sm">
              <span className="fsize-300 txtText700 mb-1 ta-l">
                {get(activeSingleProperty, 'location.zip', '')} {get(activeSingleProperty, 'location.city', '')}
                {
                  get(activeSingleProperty, 'location.countryCode', 'CH') === 'CH' && (
                    <>
                      {` (${get(activeSingleProperty, 'location.stateCode', '')})`}
                    </>
                  )
                }
              </span>
              <h6
                className="cur-poi fweight-600 fSizePx18 mb-1"
                onClick={() => onOpenCard()}
              >
                {translateTo(activeSingleProperty.title, lang)}
              </h6>
              <BrixelButtonText
                label={isPreMarket() ? translateTo('View details', lang) : translateTo('View property page', lang) }
                rightIcon={isPreMarket() ? '' : 'link-open'}
                bgTransparent
                labelClass="fsize-300"
                onClick={() => {
                  // @ts-ignore
                  if (get(activeSingleProperty, 'tags', []).includes('pre-market')) {
                    onOpenCard();
                  } else {
                    window.open(`${baseByData.pageUrl}${activeSingleProperty.stub}`, '_blank')
                  }
                }}
              />
            </div>
            <div className="w-perc-100 mb-1 mb-sm-0 w-auto-sm">
              <div className="dis-f w-perc-100 w-auto-sm jc-b a-c">
                {
                  get(offerDetail, 'offer.status', 'none') !== 'none' && get(offerDetail, 'offer.status', null) !== 'rejected' && !isPreMarket() && (
                    <Tags
                      lang={lang}
                      status={get(offerDetail, 'offer.status', '')}
                      text="Offer"
                      message={{
                        accepted: translateTo('Offer accepted', lang),
                        pending: translateTo('Offer sent', lang),
                        rejected: translateTo('Offer rejected', lang),
                      }}
                    />
                  )
                }
                <BrixelIcon
                  isLoading={isSmallLoading[`favorite-${activeSingleProperty.id}`]}
                  className="ml-2"
                  color="red"
                  icon={!isUnFavorite ? 'favorite-fill' : 'favorite'}
                  onClick={() => onChangeFavorite()}
                />
              </div>
            </div>
          </div>

          <div className="dis-fl-col dis-fl-row-md jc-b pt-2 mt-a flex-wrap">
            <div className="fsize-300 txtText700 mb-2 mb-lg-0">
              <div className="dis-f a-c jc-fs flex-wrap w-perc-100">

                <div className="bottom a-c txtText900 brdSmallRight-sm mb-1 mb-sm-0 brdText100 pr-6 mr-6">
                  <span className="fsize-300 dis-b txtText400">
                    {translateTo('Price', lang)}
                  </span>
                  {
                    !isPreMarket() && activeSingleProperty && get(activeSingleProperty, 'price.total', 0) !== 0 && get(activeSingleProperty, 'status', null) === 'on-sale' ? (
                      <div className="txtGreen400 dis-f a-b">
                        <span className="fsize-300 ff-mono notranslate">
                          {get(activeSingleProperty, 'price.currency', '')}
                        </span>
                        <span className="fsize-500 ff-mono notranslate ml-1">
                          {Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))}
                        </span>
                      </div>
                    ) : (
                      <span className="txtGreen400 fsize-400 fsize-sm-500 ff-mono">
                        {translateTo(convertLabel(get(activeSingleProperty, 'status', ''), 'propertyStatus'), lang)}
                      </span>
                    )
                  }

                </div>

                <div className="dis-f">
                  <div>
                    <span className="fsize-300 dis-b txtText400">
                      {translateTo('Rooms', lang)}
                    </span>
                    <span className="ff-mono fsize-400 txtBlack dis-b pt-small-4">
                      {FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH'))}
                    </span>
                  </div>
                  <div className="mx-4">
                    <span className="fsize-300 dis-b txtText400">
                      {translateTo('Size', lang)}
                    </span>
                    <span className="ff-mono fsize-400 txtBlack dis-b pt-small-4">
                      {get(activeSingleProperty, 'properties.typology.livingArea.value', 0)} m2
                    </span>
                  </div>
                  <div>
                    <span className="fsize-300 dis-b txtText400">
                      {translateTo('Year built', lang)}
                    </span>
                    <span className="ff-mono fsize-400 txtBlack dis-b pt-small-4">
                      {get(activeSingleProperty, 'properties.building.built', 0)}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-a mb-a ml-sm-a">
              {
                (get(offerDetail, 'offer.status', null) === 'none' || get(offerDetail, 'offer.status', null) === 'rejected') && !isPreMarket() && (
                  <BrixelButtonPrimary
                    rounded
                    label={translateTo('Make an offer', lang)}
                    isLoading={!get(dealDetail, 'id', false)}
                    onClick={() => history.push(`/packageFlow/${activeSingleProperty.id}/makeOffer/priceInfo?url=${history.location.pathname}`)}
                  />
                )
              }
              {
                (get(offerDetail, 'offer.status', null) === 'accepted' || get(offerDetail, 'offer.status', null) === 'pending') && !isPreMarket() && (
                  <BrixelButtonSecondary
                    rounded
                    label={translateTo('View offer', lang)}
                    isLoading={!get(dealDetail, 'id', false)}
                    onClick={() => history.push(`/buyer/${activeSingleProperty.id}/closing/${get(dealDetail, 'id', '')}?url=${history.location.pathname}`)}
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
const mapStateToProps = (state) => ({
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  wishlistProperties: get(state, 'market.wishlistProperties.data', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCardFavorites);
