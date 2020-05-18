/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { BrixelButtonIcon, BrixelIcon } from '@brixel/brixel-components';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import last from 'lodash/last';

function PageHeaderAchievement(props) {
  // PROPS
  const {
    history,
    icon,
    isFree,
    match,
    subtitle,
    title,
  } = props;

  const pageId = get(match, 'params.propId', '');
  const rewardType = get(history, 'location.pathname', '').split('/')[4];

  return (
    <header className="max-w-fix-760 m-a">
      <div className="container p-1 p-md-2 dis-f jc-b a-c pageHeaderAchievement">
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
          <div className="ml-2 dis-fl-col as-fe">
            <p className="fsize-100 txtDark200">
              {isFree && (<span className="txtGreen400">Free</span>)}
              <span>&nbsp;</span>
              <span>{subtitle}</span>
            </p>
            <p className="fsize-400 fweight-500 txtDark700">{title}</p>
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
          onClick={() => history.push(`/${pageId}/rewards/${rewardType}`)}
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
