import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import { getProperties } from '../actions/PropertyActions';

function Dashboard(props) {
  const {
    errorMsg,
    formValue,
    handleGetProperties,
    handleSetErrorMsg,
    history,
    properties,
  } = props;

  useEffect(() => {
    const data = {
      limit: 50,
      offset: 0,
    };
    handleGetProperties(data);
  }, []);

  const imgOrientation = (i) => {
    const el = document.getElementById(`galleryImg${i}`);
    const parEl = document.getElementById(`liImg${i}`);
    let imgClass = 'landscape';
    if (el && el.naturalWidth < el.naturalHeight) imgClass = 'portrait';
    parEl.classList.add(imgClass);
  };

  return (
    <main className="container">
      <h1>Dashboard</h1>
      <ul className="imgEffect">
        {
          properties.map((property, i) => (
            <li key={i.toString()} id={`liImg${i}`} className="mb-4">
              {
                property.coverPhoto && property.coverPhoto.thumbnailPath && (
                  <div
                    className="cover_img"
                    style={{ backgroundImage: `url(${getConfigEnv.shortPath}${property.coverPhoto.thumbnailPath})` }}
                  >
                    <img src={`${getConfigEnv.shortPath}${property.coverPhoto.bigPath}`} id={`galleryImg${i}`} onLoad={() => imgOrientation(i)} />
                  </div>
                )
              }
              <h3>{property.title}</h3>
            </li>
          ))
        }
      </ul>
    </main>
  );
}

Dashboard.propTypes = {
  handleGetProperties: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
  properties: PropTypes.arrayOf(PropTypes.object),
};

Dashboard.defaultProps = {
  loggedUser: {},
};

const mapStateToProps = (state, props) => ({
  loggedUser: get(state, 'user.loggedUser', {}),
  properties: get(state, 'property.properties', []),
});
const mapDispatchToProps = (dispatch) => ({
  handleGetProperties: bindActionCreators(getProperties, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
