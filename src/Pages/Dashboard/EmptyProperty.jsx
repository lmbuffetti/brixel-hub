import React from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import EmptyHubImg from '../../images/emptyHub.svg';

const EmptyProperty = (props) => {
  // PROPS
  const {
    history
  } = props;

  return (
    <div className="bgWhite brdRadius ta-c p-3 p-md-5 shadow-1dp">
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
  )
};

EmptyProperty.propTypes = {
  history: PropTypes.object.isRequired
};

export default EmptyProperty;
