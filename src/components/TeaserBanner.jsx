/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { setCookie, getCookie, isEligible } from '../utils/helpers';
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

  if (
    !history.location.pathname.includes('rewards') &&
    !history.location.pathname.includes('listings') &&
    !history.location.pathname.includes('property') &&
    !isEligible()
  ) {
    return <span />;
  }
  const classToHide = get(history, 'location.state.hideBackPage', false);
  return (
    <div className={`teaserWrapper container ${isClosed ? 'smallOn' : 'bigOn'} ${classToHide ? 'hide' : ''}`}>
      <div>
        <div
          ref={teaserRef}
          className={`teaserBanner bigBanner dis-f bgWhite brdRadius w-perc-100 ${className}`}
          style={{ marginTop: `${isClosed ? `-${bannerHeight()}` : '0'}px` }}
        >
          <div className="teaserImage pos-r">
            <span className="teaserTag pos-a-fix x-b-1 x-l-2"> Free </span>
            <picture>
              <source srcSet={`${TeaserImg} 1x, ${TeaserImg2x} 2x`} />
              <img className="h-perc-100" src={TeaserImg} alt="" />
            </picture>
          </div>
          <div className="bannerContent dis-fl-col w-perc-100 max-w-fix-600">
            <h5 className="">Request your free photo scan and estimation. </h5>
            <p className="body txtDark700">Do you want to capture your property in its best possible light? Request a free on-site appointment by one of our experts.</p>
            <BrixelButtonPrimary
              label="Tell me more"
              rounded
              className="as-fs"
              onClick={() => openTrialRequestFlow()}
            />
          </div>
          <div className="ml-a closeBtn">
            <BrixelButtonIcon
              theme="dark"
              small
              bgTransparent
              ghost
              className="as-c"
              icon="close-small"
              onClick={() => setIsClosed(!isClosed)}
            />
          </div>
        </div>
        <div
          ref={smallBannerRef}
          className="teaserBanner brdRadius smallBanner dis-f"
          style={{ marginTop: `${isClosed ? '0' : `-${bannerHeightSmall()}`}px` }}
        >
          <span className="teaserTag as-c">Free</span>
          <p className="pl-2 body2 txtDark700">
            <span>Request your free scan and estimation now.</span>
            <span
              onClick={() => setIsClosed(!isClosed)}
              className="fsize-300 fweight-500 txtPrimary400 cur-poi ml-1 td-u p-0 btnInline"
            >
              Read more
            </span>
          </p>
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
