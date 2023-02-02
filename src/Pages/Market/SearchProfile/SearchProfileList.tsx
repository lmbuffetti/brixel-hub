import React, {useEffect, useRef, useState} from 'react';
import {
  BrixelButtonIcon,
  BrixelButtonSecondary,
  BrixelButtonText,
  BrixelDropdownMini,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import {BrixelRadioButton, change, initializeForm} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import set from 'lodash/set';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {setModal} from '../../../actions/CommonActions';
import {deleteUserSearchProfile, updateUserSearchProfile} from '../../../actions/SearchProfileActions';
import SearchProfileField from '../../../components/SearchProfileField';
import exclamationIcon from '../../../images/searchProfile/exclamation-icon.svg';
import {QuestionsList} from '../../../resources/Flows/onBoardingBuyer';
import {titleSearchProfile} from '../../../utils/titleCreationSearchProfile';
import translateTo from '../../../utils/translation';
import type {SearchProfileListType} from '../../../@types/Pages/Market/SearchProfile/SearchProfileList';

const SearchProfileList = (props: SearchProfileListType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    changeFieldValue,
    handleDeleteUserSearchProfile,
    handleSetModal,
    handleUpdateSearchProfile,
    initForm,
    isSmallLoading,
    lang,
    onChangeProfile,
    userActiveSearchProfileId,
    userSearchProfiles = [],
  } = props;
  // REF
  const optionsRef = useRef(null);
  // STATE
  const [isOptionsOpen, setIsOptionsOpen] = useState<{id?: string; active: boolean}>({
    id: undefined,
    active: false,
  });
  const [fieldsSearchProfile, setFieldsSearchProfile] = useState<string[]>([]);

  useEffect(() => {
    const fields: string[] = [...fieldsSearchProfile];
    QuestionsList(lang, 'searchProfile', changeFieldValue, 'SearchProfile').forEach((inputs) => {
      if (inputs.inputs) {
        inputs.inputs.forEach((field) => {
          if (field.name && field.name !== 'location.countryCode') {
            if (field.name.includes('location')) fields.push('location');
            else if (!field.name.includes('register')) fields.push(field.name);
          }
        });
      }
    });
    setFieldsSearchProfile(fields);
  }, []);

  const editSearchProfile = (searchProfile) => {
    const initialValue: object = {};
    fieldsSearchProfile.forEach((field) => {
      set(initialValue, field, get(searchProfile, field, ''));
    })
    initForm(initialValue)
    history.push(`/buy/searchProfile/list/edit/${searchProfile.id}`)
  }

  const deleteSearchProfile = (profile) => {
    handleDeleteUserSearchProfile(profile);
    handleSetModal({
      state: false,
    })
  }

  const onDeleteSearchProfile = (profile) => {
    handleSetModal({
      // type: 'confirm',
      small: true,
      state: true,
      title: translateTo('Confirm Delete', lang),
      body: translateTo('Do you want to delete the selected search profile?', lang),
      bodyInnerClass: 'm-a ta-c',
      bodyClassColor: 'bgWhite dis-fl-col jc-b',
      classContainer: 'dis-b ta-c',
      titleImg: exclamationIcon,
      classImg: 'mx-a w-fix-48 mb-1 mt-4-neg',
      bodyActionsClass: 'dis-f a-c jc-c mt-5',
      classTitle: 'ta-c fSizePx18 fweight-600 dis-b mb-3-neg',
      multiBodyActions: [
        {
          btnType: 'Secondary',
          name: translateTo('No, keep it', lang),
          round: true,
          className: 'mr-1',
          func: () => handleSetModal({}),
        },
        {
          btnType: 'Primary',
          name: translateTo('Yes, remove it', lang),
          round: true,
          className: 'ml-1',
          func: () => deleteSearchProfile(profile),
        },
      ],
    })
  }

  const onSetDefaultSearchProfile = (searchProfile) => {
    handleUpdateSearchProfile({
      id: searchProfile.id,
      smallLoader: `saveData${searchProfile.id}`,
      dataSearchProfile: {
        isDefault: true,
      },
    })
    setIsOptionsOpen({
      id: undefined,
      active: false,
    });
  }

  // FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT
  useOutsideAlerter(optionsRef, {
    action: 'function',
    func: () => setIsOptionsOpen({
      id: undefined,
      active: false,
    }),
  });

  return (
    <div className="mb-3">
      <div className="dis-fl-col-rev dis-fl-row-md jc-b a-t">
        <div className="w-perc-100 max-w-fix-264">
          <h5 className="fweight-600">
            {translateTo('Your Search Profiles', lang)}
          </h5>
          <p className="txtText400 fsize-300">
            {translateTo('Select the Search Profile you’d like to apply to filter properties.', lang)}
          </p>
        </div>
        <div className="ml-a mb-2 md-md-0">
          <BrixelButtonText
            label={translateTo('New Search Profile', lang)}
            leftIcon="plus"
            onClick={() => history.push('/buy/searchProfile/list/create')}
          />
        </div>
      </div>
      {
        userSearchProfiles && userSearchProfiles.map((searchProfile, i) => (
          <React.Fragment key={`usrProfile${i.toString()}`}>
            {
              searchProfile.id && (
                <div
                  key={`searchProfile${i.toString()}`}
                  className={`searchProfileList brdSmall brdRadius p-2 p-md-3 mb-2 ${i.toString() === '0' ? 'mt-4' : ''} ${userActiveSearchProfileId === searchProfile.id ? 'bgBlue50 brdBlue200' : 'brdText50'}`}
                >
                  <div className={`dis-f a-c jc-b ${userActiveSearchProfileId === searchProfile.id ? 'brdSmallBottom-md pb-md-3 mb-md-3 pb-2' : 'pb-2 pb-md-0'} brdBlue200`} >
                    <div className="dis-f a-t jc-fs w-perc-75">
                      <BrixelRadioButton
                        disableDelay={true}
                        input={{
                          value: userActiveSearchProfileId,
                          name: 'saerchProfileSelected',
                          onChange: () => onChangeProfile(searchProfile.id || ''),
                          checkmarkColor: 'blue',
                        }}
                        options={[{
                          value: searchProfile.id,
                          label: searchProfile.name || titleSearchProfile(searchProfile, lang),
                        }]}
                      />
                    </div>
                    <div className="dis-f a-c jc-fe w-perc-20">
                      {
                        searchProfile.isDefault && (
                          <div className="mr-md-2 brdFullRadius bgBlue100 txtBlue700 fsize-300 py-small-4 px-1">
                            {translateTo('Default', lang)}
                          </div>
                        )
                      }
                      <div className="pos-r hide dis-b-md">
                        <BrixelButtonIcon
                          isLoading={isSmallLoading[`saveData${searchProfile.id}`]}
                          icon="options-vertical"
                          className="ml-a"
                          theme="dark"
                          ghost
                          bgTransparent
                          onClick={() => setIsOptionsOpen({
                            id: isOptionsOpen.id === searchProfile.id ? undefined : searchProfile.id,
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

                  <div className={userActiveSearchProfileId === searchProfile.id ? '' : 'hide-md'}>
                    <div className="hide dis-b-md">
                      <h6>{translateTo('Filters applied', lang)}</h6>
                      <p className="txtText400 fsize-300">{translateTo('Summary of all the filters applied', lang)}</p>
                    </div>

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
                                    onClick={() => history.push(`/buy/searchProfile/list/edit/${searchProfile.id}`)}
                                  />
                                </>
                              )
                            }
                          </React.Fragment>
                        ))
                      }
                    </div>

                    <div className={`hide-md dis-f jc-fe brdSmallTop ${userActiveSearchProfileId === searchProfile.id ? 'brdBlue200' : 'brdText100'} mt-3 pt-2`}>
                      <BrixelButtonText
                        theme="Red"
                        rounded
                        label={translateTo('Delete', lang)}
                        onClick={() => onDeleteSearchProfile(searchProfile)}
                      />
                      <BrixelButtonSecondary
                        rounded
                        className="ml-2"
                        label= {translateTo('Edit', lang)}
                        onClick = {() => editSearchProfile(searchProfile)}
                      />
                    </div>

                  </div>
                </div>
              )
            }
          </React.Fragment>
        ))
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
  isSmallLoading: get(state, 'common.isSmallLoading', { }),
  lang: get(state, 'common.language', 'en'),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('SearchProfile', field, value));
  },
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
