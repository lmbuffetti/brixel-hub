import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonBox } from '@brixel/brixel-components';
import { getAchievement, getGamegroup } from '../../actions/GamificationActions';
import Loading from '../../components/Loading';
import { GameGroupConfig } from '../../constants/global';
import { ga } from 'react-ga';

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
  }, [property, gameGroup]);

  if (!property.id && !userType) {
    return <Loading />
  }

  return (
    <div className="container">
      <h3>Home of</h3>
      <h4>{property.properties.typology.bedrooms} {property.properties.propertyType} in {property.location.city}</h4>

      {
        usrGroups && usrGroups.map((group, i) => (
          <>
            <h5 className="mt-4 mb-2">{GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].name}</h5>
            <div key={i.toString()} className="pl-5 pos-r">
              <div className="timelineBar" />
              {
                group.achievements && group.achievements.map((item, f) => (
                  <div key={f.toString()} className="pos-r">
                    <span className={f %2 === 0 ? "dotTimelineDone" : "dotTimeline"} />
                    <BrixelButtonBox
                      icon={item.icon}
                      label={item.name}
                      subtitle={item.description}
                      background={GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].color}
                      className="mb-4 w-perc-100 shadow-3dp"
                      colorIcon={GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].iconColor}
                      backIcon={GameGroupConfig[`level${group.stub.replace( /^\D+/g, '')}`].backColor}
                      multilineInfo={[
                        {label: 'free', color: 'green400'},
                        {label: item.points, color: 'dark700'},
                      ]}
                    />
                  </div>
                ))
              }
            </div>
          </>
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
