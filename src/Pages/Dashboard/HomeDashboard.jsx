import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonBox } from '@brixel/brixel-components';
import { getAchievement, getGamegroup } from '../../actions/GamificationActions';
import Loading from '../../components/Loading';

const HomeDashboard = (props) => {
  // PROPS
  const {
    gameGroup,
    handleGetGameAchievement,
    handleGetGameGroup,
    loggedUser,
    property,
  } = props;
  // STATE
  const [userType, setUserType] = useState(null);
  const [usrGroups, setUsrGroups] = useState(gameGroup);

  useEffect(() => {
    handleGetGameAchievement();
    handleGetGameGroup();
  }, []);

  useEffect(() => {
    if (property.id && gameGroup.length > 0) {
      console.log('props', property.owner.id, loggedUser.user)
      let userType;
      if (property.owner.id === loggedUser.user.id || loggedUser.user.role.name === 'Administrator') {
        userType = 'seller';
      } else {
        userType = 'buyer';
      }
      const filtUsrGroup = gameGroup.filter((val) => val.stub.indexOf(userType) !== -1);
      setUserType(userType);
      setUsrGroups([...filtUsrGroup]);
      console.log(filtUsrGroup);
    }
  }, [property]);

  if (!property.id && !userType) {
    return <Loading />
  }

  return (
    <div className="container">
      <h1>Home of</h1>
      {property.title}
      {console.log(usrGroups)}
      {
        usrGroups && usrGroups.map((group, i) => (
          <div key={i.toString()}>
            {
              group.achievements && group.achievements.map((item, f) => (
                <BrixelButtonBox
                  key={f.toString()}
                  label={item.name}
                />
              ))
            }
          </div>
        ))
      }
    </div>
  )
};

HomeDashboard.propTypes = {
  gameGroup: PropTypes.arrayOf(PropTypes.object),
  handleGetGameAchievement: PropTypes.func.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired,
};

HomeDashboard.defaultProps = {
  gameGroup: [],
};

const mapStateToProps = (state, props) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
  loggedUser: get(state, 'user.loggedUser', {}),
  property: get(state, 'property.property', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetGameAchievement: bindActionCreators(getAchievement, dispatch),
  handleGetGameGroup: bindActionCreators(getGamegroup, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(HomeDashboard);
