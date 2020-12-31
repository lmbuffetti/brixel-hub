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
    onClick,
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
          ghost
          bgTransparent
          theme="dark"
          onClick={onClick ? () => onClick() : () => history.push(`/${pageId}/rewards/${rewardType}`)}
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
  onClick: PropTypes.func,
};

PageHeaderAchievement.defaultProps = {
  icon: '',
  onClick: null,
  title: null,
};

export default withRouter(PageHeaderAchievement);
