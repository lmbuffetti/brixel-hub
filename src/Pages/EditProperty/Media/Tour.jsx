/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonIcon, change } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { uploadImg } from '../../../actions/UploadActions';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';

const Tour = (props) => {
  // PROPS
  const {
    formValue,
    history,
    match,
  } = props;
  // STATE
  const [showTour, setShowTour] = useState(false);
  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  return (
    <div className="tourWrapper h-perc-lg-100">
      <div className="secondLevel dis-fl-col">
        {
          get(formValue, 'virtual.matterport', null) ? (
            <div className="tour">
              <div className="dis-f jc-b a-c mb-3">
                <BrixelButtonIcon
                  className="hide-md"
                  ghost
                  icon="arrow-simple-left"
                  onClick={() => history.push(`/${propID}/property`)}
                />
                <h5 className="m-a m-lg-0 sectionTitle">
                  3D tour
                </h5>
              </div>
              {
                !showTour ? (
                  <div className="pos-r brdRadius ov-h">
                    {
                      get(formValue, 'virtual.matterport', null) && (
                        <img
                          className="dis-b"
                          src={`${baseByData.shortPath}${get(formValue, 'coverPhoto.path', '')}`}
                          alt="Cover"
                        />
                      )
                    }
                    <div className="pos-a w-perc-100 h-perc-100 bgBlack opacity5" />
                    <div className="pos-a xy-c">
                      <BrixelButtonIcon
                        ghost
                        icon="play-fill"
                        className="m-a opacity8"
                        onClick={() => setShowTour(true)}
                      />
                      <p className="ta-c txtWhite mt-2">Start 3D tour</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {
                      get(formValue, 'virtual.matterport', null) && (
                        <iframe
                          className="min-h-fix-320"
                          width="100%"
                          height="100%"
                          src={`https://my.matterport.com/show/?m=${get(formValue, 'virtual.matterport', null)}&help=0&hl=2&nt=1&play=1&brand=0&mls=2&wh=0`}
                          allow="vr"
                          frameBorder="0"
                          allowFullScreen
                          title={get(formValue, 'virtual.matterport', null)}
                        />
                      )
                    }
                  </>
                )
              }
            </div>
          ) : (
            <div className="tour brixel-upgrade-message p- rewardsSplash">
              <div className="dis-f jc-b a-c mb-3 hide-md p-2">
                <BrixelButtonIcon
                  className="hide-md"
                  icon="arrow-simple-left"
                  ghost
                  onClick={() => history.push(`/${propID}/property`)}
                />
              </div>
              <BrixelUpgradeMessage
                className="mt-0 p-2"
                unlockFunction={false}
                title="Do you want a 3D tour for your property?"
                description="A 3D tour helps you to avoid unnecessary showings and increases the attention of your property in the market. Request a free scan by one of our experts to get your own tour."
                btnLabel="Request scan"
                redirectUrl={`/${formValue.id}/trialRequest`}
                virtualTour
                trialRequest
              />
            </div>
          )
        }
      </div>

    </div>
  );
};

Tour.propTypes = {
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Tour.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  loggedInUser: get(state, 'user.loggedInUser', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleUploadImg: bindActionCreators(uploadImg, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Tour);
