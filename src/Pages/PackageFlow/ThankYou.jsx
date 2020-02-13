import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';

function ThankYou(props) {

  return (
    <main id="thankyou">
      <div className="container">
        <h1>Great. We received your request. You will receive our offer in your inbox shortly.</h1>
        <a href="https://brixel.ch/">Learn more on Brixel website</a>
      </div>
    </main>
  );
}

ThankYou.propTypes = {

};

ThankYou.defaultProps = {

};

const mapStateToProps = (state, props) => ({

});
const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ThankYou);
