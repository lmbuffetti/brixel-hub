/* global Transifex */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import Cookies from 'universal-cookie';
import { BrixelDropdown, BrixelButtonIcon, BrixelIcon, BrixelModal } from '@brixel/brixel-components';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import logoNorm from '@brixel/brixel-configuration-partner/src/images/logo.svg';
import Loadable from 'react-loadable';
import { setCookie } from '../utils/helpers';
import { setLanguage } from '../actions/CommonActions';
import { translateTo } from '../utils/translation';

const cookies = new Cookies();

const AvatarImage = Loadable({
  loader: () => import('./AvatarImage' /* webpackChunkName: "AvatarImage" */),
  loading: () => '',
});

function PageHeader(props) {
  // PROPS
  const {
    lang, languages, loggedUser, userAwards, userBrixelPoint, handleSetLanguage,
  } = props;
  // STATE
  const [currentLang, setCurrentLang] = useState(lang);
  const [dropLang, setDropLang] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (loggedUser && loggedUser.user) {
      const langUsr = loggedUser.user.language;
      setCurrentLang(lang);
      handleSetLanguage(lang);
      setCookie('brixelLang', langUsr);
    }
  }, [loggedUser]);

  useEffect(() => {
    const drpLng = [];
    languages.map((lng, i) => {
      drpLng[i] = {
        value: lng.value,
        label: lng.label.replace('_US', ''),
      }
    });
    setDropLang(drpLng);
  }, [languages]);

  const newLang = (e, langCode) => {
    e.stopPropagation();
    setCurrentLang(langCode.value);
    handleSetLanguage(langCode.value);
    setCookie('brixelLang', langCode.value);
  };

  return (
    <>
      <header className="shadow-1dp">
        <div className={`container dis-f a-c jc-b p-1 h-fix-56 pos-r zIndex5`}>
          <img className="logo dis-b max-h-perc-100" src={logoNorm} alt="Brixel Logo" id="header-logo" />
          <div className="dis-f a-c">
            {
              Object.keys(userAwards).length > 0 && (
                <div className="cur-poi" onClick={() => setModal('awards')}>
                  <BrixelIcon className="mr-1" color="green" saturationTxt={600} icon="first-time-occupancy" />
                  <span className="ff-mono txtGreen600">{Object.keys(userAwards).length}</span>
                </div>
              )
            }
            {
              Object.keys(userBrixelPoint).length > 0 && (
                <div className="cur-poi ml-2" onClick={() => setModal('brixelPoint')}>
                  <BrixelIcon className="mr-1" color="red" saturationTxt={600} icon="mosaic" />
                  <span className="ff-mono txtRed600">{userBrixelPoint.reduce((prev,next) => prev + next.point,0)}</span>
                </div>
              )
            }
            {
              !loggedUser.token ? (
                <div className="">
                  <BrixelDropdown
                    bgTransparent
                    noBorder
                    className="langMenu"
                    color="dark"
                    saturationTxt={700}
                    lang={lang}
                    keyType="label"
                    selected={currentLang}
                    options={dropLang}
                    onSelect={(e, keys) => newLang(e, keys)}
                    liClass="tt-low"
                  />
                </div>
              ) : (
                <div className="ml-2">
                  <AvatarImage
                    avatarImg={ loggedUser.user.avatar && loggedUser.user.avatar[0] ? `${getConfigEnv.shortPath}${loggedUser.user.avatar[0].thumbnailPath}` : null}
                    name={loggedUser.user.name}
                    size={40}
                  />
                </div>
              )
            }
          </div>
        </div>

      </header>
      {
        modal && (
          <>
            {
              modal === 'awards' && (
                <BrixelModal
                  title={translateTo(lang, "Awards")}
                  titleIcon="first-time-occupancy"
                  background="green"
                  saturation={200}
                  color="green"
                  saturationTxt={600}
                  onClose={() => setModal(false)}
                >
                  <p>{translateTo(lang, "Who does not like awards? To honor your effort and endurance we award you for specific achievements.")}</p>
                  <p>{translateTo(lang, "Keep on going to collect more and enjoy the ride.")}</p>
                </BrixelModal>
              )
            }
            {
              modal === 'brixelPoint' && (
                <BrixelModal
                  title={translateTo(lang, "Brixels")}
                  titleIcon="mosaic"
                  background="red"
                  saturation={200}
                  color="red"
                  saturationTxt={600}
                  onClose={() => setModal(false)}
                >
                  <p>{translateTo(lang, "This is our currency you can earn by fullfilling tasks along the way.")}</p>
                  <p>{translateTo(lang, "During your journey you can use Brixels to unlock addintional features and gifts.")}</p>
                  <p>{translateTo(lang, "So keep collecting your Brixels.")}</p>
                </BrixelModal>
              )
            }
          </>
        )
      }
    </>
  );
}

PageHeader.propTypes = {
  handleSetLanguage: PropTypes.func.isRequired,
  languages: PropTypes.arrayOf(PropTypes.object),
  lang: PropTypes.string,
  loggedUser: PropTypes.object,
  userAwards: PropTypes.arrayOf(PropTypes.object),
  userBrixelPoint: PropTypes.arrayOf(PropTypes.object)
};

PageHeader.defaultProps = {
  languages: [],
  loggedUser: {},
  noMenu: false,
  userAwards: [],
  userBrixelPoint: [],
  withShadow: false,
};

const mapStateToProps = (state) => ({
  loggedUser: get(state, 'user.loggedUser', {}),
  languages: get(state, 'common.languages', []),
  lang: get(state, 'common.language', []),
  userAwards: get(state, 'user.awards', []),
  userBrixelPoint: get(state, 'user.brixelPoint', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageHeader));
