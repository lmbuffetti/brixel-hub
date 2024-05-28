import React, {useEffect} from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import get from 'lodash/get';
import {BrixelButtonPrimary, FormatValue, Helpers} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import last from 'lodash/last';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
import {getUserProperties} from '../../../actions/UserActions';
import {spinnerOff} from '../../../actions/CommonActions';
import type {PropertiesDashboardType} from '../../../@types/Pages/Dashboard/Seller/PropertiesDashboard';

const PropertiesDashboard = (props: PropertiesDashboardType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    form,
    handleGetUserProperties,
    handleSpinnerOff,
    lang,
    loggedInUser,
    userProperties,
  } = props;
  // STATE
  // const [userType, setUserType] = useState();
  // URL PARAMS
  const getFact = () => last(history.location.pathname.split('/'));
  const propID = get(match, 'propID', null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    if (!form.Property) handleSpinnerOff();
  }, []);

  // GET USER PROPERTIES LIST
  useEffect(() => {
    if (get(loggedInUser, 'user.id')) {
      handleGetUserProperties(loggedInUser.id);
    }
  }, [loggedInUser, propID]);

  const openCloseColumn = () => {
    if (
      (history.location.pathname.includes('facts') && getFact() !== 'facts') ||
      (history.location.pathname.includes('edit'))
    ) {
      return 'closed';
    }
    return 'opened';
  };

  const showPrice = (property) => {
    const currency = get(property, 'price.currency', '');
    return (
      <>
        {
          property.status === 'on-request' && (
            <span>On Request</span>
          )
        }
        {
          property.status === 'sold' && (
            <span>Sold</span>
          )
        }
        {
          property.status === 'reserved' && (
            <span>Reserved</span>
          )
        }
        {
          property.status === 'to-rent' && (
            <>
              <span className="notranslate">{currency}&nbsp;</span>
              <span className="notranslate">{Helpers.formatNumberValue(+get(property, 'price.rent', 0), get(property, 'price.currency', ''))}</span>
            </>
          )
        }
        {
          (!property.status || property.status === 'on-sale') && (
            <>
              <span className="notranslate">{currency}&nbsp;</span>
              <span className="notranslate">{Helpers.formatNumberValue(+get(property, 'price.total', 0), get(property, 'price.currency', ''))}</span>
            </>
          )
        }
      </>
    );
  };

  return (
    <>
      <div className="property-container seller-properties jc-c h-perc-lg-100 pos-r a-t" id="propertyDashboard">
        <div>
          <div className={`dis-f jc-fe mb-3 ${userProperties.length === 0 ? 'mt-3' : ''}`}>
            <BrixelButtonPrimary
              label="Create new"
              rightIcon="plus"
              rounded
              onClick={() => history.push(`/packageFlow/getStarted?company=${get(loggedInUser, 'company.stub', '')}`)}
            />
          </div>
          <div className="properties listings-wrapper w-perc-100 px-1">
            <div className="listings-section p-0 w-perc-100 dis-fl-col jc-b row-a-b col-12 pt-1">

              {
                userProperties.map((property, i) => (
                  <div
                    key={`usrPro_${i.toString()}`}
                    className="results dis-f shadow-3dp mb-3 a-c bgWhite brdRadius cur-poi"
                    onClick={() => history.push(`/${property.id}/home`, { state: { section: 'Sell' } })}
                  >
                    <div className="row-section p-1 avatar-container dis-f a-c ov-h flex-112">
                      <Link
                        className="cur-po"
                        to={{
                          pathname: `/buyer/${property.id}/property`,
                        }}
                      >
                        <CoverPropertyImage
                          size="S"
                          coverPhoto={get(property, 'coverPhoto.url', undefined)}
                          className="avatar w-fix-96 h-fix-96 pos-r brdRadius"
                        />
                      </Link>
                    </div>

                    <div className="row-section name p-1 notranslate w-perc-100 max-w-fix-304">
                      <div className="wrapper dis-fl-col a-bl">
                        <Link
                          className="link fsize-300 fweight-500 txtText900 body2"
                          to={{
                            pathname: `/buyer/${property.id}/property`,
                          }}
                        >
                          {property.title}
                        </Link>
                      </div>
                    </div>

                    <div className="dis-f w-perc-100 min-w-fix-360 max-w-fix-600 mt-1 mt-sm-0 px-2 jc-b ml-a">
                      <div className="px-1">
                        <h6 className="fsize-100 txtText600">{translateTo('Price', lang)}</h6>
                        <div className="txtGreen400 ff-mono">{showPrice(property)}</div>
                      </div>

                      <div className="px-1">
                        <h6 className="fsize-100 txtText600 ws-nw">{translateTo('Rooms', lang)}</h6>
                        <span className="ff-mono txtText900">
                          {FormatValue.formatRooms(get(property, 'properties.typology.bedrooms', 0), get(property, 'location.countryCode', 'CH'))}
                        </span>
                      </div>
                      <div className="px-1">
                        <h6 className="fsize-100 txtText600 ws-nw">{translateTo('Living space', lang)}</h6>
                        <span className="ff-mono txtText900">{get(property, 'properties.typology.livingArea.value', '0')} m</span>
                      </div>
                      <div className="px-1">
                        <h6 className="fsize-100 txtText600 ws-nw">{translateTo('Year', lang)}</h6>
                        <span className="ff-mono txtText900">
                          {get(property, 'properties.building.built', '0000')}
                        </span>
                      </div>
                    </div>

                  </div>
                ))
              }
            </div>
          </div>
        </div>
        {
          getFact() !== 'property' && (
            <div className={`levelsWrapper w-perc-100 zIndex2 ${openCloseColumn() === 'opened' ? 'ml-lg-1 closed' : 'opened'}`} />
          )
        }
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  form: get(state, 'brixelForm', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  property: get(state, 'property.activeSingleProperty', {}),
  userProperties: get(state, 'user.userProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetUserProperties: bindActionCreators(getUserProperties, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(PropertiesDashboard);
