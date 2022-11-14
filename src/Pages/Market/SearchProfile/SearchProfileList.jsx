import { BrixelButtonSecondary, BrixelIcon, Helpers } from '@brixel/brixel-components';
import { BrixelRadioButton, initializeForm } from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import set from 'lodash/set';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import { QuestionsList } from '../../../resources/Flows/onBoardingBuyer';
import { titleSearchProfile } from '../../../utils/titleCreationSearchProfile';
import translateTo from '../../../utils/translation';

const SearchProfileList = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    initForm,
    lang,
    userSearchProfiles
  } = props;
  // STATE
  const [showDeetail, setShowDetail] = useState({});
  const [fieldsSearchProfile, setFieldsSearchProfile] = useState([]);
  
  useEffect(() => {
    const fields = [...fieldsSearchProfile];
    QuestionsList('en', 'searchProfile').forEach((inputs) => {
      if (inputs.inputs) {
        inputs.inputs.forEach((field) => {
          if (field.name !== 'location.countryCode') {
            if (field.name.includes('location')) fields.push('location');
            else if (!field.name.includes('register')) fields.push(field.name);
          }
        });
      }
    });
    setFieldsSearchProfile(fields);
  }, []);
  
  const editSearchProfile = (searchProfile) => {
    let initialValue = {};
    fieldsSearchProfile.forEach((field) => {
      set(initialValue, field, get(searchProfile, field, ''));
    })
    initForm(initialValue)
    history.push(`/buy/searchProfile/edit/${searchProfile.id}`)
  }
  
  const renderFieldsSearchProfile = (searchProfile, field) => {
    if (field === 'location') {
      return (
        <>
          {
            get(searchProfile, 'location', []).map((item, i) => (
              <React.Fragment key={`usrLoc_${i.toString()}`}>
                {i > 0 && (<span>, </span>)}
                <span>{translateTo(item.name, lang)}</span>
              </React.Fragment>
            ))
          }
        </>
      )
    } else if (Array.isArray(get(searchProfile, field, ''))) {
      return (
        <>
          {get(searchProfile, field, []).map((data, i) => (
            <React.Fragment key={`arraySearch${i.toString()}`}>
              <span key={`field${i.toString()}`}>{data}</span>
              {get(searchProfile, field, []).length - 1 !== i && (<span className="mr-1">,</span>)}
            </React.Fragment>
          ))}
        </>
      )
    } else if (get(searchProfile, `${field}.min`, -1) > -1) {
      const unit = field.includes('bedrooms') ? 'rooms' : 'm2';
      return (
        <>
          {get(searchProfile, `${field}.min`, '')} - {get(searchProfile, `${field}.max`, 0)} {unit}
        </>
      )
    } else if (field.includes('extraFeatures')) {
      const numExtraFeatures = Object.keys(get(searchProfile, field, {})).length;
      return (
        <>
          <span>{numExtraFeatures}</span><span className="ml-1">Amenities</span>
        </>
      )
    } else if (!isObject(get(searchProfile, field, ''))) {
      if (field.includes('price')) {
        const currency = get(searchProfile, 'finance.currency', 'EUR');
        const price = get(searchProfile, field, 0);
        return (
          <>
            {Helpers.formatNumberValue(price, currency)} {currency}
          </>
        )
      } else if (get(searchProfile, field, null)) {
        return (
          <>
            {get(searchProfile, field, 'test')}
          </>
        )
      }
    }
  }
  
  return (
    <div>
      <h5>Your Search Profiles</h5>
      <p>Choose the Search Profile you’d like to apply to filter properties.</p>
      
      {
        userSearchProfiles && userSearchProfiles.map((searchProfile, i) => (
          <div
            key={`searchProfile${i.toString()}`}
            className="brdSmall brdRadius p-2 brdLight200"
          >
            <div
              className="dis-f a-c jc-b"
            >
              <div className="dis-f a-t jc-fs">
                <BrixelRadioButton
                  input={{
                    value: searchProfile.id,
                    name: 'saerchProfileSelected',
                  }}
                  options={[{
                    value: searchProfile.id,
                    label: searchProfile.name || titleSearchProfile(searchProfile, lang),
                  }
                  ]}
                />
              </div>
              <div>
                <BrixelIcon
                  icon={searchProfile.id === showDeetail.id ? "arrow-simple-up" : "arrow-simple-down"}
                  onClick={() => setShowDetail(searchProfile.id === showDeetail.id ? {} : searchProfile)}
                />
              </div>
            </div>
            {
              searchProfile.id === showDeetail.id && (
                <>
                  <div>
                    <h6>Filters applied</h6>
                    <p>Summary of all the filters applied </p>
                  
                    <div className="dis-f flex-wrap a-t">
                      {
                        fieldsSearchProfile.map((field, index) => (
                          <React.Fragment key={`search${index.toString()}`}>
                            {
                              field !== 'isDefault' && field !== 'name' && (
                                <div
                                  className="brdSmall brdLight200 brdFullRadius p-1 mr-1 mb-1"
                                >
                                  {renderFieldsSearchProfile(searchProfile, field)}
                                </div>
                              )
                            }
                          </React.Fragment>
                        ))
                      }
                    </div>
                  
                  </div>
                  <div className="dis-f a-c jc-b brdSmallTop brdLight200 mt-2 pt-2">
                    <h6 className="fweight-400">Actions</h6>
    
                    <div className="dis-f a-c">
                      <BrixelButtonSecondary
                        className="mr-1"
                        rounded
                        label="Delete"
                        theme="red"
                        bgTransparent
                        onClick={() => ''}
                      />
                      <BrixelButtonSecondary
                        rounded
                        label="Edit"
                        bgTransparent
                        onClick={() => editSearchProfile(searchProfile)}
                      />
                    </div>
                  </div>
                </>
              )
            }
          </div>
        ))
      }
    </div>
  );
};

SearchProfileList.propTypes = {
  initForm: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object)
};

SearchProfileList.defaultProps = {
  userSearchProfiles: [],
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
});

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('SearchProfile', value));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SearchProfileList);
