/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelButtonIcon,
  BrixelIcon,
  Helpers,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import last from 'lodash/last';
import Sticker from 'react-stickyfill';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
import { getUserProperties } from '../../../actions/UserActions';

const HomeDashboard = (props) => {
  // PROPS
  const {
    handleGetUserProperties,
    history,
    loggedInUser,
    userProperties,
  } = props;
  // STATE
  // const [userType, setUserType] = useState();
  // URL PARAMS
  const getFact = () => last(history.location.pathname.split('/'));

  // GET USER PROPERTIES LIST
  useEffect(() => {
    if (get(loggedInUser, 'user.id')) {
      handleGetUserProperties(loggedInUser.user.id);
    }
  }, [loggedInUser]);

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
            <span c>Reserved</span>
          )
        }
        {
          property.status === 'to-rent' && (
            <>
              <span>{currency}&nbsp;</span>
              <span>{Helpers.formatNumberValue(+get(property, 'price.rent', 0))}</span>
            </>
          )
        }
        {
          (!property.status || property.status === 'on-sale') && (
            <>
              <span>{currency}&nbsp;</span>
              <span>{Helpers.formatNumberValue(+get(property, 'price.total', 0))}</span>
            </>
          )
        }
      </>
    );
  };

  return (
    <>
      <div className="property-container dis-f jc-c h-perc-md-100 pos-r a-t" id="propertyDashboard">
        <Sticker>
          <div className={`firstLevel bgLight100 expandableColumn ${openCloseColumn() === 'opened' ? 'mr-md-2' : 'collapsed'}`}>

            {
              userProperties.map((property, i) => (
                <div
                  key={i.toString()}
                  className="dis-f p-1 shadow-1dp brdRadius bgWhite mb-2 shadowHover-3dp cur-poi"
                  onClick={() => history.push(`/${property.id}/rewards`)}
                >
                  <div className="image-ratio squared w-fix-flex-80 h-fix-80 brdRadius ov-h mr-1">
                    <CoverPropertyImage coverPhoto={get(property, 'coverPhoto.thumbnailPath', null)} className="cover" />
                  </div>
                  <div className="w-perc-100 dis-fl-col jc-b">
                    <p className="body2 txtPrimary400">{property.title}</p>
                    <p className="dis-f a-c body2 fweight-600">{showPrice(property)}</p>
                    <div className="dis-f jc-b a-c w-perc-100">
                      <p className="dis-f a-c">
                        <BrixelIcon icon="bed" className="mr-1" />
                        <span className="ff-mono body2">{get(property, 'properties.typology.bedrooms', '0')}</span>
                      </p>
                      <p className="dis-f a-c">
                        <BrixelIcon icon="plans" className="mr-1" />
                        {
                          get(property, 'location.countryCode', '') === 'PT' && get(property, 'properties.typology.grossArea.value', 0) > 0 ? (
                            <span className="ff-mono body2">{get(property, 'properties.typology.grossArea.value', '0')} m</span>
                          ) : (
                            <span className="ff-mono body2">{get(property, 'properties.typology.livingArea.value', '0')} m</span>
                          )
                        }
                      </p>
                      <p className="dis-f a-c">
                        <BrixelIcon icon="house-built" className="mr-1" />
                        <span className="ff-mono body2">
                          {get(property, 'properties.building.built', '0000')}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </Sticker>
        <div className={`backButton jc-c mb-2 ${openCloseColumn() === 'closed' ? 'dis-b' : 'hide'}`}>
          <BrixelButtonIcon
            background="white"
            saturation={0}
            color="primary"
            saturationTxt={400}
            icon="arrow-simple-left"
            noBorder
            className="shadow-2dp"
            onClick={() => history.push('../facts')}
          />
        </div>
        {
          getFact() !== 'property' && (
            <div className={`levelsWrapper w-perc-100 zIndex2 ${openCloseColumn() === 'opened' ? 'ml-md-1 closed' : 'opened'}`} />
          )
        }
      </div>
    </>
  );
};

HomeDashboard.propTypes = {
  handleGetUserProperties: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  userProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

HomeDashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  userProperties: get(state, 'user.userProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  langConfig: get(state, 'common.language', ''),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  property: get(state, 'property.activeSingleProperty', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetUserProperties: bindActionCreators(getUserProperties, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(HomeDashboard);
