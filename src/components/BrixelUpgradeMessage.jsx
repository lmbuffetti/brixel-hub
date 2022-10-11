import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonIcon, BrixelButtonPrimary } from '@brixel/brixel-components';
import translateTo from '../utils/translation';
import defaultCover from '../images/3d-tour-placeholder.jpg';
import { isEligible } from '../utils/helpers';

const BrixelUpgradeMessage = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleProperty,
    btnLabel,
    className,
    description,
    descriptionConfirm,
    isSmallLoading,
    lang,
    onClick,
    onClose,
    onOpentour,
    redirectUrl,
    showClose,
    title,
    titleConfirm,
    trialRequest,
    unlockFunction,
    virtualTour,
  } = props;
  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];
  // STATE
  const [showUnlockMessage, setShowUnlockMessage] = useState(false);

  // WHEN CLICK TO CONFIRM THE UPGRADE
  const onUpgrade = () => {
    localStorage.setItem('backUrl', history.location.pathname);
    if (redirectUrl) history.push(redirectUrl);
    else history.push(`/${propID}/upgrade`);
  };

  const onClickBtn = () => {
    if (unlockFunction && titleConfirm) setShowUnlockMessage(true);
    else if (unlockFunction) onClick();
    else onUpgrade();
  };

  const bgColor = showUnlockMessage ? 'bgPrimary100' : 'bgGreen100';

  if (!isEligible(activeSingleProperty) && trialRequest) {
    return <span />;
  }

  return (
    <div className={`brixel-upgrade-message shadow-1dp p-2 p-md-3 ta-c brdRadius ${className} ${bgColor}`}>
      {
        // CONDITION TO SHOW/HIDE THE CLOSE ICON
        showClose && (
          <div className="dis-f hide-md a-c mb-3">
            <BrixelButtonIcon
              icon="arrow-simple-left"
              ghost
              onClick={() => onClose()}
            />
          </div>
        )
      }
      {
        // CONDITION TO SHOW THE MESSAGE TO UNLOCK OR THE CONFIRMATION MESSAGE
        showUnlockMessage ? (
          <div className="bgPrimary100">
            <h5 className="txtPrimary700 mb-3">{titleConfirm}</h5>
            <p className="max-w-fix-360 m-a txtDark700" dangerouslySetInnerHTML={{ __html: descriptionConfirm }} />
            <div className="dis-f jc-c mt-3">
              <BrixelButtonPrimary
                rounded
                className="mr-1"
                label={translateTo('Cancel', lang)}
                theme="white"
                onClick={() => setShowUnlockMessage(false)}
              />
              <BrixelButtonPrimary
                rounded
                className="ml-1"
                label={translateTo('Order now', lang)}
                isLoading={isSmallLoading.saveData}
                onClick={() => onClick()}
              />
            </div>
          </div>
        ) : (
          <div className="bgGreen100 pb-3">
            <h5 className="txtGreen700">{title}</h5>
            <p
              className="mt-3 mb-3 max-w-fix-360 m-a txtDark700"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            {
              // CONDITION TO SHOW MESSAGE OR DEFAULT DEFAULT TOUR IF TOUR 3D
              virtualTour && (
                <div className="my-5">
                  <div className="pos-r brdRadius ov-h">
                    <img
                      loading="lazy"
                      className="dis-b"
                      src={defaultCover}
                      alt="Cover"
                    />
                    <div className="pos-a w-perc-100 h-perc-100 bgBlack opacity5" />
                    <div className="pos-a xy-c">
                      <BrixelButtonIcon
                        ghost
                        icon="play-fill"
                        className="m-a opacity8"
                        onClick={() => onOpentour(virtualTour)}
                      />
                      <p className="ta-c txtWhite mt-2">{translateTo('Example 3D-Tour', lang)}</p>
                    </div>
                  </div>
                </div>
              )
            }
            <BrixelButtonPrimary
              rounded
              className="m-a"
              label={unlockFunction ? btnLabel || 'Unlock now' : btnLabel}
              theme="red"
              onClick={() => onClickBtn()}
            />
          </div>
        )
      }
    </div>
  );
};

BrixelUpgradeMessage.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  btnLabel: PropTypes.string,
  className: PropTypes.string,
  description: PropTypes.string,
  descriptionConfirm: PropTypes.string,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  onOpentour: PropTypes.func,
  redirectUrl: PropTypes.string,
  showClose: PropTypes.bool,
  title: PropTypes.string,
  titleConfirm: PropTypes.string,
  trialRequest: PropTypes.bool,
  unlockFunction: PropTypes.bool,
  virtualTour: PropTypes.string,
};

BrixelUpgradeMessage.defaultProps = {
  btnLabel: 'Upgrade now',
  className: '',
  description: null,
  descriptionConfirm: null,
  onClose: () => '',
  onClick: () => '',
  redirectUrl: null,
  showClose: false,
  title: null,
  titleConfirm: null,
  trialRequest: false,
  unlockFunction: false,
  virtualTour: null,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(BrixelUpgradeMessage);
