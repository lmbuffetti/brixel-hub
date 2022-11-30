import { BrixelModal, translateTo } from '@brixel/brixel-components';
import { diff } from 'deep-object-diff';
import get from 'lodash/get';
import set from 'lodash/set';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import {
  createUserSearchProfile,
  setUserActiveSearchProfile,
  updateUserSearchProfile,
} from '../../../actions/SearchProfileActions';
import { QuestionsList } from '../../../resources/Flows/onBoardingBuyer';
import SearchProfileForm from './SearchProfileForm';
import SearchProfileList from './SearchProfileList';

const SearchProfileModal = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSearchProfile,
    formValue,
    handleCreateUserSearchProfile,
    handleSetUserActiveSearchProfile,
    handleUpdateSearchProfile,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
    userSearchProfiles,
  } = props;
  // STATE
  const [userActiveSearchProfileId, setUserActiveSearchProfileId] = useState(activeSearchProfile.id);

  useEffect(() => {
    setUserActiveSearchProfileId(activeSearchProfile.id)
  }, [activeSearchProfile.id]);

  const saveData = (type) => {
    const formData = {...formValue};
    const { id, locations } = formData;
    delete formData.id;
    formData.location = locations;
    delete formValue.locations;
    let inputs = [];
    const url = get(history, 'location.state.url', null);
    QuestionsList(lang).forEach((input) => {
      if(input.inputs) {
        input.inputs.forEach(inp => {
          inputs.push(inp);
        })
      }
    })
    const checkMaxValue = inputs.filter((inp) => inp.maxLengthNum);
    checkMaxValue.forEach((val) => {
      if(val.maxLengthNum === get(formData, `${val.name}.max`, null)) {
        set(formData, `${val.name}.max`, null);
      }
      if(!get(formData, `${val.name}`, null)) {
        set(formData, `${val.name}.min`, 0);
        set(formData, `${val.name}.max`, null);
      }
    })
    const data = {
      dataSearchProfile: {
        ...formData,
        user: loggedInUser.id,
      },
      id,
      redirectToUrl: url || '/buy/searchProfile/list',
      smallLoader: 'saveData',
    }
    if (type === 'update') {
      handleUpdateSearchProfile(data)
    }
    if (type === 'new') {
      handleCreateUserSearchProfile(data)
    }
  }

  const saveChangeSearchProfile = () => {
    const newSearchProfile = userSearchProfiles.find((src) => src.id === userActiveSearchProfileId);
    if (newSearchProfile) {
      window.sessionStorage.setItem('profileID', newSearchProfile.id);
      handleSetUserActiveSearchProfile(newSearchProfile);
    }
  }

  const onClose = () => {
    const url = get(history, 'location.state.url', null);
    switch(history.location.pathname) {
      case '/buy/searchProfile/list':
        history.push(url || '/buy');
        break;
      default:
        history.push(url || '/buy/searchProfile/list');
    }
  }

  const modalTitle = () => {
    switch(history.location.pathname) {
      case '/buy/searchProfile/list':
        return 'Manage Search Profiles';
      case '/buy/searchProfile/list/create':
        return 'Create Search Profiles';
      default:
        return 'Edit Search Profile';
    }
  }

  const multiActions = () => {
    const diffForm = diff(initialValues, formValue) || {};
    switch(history.location.pathname) {
      case '/buy/searchProfile':
        return ([
          {
            round: true,
            btnType: 'Secondary',
            className: 'mr-1',
            name: translateTo('Cancel', lang),
            func: () => history.push('/buy'),
          },
          {
            round: true,
            clr: 'primary',
            name: translateTo('Apply search profile', lang),
            btnType: 'Primary',
            disabled: activeSearchProfile.id === userActiveSearchProfileId,
            func: () => saveChangeSearchProfile(),
            isLoading: isSmallLoading.saveData,
          }
        ])
      case '/buy/searchProfile/create':
        delete diffForm.changeCountry;
        delete diffForm.location;
        return ([
          {
            round: true,
            btnType: 'Secondary',
            className: 'mr-1',
            name: translateTo('Cancel', lang),
            func: () => history.push('/buy/searchProfile/list'),
          },
          {
            round: true,
            clr: 'primary',
            name: translateTo(Object.keys(diffForm).length === 0 ? 'Save changes' : 'Confirm', lang),
            btnType: 'Primary',
            disabled: Object.keys(diffForm).length === 0,
            func: () => saveData('new'),
            isLoading: isSmallLoading.saveData,
          }
        ])
      default:
        delete diffForm.changeCountry;
        delete diffForm.location;
        return ([
          {
            round: true,
            btnType: 'Secondary',
            className: 'mr-1',
            name: translateTo('Cancel', lang),
            func: () => history.push('/buy/searchProfile/list'),
          },
          {
            round: true,
            clr: 'primary',
            name: translateTo('Save changes', lang),
            btnType: 'Primary',
            disabled: Object.keys(diffForm).length === 0,
            func: () => saveData('update'),
            isLoading: isSmallLoading.saveData,
          }
        ])
    }
  }

  return (
    <BrixelModal
      clickOutsideToClose={false}
      title={translateTo(modalTitle(), lang)}
      onClose={() => onClose()}
      titleTop
      layout="xxlarge"
      titleTopClass="modalTitleClass fweight-600 fsize-500 fsize-md-600 brdSmallBottom brdLight200 ta-c mb-2 mb-md-4"
      bodyClassColor="bgWhite"
      multiActions={multiActions()}
    >
      <Routes>
        <Route
          path="/"
          element={
            <SearchProfileList
              userActiveSearchProfileId={userActiveSearchProfileId}
              onChangeProfile={(val) => setUserActiveSearchProfileId(val)}
            />
          }
        />
        <Route path="/create" element={<SearchProfileForm />} />
        <Route path="/edit/:id" element={<SearchProfileForm />} />
      </Routes>
    </BrixelModal>
  );
};

SearchProfileModal.propTypes = {
  activeSearchProfile: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreateUserSearchProfile: PropTypes.func.isRequired,
  handleSetUserActiveSearchProfile: PropTypes.func.isRequired,
  handleUpdateSearchProfile: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  activeSearchProfile: get(state, 'user.activeSearchProfile', {}),
  formValue: get(state, 'brixelForm.SearchProfile.values', {}),
  initialValues: get(state, 'brixelForm.SearchProfile.initialValues', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', { }),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleCreateUserSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
  handleSetUserActiveSearchProfile: bindActionCreators(setUserActiveSearchProfile, dispatch),
  handleUpdateSearchProfile: bindActionCreators(updateUserSearchProfile, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SearchProfileModal);
