import React, { useEffect, useRef, useState } from 'react';
import { BrixelButtonPrimary, BrixelButtonSecondary, BrixelImage, BrixelButtonText, BrixelIcon, FormatValue, Helpers, } from '@brixel-io/brixel-components';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../actions/CommonActions';
import { updateFavorite } from '../../actions/UserActions';
import api from '../../controllers/api/config';
import ModalPropertyCard from '../../Pages/Market/Buyer/ModalPropertyCard';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';
import Tags from '../Tags';
import { convertLabel } from '../../utils/helpers';
const MarketCardFavorites = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const { activeSingleProperty, handleSetModal, handleUpdateFavorites, isSmallLoading, lang, loggedInUser, } = props;
    const [dealDetail, setDealDetail] = useState();
    const [offerDetail, setOfferDetail] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [showSlideData, setShowSlideData] = useState(false);
    const [isUnFavorite, setIsUnFavorite] = useState(false);
    const isPreMarket = () => activeSingleProperty.tags ? activeSingleProperty.tags.includes('pre-market') : false;
    const settingSlider = {
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        beforeChange: (_oldIndex, newIndex) => {
            setActiveSlide(newIndex);
        },
    };
    const imgSlide = useRef();
    useEffect(() => {
        if (activeSingleProperty.id) {
            api.deal.getBuyerDeal(activeSingleProperty.id)
                .then((res) => {
                setDealDetail(res.data);
            });
        }
    }, [activeSingleProperty]);
    useEffect(() => {
        if (get(dealDetail, 'id', null)) {
            api.deal.getOffer(dealDetail?.id)
                .then((res) => {
                setOfferDetail(res.data.payload);
            })
                .catch(() => {
                setOfferDetail(undefined);
            });
        }
    }, [dealDetail]);
    const slideImg = (e, act, slideIndex = 0) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (imgSlide) {
            const slide = imgSlide.current;
            if (act === 'next')
                slide.slickNext();
            if (act === 'prev')
                slide.slickPrev();
            if (act === 'goTo')
                slide.slickGoTo(slideIndex);
        }
        return false;
    };
    const onOpenCard = () => {
        if (isPreMarket()) {
            const propsModal = {
                lang,
                property: activeSingleProperty,
                onClose: () => handleSetModal({ state: false }),
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
            });
        }
        else {
            history.push(`/buyer/${activeSingleProperty.id}/home`);
        }
    };
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
    };
    return (React.createElement("div", { className: "mb-3 marketCardFavorite" },
        React.createElement("div", { className: "dis-fl-col dis-fl-row-md dis-f brdRadius brdSmall brdText100 ov-h h-perc-100" },
            React.createElement("div", { className: "w-fix-md-304 pos-r h-perc-100 ov-h" },
                isPreMarket() && (React.createElement("div", { className: "pos-a-fix x-t-1 x-l-1 zIndex5" },
                    React.createElement(Tags, { lang: lang, status: "pre-market", text: "Offer", message: {
                            'pre-market': 'Pre-market',
                        } }))),
                !isPreMarket() && get(activeSingleProperty, 'photos', []).length > 1 && dealDetail ? (React.createElement("div", { className: "h-perc-100 scaleFix", 
                    /* onClick={() => onOpenCard()} */
                    onMouseEnter: () => setShowSlideData(true), onMouseLeave: () => setShowSlideData(false) },
                    React.createElement("div", null,
                        React.createElement("div", { className: `sliderControl ${showSlideData ? 'show' : ''}` },
                            React.createElement(BrixelIcon, { rounded: true, background: "white", saturation: 0, icon: "arrow-simple-left", className: "pos-a y-c zIndex2 ml-1", onClick: (e) => slideImg(e, 'prev') }),
                            React.createElement(BrixelIcon, { rounded: true, background: "white", saturation: 0, icon: "arrow-simple-right", className: "pos-a y-c x-r zIndex2 mr-1", onClick: (e) => slideImg(e, 'next') })),
                        React.createElement("ul", { className: "slick-dots pos-a x-c ta-c zIndex2 bt mb-1" }, get(activeSingleProperty, 'photos', []).slice(0, 5).map((_photo, i) => (React.createElement("li", { key: `dots${i.toString()}`, className: activeSlide === i ? 'slick-active' : '', onClick: (e) => slideImg(e, 'goTo', i) },
                            React.createElement("button", null, "1")))))),
                    React.createElement(Slider, { ref: imgSlide, ...settingSlider }, get(activeSingleProperty, 'photos', []).slice(0, 5).map((photo, index) => (React.createElement(React.Fragment, { key: `itm_${index.toString()}` }, photo.url && (React.createElement("div", { key: `itm_${index.toString()}`, className: `${isPreMarket() ? 'pre-market' : ''} ${get(activeSingleProperty, 'tags', []).join(' ')} cover h-fix-208 h-fix-sm-304 h-fix-lg-208 pos-r` },
                        React.createElement(BrixelImage, { className: "cover h-perc-100", url: photo.url, size: "M", alt: `Property Photos ${index.toString()}` }))))))))) : (React.createElement(CoverPropertyImage, { className: `${isPreMarket() ? 'pre-market' : ''} ${get(activeSingleProperty, 'tags', []).join(' ')} cover w-perc-100 h-fix-208 h-fix-sm-304 h-fix-lg-208 pos-r cur-poi`, coverPhoto: isPreMarket() ? undefined : get(activeSingleProperty, 'coverPhoto.url', undefined), propertyType: get(activeSingleProperty, 'properties.propertyType', undefined), onClick: () => onOpenCard(), size: "M" }))),
            React.createElement("div", { className: "dis-fl-col p-2 flex-1" },
                React.createElement("div", { className: "dis-fl-col-rev dis-fl-row-sm a-t jc-b" },
                    React.createElement("div", { className: "w-perc-100 w-auto-sm" },
                        React.createElement("span", { className: "fsize-300 txtText700 mb-1 ta-l" },
                            get(activeSingleProperty, 'location.zip', ''),
                            " ",
                            get(activeSingleProperty, 'location.city', ''),
                            get(activeSingleProperty, 'location.countryCode', 'CH') === 'CH' && (React.createElement(React.Fragment, null, ` (${get(activeSingleProperty, 'location.stateCode', '')})`))),
                        React.createElement("h6", { className: "cur-poi fweight-600 fSizePx18 mb-1", onClick: () => onOpenCard() }, translateTo(activeSingleProperty.title, lang)),
                        React.createElement(BrixelButtonText, { label: isPreMarket() ? translateTo('View details', lang) : translateTo('View property page', lang), rightIcon: isPreMarket() ? '' : 'link-open', bgTransparent: true, labelClass: "fsize-300", onClick: () => {
                                // @ts-ignore
                                if (get(activeSingleProperty, 'tags', []).includes('pre-market')) {
                                    onOpenCard();
                                }
                                else {
                                    window.open(`${baseByData?.pageUrl}${activeSingleProperty.stub}`, '_blank');
                                }
                            } })),
                    React.createElement("div", { className: "w-perc-100 mb-1 mb-sm-0 w-auto-sm" },
                        React.createElement("div", { className: "dis-f w-perc-100 w-auto-sm jc-b a-c" },
                            get(offerDetail, 'status', 'none') !== 'none' && get(offerDetail, 'status', null) !== 'rejected' && !isPreMarket() && (React.createElement(Tags, { lang: lang, status: get(offerDetail, 'status', ''), text: "Offer", message: {
                                    accepted: translateTo('Offer accepted', lang),
                                    pending: translateTo('Offer sent', lang),
                                    rejected: translateTo('Offer rejected', lang),
                                } })),
                            React.createElement(BrixelIcon, { isLoading: isSmallLoading[`favorite-${activeSingleProperty.id}`], className: "ml-2", color: "red", icon: !isUnFavorite ? 'favorite-fill' : 'favorite', onClick: () => onChangeFavorite() })))),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-md jc-b pt-2 mt-a flex-wrap" },
                    React.createElement("div", { className: "fsize-300 txtText700 mb-2 mb-lg-0" },
                        React.createElement("div", { className: "dis-f a-c jc-fs flex-wrap w-perc-100" },
                            React.createElement("div", { className: "bottom a-c txtText900 brdSmallRight-sm mb-1 mb-sm-0 brdText100 pr-6 mr-6" },
                                React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Price', lang)),
                                !isPreMarket() && activeSingleProperty && get(activeSingleProperty, 'price.total', 0) !== 0 && get(activeSingleProperty, 'status', null) === 'on-sale' ? (React.createElement("div", { className: "txtGreen400 dis-f a-b" },
                                    React.createElement("span", { className: "fsize-300 ff-mono notranslate" }, get(activeSingleProperty, 'price.currency', '')),
                                    React.createElement("span", { className: "fsize-500 ff-mono notranslate ml-1" }, Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))))) : (React.createElement("span", { className: "txtGreen400 fsize-400 fsize-sm-500 ff-mono" }, translateTo(convertLabel(get(activeSingleProperty, 'status', ''), 'propertyStatus'), lang)))),
                            React.createElement("div", { className: "dis-f" },
                                React.createElement("div", null,
                                    React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Rooms', lang)),
                                    React.createElement("span", { className: "ff-mono fsize-400 txtBlack dis-b pt-small-4" }, FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH')))),
                                React.createElement("div", { className: "mx-4" },
                                    React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Size', lang)),
                                    React.createElement("span", { className: "ff-mono fsize-400 txtBlack dis-b pt-small-4" },
                                        get(activeSingleProperty, 'properties.typology.livingArea.value', 0),
                                        " m2")),
                                React.createElement("div", null,
                                    React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Year built', lang)),
                                    React.createElement("span", { className: "ff-mono fsize-400 txtBlack dis-b pt-small-4" }, get(activeSingleProperty, 'properties.building.built', 0)))))),
                    offerDetail !== null && (React.createElement("div", { className: "mt-a mb-a ml-sm-a" },
                        (!offerDetail?.status || offerDetail?.status === 'rejected') && !isPreMarket() && (React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Make an offer', lang), isLoading: !get(dealDetail, 'id', false), onClick: () => history.push(`/buyer/${activeSingleProperty.id}/offerFlow/makeOffer`) })),
                        (get(offerDetail, 'status', null) === 'accepted' || get(offerDetail, 'status', null) === 'pending') && !isPreMarket() && (React.createElement(BrixelButtonSecondary, { rounded: true, label: translateTo('View offer', lang), isLoading: !get(dealDetail, 'id', false), onClick: () => history.push(`/buyer/${activeSingleProperty.id}/offer`) })))))))));
};
const mapStateToProps = (state) => ({
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    wishlistProperties: get(state, 'market.wishlistProperties.data', []),
});
const mapDispatchToProps = (dispatch) => ({
    handleSetModal: bindActionCreators(setModal, dispatch),
    handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(MarketCardFavorites);
