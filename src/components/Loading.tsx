import React from 'react';
import logoNorm from '@brixel-io/brixel-components/dist/configuration/images/logo.svg';
import type {LoadingType} from '../@types/components/Laoding';

// COMPONENT FOR THE FULL SCREEN SPINNER
function Loading(props: LoadingType) {
  const {
    isLoading = false,
    isSmall = false,
    skeleton = false,
  } = props;

  if (isLoading) {
    return (
      <>
        {
          skeleton ? (
            <div className="max-w-fix-1024">
              <p className="h-fix-32 mb-3 skeletonBg w-fix-56"> </p>
              <div className='w-perc-100 brdRadius skeletonBg h-fix-304'/>
              <div className="dis-f mt-4">
                <div className='w-perc-50 brdRadius skeletonBg mr-2 h-fix-304' />
                <div className='w-perc-50 brdRadius skeletonBg ml-2 h-fix-304' />
              </div>
            </div>
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

export default Loading;
