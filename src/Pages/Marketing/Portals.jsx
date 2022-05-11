/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonPrimary,
  BrixelButtonText,
  BrixelStatus,
} from '@brixel/brixel-components';
import {
  ReduxField,
  BrixelTextArea,
  change,
  reset,
  BrixelSwitchButton,
} from '@brixel/brixel-components/dist/form';
import { updatePortalsReview } from '../../actions/PropertyActions';
import { setModal } from '../../actions/CommonActions';
import { MarketingModal } from '../../resources/marketingModal';

const Portals = (props) => {
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    changeFieldValue,
    companyPortals,
    customPortals,
    formValue,
    handleSetModal,
    handleUpdatePortalsReview,
    isSmallLoading,
    modal,
    portals,
  } = props;
  // STATE
  const [status, setStatus] = useState({});
  // URL PARAMS
  const propID = get(match, 'propID', null);
  
  // GET PORTALS STATUS
  const checkPortalsOnline = () => {
    let isOnline = false;
    Object.keys(portals).map((key) => {
      if (portals[key] && get(customPortals, `${key}`, true) && !isOnline && !key.includes('Url')) isOnline = true;
      return null;
    });
    Object.keys(customPortals).map((key) => {
      if (customPortals[key] && !isOnline && !key.includes('Url')) isOnline = true;
      return null;
    });
    return isOnline;
  };
  
  // ASSIGN COLOR AND TEXT BY STATUS
  useEffect(() => {
    if (activeSingleProperty.portalsReview) {
      setStatus({
        text: 'Review',
        color: 'Yellow400',
        state: 'review',
      });
    } else if (checkPortalsOnline()) {
      setStatus({
        text: 'Published',
        color: 'Green400',
        state: 'published',
      });
    } else {
      setStatus({
        text: 'Unpublished',
        color: 'Red400',
        state: 'unpublished',
      });
    }
  }, [activeSingleProperty]);
  
  // CHANGE PORTALS REVIEW
  const changeReviewStatus = () => {
    const data = {
      page: propID,
      smallLoader: 'saveMarketingPortal',
      status: checkPortalsOnline() ? 'offline' : 'online',
    };
    handleUpdatePortalsReview(data);
  };
  
  const onClickRequest = (state, type = 'request') => {
    const bodyText = MarketingModal[state][type].body.replace(':companyPrice', `${get(activeSingleCompany, 'country.currency')} ${get(activeSingleCompany, 'meta.portals.price')}`);
    handleSetModal({
      state: true,
      layout:'xlarge',
      bodyClassColor: 'bgWhite',
      title: MarketingModal[state][type].title,
      body: bodyText,
      small: true,
      titleImg: MarketingModal[state][type].titleImg,
      classContainer: 'dis-b ta-c',
      classImg: 'mx-a w-fix-64 mb-3',
      bodyActionsClass: 'dis-f a-c jc-c mt-5 mb-3',
      bodyInnerClass: 'max-w-fix-384 m-a ta-c',
      classTitle: 'ta-c',
      showSupport: type === 'success',
      supportLayout: 'inline',
      multiBodyActions: type === 'success' ? [
        {
          btnType: 'Primary',
          name: 'Ok thanks',
          round: true,
          func: () => handleSetModal({}),
        }
      ] : [
        {
          btnType: 'Secondary',
          name: 'Cancel',
          round: true,
          className: 'mr-1',
          func: () => handleSetModal({}),
        },
        {
          btnType: 'Primary',
          name: 'Confirm',
          round: true,
          className: 'ml-1',
          func: () => changeReviewStatus()
        }
      ]
    })
  };
  
  useEffect(() => {
    if (get(modal, 'multiBodyActions', []).length > 1) {
      modal.multiBodyActions[1].isLoading = isSmallLoading.saveMarketingPortal;
      handleSetModal(modal);
    }
    if (isSmallLoading.saveMarketingPortal === false) {
      const stateText = status.state === 'published' ? 'unpublishPage' : 'publishPage';
      onClickRequest(stateText, 'success');
    }
  }, [isSmallLoading]);
  
  return (
    <>
      <div className="bgWhite p-4 brdRadius">
        <div className="dis-f jc-b a-c mb-2">
          <h5>Publish on portals</h5>
          <div className={`brdSmall px-2 py-1 brd${status.color} txt${status.color} brdRadius`}>
            {status.text}
          </div>
        </div>
        
        <div className="mb-4">
          {
            checkPortalsOnline() ? (
              <p>Your property is published on following portals:</p>
            ) : (
              <div>
                <p>
                  Reach a wide audience and publish your property on the biggest portals
                </p>
                <ul className="checkList fsize-300 green mt-2 txtAltGrey700">
                  <li>Manage all your listings in one place</li>
                  <li>Publish all your listings with one click</li>
                  <li>Valid for 6 months</li>
                  {
                    get(activeSingleProperty, 'location.countryCode', '') === 'PT' ? (
                      <li>Idealista, Imovirtual, Casa Sapo, SuperCasa and many more.</li>
                    ) : (
                      <li>Homegate, ImmoScout24, Comparis, Newhome and many more.</li>
                    )
                  }
                </ul>
              </div>
            )
          }
        </div>
        
        <div className="portalsList mt-3">
          {
            checkPortalsOnline() && Object.keys(companyPortals).map((key, i) => (
              <React.Fragment
                key={`prt_${i.toString()}`}
              >
                {
                  companyPortals[key] && (
                    <>
                      {
                        portals[key] ? (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={portals[`${key}Url`]}
                            className="dis-f a-c"
                          >
                            <span className="fsize-300">{key}</span>
                            <BrixelStatus
                              color="green"
                            />
                          </a>
                        ) : (
                          <div
                            className="dis-f a-c singlePortal"
                          >
                            <span className="fsize-300">{key}</span>
                            <BrixelStatus
                              color="red"
                            />
                          </div>
                        )
                      }
                    </>
                  )
                }
              </React.Fragment>
            ))
          }
          {
            Object.keys(customPortals).map((key, i) => (
              <React.Fragment key={`cstPrt_${i.toString()}`}>
                {
                  customPortals[key] && !key.toLocaleLowerCase().includes('url') && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={customPortals[`${key}Url`]}
                      className="dis-f a-c"
                    >
                      <span className="fsize-300">{key}</span>
                      <BrixelStatus
                        color="green"
                      />
                    </a>
                  )
                }
              </React.Fragment>
            ))
          }
        </div>
        
        {
          checkPortalsOnline() && !formValue.portalsReview && (
            <>
              <div>
                <p className="fweight-500 txtDark700 mb-1 mt-5">Portals description</p>
                <span className="txtDark200">Add a description text which is shown on portals only.</span>
              </div>
              <ReduxField
                form="Property"
                input={{
                  name: 'description.portalHighlight',
                  placeholder: 'Add text',
                }}
                design={{
                  className: 'mt-2',
                }}
                component={BrixelTextArea}
              />
            </>
          )
        }
        
        <div className="dis-f a-c jc-fe mt-5">
          {
            checkPortalsOnline() ? (
              <>
                <BrixelButtonText
                  label="Take Page offline"
                  theme="red"
                  rounded
                  onClick={() => onClickRequest('unpublishPortals', 'request')}
                  isLoading={isSmallLoading.pageReview}
                />
              </>
            ) : (
              <>
                {
                  status.state !== 'review' && (
                    <BrixelButtonPrimary
                      label="Request to publish"
                      rounded
                      onClick={() => onClickRequest('publishPortals', 'request')}
                      isLoading={isSmallLoading.pageReview}
                    />
                  )
                }
              </>
            )
          }
        </div>
      
      </div>
      
      
      {
        get(activeSingleProperty, 'published', null) === false && (
          <div className="bgWhite brdRadius p-4 mt-2">
            <BrixelSwitchButton
              isReversed
              label="Pre-market"
              className="mb-3 boldLabel"
              input={{
                onChange: (val) => changeFieldValue('preMarketVisible', val),
                name: 'stageOffer',
                value: activeSingleProperty.preMarketVisible,
              }}
            />
            {
              get(activeSingleProperty, 'preMarketVisible', false) === true ? (
                <p className="txtDark700">
                  Your property is visible on our pre-market.
                  Registered buyers can observe your property and will be informed if you want to go to market. We never share any exact address or personal data without your consent.
                </p>
              ) : (
                <p className="txtDark700" dangerouslySetInnerHTML={{ __html: 'Your property is <strong class="lh-in fweight-600">not</strong> visible on our pre-market. If you make it visible, registered buyers can observe your property and will be informed if you want to go to market. We never share any exact address or personal data without your consent.' }} />
              )
            }
          </div>
        )
      }
    
    </>
  );
};

Portals.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  companyPortals: PropTypes.object.isRequired,
  customPortals: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  handleUpdatePortalsReview: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  portals: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const formValue = get(state, 'brixelForm.Property.values', {});
  const activeSingleProperty = get(state, 'property.activeSingleProperty', {});
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty,
    companyPortals: get(state, 'companies.activeSingleCompany.availablePortals', {}),
    customPortals: get(activeSingleProperty, 'customPortals', {}),
    formValue,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    modal: get(state, 'common.modal', {}),
    portals: get(activeSingleProperty, 'portals', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form, data) {
    (dispatch(reset(form, data)));
  },
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleUpdatePortalsReview: bindActionCreators(updatePortalsReview, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Portals);
