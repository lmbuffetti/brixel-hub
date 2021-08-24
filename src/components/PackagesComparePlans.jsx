import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';

export const PackagesComparePlans = (props) => {
  const {
    windowDimensions,
  } = props;

  return (
    <div className="comparePlans">
      <table>
        <thead>
          <tr>
            <td />
            <th>Basic</th>
            <th>Premium</th>
            <th>Deluxe</th>
            <th>Business</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Feature 1</th>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <th>Feature 2</th>
            <td>❌</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <th>Feature 3</th>
            <td>❌</td>
            <td>❌</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <th>Feature 4</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
            <td>✔</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

PackagesComparePlans.propTypes = {
  windowDimensions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default connect(mapStateToProps, null)(PackagesComparePlans);
