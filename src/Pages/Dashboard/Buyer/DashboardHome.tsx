import React, {useEffect, useState} from 'react';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  Helpers,
} from '@brixel-io/brixel-components';
import get from 'lodash/get';
import {DateTime} from 'luxon';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {setModal, spinnerOff} from '../../../actions/CommonActions';
import {getUserSearchProfiles} from '../../../actions/SearchProfileActions';
import DashboardPropertyCard from '../../../components/Cards/DashboardPropertyCard';
import ArticlesBox from '../../../components/CraftCMS/ArticlesBox';
import BannerBox from '../../../components/CraftCMS/BannerBox';

import Loading from '../../../components/Loading';
import financingSvg from '../../../images/dashboard/financingDashboard.svg';
import scheduleSvg from '../../../images/dashboard/PropertyVisit.svg';
import scheduleAcceptedSvg from '../../../images/dashboard/PropertyConfimedVisit.svg';
import PropertyCalendarSvg from '../../../images/dashboard/PropertyCalendar.svg';
import PropertyVisitedSvg from '../../../images/dashboard/propertyVisited.svg';
import PropertyCanceledSvg from '../../../images/dashboard/scheduleCanceled.svg';
import {getCookie, setCookie} from '../../../utils/helpers';
import translateTo from '../../../utils/translation';
import type {ContactType} from '../../../@types/Pages/Dashboard/Buyer/DashboardHome';
import BannerBuyerByStatus from '../../../components/BannerBuyerByStatus/BannerBuyerByStatus';

const DashboardHome = (props: ContactType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    isSmallLoading,
    lang,
    loggedInUser,
    scheduleVisit,
    userTypes = 'user',
  } = props;
  // STATE
  const [visitStatus, setVisitStatus] = useState<{status: string; text: string; color: string;bg: string;}>();
  const [progressState, setProgressState] = useState({step: 1});
  const [showFirstWelcomMessage, setShowFirstWelcomMessage] = useState(false);
  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (scheduleVisit) {
      const visitInfo = Helpers.visitDateStatus(scheduleVisit[0]);
      setVisitStatus(visitInfo);
    }
  }, [scheduleVisit && scheduleVisit[0]]);


  useEffect(() => {
    if (getCookie('brixelFirstTime') === 'true') {
      setShowFirstWelcomMessage(true);
      setCookie('brixelFirstTime', 'false');
    }
  }, []);

  useEffect(() => {
    if (activeSingleProperty.sellerStatus === 'success') setProgressState({step: 5});
  }, [activeSingleProperty.sellerStatus, activeSingleProperty.progress]);

  // UNTILE NO PROPERTY OR NO USER TYPE SHOW THE LOADING
  if ((!activeSingleProperty.id && !userTypes) || isSmallLoading.getProperty) {
    return <Loading />;
  }

  return (
    <div className="rewards-container" id="rewardsDashboard">

      <h4 className="mb-3 hide dis-b-lg fweight-600">
        {
          showFirstWelcomMessage ? (
            <span>{translateTo('Welcome back', lang)}</span>
          ) : (
            <span>{translateTo('Welcome', lang)}</span>
          )
        }
        <span className="ml-small-4"> {loggedInUser && (<>{loggedInUser.firstName}</>)} 👋 </span>
      </h4>

      <div className="max-w-fix-1024 dis-fl-col pr-md-2">

        <>

          <DashboardPropertyCard
            activeSingleCompany={activeSingleCompany}
            type="buy"
            lang={lang}
          />

          <div className="dis-fl-col dis-fl-row-sm">

            {
              propID && (
                <BannerBuyerByStatus
                  className="mr-1"
                  history={history}
                  lang={lang}
                  propID={propID}
                  status={visitStatus?.status || 'default'}
                  type="visit"
                  isLoading={!scheduleVisit}
                  customDescription={scheduleVisit ? DateTime.fromMillis(scheduleVisit[0].visit.date).toFormat('dd LLL yyyy, HH:mm', {locale: lang}) : ''}
                />
              )
            }

            {
              propID && (
                <BannerBuyerByStatus
                  className="ml-1"
                  history={history}
                  lang={lang}
                  propID={propID}
                  status={'cancelled'}
                  type="offer"
                  isLoading={!scheduleVisit}
                />
              )
            }
          </div>

          <div className="dis-fl-col dis-fl-row-sm mt-2">

            <button
              onClick={() => history.push(`/buyer/${propID}/financing`)}
              className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi bgWhite ta-l"
            >
              <div
                className="cardWithBg"
                style={{backgroundImage: `url(${financingSvg})`}}
              >
                <div className="dis-fl-col max-w-perc-70">
                  <h5 className="fweight-600">
                    {translateTo('Check financing', lang)}
                  </h5>
                  <div className="dis-f a-c w-perc-100 mt-1 mb-3">
                    <p className="pr-2 fsize-300 txtText700">
                      {translateTo('Assess whether you can afford your desired property.', lang)}
                    </p>
                  </div>

                  <BrixelButtonSecondary
                    rounded
                    onClick={() => ''}
                    className="mt-a as-fs"
                    label={translateTo('Calculate now', lang)}
                  />
                </div>
              </div>
            </button>
          </div>

          {
            progressState.step < 5 && (
              <>
                <ArticlesBox
                  activeSingleProperty={activeSingleProperty}
                  activeSingleCompany={activeSingleCompany}
                  lang={lang}
                  placementSlug="buyer-hub-home-onboarding-article"
                />

                <BannerBox
                  activeSingleCompany={activeSingleCompany}
                  className="mt-6"
                  lang={lang}
                  placementSlug="buyer-hub-home-banner-bottom"
                />
              </>
            )
          }
          {
            progressState.step === 5 && (
              <>
                <BannerBox
                  activeSingleCompany={activeSingleCompany}
                  title="Plane deine nächsten Schritte."
                  className="mt-6"
                  lang={lang}
                  placementSlug="buyer-hub-home-sold-banner-top"
                />

                <ArticlesBox
                  activeSingleProperty={activeSingleProperty}
                  activeSingleCompany={activeSingleCompany}
                  lang={lang}
                  placementSlug="buyer-hub-home-sold-partner"
                />

                <ArticlesBox
                  activeSingleProperty={activeSingleProperty}
                  activeSingleCompany={activeSingleCompany}
                  lang={lang}
                  placementSlug="buyer-hub-home-sold-articles"
                />

                <BannerBox
                  activeSingleCompany={activeSingleCompany}
                  className="mt-6"
                  lang={lang}
                  placementSlug="buyer-hub-home-sold-banner-bottom"
                />
              </>
            )
          }
        </>

      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  scheduleVisit: get(state, 'deal.scheduleVisit', null),
  searchProfile: get(state, 'user.userSearchProfiles[0]', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardHome);
