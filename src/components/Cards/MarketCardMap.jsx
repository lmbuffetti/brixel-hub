/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import compact from 'lodash/compact';
import pullAt from 'lodash/pullAt';
import {
  BrixelButtonIcon,
  FormatValue,
  Helpers,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { updateFavorite } from '../../actions/UserActions';
import CoverPropertyImage from '../CoverPropertyImage';
import CardImageText from '../Skeleton/CardImageText';

const MarketCardMap = (props) => {
  // PROPS
  const {
    favoritesProperties,
    handleUpdateFavorites,
    isSmallLoading,
    item,
    loggedInUser,
    onClick,
    onHover,
    skeleton,
    type,
  } = props;
  // STATE
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);
  // const [optionsOpen, setOptionsOpen] = useState(false);

  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
  useEffect(() => {
    if (!skeleton[type] && coverImgLoaded) {
      setRemoveSkeleton(true);
    }
  }, [skeleton, coverImgLoaded]);

  const checkFavorite = () => {
    const findIndex = favoritesProperties.findIndex((prop) => prop.id === item.id);
    return findIndex > -1;
  };

  // Process tags
  useEffect(() => {
    const result = [];
    if (item.tags.length > 1) {
      item.tags.forEach((tag) => {
        if (tag === 'updated') result.splice(0, 0, tag);
        if (tag === 'new') result.splice(1, 0, tag);
        if (tag === 'premium') result.splice(2, 0, tag);
        if (tag === 'pre-market') result.splice(3, 0, tag);
      });
      set(item, 'tags', pullAt(compact(result), [0, 1]));
    }
  }, [item.tags]);

  const isPreMarket = () => get(item, 'tags', []).includes('pre-market');

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
    }
  };

  const onChangeFavorite = () => {
    const data = {
      act: checkFavorite() ? 'remove' : 'add',
      id: item.id,
      property: item,
      data: {
        email: get(loggedInUser, 'email', ''),
        language: loggedInUser.lang,
      },
    };
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
                onClick={(e) => onClick(e)}
                onMouseEnter={(e) => onHover(e)}
                onMouseLeave={() => onHover(null)}
                loadedImg={(val) => setCoverImgLoaded(val)}
                className={`${isPreMarket() ? 'pre-market' : ''} cover notranslate brdRadius min-w-perc-100 min-w-fix-sm-304 h-fix-208 cur-poi`}
                coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                propertyType={get(item, 'properties.propertyType', undefined)}
              />
              {
                item.tags.length > 0 && (
                  <div className="tag-container pos-a dis-fl-row a-c jc-b">
                    {
                      item.tags.map((tag, i) => (
                        <p
                          key={i.toString()}
                          className={`type-tag pos-r non-favorite fsize-200 fweight-500 txtWhite mr-1 bg${getColor(tag)}`}
                        >
                          <span className="type">{getTypeText(tag)}</span>
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
                  className="notranslate fweight-700 mb-small-4 fsize-400 txtDark700 w-perc-100 max-w-fix-400 cur-poi"
                  onClick={(e) => onClick(e)}
                  onMouseEnter={(e) => onHover(e)}
                  onMouseLeave={() => onHover(null)}
                >
                  {get(item, 'title', '')}
                </h6>
                <span className="notranslate fsize-300 txtDark700">
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
                  icon={checkFavorite() ? 'favorite-fill' : 'favorite'}
                  onClick={() => onChangeFavorite()}
                  isLoading={isSmallLoading === `favorite-${item.id}`}
                />
                {/*
                <BrixelButtonIcon
                  icon="options-vertical"
                  className="ml-a"
                  theme="dark"
                  ghost
                  onClick={() => {
                    setOptionsOpen(!optionsOpen);
                  }}
                />
                {/*
                  optionsOpen && (
                    <BrixelDropdownMini
                      rightAligned
                      topOffset={48}
                      links={
                        [
                          {
                            label: 'Action 1',
                            clickFunc: () => { console.log('action 1'); },
                            className: 'txtPrimary400',
                          },
                          {
                            label: 'Action 2',
                            clickFunc: () => { console.log('action 2'); },
                            className: 'txtPrimary400',
                          },
                          {
                            label: 'Action 3',
                            clickFunc: () => { console.log('action 3'); },
                            className: 'txtPrimary400',
                          },
                        ]
                      }
                    />
                  )
                */}
              </div>
            </div>
            <div className="mid dis-fl-row a-c fsize-300 txtDark400 py-2">
              <div>
                <span>
                  {get(item, 'properties.propertyType', '')}
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
                  get(item, 'properties.typology.bedrooms') > 0 && (
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
                get(item, 'price.total', 0) !== 0 && get(item, 'status', null) === 'on-sale' ? (
                  <>
                    <span className="notranslate fsize-400 txtDark700 fweight-600">{get(item, 'price.currency', '')} &nbsp; </span>
                    <span className="notranslate fsize-400 txtDark700 fweight-600">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
                  </>
                ) : (
                  <span className="txtGreen400 fsize-300 fweight-500">
                    {get(item, 'status', null) === 'sold' ? 'Sold' : 'On Request'}
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

MarketCardMap.propTypes = {
  favoritesProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleUpdateFavorites: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCardMap.defaultProps = {
  type: '',
};

const mapStateToProps = (state) => ({
  favoritesProperties: get(state, 'market.favoritesProperties.data', []),
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
