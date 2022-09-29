/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import translateTo from '../../../utils/translation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
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
    lang,
  } = props;

  // REDIRECT TO NO-PROPERTY AND LOAD brixel_zurich AS DEFAULT COMPANY
  useEffect(() => {
    history.push('/sell');
    handleGetActiveSingleCompany({ stub: 'brixel_zurich' });
  }, []);

  return (
    <div className="bgWhite brdRadius ta-c p-3 p-lg-5 shadow-2dp">
      <img loading="lazy" src={EmptyHubImg} alt="Emtpy Hub" />
      <h5 className="ta-c mt-3 mb-2">{translateTo('Anybody home?', lang)}</h5>
      <p className="ta-c txtDark200 max-w-fix-320 m-a">{translateTo('For using the Brixel Hub you need at least one property.', lang)}</p>
      <BrixelButtonPrimary
        rounded
        className="m-a mt-3"
        label={translateTo('Add property now', lang)}
        rightIcon="arrow-right"
        onClick={() => history.push('/packageFlow/getStarted')}
      />
    </div>
  );
};

EmptyProperty.propTypes = {
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmptyProperty);
