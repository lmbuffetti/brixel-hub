/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelIcon, Helpers } from '@brixel/brixel-components';
import CoverPropertyImage from './CoverPropertyImage';
import CardImageText from './Skeleton/CardImageText';
import { setActiveSingleProperty, setEstimation } from '../actions/PropertyActions';
import { setSplashType } from '../actions/CommonActions';

const MarketCardSmall = (props) => {
  const history = useNavigate();
  // PROPS
  const {
    estimation,
    handleSetActiveSingleProperty,
    handleSetEstimation,
    handleSetSplashType,
    item,
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
    if (type !== 'estimation') {
      history.push({
        pathname: `/buyer/${item.id}/property/page`,
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
        className={`market-card ov-h cur-poi h-perc-100 w-perc-100 brdRadius pos-r ${removeSkeleton && item ? '' : 'pos-a opacity0'} `}
        onClick={(e) => openCard(e)}
      >
        <div className={`${type === 'own' ? 'dis-f-sm' : 'dis-fl-col'}`}>
          <div className="brdSmall brdRadius brdLight200 ov-h dis-f h-fix-80">
            {
              type === 'estimation' ? (
                <BrixelIcon
                  className="min-w-fix-80 square"
                  icon="pro-estimation"
                  color="green"
                  background="green"
                  saturation={200}
                  saturationTxt={700}
                  iconWidth="w-fix-32"
                />
              ) : (
                <CoverPropertyImage
                  loadedImg={(val) => setCoverImgLoaded(val)}
                  className={`${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover w-perc-100 h-perc-100 h-fix-80 w-fix-80 pos-r`}
                  coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                  propertyType={get(item, 'properties.propertyType', undefined)}
                />
              )
            }
            <div className={`info dis-fl-col ${type === 'estimation' ? 'jc-c' : 'py-1'}`}>
              <div className="top dis-fl-col notranslate pl-2 pr-1 ov-h">
                <span className="fweight-600 fsize-400 ellipsis txtAltGrey700 notranslate two">
                  {get(item, 'title', '')}
                </span>
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
                          Pending
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
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetSplashType: PropTypes.func.isRequired,
  handleSetEstimation: PropTypes.func.isRequired,
  estimation: PropTypes.object,
  item: PropTypes.object,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCardSmall.defaultProps = {
  estimation: {},
  item: null,
  type: '',
};

const mapStateToProps = (state) => ({
  skeleton: get(state, 'common.skeleton', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetSplashType: bindActionCreators(setSplashType, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetEstimation: bindActionCreators(setEstimation, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCardSmall);
