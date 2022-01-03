/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EmptyHubImg from '../../../images/emptyHub.svg';
import { getActiveSingleCompany } from '../../../actions/CompanyActions';

const EmptyProperty = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    handleGetActiveSingleCompany,
  } = props;

  // REDIRECT TO NO-PROPERTY AND LOAD brixel_zurich AS DEFAULT COMPANY
  useEffect(() => {
    history.push('/sell');
    handleGetActiveSingleCompany({ stub: 'brixel_zurich' });
  }, []);

  return (
    <div className="bgWhite brdRadius ta-c p-3 p-lg-5 shadow-2dp">
      <img src={EmptyHubImg} alt="Emtpy Hub" />
      <h5 className="ta-c mt-3 mb-2">Anybody home?</h5>
      <p className="ta-c txtDark200 max-w-fix-320 m-a">For using the Brixel Hub you need at least one property.</p>
      <BrixelButtonPrimary
        rounded
        className="m-a mt-3"
        label="Add property now"
        rightIcon="arrow-right"
        onClick={() => history.push('/packageFlow/getStarted')}
      />
    </div>
  );
};

EmptyProperty.propTypes = {
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
});

export default connect(null, mapDispatchToProps)(EmptyProperty);
