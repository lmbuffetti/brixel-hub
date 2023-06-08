import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {BrixelButtonIcon, BrixelButtonPrimary} from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
import defaultCover from '../images/3d-tour-placeholder.jpg';
import {isEligible} from '../utils/helpers';
import type {BrixelUpgradeMessageType} from '../@types/components/BrixelUpgradeMessage';

const BrixelUpgradeMessage = (props: BrixelUpgradeMessageType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };

  const {
    activeSingleProperty,
    btnLabel = 'Upgrade now',
    className = '',
    description,
    descriptionConfirm,
    isSmallLoading,
    lang,
    onClick = () => '',
    onClose = () => '',
    onOpentour,
    redirectUrl,
    showClose = false,
    title,
    titleConfirm,
    trialRequest = false,
    unlockFunction = false,
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

  const bgColor = 'bgBlue50';

  if (!isEligible(activeSingleProperty) && trialRequest) {
    return <span />;
  }

  return (
    <div className={`brixel-upgrade-message p-2 p-md-3 ta-c brdRadius ${className} ${bgColor}`}>
      {
        // CONDITION TO SHOW/HIDE THE CLOSE ICON
        showClose && (
          <div className="dis-f hide-md a-c mb-3">
            <BrixelButtonIcon
              icon="arrow-simple-left"
              bgTransparent
              onClick={() => onClose()}
            />
          </div>
        )
      }
      {
        // CONDITION TO SHOW THE MESSAGE TO UNLOCK OR THE CONFIRMATION MESSAGE
        showUnlockMessage ? (
          <div className="bgPrimary50">
            <h5 className="txtBlue700 fweight-600 mb-3">{titleConfirm}</h5>
            {
              descriptionConfirm && (
                <p
                  className="max-w-fix-360 m-a txtText700"
                  dangerouslySetInnerHTML={{ __html: descriptionConfirm }}
                />
              )
            }
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
          <div>
            <h5 className="txtBlue700 fweight-600">{title}</h5>
            {
              description && (
                <p
                  className="mt-1 mb-3 max-w-fix-504 m-a txtText700"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )
            }
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
                        bgTransparent
                        icon="play-fill"
                        className="m-a opacity8"
                        onClick={() => onOpentour ? onOpentour(virtualTour) : ''}
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
              theme="blue"
              themeSat={500}
              onClick={() => onClickBtn()}
            />
          </div>
        )
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(BrixelUpgradeMessage);
