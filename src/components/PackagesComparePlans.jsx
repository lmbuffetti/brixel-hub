import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';

export const PackagesComparePlans = (props) => {
  const {
    windowDimensions,
  } = props;

  return (
    <table>
      <tbody>
        <tr>
          <td>Test {windowDimensions.width}</td>
        </tr>
      </tbody>
    </table>
  );
};

PackagesComparePlans.propTypes = {
  windowDimensions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default connect(mapStateToProps, null)(PackagesComparePlans);
