/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonIcon, BrixelButtonPrimary } from '@brixel/brixel-components';
import TeaserImg from '../images/TeaserBanner.png';
import TeaserImg2x from '../images/TeaserBanner@2x.png';

const TeaserBanner = (props) => {
  const {
    className,
  } = props;

  const [isClosed, setIsClosed] = useState(localStorage.getItem('isBannerClosed'));
  const [animClass, setAnimClass] = useState(false);

  const smallBannerRef = useRef(null);
  // const smallBannerEl = smallBannerRef.current;
  const teaserRef = useRef(null);
  const teaserEl = teaserRef.current;

  // URL PARAMS
  // const propID = history.location.pathname.split('/')[1];

  // WHEN CLICK ON UPGRADE BUTTON
  /* const onRequest = () => {
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propID}/trialRequest`);
  };
 */
  useEffect(() => {
    localStorage.setItem('isBannerClosed', isClosed);
  }, [isClosed]);

  useEffect(() => {
    if (teaserEl) console.log(teaserEl.offsetHeight);
  });

  return (
    <>
      {
        isClosed === 'yes' && (
          <div
            ref={smallBannerRef}
            className={`teaserBanner ${isClosed !== 'yes' ? 'opned' : ''} smallBanner dis-f`}
          >
            <span className="teaserTag as-c"> Free </span>
            <span className="pl-2 body2 txtDark700"> Request your free scan and estimation now. </span>
            <span className="ml-1 link body2 txtPrimary400 fweight-500 td-u">Read more </span>
          </div>
        )
      }

      {
        isClosed !== 'yes' && (
          <div
            ref={teaserRef}
            className={`teaserBanner bigBanner ${animClass ? 'closeBanner' : ''} p-1 mb-2 dis-f bgWhite brdRadius w-perc-100 w-perc-md-80 ml-a mr-a ${className}`}
            // eslint-disable-next-line no-nested-ternary
            style={{ height: `${teaserEl ? teaserEl.offsetHeight : ''}px` }}
          >
            <div className="max-w-fix-224 pos-r">
              <span className="teaserTag pos-a-fix x-b-1 x-r-2"> Free </span>
              <picture>
                <source srcSet={`${TeaserImg} 1x, ${TeaserImg2x} 2x`} />
                <img width="225" height="100%" className="h-perc-100" src={TeaserImg} alt="" />
              </picture>
            </div>
            <div className="dis-fl-col w-perc-100 w-perc-md-90 pl-2">
              <h5 className="pl-2 pt-1"> Request your free photo scan and estimation. </h5>
              <p className="p-2 body txtDark700">Do you want to capture your property in its best possible light? Request a free on-site appointment by one of our experts.</p>
              <BrixelButtonPrimary
                label="Tell me more"
                rounded
                className="as-fe"
                /* onClick={() => onRequest()} */

              />
            </div>
            <div className="ml-a">
              <BrixelButtonIcon
                color="dark"
                saturationTxt={400}
                bgTransparent
                noBorder
                className="shadow-2dp as-c"
                icon="close-small"
                onClick={() => {
                  setAnimClass(true);
                  setTimeout(() => {
                    setIsClosed('yes');
                  }, 650);
                }}
              />
            </div>
          </div>
        )
      }

    </>
  );
};

TeaserBanner.propTypes = {
  className: PropTypes.string,
  // history: PropTypes.object.isRequired,
};

TeaserBanner.defaultProps = {
  className: '',
};

export default TeaserBanner;
