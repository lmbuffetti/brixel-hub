/* eslint-disable no-nested-ternary */
import React, { useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { setCookie, isEligible } from '../utils/helpers';
import TeaserImg from '../images/scanTrial/TeaserBanner.png';
import TeaserImg2x from '../images/scanTrial/TeaserBanner@2x.png';

const TeaserBanner = (props) => {
  const {
    className,
    history,
  } = props;

  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];

  const [isCollapsed] = useState(true);

  const smallBannerRef = useRef(null);
  const teaserRef = useRef(null);

  const openTrialRequestFlow = () => {
    setCookie('brixelBannerClosed', true);
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propID}/trialRequest`);
  };

  if (
    !history.location.pathname.includes('rewards') &&
    !history.location.pathname.includes('marketing') &&
    !history.location.pathname.includes('property') &&
    !isEligible()
  ) {
    return <span />;
  }
  const classToHide = get(history, 'location.state.hideBackPage', false);

  return (
    <div className={`teaserWrapper container ${isCollapsed ? 'smallOn' : 'bigOn'} ${classToHide ? 'hide' : ''}`}>
      <div>
        { isCollapsed ? (
          <>
            <div
              ref={smallBannerRef}
              className="teaserBanner brdRadius smallBanner dis-f"
              // style={{ marginTop: `${isCollapsed ? '0' : `-${bannerHeightSmall()}`}px` }}
            >
              <span className="teaserTag as-c">Free</span>
              <p className="pl-2 body2 txtDark700">
                <span>Test drive our service. No strings attached.</span>
                <span
                  onClick={() => openTrialRequestFlow()}
                  className="fsize-300 fweight-500 txtPrimary400 cur-poi ml-1 td-u p-0 btnInline"
                >
                  Read more
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div
              ref={teaserRef}
              className={`teaserBanner bigBanner dis-f bgWhite brdRadius w-perc-100 ${className}`}
              // style={{ marginTop: `${isCollapsed ? `-${bannerHeight()}` : '0'}px` }}
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
                  onClick={() => ''}
                />
              </div>
            </div>
          </>
        )}
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
