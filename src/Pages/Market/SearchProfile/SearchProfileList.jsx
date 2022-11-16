import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonText,
  BrixelIcon,
} from '@brixel/brixel-components';
import { BrixelRadioButton, initializeForm } from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import set from 'lodash/set';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { deleteUserSearchProfile } from '../../../actions/SearchProfileActions';
import { QuestionsList } from '../../../resources/Flows/onBoardingBuyer';
import { titleSearchProfile } from '../../../utils/titleCreationSearchProfile';
import SearchProfileField from '../../../components/SearchProfileField';

const SearchProfileList = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    handleDeleteUserSearchProfile,
    initForm,
    isSmallLoading,
    lang,
    userSearchProfiles,
    onChangeProfile,
    userActiveSearchProfileId,
  } = props;
  // STATE
  const [showDeetail, setShowDetail] = useState({});
  const [isOpenDeleteConfirm, setIsDeleteConfirm] = useState(false);
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
  
  useEffect(() => {
    if (isSmallLoading.saveData === false) setIsDeleteConfirm(false);
  }, [isSmallLoading]);
  
  
  const onDeleteSearchProfile = (profile) => {
    handleDeleteUserSearchProfile(profile)
  }
  
  return (
    <div>
      <div className="dis-f jc-b a-t">
        <div className="max-w-fix-264">
          <h5>Your Search Profiles</h5>
          <p>Choose the Search Profile you’d like to apply to filter properties.</p>
        </div>
        <div>
          <BrixelButtonText
            label="New Search Profile"
            leftIcon="plus"
            onClick={() => history.push('/buy/searchProfile/create')}
          />
        </div>
      </div>
      {
        userSearchProfiles && userSearchProfiles.map((searchProfile, i) => (
          <>
            {
              searchProfile.id && (
                <div
                  key={`searchProfile${i.toString()}`}
                  className="brdSmall brdRadius p-2 brdLight200 mb-2"
                >
                  <div
                    className="dis-f a-c jc-b"
                  >
                    <div className="dis-f a-t jc-fs">
                      <BrixelRadioButton
                        disableDelay={true}
                        input={{
                          value: userActiveSearchProfileId,
                          name: `saerchProfileSelected`,
                          onChange: () => onChangeProfile(searchProfile.id),
                        }}
                        options={[{
                          index: i,
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
                    searchProfile.id && searchProfile.id === showDeetail.id && (
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
                                      <>
                                        <SearchProfileField
                                          searchProfile={searchProfile}
                                          field={field}
                                          lang={lang}
                                        />
                                      </>
                                    )
                                  }
                                </React.Fragment>
                              ))
                            }
                          </div>
            
                        </div>
                        {
                          isOpenDeleteConfirm ? (
                            <div className="dis-f a-c jc-b brdSmallTop brdLight200 mt-2 pt-2">
                              <h6 className="fweight-400">Are you sure to delete?</h6>
                              <div className="dis-f a-c">
                                <BrixelButtonSecondary
                                  className="mr-1"
                                  rounded
                                  label="Cancel"
                                  bgTransparent
                                  onClick={() => setIsDeleteConfirm(false)}
                                />
                                <BrixelButtonPrimary
                                  rounded
                                  label="Delete"
                                  theme="red"
                                  bgTransparent
                                  onClick={() => onDeleteSearchProfile(searchProfile)}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="dis-f a-c jc-b brdSmallTop brdLight200 mt-2 pt-2">
                              <h6 className="fweight-400">Actions</h6>
                              <div className="dis-f a-c">
                                <BrixelButtonSecondary
                                  className="mr-1"
                                  rounded
                                  label="Delete"
                                  theme="red"
                                  bgTransparent
                                  onClick={() => setIsDeleteConfirm(true)}
                                />
                                <BrixelButtonSecondary
                                  rounded
                                  label="Edit"
                                  bgTransparent
                                  onClick={() => editSearchProfile(searchProfile)}
                                />
                              </div>
                            </div>
                          )
                        }
                      </>
                    )
                  }
                </div>
              )
            }
          </>
        ))
      }
    </div>
  );
};

SearchProfileList.propTypes = {
  handleDeleteUserSearchProfile: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  onChangeProfile: PropTypes.func.isRequired,
  userActiveSearchProfileId: PropTypes.string,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
};

SearchProfileList.defaultProps = {
  userSearchProfiles: [],
};

const mapStateToProps = (state) => ({
  isSmallLoading: get(state, 'common.isSmallLoading', { }),
  lang: get(state, 'common.language', 'en'),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
});

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('SearchProfile', value));
  },
  handleDeleteUserSearchProfile: bindActionCreators(deleteUserSearchProfile, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SearchProfileList);
