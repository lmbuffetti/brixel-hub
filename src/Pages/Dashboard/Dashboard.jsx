/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import last from 'lodash/last';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelTabs } from '@brixel/brixel-components';
import { getProperties, getProperty, updateProperty } from '../../actions/PropertyActions';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
import { getCalcSectionInputSheets } from '../../utils/helpers';
import { InputSheets } from '../../resources/inputSheets';

const HomeDashboard = Loadable({
  loader: () => import('./HomeDashboard' /* webpackChunkName: "HomeDashboard" */),
  loading: Loading,
});

const PropertyDashboard = Loadable({
  loader: () => import('./PropertyDashboard' /* webpackChunkName: "PropertyDashboard" */),
  loading: Loading,
});

const SupportDashboard = Loadable({
  loader: () => import('./SupportDashboard' /* webpackChunkName: "SupportDashboard" */),
  loading: Loading,
});

const Dashboard = (props) => {
  // PROPS
  const {
    handleGetProperties,
    handleGetProperty,
    handleSaveProperty,
    history,
    loggedUser,
    match,
    property,
  } = props;

  // STATE
  const [widthWindow, setWindowWidth] = useState(get(window, 'innerWidth', 0));

  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);
  const checkActiveTab = () => last(history.location.pathname.split('/'));

  useEffect(() => {
    if (propID) {
      handleGetProperty({id: propID});
    } else {
      const data = {
        limit: 1,
        offset: `0/?owner=${loggedUser.user.id}`,
        setAsSingle: true,
      };
      handleGetProperties(data);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    }
  }, []);

  useEffect(() => {
    if (!propID && property.id) {
      history.push(`/${property.id}/home`);
    }
    const getPercComplete = get(property, 'inputSheet.totalComplete', null);
    if (property.id && !getPercComplete) {
      const getPerc = getCalcSectionInputSheets(InputSheets('en'), property, {});
      const data = {
        skipSection: getPerc.section.section,
        totalComplete: getPerc.section.percComplete,
      };
      handleSaveProperty({id: propID, inputSheet: data});
    }
  }, [property]);

  return (
    <div className="container" id="dashboard">
      <BrixelTabs
        classNameLi="pt-2 dis-fl-col"
        classNameUl="nav-tabs zIndex4"
        labels={['Home', 'Property', 'Support']}
        clicksList={['home', 'property', 'support']}
        labelsIcons={['star', 'star', 'star']}
        classNameArray={['order-md-2 homeTab', 'order-md-1 propertyTab', 'order-md-3 supportTab']}
        activeTab={checkActiveTab()}
        fullWidth
        onClick={(val) => history.push(val)}
        showFull={widthWindow > 768}
        arrayComponents={[
          <HomeDashboard />,
          <PropertyDashboard />,
          <SupportDashboard />,
        ]}
      />
    </div>
  )
};

Dashboard.propTypes = {
  handleGetProperties: PropTypes.func.isRequired,
  handleGetProperty: PropTypes.func.isRequired,
  handleSaveProperty: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Dashboard.defaultProps = {

};

const mapStateToProps = (state) => ({
  loggedUser: get(state, 'user.loggedUser', {}),
  property: get(state, 'property.property', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetProperties: bindActionCreators(getProperties, dispatch),
  handleGetProperty: bindActionCreators(getProperty, dispatch),
  handleSaveProperty: bindActionCreators(updateProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
