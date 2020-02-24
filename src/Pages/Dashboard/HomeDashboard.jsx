import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonBox } from '@brixel/brixel-components';
import { getAchievement, getGamegroup, getGameHistory, addGameHistory } from '../../actions/GamificationActions';
import Loading from '../../components/Loading';
import { GameGroupConfig } from '../../constants/global';

const HomeDashboard = (props) => {
  // PROPS
  const {
    gameGroup,
    gameHistory,
    handleGetGameAchievement,
    handleGetGameGroup,
    handleGetGameHistory,
    handleAddGameHistory,
    history,
    loggedUser,
    property,
  } = props;
  // STATE
  const [userType, setUserType] = useState(null);
  const [usrGroups, setUsrGroups] = useState(gameGroup);

  useEffect(() => {
    handleGetGameAchievement();
    handleGetGameGroup();
    handleGetGameHistory();
  }, []);

  useEffect(() => {
    let filtUsrGroup = [];
    if (property.id && gameGroup.length > 0) {
      let userType;
      if (property.owner.id === loggedUser.user.id || loggedUser.user.role.name === 'Administrator') {
        userType = 'seller';
      } else {
        userType = 'buyer';
      }
      filtUsrGroup = gameGroup.filter((val) => val.stub.indexOf(userType) !== -1);
      setUserType(userType);
      if (property.owner.id === loggedUser.user.id && filtUsrGroup && filtUsrGroup[0].achievements[0].stub !== 'homebase') {
        const data = {
          id: loggedUser.user.id,
          page: property.stub,
          achievement: 'homebase',
        };
        handleAddGameHistory(data);
      }
    }
    if (gameHistory.data) {
      gameHistory.data.map((game) => {
        filtUsrGroup.map((group, f) => {
          const idGroup = group.achievements.findIndex(val => val.stub === game.achievement.stub);
          if (idGroup >= 0) filtUsrGroup[f].achievements[idGroup].done = true;
          return null;
        });
        return null;
      })
    }
    setUsrGroups([...filtUsrGroup]);
  }, [property, gameGroup, gameHistory]);

  const saveGameHistory = (e, groupAchievement) => {
    e.preventDefault();
    const data = {
      id: loggedUser.user.id,
      page: property.stub,
      achievement: groupAchievement.stub,
    };
    // handleAddGameHistory(data);
  };

  if (!property.id && !userType) {
    return <Loading />
  }

  return (
    <div className="container">
      <h3>Home of</h3>
      <h4>{property.properties.typology.bedrooms} {property.properties.propertyType} in {property.location.city}</h4>
      {
        usrGroups && usrGroups.map((group, i) => (
          <Fragment key={i.toString()}>
            {
              GameGroupConfig[`level${group.stub.replace(/^\D+/g, '')}`] && (
                <>
                  <h5 className="mt-4 mb-2">{GameGroupConfig[`level${group.stub.replace(/^\D+/g, '')}`].name}</h5>
                  <div key={i.toString()} className="pl-5 pos-r">
                    <div className="timelineBar" />
                    {
                      group.achievements && group.achievements.map((item, f) => (
                        <div key={f.toString()} className="pos-r">
                          <span className={item.done ? "dotTimelineDone" : "dotTimeline"} />
                          <BrixelButtonBox
                            icon={item.done ? 'check' : item.icon}
                            label={item.name}
                            subtitle={item.description}
                            background={item.done ? 'light100' : GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].color}
                            className="mb-4 w-perc-100 shadow-3dp"
                            colorIcon={item.done ? 'green400'  : GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].iconColor}
                            backIcon={item.done ? 'light200' : GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].backColor}
                            multilineInfo={[
                              item.done ? {icon: 'cup-awards', color: 'green400'} : {label: 'free', color: 'green400'},
                              {label: item.points, color: 'dark700'},
                            ]}
                            onClick={(e) => history.push(`./achievement/${item.stub}`)}
                          />
                        </div>
                      ))
                    }
                  </div>
                </>
              )
            }
          </Fragment>
        ))
      }
    </div>
  )
};

HomeDashboard.propTypes = {
  gameGroup: PropTypes.arrayOf(PropTypes.object),
  gameHistory: PropTypes.object,
  handleGetGameAchievement: PropTypes.func.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
  handleGetGameHistory: PropTypes.func.isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object.isRequired,
};

HomeDashboard.defaultProps = {
  gameGroup: [],
  gameHistory: {},
};

const mapStateToProps = (state, props) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
  property: get(state, 'property.property', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetGameAchievement: bindActionCreators(getAchievement, dispatch),
  handleGetGameGroup: bindActionCreators(getGamegroup, dispatch),
  handleGetGameHistory: bindActionCreators(getGameHistory, dispatch),
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(HomeDashboard);
