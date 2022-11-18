import { BrixelButtonIcon, BrixelButtonText, BrixelDropdownMini, useOutsideAlerter } from '@brixel/brixel-components';
import { BrixelRadioButton, initializeForm } from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import set from 'lodash/set';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../../actions/CommonActions';
import { deleteUserSearchProfile, updateUserSearchProfile } from '../../../actions/SearchProfileActions';
import SearchProfileField from '../../../components/SearchProfileField';
import { QuestionsList } from '../../../resources/Flows/onBoardingBuyer';
import { titleSearchProfile } from '../../../utils/titleCreationSearchProfile';
import translateTo from '../../../utils/translation';

const SearchProfileList = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    handleDeleteUserSearchProfile,
    handleSetModal,
    initForm,
    isSmallLoading,
    lang,
    userSearchProfiles,
    onChangeProfile,
    userActiveSearchProfileId,
    handleUpdateSearchProfile,
  } = props;
  // REF
  const optionsRef = useRef(null);
  // STATE
  const [isOptionsOpen, setIsOptionsOpen] = useState({
    id: null,
    active: false,
  });
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

  const onDeleteSearchProfile = (profile) => {
    handleSetModal({
      type: 'confirm',
      title: translateTo('Confirm Delete', lang),
      message: translateTo('Do you want delete the selected search profile?', lang),
      confirm: () => handleDeleteUserSearchProfile(profile),
      cancel: () => handleSetModal({}),
    })
  }

  const onSetDefaultSearchProfile = (searchProfile) => {
    handleUpdateSearchProfile({
      id: searchProfile.id,
      smallLoader: `saveData${searchProfile.id}`,
      dataSearchProfile: {
        isDefault: true
      },
    })
    setIsOptionsOpen({
      id: null,
      active: false,
    });
  }

  // FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT
  useOutsideAlerter(optionsRef, {
    action: 'function',
    func: () => setIsOptionsOpen({
      id: null,
      active: false,
    }),
  });

  return (
    <div className="mb-3">
      <div className="dis-f jc-b a-t">
        <div className="max-w-fix-264">
          <h5 className="fweight-600">
            {translateTo('Your Search Profiles', lang)}
          </h5>
          <p className="txtAltGrey400 fsize-300">
            {translateTo('Select the Search Profile you’d like to apply to filter properties.', lang)}
          </p>
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
                  className={`searchProfileList brdSmall brdRadius p-2 p-md-3 mb-2 ${i.toString() === '0' ? 'mt-4' : ''} ${userActiveSearchProfileId === searchProfile.id ? 'bgBlue100 brdBlue300' : 'brdLight200'}`}
                >
                  <div className={`dis-f a-c jc-b ${userActiveSearchProfileId === searchProfile.id ? 'brdSmallBottom brdBlue300 pb-3 mb-3' : ''}`} >
                    <div className="dis-f a-t jc-fs w-perc-75">
                      <BrixelRadioButton
                        disableDelay={true}
                        input={{
                          value: userActiveSearchProfileId,
                          name: `saerchProfileSelected`,
                          onChange: () => onChangeProfile(searchProfile.id),
                          checkmarkColor: 'blue',
                        }}
                        options={[{
                          index: i,
                          value: searchProfile.id,
                          label: searchProfile.name || titleSearchProfile(searchProfile, lang),
                        }
                        ]}
                      />
                    </div>
                    <div className="dis-f a-c jc-fe w-perc-20">
                      {
                        searchProfile.isDefault && (
                          <div className="mr-2 brdFullRadius bgBlue200 txtBlue700 fsize-300 py-small-4 px-1">
                            Default
                          </div>
                        )
                      }
                      <div className="pos-r">
                        <BrixelButtonIcon
                          isLoading={isSmallLoading[`saveData${searchProfile.id}`]}
                          icon="options-vertical"
                          className="ml-a"
                          theme="dark"
                          ghost
                          bgTransparent
                          onClick={() => setIsOptionsOpen({
                            id: isOptionsOpen.id === searchProfile.id ? null : searchProfile.id,
                            active: !isOptionsOpen.active,
                          })}
                        />
                        {
                          (isOptionsOpen.id === searchProfile.id && isOptionsOpen.active)  && (
                            <BrixelDropdownMini
                              rightAligned
                              ref={optionsRef}
                              topOffset={48}
                              links={
                                [
                                  {
                                    label: translateTo('Edit', lang),
                                    clickFunc: () => editSearchProfile(searchProfile),
                                    className: 'txtPrimary400',
                                  },
                                  {
                                    label: translateTo('Set as default', lang),
                                    clickFunc: () => onSetDefaultSearchProfile(searchProfile),
                                    className: 'txtPrimary400',
                                  },
                                  {
                                    label: translateTo('Delete', lang),
                                    clickFunc: () => onDeleteSearchProfile(searchProfile),
                                    className: 'txtRed400',
                                  },
                                ]
                              }
                            />
                          )
                        }
                      </div>
                    </div>
                  </div>
                  {
                    searchProfile.id && userActiveSearchProfileId === searchProfile.id && (
                      <>
                        <div>
                          <h6>Filters applied</h6>
                          <p className="txtAltGrey400 fsize-300">Summary of all the filters applied </p>

                          <div className="dis-f flex-wrap a-t mt-2">
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
                                          onClick={() => history.push(`/buy/searchProfile/edit/${searchProfile.id}`)}
                                        />
                                      </>
                                    )
                                  }
                                </React.Fragment>
                              ))
                            }
                          </div>

                        </div>
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
  handleSetModal: PropTypes.func.isRequired,
  handleUpdateSearchProfile: PropTypes.func.isRequired,
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
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleUpdateSearchProfile: bindActionCreators(updateUserSearchProfile, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SearchProfileList);
