/* eslint-disable react-hooks/exhaustive-deps */
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
    let userType;
    if (property.id && (property.owner.id === loggedUser.user.id || loggedUser.user.role.name === 'Administrator')) {
      userType = 'seller';
    } else {
      userType = 'buyer';
    }
    filtUsrGroup = gameGroup.filter((val) => val.stub.indexOf(userType) !== -1);
    setUserType(userType);
    console.log(filtUsrGroup, userType);
    if (gameHistory.data) {
      // CHECK IF DONE HOMEBASE
      gameHistory.data.map((game) => {
        filtUsrGroup.map((group, f) => {
          const idGroup = group.achievements.findIndex(val => val.stub === game.achievement.stub && property.id === game.page);
          if (idGroup >= 0) filtUsrGroup[f].achievements[idGroup].done = true;
          return null;
        });
        return null;
      })
    }
    console.log(gameGroup, filtUsrGroup);
    setUsrGroups([...filtUsrGroup]);
  }, [property, gameGroup, gameHistory]);

  useState(() => {
    if (gameHistory.data && property.id) {
      // CHECK IF DONE HOMEBASE
      const getHomeBase = gameHistory.data.findIndex(val => val.achievement.stub === 'homebase' && property.id === val.page);
      if (getHomeBase === -1 && userType === 'seller') {
        const data = {
          id: loggedUser.user.id,
          page: property.stub,
          achievement: 'homebase',
        };
        handleAddGameHistory(data);
      }
    }
  }, [property, gameHistory]);

  if (!property.id && !userType) {
    return <Loading />
  }

  return (
    <div className="">

      <div className="hide-md mb-3">
        <span className="heading5">Home of</span>
        {
          property.properties && property.properties.typology && (
            <h5 className="heading5 txtPrimary400">{property.properties.typology.bedrooms} {property.properties.propertyType} in {property.location.city}</h5>
          )
        }
      </div>
      {userType}
      {console.log(usrGroups)}
      {
        usrGroups && usrGroups.map((group, i) => (
          <Fragment key={i.toString()}>
            {
              GameGroupConfig[`level${group.stub.replace(/^\D+/g, '')}`] && (
                <>
                  <span className="mb-3 dis-b txtDark700 fweight-500">{GameGroupConfig[`level${group.stub.replace(/^\D+/g, '')}`].name}</span>
                  <div key={i.toString()} className="pl-5 pos-r">
                    <div className="timelineBar" />
                    {
                      group.achievements && group.achievements.map((item, f) => (
                        <div key={f.toString()} className="pos-r">
                          <span className={item.done ? "dotTimelineDone" : "dotTimeline"} />
                          {
                            (property.location && property.location.countryCode !== 'CH' && (item.name.includes('Bestimate') || item.name.includes('Market Checker'))) ? (
                              <BrixelButtonBox
                                icon={item.icon}
                                label={item.name}
                                subtitle={item.description}
                                background="light100"
                                className="mb-2 w-perc-100 opacity5 p-2"
                                colorIcon={GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].iconColor}
                                backIcon="light200 mr-1"
                                multilineInfo={[
                                  {label: 'Coming', color: 'dark200'},
                                  {label: 'soon', color: 'dark200'},
                                ]}
                              />
                            ) : (
                              <BrixelButtonBox
                                icon={item.done ? 'check' : item.icon}
                                label={item.name}
                                subtitle={item.description}
                                background={item.done ? 'light100' : GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].color}
                                className={`mb-2 w-perc-100 p-2 ${item.done ? '' : 'shadow-2dp'}`}
                                colorIcon={item.done ? 'green400'  : GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].iconColor}
                                backIcon={`${item.done ? 'light200' : GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].backColor} mr-1`}
                                paddingIconClass="fSizePx24 p-small-12"
                                multilineInfo={[
                                  item.done ? {icon: 'cup-awards', color: 'green400'} : {label: 'free', color: 'green400'},
                                  {label: item.points, color: 'dark200'},
                                ]}
                                onClick={() => history.push(`/${property.id}/home/achievement/${item.stub}`)}
                              />
                            )
                          }
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

const mapStateToProps = (state) => ({
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
