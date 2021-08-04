/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { BrixelButtonIcon, BrixelIcon } from '@brixel/brixel-components';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setHistory } from '../actions/CommonActions';

function PageHeaderAchievement(props) {
  // PROPS
  const {
    handleSetHistory,
    history,
    historyUrl,
    icon,
    match,
    navHistory,
    onClick,
    title,
  } = props;

  const pageId = get(match, 'params.propId', '');
  const rewardType = get(history, 'location.pathname', '').split('/')[4];

  const onClose = useCallback(() => {
    if (navHistory.source) {
      handleSetHistory({});
      history.push(navHistory.source);
    } else if (onClick) onClick();
    else if (historyUrl) {
      history.push(historyUrl);
    } else history.push(`/${pageId}/rewards/${rewardType}`);
  }, [navHistory.source]);

  return (
    <header className="max-w-fix-760 w-perc-100 m-a pageHeaderAchievement">
      <div className="container p-1 p-lg-2 dis-f jc-b a-c">
        <div className="dis-f a-c">
          {
            icon && (
              <BrixelIcon
                rounded
                icon={icon || ''}
                background="green"
                saturation={100}
                color="green"
                saturationTxt={400}
                padding="p-small-9"
              />
            )
          }
          <div className="ml-2 dis-fl-col">
            <p className="fsize-400 fweight-500 txtDark700">{title}</p>
          </div>
        </div>
        <BrixelButtonIcon
          icon="close-small"
          ghost
          theme="dark"
          onClick={() => onClose()}
        />
      </div>

    </header>
  );
}

PageHeaderAchievement.propTypes = {
  handleSetHistory: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  historyUrl: PropTypes.object,
  icon: PropTypes.string,
  match: PropTypes.object.isRequired,
  navHistory: PropTypes.object,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

PageHeaderAchievement.defaultProps = {
  historyUrl: null,
  icon: null,
  navHistory: {},
  onClick: null,
  title: null,
};

const mapStateToProps = (state) => ({
  navHistory: get(state, 'common.history', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetHistory: bindActionCreators(setHistory, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PageHeaderAchievement);
