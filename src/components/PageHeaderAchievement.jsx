/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrixelButtonIcon, BrixelIcon } from '@brixel/brixel-components';
import PropTypes from 'prop-types';
import get from 'lodash/get';

function PageHeaderAchievement(props) {
  // PROPS
  const {
    history,
    icon,
    match,
    subtitle,
    title,
  } = props;

  const pageId = get(match, 'params.propId', '');

  return (
    <header className="bgGreen100">
      <div className="container p-1 p-md-2 dis-f jc-b a-c">
        <div className="dis-f a-c">
          <BrixelIcon
            icon={icon}
            background="green"
            saturation={500}
            color="white"
            saturationTxt={0}
          />
          <div className="ml-2">
            <h6 className="mb-1-neg">{title}</h6>
            <p className="body2 txtDark200">{subtitle}</p>
          </div>
        </div>
        <BrixelButtonIcon
          className="shadow-3dp"
          noBorder
          background="white"
          saturation={0}
          color="dark"
          saturationTxt={700}
          icon="close-small"
          onClick={() => history.push(`/${pageId}/home`)}
        />
      </div>

    </header>
  );
}

PageHeaderAchievement.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  match: PropTypes.object.isRequired,
  subtitle: PropTypes.string,
};

PageHeaderAchievement.defaultProps = {
};

export default withRouter(PageHeaderAchievement);
