import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
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
    history,
    match,
  } = props;
  useEffect(() => {
    const data = {
      limit: 1,
      offset: 0,
      setAsSingle: true,
    };
    handleGetProperties(data);
  }, []);


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
  match: PropTypes.object.isRequired,
};

Dashboard.defaultProps = {

};

const mapStateToProps = (state, props) => ({
});

const mapDispatchToProps = (dispatch) => ({
  handleGetProperties: bindActionCreators(getProperties, dispatch),
  handleGetProperty: bindActionCreators(getProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
