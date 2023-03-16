import React, {useEffect, useState} from 'react';
import {BrixelButtonIcon, FormatValue, Helpers} from '@brixel/brixel-components';
import compact from 'lodash/compact';
import get from 'lodash/get';
import pullAt from 'lodash/pullAt';
import set from 'lodash/set';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {updateFavorite} from '../../actions/UserActions';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';
import CardImageText from '../Skeleton/CardImageText';
import type {MarketCardMapType} from '../../@types/components/Cards/MarketCardMap';

const MarketCardMap = (props: MarketCardMapType) => {
  // PROPS
  const {
    wishlistProperties,
    handleUpdateFavorites,
    isSmallLoading,
    item,
    lang,
    loggedInUser,
    onClick,
    onHover,
    skeleton,
    type = '',
  } = props;
  // STATE
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);
  const [isUnFavorite, setIsUnFavorite] = useState(false);

  const isPreMarket: () => boolean = () => item.tags ? item.tags.includes('pre-market') : false;

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
    const result: string[] = [];
    if (get(item, 'tags', []).length > 1) {
      get(item, 'tags', []).forEach((tag) => {
        if (tag === 'updated') result.splice(0, 0, tag);
        if (tag === 'new') result.splice(1, 0, tag);
        if (tag === 'premium') result.splice(2, 0, tag);
        if (tag === 'pre-market') result.splice(3, 0, tag);
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

  return (
    <>
      {
        !removeSkeleton && (
          <CardImageText type="map-view" />
        )
      }
      <div className={`w-perc-100 pb-3 pr-lg-3 ${removeSkeleton ? '' : 'pos-a opacity0'}`}>
        <hr className="lighter" />
      </div>
      <div
        className={`market-card cardMap ov-h dis-fl-col dis-fl-row-sm brdRadius pos-r ${removeSkeleton ? '' : 'pos-a opacity0'} pr-lg-3 pb-3`}
      >
        <>
          <div className="">
            <>
              <CoverPropertyImage
                onClick={() => onClick()}
                onMouseEnter={(e) => onHover(e)}
                onMouseLeave={() => onHover(null)}
                loadedImg={(val) => setCoverImgLoaded(val)}
                className={`${isPreMarket() ? 'pre-market' : ''} cover notranslate brdRadius min-w-perc-100 min-w-fix-sm-304 h-fix-208 cur-poi`}
                coverPhoto={isPreMarket() ? undefined : get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                propertyType={get(item, 'properties.propertyType', undefined)}
              />
              {
                get(item, 'tags', []).length > 0 && (
                  <div className="tag-container pos-a dis-fl-row a-c jc-b">
                    {
                      get(item, 'tags', []).map((tag, i) => (
                        <p
                          key={`tag_${i.toString()}`}
                          className={`type-tag pos-r non-favorite fsize-200 fweight-500 txtWhite mr-1 bg${getColor(tag)}`}
                        >
                          <span className="type txtWhite">{translateTo(getTypeText(tag), lang)}</span>
                        </p>
                      ))
                    }
                  </div>
                )
              }
            </>
          </div>
          <div className="info dis-fl-col pl-sm-2 pl-0 w-perc-100 mt-2 mt-sm-0">
            <div className="top dis-f jc-b pt-lg-0">
              <div className="dis-fl-col">
                <h6
                  className="notranslate fweight-700 mb-small-4 fsize-400 txtText900 w-perc-100 max-w-fix-400 cur-poi"
                  onClick={(e) => onClick(e)}
                  onMouseEnter={(e) => onHover(e)}
                  onMouseLeave={() => onHover(null)}
                >
                  {translateTo(get(item, 'title', ''), lang)}
                </h6>
                <span className="notranslate fsize-300 txtText900">
                  {get(item, 'location.zip', '')} {get(item, 'location.city', '')}
                  {
                    get(item, 'location.countryCode', 'CH') === 'CH' && (
                      <>
                        {` (${get(item, 'location.stateCode', '')})`}
                      </>
                    )
                  }
                </span>
              </div>
              <div className="dis-f notranslate">
                <BrixelButtonIcon
                  theme="red"
                  small
                  ghost
                  icon={checkFavorite() && !isUnFavorite ? 'favorite-fill' : 'favorite'}
                  onClick={() => onChangeFavorite()}
                  isLoading={isSmallLoading[`favorite-${item.id}`]}
                />
              </div>
            </div>
            <div className="mid dis-fl-row a-c fsize-300 txtText700 py-2">
              <div>
                <span>
                  {translateTo(get(item, 'properties.propertyType', ''), lang)}
                </span>
                <span className="px-1 notranslate"> &middot; </span>
                <span>
                  <span className="notranslate">
                    {FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))}
                  </span>
                  <span>
                    {get(item, 'location.countryCode', 'CH') === 'PT' ? '' : `${get(item, 'properties.typology.bedrooms', 0) ? ' Rooms' : ''}`}
                  </span>
                </span>
                {
                  get(item, 'properties.typology.bedrooms', 0) > 0 && (
                    <span className="px-1 notranslate"> &middot; </span>
                  )
                }
                {
                  get(item, 'properties.typology.livingArea.value', 0) && (
                    <span className="notranslate">
                      <span className="notranslate">
                        {get(item, 'properties.typology.livingArea.value', 0)}
                      </span>
                      <span className="notranslate"> m2</span>
                    </span>
                  )
                }
              </div>
            </div>
            <div className="bottom m-a ml-0 mb-0 dis-f a-c fsize-400">
              {
                get(item, 'price.total', 0) !== 0 && get(item, 'status', null) === 'on-sale' && !isPreMarket() ? (
                  <>
                    <span className="notranslate fsize-400 txtText900 fweight-600">{get(item, 'price.currency', '')} &nbsp; </span>
                    <span className="notranslate fsize-400 txtText900 fweight-600">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
                  </>
                ) : (
                  <span className="txtGreen400 fsize-300 fweight-500">
                    {translateTo(get(item, 'status', null) === 'sold' ? 'Sold' : 'On Request', lang)}
                  </span>
                )
              }
            </div>
          </div>
        </>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  wishlistProperties: get(state, 'market.wishlistProperties.data', []),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  skeleton: get(state, 'common.skeleton', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCardMap);
