import { BrixelModal } from '@brixel/brixel-components';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import SearchProfileForm from './SearchProfileForm';
import SearchProfileList from './SearchProfileList';

const SearchProfileModal = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  
  const saveData = () => {
    console.log('save data');
  }
  
  const multiActions = () => {
    return ([
      {
        round: true,
        clr: 'red',
        btnType: 'Secondary',
        className: 'mr-1',
        name: 'Discard and exit',
        func: () => history.push('/buy/searchProfile'),
      },
      {
        round: true,
        clr: 'primary',
        name: 'Save and exit',
        btnType: 'Primary',
        func: () => saveData(),
      }
    ])
  }
  
  return (
    <BrixelModal
      title="Manage Search Profiles"
      onClose={() => history.push('/buy')}
      layout="xxlarge"
      classContainer="ta-c mt-8-neg brdSmallBottom brdLight200 pb-3"
      bodyClassColor="bgWhite"
      multiActions={multiActions()}
    >
      <Routes>
        <Route path="/" element={<SearchProfileList />} />
        <Route path="/edit/:id" element={<SearchProfileForm />} />
      </Routes>
    </BrixelModal>
  );
};

SearchProfileModal.propTypes = {

};

SearchProfileModal.defaultProps = {

};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SearchProfileModal);
