import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BrixelButtonPrimary } from '@brixel/brixel-components';

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
    unlockFunction,
  } = props;
  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];
  // STATE
  const [showUnlockMessage, setShowUnlockMessage] = useState(false);

  const onUpgrade = () => {
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propID}/upgrade`);
  };

  return (
    <>
      {
        showUnlockMessage ? (
          <div className={`brixel-upgrade-message bgPrimary100 ta-c brdRadius ${className}`}>
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
          <div className={`brixel-upgrade-message bgGreen100 ta-c brdRadius ${className}`}>
            <h5 className="txtGreen700">{title}</h5>
            <p className="mt-3 mb-3 max-w-fix-280 m-a txtDark700">{description}</p>
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
      </>
  )
};

BrixelUpgradeMessage.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.string,
  title: PropTypes.string,
};

BrixelUpgradeMessage.defaultProps = {
  className: '',
  description: null,
  isSmallLoading: null,
  title: null,
};

export default withRouter(BrixelUpgradeMessage);
