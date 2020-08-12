/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
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
    title,
  } = props;

  const pageId = get(match, 'params.propId', '');
  const rewardType = get(history, 'location.pathname', '').split('/')[4];

  return (
    <header className="max-w-fix-760 w-perc-100 m-a pageHeaderAchievement">
      <div className="container p-1 p-md-2 dis-f jc-b a-c">
        <div className="dis-f a-c">
          <BrixelIcon
            rounded
            icon={icon || ''}
            background="green"
            saturation={100}
            color="green"
            saturationTxt={400}
            padding="p-small-9"
          />
          <div className="ml-2 dis-fl-col">
            <p className="fsize-400 fweight-500 txtDark700">{title}</p>
          </div>
        </div>
        <BrixelButtonIcon
          className="shadow-2dp"
          noBorder
          bgTransparent
          color="dark"
          saturationTxt={400}
          icon="close-small"
          onClick={() => history.push(`/${pageId}/rewards/${rewardType}`)}
        />
      </div>

    </header>
  );
}

PageHeaderAchievement.propTypes = {
  history: PropTypes.object.isRequired,
  icon: PropTypes.string,
  title: PropTypes.string,
  match: PropTypes.object.isRequired,
};

PageHeaderAchievement.defaultProps = {
  icon: '',
  title: null,
};

export default withRouter(PageHeaderAchievement);
