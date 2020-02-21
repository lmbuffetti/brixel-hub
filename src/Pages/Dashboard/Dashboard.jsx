import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelTabs } from '@brixel/brixel-components';
import { getProperties, getProperty } from '../../actions/PropertyActions';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';

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
    history,
    loggedUser,
    match,
    property,
  } = props;
  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);

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
  }, []);

  useEffect(() => {
    if (!propID && property.title) {
      history.push(`/${property.id}/home`);
      if (property.inputSheet && property.inputSheet.totalComplete) {

      } else {

      }
    }
  }, [property]);

  return (
    <div className="container" id="dashboard">
      <BrixelTabs
        classNameLi="pt-2 dis-fl-col"
        classNameUl="nav-tabs"
        labels={['Home', 'Property', 'Support']}
        clicksList={['home', 'property', 'support']}
        labelsIcons={['star', 'star', 'star']}
        fullWidth
        onClick={(val) => history.push(val)}
        showFull
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
  loggedUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Dashboard.defaultProps = {

};

const mapStateToProps = (state, props) => ({
  loggedUser: get(state, 'user.loggedUser', {}),
  property: get(state, 'property.property', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetProperties: bindActionCreators(getProperties, dispatch),
  handleGetProperty: bindActionCreators(getProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
