/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { setModal } from '../../../actions/CommonActions';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';

const Tour = (props) => {
  // PROPS
  const {
    formValue,
    handleSetModal,
  } = props;
  // URL PARAMS

  const open3dTour = (url) => {
    const urlTour = url || `https://my.matterport.com/show/?m=${get(formValue, 'virtual.matterport', null)}&help=0&hl=2&nt=1&play=1&brand=0&mls=2&wh=0`
    handleSetModal({
      state: true,
      small: true,
      layout: 'fullscreen',
      body: `<iframe
                            class="matterportIframeModal"
                            width="100%"
                            height="100%"
                            src="${urlTour}"
                            allow="vr"
                            frameBorder="0"
                            allowFullScreen
                            title={get(formValue, 'virtual.matterport', null)}
                          />`
    })
  }

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
                <div className="pos-r brdRadius ov-h max-h-fix-344">
                  {
                    get(formValue, 'virtual.matterport', null) && (
                      <img
                        className="dis-b w-perc-100"
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
                      onClick={() => open3dTour()}
                    />
                    <p className="ta-c txtWhite mt-2">Start 3D tour</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tour brixel-upgrade-message rewardsSplash">
                <BrixelUpgradeMessage
                  onOpentour={(url) => open3dTour(url)}
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
  handleSetModal: PropTypes.func.isRequired,
};

Tour.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  loggedInUser: get(state, 'user.loggedInUser', { }),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Tour);
