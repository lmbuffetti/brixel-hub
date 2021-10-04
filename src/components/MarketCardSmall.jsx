/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import CoverPropertyImage from './CoverPropertyImage';
import CardImageText from './Skeleton/CardImageText';

const MarketCardSmall = (props) => {
  // PROPS
  const {
    history,
    item,
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

  const isPreMarket = () => get(item, 'tags', []).includes('pre-market');

  const openCard = (e) => {
    if (e) e.preventDefault();
    history.push({
      pathname: `/buyer/${item.id}/property/page`,
      state: { section: 'Market' },
    });
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
          <div className="brdSmall brdRadius brdLight200 ov-h dis-f">
            <CoverPropertyImage
              loadedImg={(val) => setCoverImgLoaded(val)}
              className={`${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover w-perc-100 h-perc-100 h-fix-80 w-fix-80 pos-r`}
              coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
              propertyType={get(item, 'properties.propertyType', undefined)}
            />
            <div className="info dis-fl-col jc-b">
              <div className="top dis-fl-col notranslate pl-2 pt-1 pr-1 ov-h">
                <span className="fweight-600 fsize-400 ellipsis three txtAltGrey700 notranslate">
                  {get(item, 'title', '')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

MarketCardSmall.propTypes = {
  history: PropTypes.object.isRequired,
  item: PropTypes.object,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCardSmall.defaultProps = {
  item: null,
  type: '',
};

const mapStateToProps = (state) => ({
  skeleton: get(state, 'common.skeleton', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(MarketCardSmall);
