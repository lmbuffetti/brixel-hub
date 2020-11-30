import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonIcon, BrixelButtonPrimary } from '@brixel/brixel-components';
import defaultCover from '../images/3d-tour-placeholder.jpg';
import { isEligible } from '../utils/helpers';

const BrixelUpgradeMessage = (props) => {
  const {
    activeSingleProperty,
    btnLabel,
    className,
    history,
    title,
    description,
    titleConfirm,
    isSmallLoading,
    descriptionConfirm,
    onClick,
    onClose,
    redirectUrl,
    showClose,
    unlockFunction,
    trialRequest,
    virtualTour,
  } = props;
  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];
  // STATE
  const [showUnlockMessage, setShowUnlockMessage] = useState(false);
  const [showTour, setShowTour] = useState(false);

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
    <div className={`brixel-upgrade-message ta-c brdRadius ${className} ${bgColor}`}>
      {
        // CONDITION TO SHOW/HIDE THE CLOSE ICON
        showClose && (
          <div className="dis-f hide-md a-c mb-3">
            <BrixelButtonIcon
              className="shadow-3dp bgWhite"
              icon="arrow-simple-left"
              color="primary"
              saturationTxt={400}
              noBorder
              onClick={() => onClose()}
            />
            {/* <h5 className="ml-2 body fweight-500 sectionTitle">
              Porperty
            </h5> */}
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
                label="Cancel"
                background="white"
                saturation={0}
                color="dark"
                saturationTxt={700}
                onClick={() => setShowUnlockMessage(false)}
              />
              <BrixelButtonPrimary
                rounded
                className="ml-1"
                label="Order now"
                background="primary"
                isLoading={isSmallLoading !== null}
                saturation={400}
                onClick={() => onClick()}
              />
            </div>
          </div>
        ) : (
          <div className="bgGreen100 pb-3">
            <h5 className="txtGreen700">{title}</h5>
            <p className="mt-3 mb-3 max-w-fix-360 m-a txtDark700" dangerouslySetInnerHTML={{ __html: description }} />
            {
              // CONDITION TO SHOW MESSAGE OR DEFAULT DEFAULT TOUR IF TOUR 3D
              virtualTour && (
                <div className="my-5">
                  {
                    showTour ? (
                      <div className="ta-c">
                        <iframe
                          className="min-h-fix-320"
                          width="100%"
                          height="100%"
                          src={virtualTour}
                          allow="vr"
                          frameBorder="0"
                          allowFullScreen
                          title="Virtual Tour"
                        />
                      </div>
                    ) : (
                      <div className="pos-r brdRadius ov-h">
                        <img
                          className="dis-b"
                          src={defaultCover}
                          alt="Cover"
                        />
                        <div className="pos-a w-perc-100 h-perc-100 bgBlack opacity5" />
                        <div className="pos-a xy-c">
                          <BrixelButtonIcon
                            noBorder
                            padding={16}
                            icon="play-fill"
                            background="white"
                            saturation={0}
                            color="primary"
                            fontSize={16}
                            className="m-a opacity8"
                            saturationTxt={400}
                            onClick={() => setShowTour(true)}
                          />
                          <p className="ta-c txtWhite mt-2">Example 3D-Tour</p>
                        </div>
                      </div>
                    )
                  }
                </div>
              )
            }
            <BrixelButtonPrimary
              rounded
              className="m-a"
              label={unlockFunction ? btnLabel || 'Unlock now' : btnLabel}
              background="red"
              saturation={400}
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
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.string,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
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
  isSmallLoading: null,
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
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(BrixelUpgradeMessage);
