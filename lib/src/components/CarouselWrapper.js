import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import Slider from 'react-slick';
import { BrixelButtonIcon, BrixelButtonText } from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setWindowDimensions } from '../actions/CommonActions';
import MarketCard from './Cards/MarketCard';
const CarouselWrapper = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { className, companyListings, items, lang, layout, loggedInUser, onSetActiveProperty = () => '', ownerProperties = () => '', setPropertyId, slideToGo = 0, subtitle, theme, title, total = 0, type, windowDimensions, } = props;
    const [activeSlide, setActiveSlide] = useState(0);
    const [preventClick, setPreventClick] = useState(false);
    const sliderInstance = useRef();
    let slideToShow = 1;
    if (windowDimensions.width > 767)
        slideToShow = type === 'own' ? 1 : 2;
    if (windowDimensions.width > 1024)
        slideToShow = type === 'own' ? 1 : 3;
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
        beforeChange: (_prev, next) => {
            setActiveSlide(next);
        },
    }), [type, windowDimensions.width]);
    const moveSlide = (action) => {
        const slider = sliderInstance.current;
        if (slider) {
            if (action === 'next')
                slider.slickNext();
            else
                slider.slickPrev();
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
        if (items && layout === 'singleOwnCard') {
            const activeCompanyId = items[activeSlide].company;
            if (activeCompanyId && (activeSlide > 0 || slideToGo < 0)) {
                if (setPropertyId)
                    setPropertyId(get(items[activeSlide], 'id', ''));
            }
        }
    }, [activeSlide]);
    const getCompanyStub = () => {
        // TODO: Company management for "Add new" property flow
        if (get(ownerProperties, 'total', null) === 0)
            return get(loggedInUser, 'company.stub', '');
        else {
            const company = companyListings.find((cmp) => cmp.id === get(ownerProperties, 'data[0].company', ''));
            if (company)
                return company.stub;
        }
    };
    if (layout === 'singleOwnCard') {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: `${className} carousel-wrapper pos-r` },
                React.createElement("div", { className: "carouselContainer pos-r max-w-fix-768 ml-a mr-a px-2 px-md-0" },
                    React.createElement("div", { className: "py-2 px-0 pt-sm-3 pb-sm-1 px-sm-3 brdRadius brdSmall brdText50 bgWhite shadow-2dp min-h-fix-240 pos-r" },
                        React.createElement(Slider, { ref: sliderInstance, ...settingSlider() },
                            !items && numCard.map((card, i) => (React.createElement(MarketCard, { layout: layout, type: type, key: `nmCrd_${i.toString()}`, item: card, preventClick: preventClick, onSetActiveProperty: (id) => onSetActiveProperty ? onSetActiveProperty(id) : '', lang: lang }))),
                            items && items.length > 0 && items.map((item, i) => (React.createElement(MarketCard, { lang: lang, layout: layout, type: type, key: `mkCrd_${i.toString()}`, item: item, preventClick: preventClick, onSetActiveProperty: (id) => onSetActiveProperty ? onSetActiveProperty(id) : '' })))),
                        items && items.length > 1 && (React.createElement(React.Fragment, null,
                            React.createElement(BrixelButtonIcon, { onClick: () => moveSlide('prev'), className: `txtText400 icnText400 brdText400 slick-arrow secondary small pos-a y-c ml-7-neg ${activeSlide < 1 ? 'slick-disabled' : ''}`, icon: "arrow-simple-left", theme: "text", themeSat: 300, ghost: true }),
                            React.createElement(BrixelButtonIcon, { onClick: () => moveSlide('next'), className: `mr-1 txtText400 icnText400 brdText400 slick-arrow secondary small pos-a y-c mr-7-neg x-r ${items && activeSlide >= items.length - 1 ? 'slick-disabled' : ''}`, icon: "arrow-simple-right", theme: "text", themeSat: 300, ghost: true })))),
                    React.createElement("div", { className: "mt-1 dis-fl-col-sm a-c jc-c" },
                        React.createElement("div", { className: "dis-fl-row-sm hide a-c jc-c pt-1" },
                            React.createElement(BrixelButtonText, { className: "fsize-300 show-all pos-r mr-1", label: translateTo('+ Add new', lang), theme: "blue", themeSat: 700, onClick: () => history.push(`/packageFlow/getStarted?company=${getCompanyStub()}`) }),
                            React.createElement(BrixelButtonText, { theme: "blue", themeSat: 700, className: "fsize-300 show-all pos-r", label: `<span>${translateTo('View all', lang)}</span> <span class="ml-1">(${total})</span>`, onClick: () => showAll() }))),
                    items && items.length > 1 && (React.createElement("div", { className: "dis-f a-c jc-c mt-2 hide-sm w-perc-100" },
                        React.createElement(BrixelButtonIcon, { onClick: () => moveSlide('prev'), className: `txtText400 icnText400 brdText400 slick-arrow secondary small ${activeSlide < 1 ? 'slick-disabled' : ''}`, icon: "arrow-simple-left", theme: "text", themeSat: 300, ghost: true }),
                        React.createElement("div", { className: "fsize-300 txtPrimary400 ml-3 mr-3" },
                            React.createElement("span", null, activeSlide + 1),
                            React.createElement("span", { className: "ml-small-4 mr-small-4" }, translateTo('of', lang)),
                            React.createElement("span", null, total)),
                        React.createElement(BrixelButtonIcon, { onClick: () => moveSlide('next'), className: `mr-1 txtText400 icnText400 brdText400 slick-arrow secondary small ${activeSlide >= items.length - 1 ? 'slick-disabled' : ''}`, icon: "arrow-simple-right", theme: "text", themeSat: 300, ghost: true })))))));
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: `${className} carousel-wrapper pos-r` },
            React.createElement("div", { className: `${subtitle ? '' : 'mb-3'} dis-fl-col dis-fl-row-sm a-c-sm jc-b` },
                title && (React.createElement("h4", { className: `title fweight-600 fsize-600 ${theme === 'light' ? 'txtWhite' : ''}` }, translateTo(title, lang))),
                React.createElement("div", { className: "mt-1 mt-sm-0 dis-f a-c" },
                    React.createElement(BrixelButtonText, { className: "fsize-300 show-all pos-r mr-1", label: `<span>${translateTo('Show all', lang)}</span> <span class="ml-1">(${total})</span>`, onClick: () => showAll(), theme: theme === 'light' ? 'white' : undefined, themeSat: 0 }),
                    items && items.length > slideToShow && (React.createElement(React.Fragment, null,
                        React.createElement(BrixelButtonIcon, { onClick: () => moveSlide('prev'), className: `mr-1 txtText400 icnText400 brdText400 slick-arrow secondary small ${activeSlide < 1 ? 'slick-disabled' : ''}`, icon: "arrow-simple-left", theme: "text", themeSat: 300, ghost: true }),
                        React.createElement(BrixelButtonIcon, { onClick: () => moveSlide('next'), className: `mr-1 txtText400 icnText400 brdText400 slick-arrow secondary small ${activeSlide >= items.length - 1 ? 'slick-disabled' : ''}`, icon: "arrow-simple-right", theme: "text", themeSat: 300, ghost: true }))))),
            subtitle && (React.createElement("h6", { className: `${theme === 'light' ? 'txtWhite' : ''} mb-3` }, translateTo(subtitle, lang))),
            React.createElement(Slider, { ref: sliderInstance, ...settingSlider() },
                !items && numCard.map((card, i) => (React.createElement(MarketCard, { lang: lang, type: type, key: `nmCrd_${i.toString()}`, item: card, preventClick: preventClick, onSetActiveProperty: (id) => onSetActiveProperty(id) }))),
                items && items.length > 0 && items.map((item, i) => (React.createElement(MarketCard, { lang: lang, type: type, key: `mktCrd_${i.toString()}`, item: item, preventClick: preventClick, onSetActiveProperty: (id) => onSetActiveProperty(id) })))))));
};
const mapStateToProps = (state) => ({
    companyListings: get(state, 'companies.companyListings.data', []),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    windowDimensions: get(state, 'common.windowDimensions', {}),
    ownerProperties: get(state, 'market.ownerProperties', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(CarouselWrapper);
