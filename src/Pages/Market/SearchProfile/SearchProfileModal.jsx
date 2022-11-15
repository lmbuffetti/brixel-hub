import { BrixelModal, translateTo } from '@brixel/brixel-components';
import { diff } from 'deep-object-diff';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { createUserSearchProfile, updateUserSearchProfile } from '../../../actions/SearchProfileActions';
import SearchProfileForm from './SearchProfileForm';
import SearchProfileList from './SearchProfileList';

const SearchProfileModal = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    formValue,
    handleCreateUserSearchProfile,
    handleUpdateSearchProfile,
    initialValues,
    isSmallLoading,
    lang,
  } = props;

  const saveData = (type) => {
    const { id, locations } = formValue;
    delete formValue.id;
    formValue.location = locations;
    delete formValue.locations;
    const data = {
      dataSearchProfile: formValue,
      id,
      redirectToUrl: '/buy/searchProfile',
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
    switch(history.location.pathname) {
      case '/buy/searchProfile':
        history.push('/buy');
        break;
      default:
        history.push('/buy/searchProfile');
    }
  }
  
  const modalTitle = () => {
    switch(history.location.pathname) {
      case '/buy/searchProfile':
        return 'Manage Search Profiles';
      case '/buy/searchProfile/create':
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
            name: translateTo('Save changes', lang),
            btnType: 'Primary',
            // disabled: true,
            func: () => '',
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
            func: () => history.push('/buy/searchProfile'),
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
            func: () => history.push('/buy/searchProfile'),
          },
          {
            round: true,
            clr: 'primary',
            name: translateTo(Object.keys(diffForm).length === 0 ? 'Save changes' : 'Confirm', lang),
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
      title={translateTo(modalTitle(), lang)}
      onClose={() => onClose()}
      layout="xxlarge"
      classContainer="ta-c mt-8-neg brdSmallBottom brdLight200 pb-3"
      bodyClassColor="bgWhite"
      multiActions={multiActions()}
    >
      <Routes>
        <Route path="/" element={<SearchProfileList />} />
        <Route path="/create" element={<SearchProfileForm />} />
        <Route path="/edit/:id" element={<SearchProfileForm />} />
      </Routes>
    </BrixelModal>
  );
};

SearchProfileModal.propTypes = {
  formValue: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleCreateUserSearchProfile: PropTypes.func.isRequired,
  handleUpdateSearchProfile: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.SearchProfile.values', {}),
  initialValues: get(state, 'brixelForm.SearchProfile.initialValues', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', { }),
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdateSearchProfile: bindActionCreators(updateUserSearchProfile, dispatch),
  handleCreateUserSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SearchProfileModal);
