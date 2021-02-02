/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  BrixelButtonIcon, BrixelDropdownMini,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import ProgressRing from './ProgressRing';
import CoverPropertyImage from './CoverPropertyImage';
import CardImageText from './Skeleton/CardImageText';

const MarketCardMap = (props) => {
  // PROPS
  const {
    favoritesProperties,
    history,
    isLoading,
    item,
    onClick,
    skeleton,
    type,
  } = props;
  // STATE
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
  useEffect(() => {
    if (!skeleton[type] && coverImgLoaded) {
      setRemoveSkeleton(true);
    }
  }, [skeleton, coverImgLoaded]);

  const openCard = (e) => {
    if (e) e.preventDefault();
    if (type === 'own') history.push(`/${item.id}/rewards`);
    if (type === 'favorite') history.push(`/buyer/property/${item.id}`);
    // TODO: Estimation opens overlay
    // TODO: Pre-Market opens overlay
    else window.open(`${baseByData.pageUrl}${item.stub}`, '_blank');
  };

  const checkFavorite = () => {
    const findIndex = favoritesProperties.findIndex((prop) => prop.id === item.id);
    return findIndex > -1;
  };

  return (
    <>
      {
        !removeSkeleton && (
          <CardImageText type={get(skeleton, '[type]', '')} />
        )
      }
      <div
        className={`market-card ov-h ${type === 'own' ? 'dis-f-sm' : 'dis-fl-col'} brdRadius px-1 pos-r ${removeSkeleton ? '' : 'pos-a opacity0'}`}
      >
        <>
          <CoverPropertyImage
            onClick={(e) => onClick(e)}
            loadedImg={(val) => setCoverImgLoaded(val)}
            className="cover brdRadius mb-1 h-fix-200 w-perc-100 w-fix-sm-320 cur-poi"
            coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
            propertyType={get(item, 'properties.propertyType', undefined)}
          />
          <div className="info dis-fl-col pl-sm-2 pl-0 w-perc-100">
            <div className="top dis-f a-t jc-b mb-3">
              <div className=" dis-fl-col">
                <h6
                  className="fweight-700 txtDark700 ellipsis one w-perc-100 max-w-fix-400 cur-poi"
                  onClick={(e) => onClick(e)}
                >
                  {get(item, 'title', '')}
                </h6>
                <span className="fsize-300 txtDark700">{get(item, 'location.address', '')}</span>
              </div>
              <div className="dis-f">
                <BrixelButtonIcon
                  ghost
                  theme="red"
                  icon={checkFavorite() ? 'favorite-fill' : 'favorite'}
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
            <div className="mid dis-fl-row a-c fsize-300 txtDark400 mb-3">
              <span>{get(item, 'properties.propertyType', '')} </span> <span className="px-1"> &middot; </span>
              <span><span>{get(item, 'properties.typology.bedrooms', 0)}</span> <span>bedrooms</span></span> <span className="px-1"> &middot; </span>
              <span><span>{get(item, 'properties.typology.livingArea.value', 0)}</span><span>m2</span></span>
            </div>
            <div className="bottom dis-f a-c fsize-300 py-1">
              <p className="fweight-700 fsize-500">{get(item, 'price.total', 0)}</p>
              <span className="fsize-200 ml-1">{get(item, 'price.currency', 'CHF')}</span>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

MarketCardMap.propTypes = {
  favoritesProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCardMap.defaultProps = {
  isLoading: true,
  type: '',
};

const mapStateToProps = (state) => ({
  favoritesProperties: get(state, 'market.favoritesProperties', []),
  skeleton: get(state, 'common.skeleton', {}),
});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCardMap);
