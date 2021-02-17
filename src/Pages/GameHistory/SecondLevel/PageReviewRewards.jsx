/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import { BrixelButtonPrimary, BrixelIcon, FormatValue } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { addGameHistory } from '../../../actions/GamificationActions';
import CoverPropertyImage from '../../../components/CoverPropertyImage';

const PageReviewRewards = (props) => {
  const {
    activeSingleProperty,
    formValue,
    gameHistory,
    handleAddGameHistory,
    history,
    isSmallLoading,
    match,
  } = props;
  // STATE
  const [isDone, setIsDone] = useState(false);
  // PARAMS URL
  const propID = get(match, 'params.propId', '');
  const gameStub = history.location.pathname.split('/')[3];

  // CHECK IF THE SECTION IS DONE
  useEffect(() => {
    const isCheckDone = gameHistory.find((item) => item.page === propID && item.achievement.stub === gameStub);
    setIsDone(typeof isCheckDone !== 'undefined');
  }, [gameHistory]);

  // FUNCTION TO OPEN THE PAGE PREVIEW AND ADD TO GAME HISTORY
  const openPreview = () => {
    const redirectUrl = `${baseByData.pageUrl}preview/${activeSingleProperty.stub}?hubUrl=${window.location.href}`;
    handleAddGameHistory({ stub: gameStub, redirectTo: redirectUrl, smallLoader: 'preview' });
  };

  return (
    <main id="rewards" className="w-perc-100 h-perc-100 dis-fl-col a-c">
      {
        isDone ? (
          <>
            <div className="dis-fl-col jc-c a-c">
              <h5 className="ta-c mb-2">Want a second look?</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300">You can edit and preview as often as you want. We are ready when you are.</p>
              <div
                className="websitePage brdRadius ov-h shadow-3dp pos-r cur-poi w-perc-100 my-5"
                onClick={() => openPreview()}
              >
                <div className="dis-f bgLight100 p-1">
                  <div className="square brdCircle w-fix-8 bgRed400 mr-1" />
                  <div className="square brdCircle w-fix-8 bgYellow400 mr-1" />
                  <div className="square brdCircle w-fix-8 bgGreen400" />
                </div>
                <div className="image-ratio">
                  <CoverPropertyImage
                    className="cover"
                    size="56"
                    coverPhoto={get(formValue, 'coverPhoto.path', undefined)}
                    propertyType={get(formValue, 'properties.propertyType', undefined)}
                  />
                </div>
                <div className="cardPageInfo">
                  <div className="w-fix-80 bgPrimary400 opacity5 h-fix-8 mb-1" />
                  <h6>{formValue.title}</h6>
                  <div className="dis-f jc-b a-c mt-2">
                    <div className="w-fix-40 bgLight400 opacity5 h-fix-8" />
                    <div className="w-fix-40 bgLight400 opacity5 h-fix-8" />
                  </div>
                  <div className="dis-f jc-b a-c mt-3">
                    <div className="w-fix-24 bgLight400 opacity5 h-fix-8" />
                    <div className="w-fix-24 bgLight400 opacity5 h-fix-8" />
                    <div className="w-fix-24 bgLight400 opacity5 h-fix-8" />
                  </div>
                  <div className="dis-f jc-b a-c pb-3">
                    <h6 className="w-fix-24 ff-mono">{FormatValue.formatRooms(get(formValue, 'properties.typology.bedrooms', 0), get(formValue, 'location.countryCode', 'CH'))}</h6>
                    {
                      get(formValue, 'location.countryCode', '') === 'PT' && get(formValue, 'properties.typology.grossArea.value', 0) > 0 ? (
                        <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.grossArea.value', 0)}</h6>
                      ) : (
                        <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.livingArea.value', 0)}</h6>
                      )
                    }
                    <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.building.built', 0)}</h6>
                  </div>
                  <div className="contactPageCard">
                    <div className="contactUser">
                      <BrixelIcon icon="account" />
                    </div>
                    <div className="button" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <BrixelButtonPrimary
                label="Open preview"
                rounded
                rightIcon="arrow-right"
                className="m-a"
                onClick={() => openPreview(false)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="dis-fl-col jc-c a-c">
              <h5 className="ta-c mb-2">Have a look!</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300">This is your personal property page. Don’t worry this is not public. This is for you eyes only.</p>
              <div
                className="websitePage brdRadius ov-h shadow-3dp pos-r cur-poi w-perc-100 my-5"
                onClick={() => openPreview()}
              >
                <div className="dis-f bgLight100 p-1">
                  <div className="square brdCircle w-fix-8 bgRed400 mr-1" />
                  <div className="square brdCircle w-fix-8 bgYellow400 mr-1" />
                  <div className="square brdCircle w-fix-8 bgGreen400" />
                </div>
                <div className="image-ratio">
                  <CoverPropertyImage
                    className="cover"
                    size="56"
                    coverPhoto={get(formValue, 'coverPhoto.path', undefined)}
                    propertyType={get(formValue, 'properties.propertyType', undefined)}
                  />
                </div>
                <div className="cardPageInfo">
                  <div className="w-fix-80 bgPrimary400 opacity5 h-fix-8 mb-1" />
                  <h6>{formValue.title}</h6>
                  <div className="dis-f jc-b a-c mt-2">
                    <div className="w-fix-40 bgLight400 opacity5 h-fix-8" />
                    <div className="w-fix-40 bgLight400 opacity5 h-fix-8" />
                  </div>
                  <div className="dis-f jc-b a-c mt-3">
                    <div className="w-fix-24 bgLight400 opacity5 h-fix-8" />
                    <div className="w-fix-24 bgLight400 opacity5 h-fix-8" />
                    <div className="w-fix-24 bgLight400 opacity5 h-fix-8" />
                  </div>
                  <div className="dis-f jc-b a-c pb-3">
                    <h6 className="w-fix-24 ff-mono">{FormatValue.formatRooms(get(formValue, 'properties.typology.bedrooms', 0), get(formValue, 'location.countryCode', ''))}</h6>
                    {
                      get(formValue, 'location.countryCode', '') === 'PT' && get(formValue, 'properties.typology.grossArea.value', 0) > 0 ? (
                        <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.grossArea.value', 0)}</h6>
                      ) : (
                        <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.livingArea.value', 0)}</h6>
                      )
                    }
                    <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.building.built', 0)}</h6>
                  </div>
                  <div className="contactPageCard">
                    <div className="contactUser">
                      <BrixelIcon icon="account" />
                    </div>
                    <div className="button" />
                  </div>
                </div>
              </div>

            </div>
            <div>
              <BrixelButtonPrimary
                label="Open preview"
                rounded
                rightIcon="arrow-right"
                className="m-a"
                onClick={() => openPreview(true)}
                isLoading={isSmallLoading === 'preview'}
              />
            </div>
          </>
        )
      }
    </main>
  );
};

PageReviewRewards.propTypes = {
  activeSingleProperty: Proptypes.object.isRequired,
  formValue: Proptypes.object.isRequired,
  handleAddGameHistory: Proptypes.func.isRequired,
  isSmallLoading: Proptypes.string,
  history: Proptypes.object.isRequired,
  match: Proptypes.object.isRequired,
  gameHistory: Proptypes.arrayOf(Proptypes.object).isRequired,
};

PageReviewRewards.defaultProps = {
  isSmallLoading: null,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', ''),
  gameHistory: get(state, 'gamification.gameHistory.data', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PageReviewRewards);
