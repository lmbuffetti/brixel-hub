import React, { useEffect, useState } from 'react';
import { BrixelButtonIcon, FormatValue, Helpers } from '@brixel-io/brixel-components';
import compact from 'lodash/compact';
import get from 'lodash/get';
import pullAt from 'lodash/pullAt';
import set from 'lodash/set';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { updateFavorite } from '../../actions/UserActions';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';
import CardImageText from '../Skeleton/CardImageText';
import { convertLabel } from '../../utils/helpers';
const MarketCardMap = (props) => {
    // PROPS
    const { wishlistProperties, handleUpdateFavorites, isSmallLoading, item, lang, loggedInUser, onClick, onHover, skeleton, type = '', } = props;
    // STATE
    const [coverImgLoaded, setCoverImgLoaded] = useState(false);
    const [removeSkeleton, setRemoveSkeleton] = useState(false);
    const [isUnFavorite, setIsUnFavorite] = useState(false);
    const isPreMarket = () => item.tags ? item.tags.includes('pre-market') : false;
    // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
    useEffect(() => {
        if (!skeleton[type] && coverImgLoaded) {
            setRemoveSkeleton(true);
        }
    }, [skeleton, coverImgLoaded]);
    const checkFavorite = () => {
        const findIndex = wishlistProperties.findIndex((prop) => prop.id === item.id);
        return findIndex > -1;
    };
    // Process tags
    useEffect(() => {
        const result = [];
        if (get(item, 'tags', []).length > 1) {
            get(item, 'tags', []).forEach((tag) => {
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
    }, [item.tags]);
    // eslint-disable-next-line consistent-return
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
    // eslint-disable-next-line consistent-return
    const getColor = (text) => {
        switch (text) {
            case 'new': {
                return 'Green';
            }
            case 'updated': {
                return 'Yellow';
            }
            case 'premium': {
                return 'Red';
            }
            case 'pre-market': {
                return 'Primary';
            }
            default:
                return '';
        }
    };
    const onChangeFavorite = () => {
        setIsUnFavorite(!isUnFavorite);
        const data = {
            act: 'remove',
            id: item.id,
            property: item.id,
            data: {
                email: get(loggedInUser, 'email', ''),
                language: get(loggedInUser, 'lang', 'en'),
            },
        };
        if (isUnFavorite) {
            data.act = 'add';
        }
        handleUpdateFavorites(data);
    };
    return (React.createElement(React.Fragment, null,
        !removeSkeleton && (React.createElement(CardImageText, { type: "map-view" })),
        React.createElement("div", { className: `w-perc-100 pb-3 pr-lg-3 ${removeSkeleton ? '' : 'pos-a opacity0'}` },
            React.createElement("hr", { className: "lighter" })),
        React.createElement("div", { className: `market-card cardMap ov-h dis-fl-col dis-fl-row-sm brdRadius pos-r ${removeSkeleton ? '' : 'pos-a opacity0'} pr-lg-3 pb-3` },
            React.createElement(React.Fragment, null,
                React.createElement("div", { className: "" },
                    React.createElement(React.Fragment, null,
                        React.createElement(CoverPropertyImage, { onClick: () => onClick(), onMouseEnter: () => onHover(), onMouseLeave: () => onHover(null), loadedImg: (val) => setCoverImgLoaded(val), className: `${isPreMarket() ? 'pre-market' : ''} cover notranslate brdRadius min-w-perc-100 min-w-fix-sm-304 h-fix-208 cur-poi`, coverPhoto: isPreMarket() ? undefined : get(item, 'coverPhoto.url', undefined), propertyType: get(item, 'properties.propertyType', undefined), size: "M" }),
                        get(item, 'tags', []).length > 0 && (React.createElement("div", { className: "tag-container pos-a dis-fl-row a-c jc-b" }, get(item, 'tags', []).map((tag, i) => (React.createElement("p", { key: `tag_${i.toString()}`, className: `type-tag pos-r non-favorite fsize-200 fweight-500 txtWhite mr-1 bg${getColor(tag)}` },
                            React.createElement("span", { className: "type txtWhite" }, translateTo(getTypeText(tag), lang))))))))),
                React.createElement("div", { className: "info dis-fl-col pl-sm-2 pl-0 w-perc-100 mt-2 mt-sm-0" },
                    React.createElement("div", { className: "top dis-f jc-b pt-lg-0" },
                        React.createElement("div", { className: "dis-fl-col" },
                            React.createElement("h6", { className: "notranslate fweight-700 mb-small-4 fsize-400 txtText900 w-perc-100 max-w-fix-400 cur-poi", onClick: (e) => onClick(e), onMouseEnter: (e) => onHover(e), onMouseLeave: () => onHover(null) }, translateTo(get(item, 'title', ''), lang)),
                            React.createElement("span", { className: "notranslate fsize-300 txtText900" },
                                get(item, 'location.zip', ''),
                                " ",
                                get(item, 'location.city', ''),
                                get(item, 'location.countryCode', 'CH') === 'CH' && (React.createElement(React.Fragment, null, ` (${get(item, 'location.stateCode', '')})`)))),
                        React.createElement("div", { className: "dis-f notranslate" },
                            React.createElement(BrixelButtonIcon, { theme: "red", small: true, bgTransparent: true, icon: checkFavorite() && !isUnFavorite ? 'favorite-fill' : 'favorite', onClick: () => onChangeFavorite(), isLoading: isSmallLoading[`favorite-${item.id}`] }))),
                    React.createElement("div", { className: "mid dis-fl-row a-c fsize-300 txtText700 py-2" },
                        React.createElement("div", { className: '' },
                            React.createElement("span", { className: `${get(item, 'properties.propertyType', null) === 'Building land' ? '' : 'dis-ib pt-small-2'}` }, translateTo(get(item, 'properties.propertyType', ''), lang)),
                            get(item, 'properties.typology.bedrooms', 0) > 0 && (React.createElement(React.Fragment, null,
                                React.createElement("span", { className: "px-1 notranslate" }, " \u00B7 "),
                                React.createElement("span", null,
                                    React.createElement("span", { className: "notranslate" }, FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))),
                                    React.createElement("span", null, `${get(item, 'properties.typology.bedrooms', 0) ? ' Rooms' : ''}`)))),
                            get(item, 'properties.propertyType', null) === 'Building land' ? (React.createElement(React.Fragment, null,
                                get(item, 'properties.typology.lotArea.value', 0) > 0 && (React.createElement(React.Fragment, null,
                                    React.createElement("span", { className: "px-1 notranslate" }, " \u00B7 "),
                                    React.createElement("span", null, get(item, 'properties.typology.lotArea.value', 0)),
                                    React.createElement("span", { className: "ff-mono fsize-200 ml-small-4" }, "m2"))),
                                get(item, 'properties.typology.lotAreaUsable.value', 0) > 0 && (React.createElement(React.Fragment, null,
                                    React.createElement("span", { className: "px-1 notranslate" }, " \u00B7 "),
                                    React.createElement("span", null, get(item, 'properties.typology.lotAreaUsable.value', 0)),
                                    React.createElement("span", { className: "ff-mono fsize-200 ml-small-4" }, "m2"))))) :
                                React.createElement(React.Fragment, null, get(item, 'properties.typology.livingArea.value', 0) && (React.createElement(React.Fragment, null,
                                    React.createElement("span", { className: "px-1 notranslate" }, " \u00B7 "),
                                    React.createElement("span", { className: "notranslate" },
                                        React.createElement("span", { className: "notranslate" }, get(item, 'properties.typology.livingArea.value', 0)),
                                        React.createElement("span", { className: "notranslate" }, " m2"))))))),
                    React.createElement("div", { className: `bottom m-a ml-0 mb-0 dis-f a-c fsize-400 fweight-500 ${Helpers.statusColorClass(get(item, 'status', null))}` }, get(item, 'price.total', 0) !== 0 && get(item, 'status', null) === 'on-sale' && !isPreMarket() ? (React.createElement(React.Fragment, null,
                        React.createElement("span", { className: "notranslate " },
                            get(item, 'price.currency', ''),
                            " \u00A0 "),
                        React.createElement("span", { className: "notranslate " }, Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))))) : (React.createElement("span", { className: '' }, translateTo(convertLabel(get(item, 'status', null), 'propertyStatus'), lang)))))))));
};
const mapStateToProps = (state) => ({
    wishlistProperties: get(state, 'market.wishlistProperties.data', []),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    skeleton: get(state, 'common.skeleton', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(MarketCardMap);
