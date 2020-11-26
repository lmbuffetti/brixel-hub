/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BrixelButtonIcon, BrixelButtonPrimary } from '@brixel/brixel-components';
import { setCookie, getCookie } from '../utils/helpers';
import TeaserImg from '../images/scanTrial/TeaserBanner.png';
import TeaserImg2x from '../images/scanTrial/TeaserBanner@2x.png';

const TeaserBanner = (props) => {
  const {
    className,
    history,
  } = props;

  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];

  const [isClosed, setIsClosed] = useState(getCookie('brixelBannerClosed') === 'true');
  // const [animClass, setAnimClass] = useState(false);

  const smallBannerRef = useRef(null);
  const smallBannerEl = smallBannerRef.current;
  const teaserRef = useRef(null);
  const teaserEl = teaserRef.current;

  useEffect(() => {
    setCookie('brixelBannerClosed', isClosed);
  }, [isClosed]);

  const openTrialRequestFlow = () => {
    setIsClosed(!isClosed);
    setCookie('brixelBannerClosed', true);
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propID}/trialRequest`);
  };

  /* const closeBanner = () => {
    setAnimClass(true);
    setTimeout(() => {
      setIsClosed(true);
    }, 650);m
  }; */

  const bannerHeight = () => {
    let height;
    if (teaserEl) height = teaserEl.offsetHeight;
    return height;
  };
  const bannerHeightSmall = () => {
    let height;
    if (smallBannerEl) height = smallBannerEl.offsetHeight;
    return height;
  };

  return (
    <div className={`teaserWrapper ${isClosed ? 'smallOn' : 'bigOn'} hide`}>
      <div>
        <div
          ref={teaserRef}
          className={`p-2 teaserBanner bigBanner dis-f bgWhite brdRadius w-perc-100 ${className}`}
          style={{ marginTop: `${isClosed ? `-${bannerHeight()}` : '0'}px` }}
        >
          <div className="max-w-fix-224 pos-r">
            <span className="teaserTag pos-a-fix x-b-1 x-l-2"> Free </span>
            <picture>
              <source srcSet={`${TeaserImg} 1x, ${TeaserImg2x} 2x`} />
              <img width="225" height="100%" className="h-perc-100" src={TeaserImg} alt="" />
            </picture>
          </div>
          <div className="dis-fl-col w-perc-100 max-w-fix-600 pl-3">
            <h5 className="pt-1">Request your free photo scan and estimation. </h5>
            <p className="pt-2 pb-2 pr-2 body txtDark700">Do you want to capture your property in its best possible light? Request a free on-site appointment by one of our experts.</p>
            <BrixelButtonPrimary
              label="Tell me more"
              rounded
              className="as-fs"
              onClick={() => {
                openTrialRequestFlow();
              }}

            />
          </div>
          <div className="ml-a">
            <BrixelButtonIcon
              color="dark"
              saturationTxt={400}
              bgTransparent
              noBorder
              className="as-c"
              icon="close-small"
              onClick={() => setIsClosed(!isClosed)}
            />
          </div>
        </div>
        <div
          ref={smallBannerRef}
          className="teaserBanner smallBanner dis-f"
          style={{ marginTop: `${isClosed ? '0' : `-${bannerHeightSmall()}`}px` }}
        >
          <span className="teaserTag as-c">Free</span>
          <span className="pl-2 body2 txtDark700">Request your free scan and estimation now.</span>
          <span
            className="ml-1 link body2 txtPrimary400 fweight-500 td-u cur-poi"
            onClick={() => {
              setIsClosed(!isClosed);
            }}
          >
            Read more
          </span>
        </div>
      </div>
    </div>
  );
};

TeaserBanner.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
};

TeaserBanner.defaultProps = {
  className: '',
};

export default withRouter(TeaserBanner);
