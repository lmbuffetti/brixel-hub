import { initializeForm, MultiFileldsReduxForm } from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { compose } from 'redux';
import { QuestionsList } from '../../../resources/Flows/onBoardingBuyer';

const SearchProfileForm = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const idSearchProfile = get(match, 'id', null);
  const {
    formValue,
    initForm,
    lang,
    userSearchProfiles
  } = props;
  // STATE
  const [fullForm, setFullForm] = useState([]);
  
  useEffect(() => {
    const inputform = [];
    QuestionsList(lang, 'searchProfile').forEach((form) => {
      if (!form.hideSearchProfile) inputform.push(form);
    });
    setFullForm(inputform);
    if (userSearchProfiles) {
      const getCurrentSearchProfile = userSearchProfiles.find((itm) => itm.id === idSearchProfile);
      if (getCurrentSearchProfile) {
        getCurrentSearchProfile.locations = getCurrentSearchProfile.location;
        getCurrentSearchProfile.location.countryCode = getCurrentSearchProfile.location[0].countryCode
        initForm(getCurrentSearchProfile);
      }
    }
  }, [userSearchProfiles]);
  
  return (
    <div>
      <MultiFileldsReduxForm
        form="SearchProfile"
        disableNextBtn={false}
        formValue={formValue}
        nestedInputs={fullForm}
        showSendButton
        autofocus={false}
      />
    </div>
  );
};

SearchProfileForm.propTypes = {
  initForm: PropTypes.func.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object)
};

SearchProfileForm.defaultProps = {
  userSearchProfiles: [],
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.SearchProfile.values', {}),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
});

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('SearchProfile', value));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SearchProfileForm);
