/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonIcon, translateTo } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { setModal } from '../../../actions/CommonActions';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';

const Tour = (props) => {
  // PROPS
  const {
    formValue,
    lang,
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
      <h3 className="mb-3 hide dis-b-lg">{translateTo('3D tour', lang)}</h3>
      <div className="tourWrapper h-perc-lg-100">
        <div className="secondLevel dis-fl-col">
          <div className="dis-f backPanel hide-lg">
            <h5 className="sectionTitle">
              {translateTo('3D tour', lang)}
            </h5>
          </div>
          {
            get(formValue, 'virtual.matterport', null) ? (
              <div className="tour boxCard mb-5">
                <div className="pos-r brdRadius ov-h max-h-fix-344">
                  {
                    get(formValue, 'virtual.matterport', null) && (
                      <img
                        loading="lazy"
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
                    <p className="ta-c txtWhite mt-2">{translateTo('Start 3D tour', lang)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tour brixel-upgrade-message rewardsSplash">
                <BrixelUpgradeMessage
                  lang={lang}
                  onOpentour={(url) => open3dTour(url)}
                  unlockFunction={false}
                  title={translateTo('Do you want a 3D tour for your property?', lang)}
                  description={translateTo('A 3D tour helps you to avoid unnecessary showings and increases the attention of your property in the market. Request a free scan by one of our experts to get your own tour.', lang)}
                  btnLabel={translateTo('Request scan', lang)}
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
  lang: PropTypes.string.isRequired,
  handleSetModal: PropTypes.func.isRequired,
};

Tour.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser', { }),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Tour);
