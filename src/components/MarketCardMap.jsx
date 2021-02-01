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

const MarketCardMap = (props) => {
  // PROPS
  const {
    isLoading,
    item,
    type,
    skeleton,
    history,
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
    if (type === 'own') history.push(`/${item.id}/rewards`);
    if (type === 'favorite') history.push(`/buyer/property/${item.id}`);
    // TODO: Estimation opens overlay
    // TODO: Pre-Market opens overlay
    else window.open(`${baseByData.pageUrl}${item.stub}`, '_blank');
  };

  return (
    <>
      {
        !removeSkeleton && (
          <CardImageText type={get(skeleton, '[type]', '')} />
        )
      }
      <div
        className={`market-card ov-h cur-poi ${type === 'own' ? 'dis-f-sm' : 'dis-fl-col'} brdRadius px-1 pos-r ${removeSkeleton ? '' : 'pos-a opacity0'}`}
        onClick={(e) => openCard(e)}
      >
        <>
          <CoverPropertyImage
            loadedImg={(val) => setCoverImgLoaded(val)}
            className="cover brdRadius mb-1 h-fix-200 w-perc-100 w-fix-sm-320"
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
            <div className="bottom dis-f a-c fsize-300 py-1">
              {get(item, 'price.total', 0)}
            </div>
          </div>
        </>
      </div>
    </>
  );
};

MarketCardMap.propTypes = {
  isLoading: PropTypes.bool,
  item: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  type: PropTypes.string,
  skeleton: PropTypes.object.isRequired,
};

MarketCardMap.defaultProps = {
  isLoading: true,
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
)(MarketCardMap);
