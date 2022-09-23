/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelIcon, Helpers, translateTo } from '@brixel/brixel-components';
import CoverPropertyImage from '../CoverPropertyImage';
import CardImageText from '../Skeleton/CardImageText';
import { setActiveMarketOverlayProperty, setActiveSingleProperty, setEstimation } from '../../actions/PropertyActions';
import { setSplashType } from '../../actions/CommonActions';

const MarketCardSmall = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    className,
    estimation,
    handleSetActiveSingleProperty,
    handleSetEstimation,
    handleSetSplashType,
    item,
    lang,
    readOnly,
    setMarketOverlayProperty,
    setSplashScreen,
    showAddess,
    skeleton,
    type,
  } = props;
  // STATE
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);

  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
  useEffect(() => {
    if (!skeleton[type] && (coverImgLoaded || type === 'estimation')) {
      setRemoveSkeleton(true);
    }
  }, [skeleton, coverImgLoaded]);

  const isPreMarket = () => get(item, 'tags', []).includes('pre-market');

  const openCard = (e) => {
    if (e) e.preventDefault();
    if (isPreMarket()) {
      setSplashScreen('marketOverlay');
      setMarketOverlayProperty(item);
    } else if (type !== 'estimation') {
      history.push({
        pathname: `/buyer/${item.id}/home`,
        state: { section: 'Market' },
      });
    } else {
      const data = {
        ...item,
        estimation: {
          result: estimation,
        },
      };
      handleSetEstimation({
        result: {
          ...estimation,
          higherValue: estimation.higherValue || 0,
        },
      });
      handleSetActiveSingleProperty(data);
      handleSetSplashType('bestimateResult');
    }
  };

  return (
    <>
      {
        (!removeSkeleton || !item) && (
          <CardImageText type={type} />
        )
      }
      <div
        className={`market-card ov- h-perc-100 w-perc-100 brdRadius pos-r ${removeSkeleton && item ? '' : 'pos-a opacity0'} ${readOnly ? 'max-w-fix-448 m-a' : 'cur-poi'}`}
        onClick={(e) => (readOnly ? '' : openCard(e))}
      >
        <div className={`${type === 'own' ? 'dis-f-sm' : 'dis-fl-col'}`}>
          <div className={`brdSmall brdRadius brdLight200 ov-h dis-f ${readOnly ? 'h-fix-104 h-fix-sm-144' : 'h-fix-80'} ${className}`}>
            {
              type === 'estimation' ? (
                <BrixelIcon
                  className={`square ${readOnly ? 'w-fix-128' : 'min-w-fix-80'}`}
                  icon="pro-estimation"
                  color="green"
                  background="green"
                  saturation={200}
                  saturationTxt={700}
                  iconWidth={`${readOnly ? 'w-fix-40' : 'w-fix-32'}`}
                />
              ) : (
                <CoverPropertyImage
                  loadedImg={(val) => setCoverImgLoaded(val)}
                  className={`${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover w-perc-100 h-perc-100 pos-r ${readOnly ? 'h-fix-104 w-fix-104 h-fix-sm-144 w-fix-sm-128' : 'h-fix-80 w-fix-80'}`}
                  coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                  propertyType={get(item, 'properties.propertyType', undefined)}
                />
              )
            }
            <div className={`info dis-fl-col ${type === 'estimation' ? 'jc-c' : 'py-1'} ${readOnly ? 'ta-l' : ''} `}>
              <div className={`top dis-fl-col notranslate pl-2 pr-1 ov-h ${readOnly ? 'py-1 px-1 py-sm-2 px-sm-3' : ''}`}>
                <span className={`ellipsis txtDark700 notranslate two ${readOnly ? 'fweight-600 fsize-400 fsize-sm-600' : 'fweight-600 fsize-400'}`}>
                  {get(item, 'title', '')}
                </span>
                {
                  showAddess && (
                    <span className={`ellipsis txtAltGrey700 notranslate two ${readOnly ? 'fsize-300 pt-1' : 'fsize-200 fweight-600'}`}>
                      {get(item, 'location.name', '')}, {get(item, 'location.city', '')}
                    </span>
                  )
                }
              </div>

              {
                type === 'estimation' && (
                  <div className="px-2">
                    {
                      estimation.higherValue ? (
                        <p className="txtLight400">
                          <span>{estimation.currency}</span>
                          <span className="ml-1">
                            {Helpers.formatNumberValue(Math.round(estimation.higherValue), estimation.currency)}
                          </span>
                        </p>
                      ) : (
                        <p className="txtLight400">
                          {translateTo('Pending', lang)}
                        </p>
                      )
                    }
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

MarketCardSmall.propTypes = {
  className: PropTypes.string,
  estimation: PropTypes.object,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetEstimation: PropTypes.func.isRequired,
  handleSetSplashType: PropTypes.func.isRequired,
  item: PropTypes.object,
  lang: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  setMarketOverlayProperty: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  showAddess: PropTypes.bool,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCardSmall.defaultProps = {
  className: '',
  readOnly: false,
  estimation: {},
  item: null,
  showAddess: false,
  type: '',
};

const mapStateToProps = (state) => ({
  skeleton: get(state, 'common.skeleton', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetSplashType: bindActionCreators(setSplashType, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetEstimation: bindActionCreators(setEstimation, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCardSmall);
