/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
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
  } = props;
  // STATE
  const [showTour, setShowTour] = useState(false);
  // URL PARAMS

  return (
    <>
      <h3 className="mb-3 hide dis-b-lg">3D tour</h3>
      <div className="tourWrapper h-perc-lg-100">
        <div className="secondLevel dis-fl-col">
          <div className="dis-f backPanel hide-lg">
            <h5 className="sectionTitle">
              3D tour
            </h5>
          </div>
          {
            get(formValue, 'virtual.matterport', null) ? (
              <div className="tour boxCard mb-5">
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
              <div className="tour brixel-upgrade-message rewardsSplash">
                <BrixelUpgradeMessage
                  unlockFunction={false}
                  title="Do you want a 3D tour for your property?"
                  description="A 3D tour helps you to avoid unnecessary showings and increases the attention of your property in the market. Request a free scan by one of our experts to get your own tour."
                  btnLabel="Request scan"
                  redirectUrl={`/${formValue.id}/trialRequest`}
                  virtualTour="https://my.matterport.com/show/?m=ctWod3ggrZi&help=0&hl=2&nt=1&play=1&brand=0&mls=2&mt=0&wh=0"
                  trialRequest
                />
              </div>
            )
          }
        </div>
      </div>
    </>
  );
};

Tour.propTypes = {
  formValue: PropTypes.object.isRequired,
};

Tour.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  loggedInUser: get(state, 'user.loggedInUser', { }),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleUploadImg: bindActionCreators(uploadImg, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Tour);
