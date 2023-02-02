import React, {useEffect, useState} from 'react';
import {BrixelButtonIcon, BrixelModal} from '@brixel/brixel-components';
import {diff} from 'deep-object-diff';
import get from 'lodash/get';
import set from 'lodash/set';
import {connect} from 'react-redux';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {
  createUserSearchProfile,
  setUserActiveSearchProfile,
  updateUserSearchProfile,
} from '../../../actions/SearchProfileActions';
import {QuestionsList} from '../../../resources/Flows/onBoardingBuyer';
import translateTo from '../../../utils/translation';
import SearchProfileForm from './SearchProfileForm';
import SearchProfileList from './SearchProfileList';
import type {SearchProfileModalType} from '../../../@types/Pages/Market/SearchProfile/SearchProfileModal';
import {QuestionInputType} from '@brixel/brixel-components/dist/@types/Model';

const SearchProfileModal = (props: SearchProfileModalType) => {
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
    userSearchProfiles = [],
  } = props;
  // STATE
  const [userActiveSearchProfileId, setUserActiveSearchProfileId] = useState(activeSearchProfile.id);

  useEffect(() => {
    setUserActiveSearchProfileId(activeSearchProfile.id)
  }, [activeSearchProfile.id]);

  const saveData = (type) => {
    const formData = {...formValue};
    const { id, locations } = formData;
    set(formData, 'characteristics.propertyType', formData.characteristics?.propertyType || []);
    delete formData.id;
    formData.location = locations;
    delete formValue.locations;
    const inputs: QuestionInputType[] = [];
    const url = get(history, 'location.state.url', null);
    QuestionsList(lang, 'searchProfile', () => '', 'SearchProfile').forEach((input) => {
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

  const onClose = () => {
    const url = get(history, 'location.state.url', null);
    switch(history.location.pathname) {
      case '/buy/searchProfile/list':
        history.push(url || '/buy');
        break;
      default:
        history.push(url || '/buy');
    }
  }

  const onBack = () => {
    const url = get(history, 'location.state.url', null);
    if (history.location.pathname.includes('/buy/searchProfile/list/edit') || history.location.pathname.includes('/buy/searchProfile/list/create')) {
      history.push('/buy/searchProfile/list');
    } else {
      history.push(url || '/buy');
    }
  }

  const modalTitle = () => {
    switch(history.location.pathname) {
      case '/buy/searchProfile/list':
        return translateTo('Manage Search Profiles', lang);
      case '/buy/searchProfile/list/create':
        return translateTo('Create Search Profiles', lang);
      default:
        return translateTo('Edit Search Profile', lang);
    }
  }

  const saveChangeSearchProfile = () => {
    const newSearchProfile = userSearchProfiles.find((src) => src.id === userActiveSearchProfileId);
    if (newSearchProfile) {
      window.sessionStorage.setItem('profileID', newSearchProfile.id || '');
      handleSetUserActiveSearchProfile(newSearchProfile);
      onClose();
    }
  }

  const multiActions = () => {
    const diffForm: { changeCountry?: string, location?: object } = diff(initialValues, formValue);
    switch(history.location.pathname) {
      case '/buy/searchProfile/list':
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
          },
        ])
      case '/buy/searchProfile/list/create':
        delete diffForm.changeCountry;
        delete diffForm.location;
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
            name: translateTo(Object.keys(diffForm).length === 0 ? 'Save changes' : 'Confirm', lang),
            btnType: 'Primary',
            disabled: Object.keys(diffForm).length === 0,
            func: () => saveData('new'),
            isLoading: isSmallLoading.saveData,
          },
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
            func: () => history.push('/buy'),
          },
          {
            round: true,
            clr: 'primary',
            name: translateTo('Save changes', lang),
            btnType: 'Primary',
            disabled: Object.keys(diffForm).length === 0,
            func: () => saveData('update'),
            isLoading: isSmallLoading.saveData,
          },
        ])
    }
  }

  const showBackIcon = () => history.location.pathname.includes('/buy/searchProfile/list/create') || history.location.pathname.includes('/buy/searchProfile/list/edit');

  return (
    <BrixelModal
      clickOutsideToClose={false}
      title={translateTo(modalTitle(), lang)}
      onClose={() => onClose()}
      titleTop
      layout="xxlarge"
      titleTopClass="modalTitleClass fweight-600 fsize-500 fsize-md-600 brdSmallBottom brdText50 ta-c mb-2 mb-md-4"
      bodyClassColor="bgWhite"
      multiActions={multiActions()}
    >
      {
        showBackIcon() && (
          <BrixelButtonIcon
            icon='dropdown-open'
            ghost
            theme='dark'
            className='backIcon'
            onClick={() => onBack()}
          />
        )
      }
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
