import React from 'react';
import PropTypes from 'prop-types';
import logoNorm from '@brixel/brixel-components/dist/configuration/images/logo.svg';

// COMPONENT FOR THE FULL SCREEN SPINNER
function Loading(props) {
  const { isLoading, isSmall, skeleton } = props;
  if (isLoading) {
    return (
      <>
        {
          skeleton ? (
            <div>loading...</div>
          ) : (
            <div className={`elem-loader elem-overlay ${isSmall ? 'small' : 'large'}`}>
              <div className="loader">
                <img loading="lazy" className="logo dis-b" src={logoNorm} alt="Brixel Logo" id="header-logo" />
                <svg className="circular" viewBox="25 25 50 50">
                  <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
                </svg>
              </div>
            </div>
          )
        }
      </>
    );
  }
  return null;
}

Loading.propTypes = {
  isLoading: PropTypes.bool,
  isSmall: PropTypes.bool,
  skeleton: PropTypes.bool,
};

Loading.defaultProps = {
  isLoading: false,
  skeleton: false,
  isSmall: false,
};

export default Loading;
