import React, { useEffect, useRef, useState } from 'react';
import { BrixelButtonPrimary, BrixelButtonSecondary, BrixelImage, BrixelIcon, FormatValue, Helpers, ProgressRing, } from '@brixel-io/brixel-components';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { BrixelMap } from '@brixel-io/brixel-components/dist/map';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
import get from 'lodash/get';
import has from 'lodash/has';
import orderBy from 'lodash/orderBy';
import pullAt from 'lodash/pullAt';
import set from 'lodash/set';
import { connect } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { bindActionCreators, compose } from 'redux';
import { setModal, setSplashType } from '../../actions/CommonActions';
import { generateEstimation } from '../../actions/EstimationActions';
import { getEstimation, getPackageProperty, setActiveMarketOverlayProperty, setActiveMarketOverlayPropertyLists, setActiveSingleProperty, setEstimation, } from '../../actions/PropertyActions';
import { addNotInterested, updateFavorite } from '../../actions/UserActions';
import api from '../../controllers/api/config';
import testdrive from '../../images/Market/testDriveSell.svg';
import ModalPropertyCard from '../../Pages/Market/Buyer/ModalPropertyCard';
import NotInterestedConfirmModal from '../../Pages/Market/Buyer/NotInterestedConfirmModal';
import { calcPercentageProEstimation, completedBestimate, convertLabel, getCookie, setCookie } from '../../utils/helpers';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';
import CardImageText from '../Skeleton/CardImageText';
const MarketCard = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { companyDetail = {}, favoritesProperties, handleGenerateBestimate, handleGetEstimation, handleGetPackageProperty, handleSetModal, handleMarkNotInterested, handleUpdateFavorites, index = -1, isSmallLoading, item, lang, layout, loggedInUser, onSetActiveProperty = () => '', preventClick = false, setMarketOverlayProperty, setPropertyEstimation, setSplashScreen, skeleton, type = '', wishlistProperties, } = props;
    // STATE
    const [isShowLocationCard, setIsShowLocationCard] = useState(false);
    const [coverImgLoaded, setCoverImgLoaded] = useState(false);
    const [removeSkeleton, setRemoveSkeleton] = useState(false);
    const [isFullVisitble, setIsFullVisitble] = useState(false);
    const [propertyServicePacakges, setPropertyServicePacakge] = useState();
    const [activeSlide, setActiveSlide] = useState(0);
    const [showSlideData, setShowSlideData] = useState(false);
    const checkTag = get(item, 'tags', []);
    const settingSlider = {
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerPadding: '8px',
        arrows: false,
        dots: false,
        beforeChange: (_oldIndex, newIndex) => {
            setActiveSlide(newIndex);
        },
    };
    const imgSlide = useRef();
    // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
    useEffect(() => {
        setRemoveSkeleton(true);
    }, [skeleton, coverImgLoaded]);
    useEffect(() => {
        if (item && (checkTag.includes('pre-market') || item.hideAddress)) {
            setIsFullVisitble(false);
        }
        else {
            setIsFullVisitble(true);
        }
        if (type === 'own' && get(item, 'id', null)) {
            api.property.packagePage(get(item, 'id', ''))
                .then((res) => setPropertyServicePacakge(res.data));
        }
    }, [get(item, 'id', null)]);
    const isPreMarket = () => item ? checkTag.includes('pre-market') : false;
    // Process tags
    useEffect(() => {
        const result = [];
        if (item && get(item, 'tags', []).length > 1) {
            item.tags.forEach((tag) => {
                if (tag === 'updated')
                    result.splice(0, 0, tag);
                if (tag === 'new')
                    result.splice(1, 0, tag);
                if (tag === 'premium')
                    result.splice(2, 0, tag);
                if (tag === 'pre-market')
                    result.splice(3, 0, tag);
            });
            set(item, 'tags', pullAt(compact(result), [0, 1]));
        }
    }, [get(item, 'tags', [])]);
    useEffect(() => {
        if (layout === 'singleOwnCard' && type === 'own') {
            handleGetPackageProperty({ id: get(item, 'id', null), smallLoader: `loadPackage${get(item, 'id', '')}`, addToOwnerProp: true });
        }
    }, [layout, item]);
    const openCard = (e) => {
        if (e)
            e.preventDefault();
        if (!preventClick) {
            if (type === 'own') {
                history.push(`/${get(item, 'id', '')}/home`, { state: { section: 'Market' } });
            }
            else if (type === 'preMarket' || checkTag.includes('pre-market') ||
                ((type === 'premium' || checkTag.includes('premium') ||
                    type === 'new' || checkTag.includes('new')) && type !== 'favorite' && type !== 'wishlist' && !history.location.pathname.includes('sell'))) {
                window.open(`${baseByData?.pageUrl}${get(item, 'stub', '')}`, '_blank');
            }
            else if (type === 'favorite' || type === 'wishlist') {
                history.push(`/buyer/${get(item, 'id', '')}/home`, { state: { section: 'Market' } });
            }
            else
                window.open(`${baseByData?.pageUrl}${get(item, 'stub', '')}`, '_blank');
            // TODO: Estimation opens overlay
        }
    };
    const openBestimateOverlay = (e, location, estim, page, action) => {
        if (e)
            e.preventDefault();
        onSetActiveProperty(page.id);
        setMarketOverlayProperty(page);
        if (location.countryCode !== 'CH') {
            setCookie('brixelMarketBestimate', false);
            setSplashScreen('bestimateTeaser');
        }
        if (location.countryCode === 'CH') {
            if (action === 'new') {
                setCookie('brixelMarketBestimate', false);
                setSplashScreen('bestimateTeaser');
            }
            else {
                if (!has(estim, 'result')) {
                    const payload = {
                        reloadOnwProperties: true,
                        type: 'market',
                        id: get(item, 'id', ''),
                    };
                    handleGetEstimation(payload);
                }
                else if (has(estim, 'result') && !has(estim, 'result.value')) {
                    handleGenerateBestimate(estim.id);
                }
                setCookie('brixelMarketBestimate', false);
                setSplashScreen('bestimateResult');
                setPropertyEstimation(estim);
            }
        }
    };
    const selectActiveServicePackage = () => {
        // TODO check servicePackageType error
        const basicPackage = undefined;
        if (propertyServicePacakges && propertyServicePacakges.length > 0) {
            const activeSinglePropertyPackage = cloneDeep(propertyServicePacakges);
            if (activeSinglePropertyPackage.length > 0) {
                const sortedPackage = orderBy(activeSinglePropertyPackage, ['price.total'], ['desc']);
                const getActivePackage = sortedPackage.find((pkg) => pkg.started);
                if (getActivePackage && get(getActivePackage, 'servicePackage', null)) {
                    return getActivePackage.servicePackage;
                }
                if (get(sortedPackage[0], 'servicePackage', null)) {
                    return sortedPackage[0].servicePackage;
                }
            }
        }
        return basicPackage;
    };
    const checkFavorite = () => {
        let findIndex = favoritesProperties.findIndex((prop) => prop.id === get(item, 'id', null));
        if (findIndex < 0)
            findIndex = wishlistProperties.findIndex((prop) => prop.id === get(item, 'id', null));
        return findIndex > -1;
    };
    const saveFavorite = (action) => {
        if (item) {
            const data = {
                act: action,
                id: get(item, 'id', ''),
                property: item,
                reloadProperties: true,
                data: {
                    email: get(loggedInUser, 'email', ''),
                    language: loggedInUser.language,
                },
            };
            handleUpdateFavorites(data);
            handleSetModal({ state: false });
        }
    };
    const onRemoveProperty = () => {
        if (item) {
            const isHideModal = getCookie('brixelHideNotInterested');
            if (isHideModal === true || isHideModal === 'true') {
                handleMarkNotInterested({ id: item.id, reloadBuyerProperties: true });
                handleSetModal({ state: false });
            }
            else {
                handleSetModal({
                    state: true,
                    component: React.createElement(NotInterestedConfirmModal, {
                        lang,
                        id: item.id,
                        onClick: () => handleMarkNotInterested({ id: item.id, reloadBuyerProperties: true }),
                    }),
                    small: true,
                    layout: 'large',
                    bodyClassColor: 'dis-fl-col',
                    bodyInnerClass: 'h-perc-100 dis-fl-col flex-1',
                });
            }
        }
    };
    const onOpenCard = () => {
        if (item && item.tags.includes('pre-market')) {
            const propsModal = {
                lang,
                property: item,
                onRemoveProperty: () => onRemoveProperty(),
                saveFavorite: (act) => saveFavorite(act),
                onClose: () => handleSetModal({ state: false }),
                isFavorite: checkFavorite(),
            };
            handleSetModal({
                hideHeader: true,
                state: true,
                component: React.createElement(ModalPropertyCard, propsModal),
                small: true,
                layout: 'xxlarge',
                bodyClassColor: 'white p-0',
                hideClose: true,
            });
        }
        else {
            window.open(`${baseByData?.pageUrl}${get(item, 'stub', '')}`, '_blank');
        }
    };
    const getTypeText = (text) => {
        switch (text) {
            case 'new': {
                return 'New';
            }
            case 'updated': {
                return 'Updated';
            }
            case 'premium': {
                return 'Premium';
            }
            case 'pre-market': {
                return 'Pre-market';
            }
            default:
                return '';
        }
    };
    const getColor = (text) => {
        switch (text) {
            case 'new': {
                return 'Blue100';
            }
            case 'updated': {
                return 'Green50';
            }
            case 'premium': {
                return 'Red';
            }
            case 'pre-market': {
                return 'Blue100';
            }
            default:
        }
    };
    const iconTag = (text) => {
        switch (text) {
            case 'new':
                return 'star-new';
            case 'updated':
                return 'update-property';
            default:
                return '';
        }
    };
    const textColor = (text) => {
        switch (text) {
            case 'new': {
                return 'Blue700';
            }
            case 'updated': {
                return 'Green400';
            }
            case 'premium': {
                return 'White';
            }
            case 'pre-market': {
                return 'Blue700';
            }
            default:
        }
    };
    const slideImg = (e, act, slideIndex = 0) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (imgSlide) {
            const slide = imgSlide.current;
            if (act === 'next' && slide)
                slide.slickNext();
            if (act === 'prev' && slide)
                slide.slickPrev();
            if (act === 'goTo' && slide)
                slide.slickGoTo(slideIndex);
        }
        return false;
    };
    return (React.createElement(React.Fragment, null,
        (!removeSkeleton || !item) && (React.createElement(CardImageText, { type: type })),
        index === 0 && (React.createElement(React.Fragment, null, propertyServicePacakges ? (React.createElement(React.Fragment, null, get(selectActiveServicePackage(), 'type', null) === 'basic' && (React.createElement("div", { className: "w-perc-100 dis-f bgBlue50 brdRadiusSmall px-2 pl-md-0 pr-md-6 mb-2 mb-sm-3 cur-poi", onClick: () => history.push(`/${get(item, 'id', '')}/trialRequest?url=/sell`) },
            React.createElement("div", { className: "hide dis-b-md" },
                React.createElement("img", { width: "176", height: "158", src: testdrive, alt: "testdrive" })),
            React.createElement("div", { className: "ml-md-5" },
                React.createElement("h3", { className: "fsize-500 fsize-md-700 fweight-600 pt-2" }, translateTo('Test drive our service. No strings attached.', lang)),
                React.createElement("h5", { className: "fweight-400 fsize-300 fsize-md-400 mt-1 mb-1 mb-sm-3 txtBlue700" }, companyDetail && get(companyDetail, 'meta.teaserPackage.price', 0) > 0 ? (React.createElement(React.Fragment, null,
                    React.createElement("span", null, translateTo('Get the full Brixel experience worth', lang)),
                    React.createElement("span", { className: "ml-small-4" },
                        get(companyDetail, 'meta.teaserPackage.currency', ''),
                        " ",
                        Helpers.formatNumberValue(get(companyDetail, 'meta.teaserPackage.price', 0), get(companyDetail, 'meta.teaserPackage.currency', '')),
                        "."))) : (React.createElement("span", null, translateTo('Get the full Brixel experience', lang)))),
                React.createElement("div", null,
                    React.createElement("ul", { className: "checked markerDot mt-1 mt-md-4 txtText900 dis-fl-row-sm fsize-400 mb-2 hide" },
                        React.createElement("li", null, translateTo('Personal consultation', lang)),
                        React.createElement("li", { className: "pl-sm-2", dangerouslySetInnerHTML: { __html: translateTo('Free 3D tour &amp; HD photos', lang) } }),
                        React.createElement("li", { className: "pl-sm-2" }, translateTo('Full estimation by an expert', lang))))))))) : (React.createElement("div", { className: "w-perc-100 ov-h brdRadius skeletonBg h-fix-md-152 mb-4" },
            React.createElement("div", { className: "w-fix-216 skeletonBgInner hide dis-b-md" }),
            React.createElement("div", { className: "ml-md-4 ml-2 h-perc-100 dis-fl-col w-perc-100 py-2" },
                React.createElement("p", { className: "h-fix-40 skeletonBgInner w-perc-60" }, " "),
                React.createElement("p", { className: "h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-30" }, " "),
                React.createElement("p", { className: "h-fix-16 mt-a-md mt-2 skeletonBgInner w-perc-50" }, " ")))))),
        React.createElement("div", { className: `market-card ov-hs h-perc-100 pos-r ${removeSkeleton && item ? '' : 'pos-a opacity0'} ` },
            React.createElement("div", { className: `${type === 'own' ? 'dis-f-sm' : 'dis-fl-col'} ${layout === 'singleOwnCard' ? 'px-0' : 'px-1'}` }, type === 'own' ? (React.createElement(React.Fragment, null,
                React.createElement(CoverPropertyImage, { loadedImg: (val) => setCoverImgLoaded(val), className: `${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover w-perc-100 ${layout === 'singleOwnCard' ? 'w-fix-sm-184 h-fix-184 mb-sm-0' : 'w-fix-sm-216 h-fix-216'}`, coverPhoto: isPreMarket() ? undefined : get(item, 'coverPhoto.url', undefined), propertyType: get(item, 'properties.propertyType', undefined), onClick: () => openCard(null), size: "S" }),
                get(item, 'tags', []).length > 0 && layout !== 'singleOwnCard' && (React.createElement("div", { className: "tag-container pos-a dis-fl-row a-c jc-b" }, get(item, 'tags', []).filter((tag) => tag !== 'new').map((tag, i) => (React.createElement("p", { key: `itm_${i.toString()}`, className: `type-tag pos-r non-favorite fsize-200 fweight-500 txtWhite mr-1 bg${getColor(tag)}`, onClick: () => tag === 'pre-market' && history.push(`/${get(item, 'id', '')}/marketing/portals`) },
                    React.createElement("span", { className: "type txtWhite" }, translateTo(getTypeText(tag), lang))))))),
                React.createElement("div", { className: "info dis-fl-col pl-sm-4 pl-0 w-perc-100 jc-b" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "top dis-fl-col cur-poi", onClick: (e) => openCard(e) },
                            React.createElement("h6", { className: "fweight-600 fsize-500 fsize-sm-600 mb-small-4 txtText900 ellipsis two w-perc-100 ta-l mt-2 mt-sm-0 mb-2 notranslate" }, translateTo(get(item, 'title', ''), lang)),
                            React.createElement("div", null,
                                React.createElement("span", { className: "fsize-300 txtText700 mb-1 ta-l brdSmallRight brdText200 mr-2 pr-2 dis-ib notranslate" },
                                    get(item, 'location.zip', ''),
                                    " ",
                                    get(item, 'location.city', ''),
                                    get(item, 'location.countryCode', 'CH') === 'CH' && (React.createElement(React.Fragment, null, ` (${get(item, 'location.stateCode', '')})`))),
                                React.createElement("span", { className: "fsize-300 txtText700 mb-1 ta-l brdSmallRight mr-2 pr-2 brdText200 dis-ib" }, translateTo(get(item, 'properties.propertyType', ''), lang)),
                                React.createElement("span", { className: "fsize-300 txtText700 mb-1 ta-l brdSmallRight mr-2 pr-2  brdText200 dis-ib notranslate" }, FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))),
                                get(item, 'properties.typology.livingArea.value', 0) > 0 && (React.createElement("span", { className: "dis-ib notranslate" },
                                    React.createElement("span", { className: "fsize-300 txtText700" }, get(item, 'properties.typology.livingArea.value', 0)),
                                    React.createElement("span", { className: "fsize-300 txtText700" }, " m2")))))),
                    React.createElement("div", { className: "" }, item && get(item, 'price.total', 0) > 0 ? (React.createElement("div", { className: "dis-fl-col mt-2" },
                        React.createElement("div", { className: "dis-f a-c" },
                            React.createElement(BrixelIcon, { background: "blue", saturation: 100, color: "blue", saturationTxt: 700, padding: "p-small-12", icon: "price", rounded: true, className: "mr-0", iconSize: "large" }),
                            React.createElement("div", { className: "ml-2 dis-fl-col" },
                                React.createElement("span", { className: "txtText400 fsize-300" }, translateTo('Your Price', lang)),
                                React.createElement(Link, { to: `/${get(item, 'id', '')}/property/price`, className: "txtBlue700 fweight-600" },
                                    React.createElement("span", null, get(item, 'price.currency', 0)),
                                    React.createElement("span", { className: "ml-1" }, Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', 'EUR')))))))) : (React.createElement("div", { className: "dis-f pt-sm-2 a-t pt-3 pt-sm-0" },
                        React.createElement(BrixelIcon, { className: "dis-b-sm hide mr-2", background: "blue", saturation: 100, color: "blue", saturationTxt: 700, padding: "p-small-12", icon: "chart", rounded: true, iconSize: "large" }),
                        React.createElement("div", { className: "dis-fl-col" },
                            React.createElement("span", { className: "txtText400 fsize-300" }, translateTo('Your Bestimate', lang)),
                            ((get(item, 'estimation.status', null) === 'pending' && completedBestimate(item)) || (get(item, 'properties.propertyType', null) === 'Commercial' || get(item, 'properties.propertyType', null) === 'Building land')) ? (React.createElement("span", { className: "txtBlue700 fweight-600" }, translateTo('Pending', lang))) : (React.createElement(React.Fragment, null, get(item, 'estimation.status', null) !== 'processed' && (React.createElement(Link, { to: `/${get(item, 'id', '')}/singleFlow/achievement/bestimate/step1?url=/sell`, className: "txtBlue700 fweight-600" }, translateTo('Get Estimation', lang))))),
                            get(item, 'estimation.status', null) === 'processed' && (get(item, 'properties.propertyType', null) === 'House' || get(item, 'properties.propertyType', null) === 'Apartment') && (React.createElement("div", { onClick: (e) => openBestimateOverlay(e, get(item, 'location', {}), get(item, 'estimation', {}), item, 'exists'), className: "txtBlue700 no-state fweight-600" },
                                get(item, 'estimation.result.currency', ''),
                                " ",
                                Helpers.formatNumberValue(get(item, 'estimation.result.higherValue', 0), get(item, 'estimation.currency', ''))))),
                        (get(item, 'properties.propertyType', null) === 'House' || get(item, 'properties.propertyType', null) === 'Apartment') && (React.createElement("div", { onClick: () => window.location.assign(`/${get(item, 'id', '')}/property/price/proEstimation`), className: "dis-fl-row a-c ml-4 brdSmallLeft brdText200 pl-4" },
                            React.createElement("div", { className: "hide dis-fl-row-sm" },
                                React.createElement("div", { className: "pos-r h-fix-48 w-fix-48" },
                                    React.createElement(ProgressRing, { customIcon: get(item, 'proEstimation.value', 0) <= 0 && calcPercentageProEstimation('', item).realPerc === 100 ? 'hourglass' : undefined, iconColor: {
                                            color: 'primary',
                                            sat: 400,
                                        }, progress: calcPercentageProEstimation('', item).realPerc, size: 48, strokeWidth: 10, circleOneStroke: "#D7F0F1", circleTwoStroke: calcPercentageProEstimation('', item).realPerc === 100 ? '#218B80' : '#004D71', showIcon: false, showIconComplete: calcPercentageProEstimation('', item).realPerc === 100 }))),
                            React.createElement("div", { className: "pl-2" },
                                React.createElement("span", { className: "txtText400 fsize-300 dis-b" }, translateTo('Pro estimation', lang)),
                                React.createElement("span", { className: "txtBlue700 fweight-600 dis-b" },
                                    React.createElement("span", null,
                                        calcPercentageProEstimation('', item).realPerc,
                                        "% "),
                                    React.createElement("span", null, translateTo('complete', lang)))))))))))) : (React.createElement("div", { className: "brdSmall brdText50 brdRadius ov-h bgWhite", 
                // onClick={() => openCard()}
                onMouseEnter: () => setShowSlideData(true), onMouseLeave: () => setShowSlideData(false) },
                isShowLocationCard ? (React.createElement("div", null,
                    React.createElement(BrixelMap, { className: "w-perc-100 h-fix-216", gestureHandling: "auto", baseByData: baseByData, lang: lang, hideLocation: !isFullVisitble, externalControls: false, center: {
                            lat: get(item, 'location.latitude', 0),
                            lng: get(item, 'location.longitude', 0),
                        }, type: 'satellite', marker: item, zoom: 14 }))) : (React.createElement(React.Fragment, null, !isPreMarket() && get(item, 'photos', []).length > 1 ? (React.createElement("div", { className: "h-fix-216 pos-r" },
                    React.createElement("div", { className: `sliderControl ${showSlideData ? 'show' : ''}` },
                        React.createElement(BrixelIcon, { rounded: true, background: "white", saturation: 0, saturationTxt: 600, color: "text", icon: "arrow-simple-left", className: "pos-a y-c zIndex2 ml-1", onClick: (e) => slideImg(e, 'prev'), iconSize: "small" }),
                        React.createElement(BrixelIcon, { rounded: true, background: "white", saturation: 0, saturationTxt: 600, color: "text", icon: "arrow-simple-right", className: "pos-a y-c x-r zIndex2 mr-1", iconSize: "small", onClick: (e) => slideImg(e, 'next') })),
                    React.createElement("ul", { className: "slick-dots pos-a x-c ta-c zIndex2 bt mb-1" }, item && item.photos.slice(0, 5).map((_photo, i) => (React.createElement("li", { key: `dots${i.toString()}`, className: activeSlide === i ? 'slick-active' : '', onClick: (e) => slideImg(e, 'goTo', i) },
                        React.createElement("button", null, "1"))))),
                    React.createElement(Slider, { ref: imgSlide, ...settingSlider }, item && item.photos.slice(0, 5).map((photo, i) => (React.createElement("div", { key: `itm_${i.toString()}`, className: `${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover w-perc-100 h-fix-216 h-perc-100 pos-r` },
                        React.createElement(BrixelImage, { url: photo.url, size: "M", alt: `Photo ${i.toString()}`, className: "h-perc-100 cover w-perc-100" }))))))) : (React.createElement(CoverPropertyImage, { loadedImg: (val) => setCoverImgLoaded(val), className: `${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover w-perc-100 h-perc-100 h-fix-216 pos-r`, coverPhoto: isPreMarket() ? undefined : get(item, 'coverPhoto.url', undefined), propertyType: get(item, 'properties.propertyType', undefined), size: "M" })))),
                React.createElement("div", { className: "dis-f a-c jc-b pos-a-fix x-l-0 x-t-0 w-perc-100 p-2" },
                    React.createElement("div", { className: 'dis-f' }, get(item, 'tags', []).length > 0 && (React.createElement("div", { className: "dis-fl-row a-c jc-b" }, item && item.tags.map((tag, i) => (React.createElement("p", { key: `itmTgs_${i.toString()}`, className: `type-tag pos-r non-favorite fsize-200 fweight-500 mr-1 bg${getColor(tag)} txt${textColor(tag)} dis-f a-c brdRadiusSmall px-1 py-small-4` },
                        iconTag(tag) && (React.createElement(BrixelIcon, { iconSize: "w-fix-16", className: "mr-1", icon: iconTag(tag), color: textColor(tag), saturationTxt: 0 })),
                        React.createElement("span", { className: "type" }, translateTo(getTypeText(tag), lang)))))))),
                    React.createElement("div", { className: 'dis-f' },
                        React.createElement(BrixelIcon, { color: "green", rounded: true, background: "white", saturation: 0, icon: "location-pin-simple", onClick: () => setIsShowLocationCard(!isShowLocationCard) }),
                        React.createElement(BrixelIcon, { isLoading: isSmallLoading[`notInterested-${get(item, 'id', '')}`], className: "mx-1", color: "blue", saturationTxt: 700, rounded: true, background: "white", saturation: 0, icon: "eye-hidden", onClick: () => onRemoveProperty() }),
                        React.createElement(BrixelIcon, { isLoading: isSmallLoading[`favorite-${get(item, 'id', '')}`], rounded: true, background: "white", saturation: 0, icon: checkFavorite() ? 'favorite-fill' : 'favorite', color: "red", onClick: () => saveFavorite(checkFavorite() ? 'remove' : 'add') }))),
                React.createElement("div", { className: "info dis-fl-col jc-b" },
                    React.createElement("div", { className: "top dis-fl-col notranslate px-2 px-sm-3 pt-2 pt-sm-3" },
                        React.createElement("span", { className: "fsize-300 fsize-sm-400 txtText600 notranslate cur-poi", onClick: () => onOpenCard() },
                            get(item, 'location.zip', ''),
                            " ",
                            get(item, 'location.city', ''),
                            get(item, 'location.countryCode', 'CH') === 'CH' && (React.createElement(React.Fragment, null, ` (${get(item, 'location.stateCode', '')})`))),
                        React.createElement("span", { className: "fweight-600 fsize-500 txtText900 ellipsis one notranslate cur-poi", onClick: () => onOpenCard() }, get(item, 'title', ''))),
                    React.createElement("div", { className: "bottom a-c txtText900 px-2 px-sm-3 my-1 my-sm-2" },
                        React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Price', lang)),
                        !isPreMarket() && item && get(item, 'price.total', 0) !== 0 && get(item, 'status', null) === 'on-sale' ? (React.createElement("div", { className: "txtGreen400 dis-f a-b" },
                            React.createElement("span", { className: "fsize-300 ff-mono notranslate" }, get(item, 'price.currency', '')),
                            React.createElement("span", { className: "fsize-400 fsize-sm-500 ff-mono notranslate ml-1" }, Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))))) : (React.createElement("span", { className: `ff-mono fsize-400 fsize-sm-500 ${Helpers.statusColorClass(get(item, 'status', null))}` }, translateTo(convertLabel(get(item, 'status', null), 'propertyStatus'), lang)))),
                    React.createElement("div", { className: "mx-2 mx-sm-3" },
                        React.createElement("span", { className: "hr lighter" })),
                    React.createElement("div", { className: "mid dis-fl-row a-c fsize-300 px-2 px-sm-3 pt-2 txtText700 pb-2" },
                        React.createElement("div", { className: "dis-f a-c jc-b flex-wrap w-perc-100" },
                            React.createElement("div", null,
                                React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Rooms', lang)),
                                React.createElement("span", { className: "ff-mono fsize-400 txtBlack" }, FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH')))),
                            React.createElement("div", null,
                                React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Size', lang)),
                                React.createElement("span", { className: "ff-mono fsize-400 txtBlack" },
                                    get(item, 'properties.typology.livingArea.value', 0),
                                    " m2")),
                            React.createElement("div", null,
                                React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Year built', lang)),
                                React.createElement("span", { className: "ff-mono fsize-400 txtBlack" }, get(item, 'properties.building.built', 0))))))))),
            type === 'own' && (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "hr mt-3 lighter mb-1" }),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm a-c-sm jc-b-sm flex-wrap" },
                    React.createElement("div", { className: "dis-fl-col dis-fl-row-sm ta-l" },
                        React.createElement("div", { className: "dis-fl-row-sm" },
                            React.createElement("p", { className: "pl-1 fsize-300 txtText400" }, get(item, 'published', null) === true && (React.createElement("span", null, translateTo('Your property is visible on our market.', lang)))))),
                    React.createElement("div", { className: "pt-1 pt-sm-0 ml-sm-a dis-fl-col dis-fl-row-sm a-c" },
                        isSmallLoading[`loadPackage${get(item, 'id', '')}`] === false && (React.createElement("div", null,
                            React.createElement("span", null, translateTo('Your plan:', lang)),
                            React.createElement("span", { className: "ml-1 td-u cur-poi", onClick: () => history.push(`/${get(item, 'id', '')}/upgrade`) }, get(selectActiveServicePackage(), 'name', 'Basic')))),
                        React.createElement("div", { className: "dis-fl-col dis-fl-row-sm w-perc-100-sm" },
                            React.createElement(BrixelButtonSecondary, { className: "ml-sm-2 my-1 my-sm-0", rounded: true, label: translateTo('Edit', lang), onClick: () => history.push(`/${get(item, 'id', '')}/home`) }),
                            React.createElement(BrixelButtonPrimary, { className: "ml-sm-2", rounded: true, label: translateTo('Request test drive', lang), onClick: () => history.push(`/${get(item, 'id', '')}/trialRequest?url=/sell`) })))))))));
};
const mapStateToProps = (state) => ({
    allProperties: get(state, 'market.allProperties.data', []),
    companyListings: get(state, 'companies.companyListings.data', []),
    estimation: get(state, 'property.estimation', {}),
    favoritesProperties: get(state, 'market.wishlistProperties.data', []),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lastViewedProperties: get(state, 'market.lastViewedProperties.data', []),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    newProperties: get(state, 'market.newProperties.data', []),
    ownerProperties: get(state, 'market.ownerProperties.data', []),
    preMarketProperties: get(state, 'market.preMarketProperties.data', []),
    premiumProperties: get(state, 'market.premiumProperties.data', []),
    skeleton: get(state, 'common.skeleton', {}),
    windowDimensions: get(state, 'common.windowDimensions', {}),
    wishlistProperties: get(state, 'market.wishlistProperties.data', []),
});
const mapDispatchToProps = (dispatch) => ({
    handleGenerateBestimate: bindActionCreators(generateEstimation, dispatch),
    handleGetEstimation: bindActionCreators(getEstimation, dispatch),
    handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
    handleMarkNotInterested: bindActionCreators(addNotInterested, dispatch),
    handleSetActiveMarketOverlayPropertyLists: bindActionCreators(setActiveMarketOverlayPropertyLists, dispatch),
    handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
    handleSetModal: bindActionCreators(setModal, dispatch),
    handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
    setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
    setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
    setSplashScreen: bindActionCreators(setSplashType, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(MarketCard);
