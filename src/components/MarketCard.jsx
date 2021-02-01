/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
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

const MarketCard = (props) => {
  // PROPS
  const {
    history,
    isLoading,
    item,
    preventClick,
    skeleton,
    type,
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

  return (
    <>
      {
        !removeSkeleton && (
          <CardImageText type={get(skeleton, '[type]', '')} />
        )
      }
      <div
        className={`market-card ov-h cur-poi h-perc-100 ${type === 'own' ? 'dis-f-sm' : 'dis-fl-col'} brdRadius px-1 pos-r ${removeSkeleton ? '' : 'pos-a opacity0'}`}
        onClick={(e) => openCard(e)}
      >
        {
          type === 'own' ? (
            <>
              <CoverPropertyImage
                loadedImg={(val) => setCoverImgLoaded(val)}
                className="cover brdRadius mb-1 h-fix-200 w-perc-100 w-fix-sm-200"
                coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                propertyType={get(item, 'properties.propertyType', undefined)}
              />
              <div className="info dis-fl-col pl-sm-2 pl-0">
                <div className="top dis-fl-col">
                  <h6 className="fweight-700 txtDark700 ellipsis one w-perc-100 max-w-fix-400">{get(item, 'title', '')}</h6>
                  <span className="fsize-300 txtDark700">{get(item, 'location.address', '')}</span>
                </div>
                <div className="mid dis-fl-row a-c fsize-300 txtDark400">
                  <span>{get(item, 'properties.propertyType', '')} </span> <span className="px-1"> &middot; </span>
                  <span><span>{get(item, 'properties.typology.bedrooms', 0)}</span> <span>bedrooms</span></span> <span className="px-1"> &middot; </span>
                  <span><span>{get(item, 'properties.typology.livingArea.value', 0)}</span><span>m2</span></span>
                </div>
                <div className="dis-f py-1">
                  <BrixelIcon className="fsize-200 txtDark700" icon="favorite-fill" /> <span className="fsize-200 txtDark700">&nbsp;  17</span>
                </div>
                <div className="bottom dis-f a-c fsize-300 py-1">
                  <div className="p-2 mr-1 brdRadius bgBlue100">
                    <span className="fweight-500 txtDark100">Your bestimate&reg;</span>
                    <span className="dis-b fweight-600 txtPrimary400 ">

                      {get(item, 'estimation.bestimate.currency', '')} {' '}
                      {get(item, 'estimation.bestimate.higherValue', 0)}
                      - {get(item, 'estimation.bestimate.lowerValue', 0)}
                    </span>
                  </div>
                  <div className="p-2 mr-1 brdRadius bgBlue100 dis-f a-c">
                    <ProgressRing
                      progress={get(item, 'inputSheet.totalComplete', 0)}
                      size={45}
                      strokeWidth={3}
                      circleOneStroke="#DCDDDE"
                      circleTwoStroke="#387AFF"
                    />
                    <div className="pl-2">
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
              <CoverPropertyImage
                loadedImg={(val) => setCoverImgLoaded(val)}
                className="cover brdRadius mb-1 w-perc-100 h-perc-100 h-fix-200"
                coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                propertyType={get(item, 'properties.propertyType', undefined)}
              />
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
                  <span className="fsize-300 fweight-600">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
                  <span className="fsize-300 fweight-600"> &nbsp; {get(item, 'price.currency', '')}</span>
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
  isLoading: PropTypes.bool,
  item: PropTypes.object.isRequired,
  preventClick: PropTypes.bool,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCard.defaultProps = {
  isLoading: true,
  preventClick: false,
  type: '',
};

const mapStateToProps = (state) => ({
  skeleton: get(state, 'common.skeleton', {}),
});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCard);
