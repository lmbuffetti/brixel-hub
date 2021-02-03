/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  Helpers, BrixelIcon,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import ProgressRing from './ProgressRing';
import CoverPropertyImage from './CoverPropertyImage';
import CardImageText from './Skeleton/CardImageText';
import { setCookie } from '../utils/helpers';
import { setSplashType } from '../actions/CommonActions';
import { setEstimation } from '../actions/PropertyActions';

const MarketCard = (props) => {
  // PROPS
  const {
    history,
    item,
    preventClick,
    skeleton,
    type,
    setSplashScreen,
    setPropertyEstimation,
  } = props;
  // STATE
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);

  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
  useEffect(() => {
    if (!skeleton[type] && coverImgLoaded) {
      setRemoveSkeleton(true);
    }
  }, [skeleton, coverImgLoaded]);

  const openCard = (e) => {
    if (e) e.preventDefault();
    if (!preventClick) {
      if (type === 'own') history.push(`/${item.id}/rewards`);
      else if (type === 'favorite') history.push(`/buyer/property/${item.id}`);
      // TODO: Estimation opens overlay
      // TODO: Pre-Market opens overlay
      else window.open(`${baseByData.pageUrl}${item.stub}`, '_blank');
    }
  };

  const openBestimateOverlay = (e, location, estimation) => {
    if (e) e.preventDefault();
    if (location.countryCode === 'PT') {
      setCookie('brixelMarketBestimate', false);
      setSplashScreen('bestimateTeaser');
    }
    if (location.countryCode === 'CH') {
      setCookie('brixelMarketBestimate', false);
      setSplashScreen('bestimateResult');
      setPropertyEstimation(estimation);
    }
  };

  // eslint-disable-next-line consistent-return
  const getTypeText = () => {
    switch (type) {
      case 'new': {
        return 'New';
      }
      case 'premium': {
        return 'Premium';
      }
      case 'preMarket': {
        return 'Pre-market';
      }
      default:
    }
  };

  // eslint-disable-next-line consistent-return
  const getColor = () => {
    switch (type) {
      case 'new': {
        return 'Green';
      }
      case 'premium': {
        return 'Red';
      }
      case 'preMarket': {
        return 'Primary';
      }
      default:
    }
  };

  return (
    <>
      {
        !removeSkeleton && (
          <CardImageText type={get(skeleton, '[type]', '')} />
        )
      }
      <div
        className={`market-card ov-h cur-poi h-perc-100 ${type === 'own' ? 'dis-f-sm' : 'dis-fl-col'} brdRadius px-1 pos-r ${removeSkeleton ? '' : 'pos-a opacity0'}`}
        onClick={(e) => (type !== 'own' ? openCard(e) : '')}
      >
        {
          type === 'own' ? (
            <>
              <CoverPropertyImage
                loadedImg={(val) => setCoverImgLoaded(val)}
                className="cover brdRadius mb-1 h-fix-200 w-perc-100 w-fix-sm-200"
                coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                propertyType={get(item, 'properties.propertyType', undefined)}
                onClick={(e) => openCard(e)}
              />
              <div className="info dis-fl-col pl-sm-2 pl-0">
                <div className="top dis-fl-col" onClick={(e) => openCard(e)}>
                  <h6 className="fweight-700 txtDark700 ellipsis one w-perc-100 max-w-fix-400">{get(item, 'title', '')}</h6>
                  <span className="fsize-300 txtDark700">{get(item, 'location.address', '')}</span>
                </div>
                <div className="mid dis-fl-row a-c fsize-300 txtDark400" onClick={(e) => openCard(e)}>
                  <span>{get(item, 'properties.propertyType', '')} </span> <span className="px-1"> &middot; </span>
                  <span><span>{get(item, 'properties.typology.bedrooms', 0)}</span> <span>bedrooms</span></span> <span className="px-1"> &middot; </span>
                  <span><span>{get(item, 'properties.typology.livingArea.value', 0)}</span><span>m2</span></span>
                </div>
                <div className="dis-f py-1" onClick={(e) => openCard(e)}>
                  <BrixelIcon className="fsize-200 txtDark700" icon="favorite-fill" /> <span className="fsize-200 txtDark700">&nbsp;  17</span>
                </div>
                <div
                  className="bottom dis-f a-c fsize-300 py-1"
                  onClick={(e) => openBestimateOverlay(e, item.location, item.estimation)}
                >
                  <div className="p-2 mr-1 brdRadius bgBlue100">
                    <span className="fweight-500 txtDark100">Your Bestimate&reg;</span>
                    <span className="dis-b fweight-600 txtPrimary400 ">
                      {
                        has(item, 'estimation.result.value') ? (
                          <>
                            {get(item, 'estimation.result.currency', '')} {' '}
                            {Helpers.formatNumberValue(get(item, 'estimation.result.lowerValue', 0).toFixed(0), get(item, 'estimation.result.currency', ''))} -
                            {Helpers.formatNumberValue(get(item, 'estimation.result.higherValue', 0).toFixed(0), get(item, 'estimation.result.currency', ''))}
                          </>
                        ) : (
                          <span>Pending</span>
                        )
                      }
                    </span>
                  </div>
                  <div
                    className="p-2 mr-1 brdRadius bgBlue100 dis-f a-c"
                    onClick={(e) => {
                      if (e) {
                        e.preventDefault();
                      }
                      history.push(`/${item.id}/rewards/achievement/facts`);
                    }}
                  >
                    <div className="w-fix-56">
                      <ProgressRing
                        progress={get(item, 'inputSheet.totalComplete', 0)}
                        size={45}
                        strokeWidth={3}
                        circleOneStroke="#DCDDDE"
                        circleTwoStroke="#387AFF"
                      />
                    </div>
                    <div className="pl-1">
                      <span className="fweight-500 txtDark100">Facts</span>
                      <span className="dis-b fweight-600 txtDark400">
                        {get(item, 'inputSheet.totalComplete', 0)}% completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <>
                <CoverPropertyImage
                  loadedImg={(val) => setCoverImgLoaded(val)}
                  className="cover brdRadius mb-1 w-perc-100 h-perc-100 h-fix-200 pos-r"
                  coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                  propertyType={get(item, 'properties.propertyType', undefined)}
                />
                {
                  type === 'favorite' ? (
                    <BrixelIcon
                      icon="favorite-fill"
                      color="red"
                      className="type-tag favorite pos-a"
                    />
                  ) : (
                    <p
                      className={`type-tag pos-a non-favorite fsize-200 fweight-500 txtWhite mr-1 bg${getColor()}400`}
                    >
                      <span className="type">{getTypeText()}</span>
                    </p>
                  )
                }
              </>
              <div className="info dis-fl-col jc-b">
                <div className="top dis-fl-col">
                  <span className="fweight-600 fsize-300 txtDark700 ellipsis one">{get(item, 'title', '')}</span>
                  <span className="fsize-300 txtDark700">{get(item, 'location.address', '')}</span>
                </div>
                <div className="mid dis-fl-row a-c fsize-300 txtDark400">
                  <span>{get(item, 'properties.propertyType', '')} </span> <span className="px-1"> &middot; </span>
                  <span><span>{get(item, 'properties.typology.bedrooms', 0)}</span> <span>bedrooms</span></span> <span className="px-1"> &middot; </span>
                  <span><span>{get(item, 'properties.typology.livingArea.value', 0)}</span><span>m2</span></span>
                </div>
                <div className="bottom dis-fl-row a-c txtDark700 pt-1">

                  {
                    get(item, 'price.total', 0) !== 0 ? (
                      <>
                        <span className="fsize-300 fweight-600">{get(item, 'price.currency', '')} &nbsp; </span>
                        <span className="fsize-300 fweight-600">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
                      </>
                    ) : (
                      <span className="txtGreen400 fsize-300 fweight-500">On Request</span>
                    )
                  }

                </div>
              </div>
            </>
          )
        }
      </div>
    </>
  );
};

MarketCard.propTypes = {
  history: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  preventClick: PropTypes.bool,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
  setSplashScreen: PropTypes.func.isRequired,
  setPropertyEstimation: PropTypes.func.isRequired,
};

MarketCard.defaultProps = {
  preventClick: false,
  type: '',
};

const mapStateToProps = (state) => ({
  skeleton: get(state, 'common.skeleton', {}),
});

const mapDispatchToProps = (dispatch) => ({
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCard);
