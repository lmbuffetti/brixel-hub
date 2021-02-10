/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  BrixelButtonIcon, FormatValue,
  BrixelIcon, Helpers, // BrixelDropdownMini,
} from '@brixel/brixel-components';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { updateFavorite } from '../actions/UserActions';
import CoverPropertyImage from './CoverPropertyImage';
import CardImageText from './Skeleton/CardImageText';

const MarketCardMap = (props) => {
  // PROPS
  const {
    favoritesProperties,
    handleUpdateFavorites,
    isSmallLoading,
    item,
    loggedInUser,
    onClick,
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

  const onChangeFavorite = () => {
    const data = {
      act: checkFavorite() ? 'remove' : 'add',
      id: item.id,
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
          <CardImageText type={get(skeleton, '[type]', '')} />
        )
      }
      <div className={`w-perc-100 pb-3 pr-lg-3 ${removeSkeleton ? '' : 'pos-a opacity0'}`}>
        <hr className="lighter" />
      </div>
      <div
        className={`market-card ov-h dis-fl-col dis-fl-row-sm brdRadius pos-r ${removeSkeleton ? '' : 'pos-a opacity0'} pr-lg-3 pb-3`}
      >
        <>
          <div className="image-ratio w-fix-flex-sm-296">
            <CoverPropertyImage
              onClick={(e) => onClick(e)}
              loadedImg={(val) => setCoverImgLoaded(val)}
              className="cover brdRadius h-fix-204 w-perc-100 w-fix-flex-sm-296 cur-poi"
              coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
              propertyType={get(item, 'properties.propertyType', undefined)}
            />
          </div>
          <div className="info dis-fl-col pl-sm-2 pl-0 w-perc-100">
            <div className="top dis-f pt-3 jc-b pt-md-0">
              <div className="dis-fl-col">
                <h6
                  className="fweight-700 mb-small-4 fsize-400 txtDark700 w-perc-100 max-w-fix-400 cur-poi"
                  onClick={(e) => onClick(e)}
                >
                  {get(item, 'title', '')}
                </h6>
                <span className="fsize-300 txtDark700">
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
              <div className="dis-f">
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
              <span>
                {get(item, 'properties.propertyType', '')}
              </span>
              <span className="px-1"> &middot; </span>
              <span>
                <span>
                  {FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))}
                </span>
                <span>
                  {get(item, 'location.countryCode', 'CH') === 'PT' ? '' : `${get(item, 'properties.typology.bedrooms', 0) ? ' Rooms' : ''}`}
                </span>
              </span>
              {
                get(item, 'properties.typology.bedrooms', 0) && (
                  <span className="px-1"> &middot; </span>
                )
              }
              {
                get(item, 'properties.typology.livingArea.value', 0) && (
                  <span>
                    <span>
                      {get(item, 'properties.typology.livingArea.value', 0)}
                    </span>
                    <span> m2</span>
                  </span>
                )
              }
            </div>
            <div className="bottom m-a ml-0 mb-0 dis-f a-c fsize-400">
              {
                get(item, 'price.total', 0) !== 0 ? (
                  <>
                    <span className="fsize-400 txtDark700 fweight-600">{get(item, 'price.currency', '')} &nbsp; </span>
                    <span className="fsize-400 txtDark700 fweight-600">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
                  </>
                ) : (
                  <span className="txtGreen400 fsize-300 fweight-500">On Request</span>
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
  isSmallLoading: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  handleUpdateFavorites: PropTypes.func.isRequired,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCardMap.defaultProps = {
  isSmallLoading: null,
  type: '',
};

const mapStateToProps = (state) => ({
  favoritesProperties: get(state, 'market.favoritesProperties.data', []),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  skeleton: get(state, 'common.skeleton', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCardMap);
