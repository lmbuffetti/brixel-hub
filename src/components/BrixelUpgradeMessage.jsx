import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BrixelButtonIcon, BrixelButtonPrimary } from '@brixel/brixel-components';
import defaultCover from '../images/3d-tour-placeholder.jpg';
import get from 'lodash/get';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

const BrixelUpgradeMessage = (props) => {
  const {
    className,
    history,
    title,
    description,
    titleConfirm,
    isSmallLoading,
    descriptionConfirm,
    onClick,
    onClose,
    showClose,
    unlockFunction,
    virtualTour
  } = props;
  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];
  // STATE
  const [showUnlockMessage, setShowUnlockMessage] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const onUpgrade = () => {
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propID}/upgrade`);
  };

  const bgColor = showUnlockMessage ? "bgPrimary100" : "bgGreen100"

  return (
    <div className={`brixel-upgrade-message ta-c brdRadius ${className} ${bgColor}`}>
      {
        showClose && (
          <BrixelButtonIcon
            className="shadow-3dp"
            icon="arrow-simple-left"
            background="White"
            color="primary"
            saturationTxt={400}
            noBorder
            onClick={() => onClose()}
          />
        )
      }
      {
        showUnlockMessage ? (
          <div className="bgPrimary100">
            <h5 className="txtPrimary700">{titleConfirm}</h5>
            <p className="mt-3 mb-3 max-w-fix-280 m-a txtDark700" dangerouslySetInnerHTML={{ __html: descriptionConfirm}} />
            <div className="dis-f jc-b">
              <BrixelButtonPrimary
                rounded
                className="mr-1 w-perc-100 shadow-3dp"
                label="Cancel"
                background="white"
                saturation={0}
                color="dark"
                saturationTxt={700}
                onClick={() => setShowUnlockMessage(false) }
              />
              <BrixelButtonPrimary
                rounded
                className="ml-1 w-perc-100"
                label="Order now"
                background="primary"
                isLoading={isSmallLoading !== null}
                saturation={400}
                onClick={() => onClick() }
              />
            </div>
          </div>
        ) : (
          <div className="bgGreen100">
            <h5 className="txtGreen700">{title}</h5>
            <p className="mt-3 mb-3 max-w-fix-280 m-a txtDark700">{description}</p>
            {
              virtualTour && (
                <div className="mb-3">
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
                          <p className="ta-c txtWhite mt-2">Start 3D tour</p>
                        </div>
                      </div>
                    )
                  }
                </div>
              )
            }
            <BrixelButtonPrimary
              rounded
              className="m-a min-w-fix-176"
              label={unlockFunction ? "Unlock now" : "Upgrade now"}
              background="red"
              saturation={400}
              onClick={() => unlockFunction ? setShowUnlockMessage(true) : onUpgrade() }
            />
          </div>
        )
      }
      </div>
  )
};

BrixelUpgradeMessage.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.string,
  onClose: PropTypes.func,
  showClose: PropTypes.bool,
  title: PropTypes.string,
  virtualTour: PropTypes.string,
};

BrixelUpgradeMessage.defaultProps = {
  className: '',
  description: null,
  isSmallLoading: null,
  onClose: () => '',
  showClose: false,
  title: null,
  virtualTour: null,
};

export default withRouter(BrixelUpgradeMessage);
