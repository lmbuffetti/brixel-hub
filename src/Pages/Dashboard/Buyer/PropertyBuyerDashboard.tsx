/* eslint-disable react-hooks/exhaustive-deps */
import React, {Suspense, useEffect} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate, useParams,} from 'react-router-dom';
import get from 'lodash/get';
import {BrixelButtonBox, BrixelButtonIcon,} from '@brixel/brixel-components';
import translateTo from '../../../utils/translation';
import {compose} from 'redux';
import {connect} from 'react-redux';
import last from 'lodash/last';
import Sticker from 'react-stickyfill';
import lazyWithRetry from '../../../components/LazyWithRetry';
import Loading from '../../../components/Loading';
import type {PropertyBuyerDashboardType} from '../../../@types/Pages/Dashboard/Buyer/PropertyBuyerDashbaord';

const PageBuyer = lazyWithRetry(() => import('./PageBuyer'));

const ContactBuyer = lazyWithRetry(() => import('./ContactBuyer'));

const PropertyBuyerDashboard = (props: PropertyBuyerDashboardType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleDeal,
    formValue,
    lang,
    windowDimensions,
  } = props;
  // STATE
  // const [userType, setUserType] = useState();
  // URL PARAMS
  const propID = get(match, 'propID', null);
  const getFact = () => last(history.location.pathname.split('/'));

  // ON DESKTOP REDIREECT TO /LISTINGS/PAGE
  useEffect(() => {
    if (windowDimensions && windowDimensions.width > 1024 && (getFact() === propID || getFact() === 'property')) {
      history.push({ pathname: `/buyer/${propID}/property/contact` });
    }
  }, [windowDimensions, getFact()]);

  // CLASS FOR OPEN/CLOSE COLUMNS
  const openCloseColumn = () => {
    if (
      (history.location.pathname.includes('facts') && getFact() !== 'facts') ||
      (history.location.pathname.includes('edit'))
    ) {
      return 'closed';
    }
    return 'opened';
  };

  // FUNCTION TO CALC NUMBER OF PHOTOS - FLOORPLANS - DOCUMENTS
  const calcLenght = (val) => {
    if (val) return val.length;
    return 0;
  };

  return (
    <>
      <div className="property-container dis-f jc-fs h-perc-lg-100 pos-r a-t" id="propertyDashboard">
        <div className="flex-1">
          <Sticker>
            {
              windowDimensions.width <= 1024 && (
                <div
                  className={`firstLevel expandableColumn ${openCloseColumn() === 'opened' ? 'mr-lg-2' : 'collapsed'}`}
                >
                  <div className="dis-f min-h-fix-136 mb-2">
                    <BrixelButtonBox
                      verticalView
                      bgTransparent
                      icon="message"
                      label={translateTo('Contact', lang)}
                      labelClass="fweight-400"
                      subtitle={get(formValue, 'contacts[0].name', '')}
                      subtitleClass="fsize-200 pt-small-6"
                      className={`w-perc-100 shadow-1dp ml-1 brdMedium ${getFact() === 'contact' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                      colorIcon="primary700"
                      backIcon="primary100"
                      onClick={() => history.push(`/buyer/${propID}/property/contact`)}
                    />
                  </div>

                  <div className="dis-f min-h-fix-136">
                    <BrixelButtonBox
                      verticalView
                      bgTransparent
                      icon="copy-link"
                      label={translateTo('Page', lang)}
                      labelClass="fweight-400"
                      subtitle=""
                      subtitleClass="fsize-200 pt-small-6"
                      className={`w-perc-100 shadow-1dp ml-1 brdMedium ${getFact() === 'page' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                      colorIcon="primary700"
                      backIcon="primary100"
                      onClick={() => history.push(`/buyer/${propID}/property/page`)}
                    />

                    <BrixelButtonBox
                      verticalView
                      bgTransparent
                      icon="folder"
                      label={translateTo('Docubox', lang)}
                      labelClass="fweight-400"
                      subtitle={`<span>${calcLenght(get(formValue, 'documents', []).filter((i) => !i.isPrivate))}</span>&nbsp;<span>${translateTo(calcLenght(get(formValue, 'documents', []).filter((i) => !i.isPrivate)) !== 1 ? 'Files' : 'File', lang)}</span>`}
                      subtitleClass={`fsize-200 pt-small-6 ${calcLenght(get(formValue, 'documents', []).filter((i) => !i.isPrivate)) >= 1 ? 'txtPrimary700' : 'txtDark200'}`}
                      className={`w-perc-100 shadow-1dp ml-1 brdMedium ${getFact() === 'docubox' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                      colorIcon="primary700"
                      backIcon="primary100"
                      onClick={() => history.push(`/buyer/${propID}/docubox`)}
                    />
                  </div>

                  <div className="dis-f mt-1 pr-lg-2 min-h-fix-136">
                    <BrixelButtonBox
                      verticalView
                      bgTransparent
                      icon="calendar"
                      label={translateTo('Showings', lang)}
                      labelClass={`fweight-400 ${windowDimensions.width <= 1024 ? 'w-perc-50' : 'w-perc-25'}`}
                      subtitle=""
                      subtitleClass="fsize-200 pt-small-6"
                      className={`w-perc-100 w-perc-lg-50 shadow-1dp ml-1 brdMedium ${getFact() === 'showings' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                      colorIcon="primary700"
                      backIcon="primary100"
                      onClick={() => history.push(`/buyer/${propID}/property/showings`)}
                    />

                    {
                      windowDimensions.width <= 1024 && (
                        <BrixelButtonBox
                          verticalView
                          bgTransparent
                          icon="money"
                          label={translateTo('Closing', lang)}
                          labelClass="fweight-400 w-perc-50"
                          subtitle=""
                          subtitleClass="fsize-200 pt-small-6"
                          className={`w-perc-100 min-h-fix-136 shadow-1dp brdMedium ${getFact() === 'deals' ? 'brdPrimary400 bgWhite' : 'brdTrans'} ml-1 p-2`}
                          colorIcon="primary700"
                          backIcon="primary100"
                          onClick={() => history.push(`/buyer/${propID}/closing/${activeSingleDeal.id}`)}
                        />
                      )
                    }

                  </div>

                </div>
              )
            }
          </Sticker>
          <div className={`backButton jc-c mb-2 ${openCloseColumn() === 'closed' ? 'dis-b' : 'hide'}`}>
            <BrixelButtonIcon
              ghost
              icon="arrow-simple-left"
              onClick={() => history.push('../page')}
            />
          </div>
        </div>
        {
          getFact() !== 'property' && (
            <div className={`levelsWrapper w-perc-100 zIndex2 ${openCloseColumn() === 'opened' ? 'ml-lg-1 closed' : 'opened'}`}>
              <Suspense fallback={<Loading isLoading />}>
                <Routes>
                  <Route path="/page" element={<PageBuyer />} />
                  <Route path="/contact/*" element={<ContactBuyer />} />
                  <Route path="*" element={<Navigate to={`/buyer/${propID}/property/page`} />} />
                </Routes>
              </Suspense>
            </div>
          )
        }
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  formValue: get(state, 'property.activeSingleProperty', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  property: get(state, 'property.activeSingleProperty', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(PropertyBuyerDashboard);
