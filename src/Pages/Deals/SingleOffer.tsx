import React, {useEffect} from 'react';
import {
  BrixelButtonIcon,
  BrixelIcon,
} from '@brixel-io/brixel-components';
import {change} from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {
  getActiveSingleDeal, getActiveSingleOffer,
} from '../../actions/DealActions';
import {setModal} from '../../actions/CommonActions';
import {DealType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import translateTo from '../../utils/translation';
import MakeOfferPropertyCardVertical from '../../components/Cards/MakeOfferPropertyCardVertical';
import ContactPageCard from '../../components/Cards/ContactPageCard';
import BannerFullSize from '../../components/BannerFullSize';
import MakeOfferTimeline from '../Dashboard/Buyer/Offer/MakeOffer/MakeOfferTimeline';
import DocumentIcon from '../../images/documentsIcon/documentFull.svg';
import BannerOfferDefault from '../../images/dashboard/bannerOffer-deafault.svg';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';
import {getActiveSingleProperty} from '../../actions/PropertyActions';
import ReviewOfferModal from './Offer/ReviewOfferModal';
import medelIcon from '../../images/offer-flow/medel.svg';

type SingleOfferType = {
  activeSingleDeal: DealType
  activeSingleOffer: OfferType
  activeSingleProperty: PropertyType
  handleGetActiveDeal: (data: object) => void;
  handleGetActiveSingleOffer: (data: object) => void;
  handleSetModal: (data: object) => void;
  hanldeGetActiveSingleProperty: (data: object) => void;
  lang: string
}

const SingleOffer = (props: SingleOfferType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    activeSingleDeal,
    activeSingleOffer,
    activeSingleProperty,
    handleGetActiveDeal,
    handleGetActiveSingleOffer,
    handleSetModal,
    hanldeGetActiveSingleProperty,
    lang,
  } = props;

  const propID = get(match, 'propID', null);
  const dealID = get(match, 'dealID', null);

  useEffect(() => {
    if (activeSingleDeal.id !== dealID || !activeSingleDeal.id) {
      handleGetActiveDeal({ id: dealID, property: propID, smallLoader: 'getDeal' });
      handleGetActiveSingleOffer({ id: dealID, smallLoader: 'getOffer' });
    }
  }, [history?.location?.pathname]);

  useEffect(() => {
    if (activeSingleProperty.id !== propID || !activeSingleProperty.id) {
      hanldeGetActiveSingleProperty({ id: propID, smallLoader: 'getProperty' });
    }
  }, [propID]);

  const viewOffer = () => {
    handleSetModal({
      clickOutsideToClose: false,
      bodyClassColor: 'p-0 dis-fl-col',
      bodyInnerClass: 'h-perc-100 dis-fl-col flex-1',
      state: true,
      small: true,
      hideHeader: true,
      layout: 'fullscreen',
      component: <ReviewOfferModal closeModal={() => handleSetModal({})} />,
    })
  }

  const getFirstName = () => {
    const fullName = get(activeSingleDeal, 'user.name', '');
    return fullName.split(' ')[0] || '';
  };


  const getOfferBackground = () => {
    if (activeSingleOffer?.status === 'accepted') return 'Green';
    if (activeSingleOffer?.status === 'pending') return 'Yellow';
    if (activeSingleOffer?.status === 'rejected') return 'Red';
    return 'light';
  };

  const getOfferTextColor = () => {
    if (activeSingleOffer?.status === 'accepted') return 'Green400';
    if (activeSingleOffer?.status === 'pending') return 'Yellow400';
    if (activeSingleOffer?.status === 'rejected') return 'Red400';
    return 'Text900';
  };

  const getStatusIcon = () => {
    if (activeSingleOffer?.status === 'accepted') return 'check-thin';
    if (activeSingleOffer?.status === 'pending') return 'clock';
    if (activeSingleOffer?.status === 'rejected') return 'close-small';
    return 'clock';
  };

  return (
    <>
      {
        activeSingleOffer.id && (
          <div className="dashboardContainer mt-0 mt-md-3 dis-f jc-b" id="dashboard">
            <div className="w-perc-100">
              <div className="single-deal dis-fl-col max-w-fix-1024">
                {/* top panel */}
                <div className="actions dis-fl-row jc-b pb-2">
                  <div className="pt-2 pr-1 pr-lg-0 pt-lg-0">
                    <BrixelButtonIcon
                      icon="arrow-left-small"
                      ghost
                      theme="text"
                      onClick={() => history.push(`/${propID}/prospect/${dealID}`)}
                    />
                  </div>
                </div>

                <div className="dis-f h-perc-lg-100">
                  <div className="dis-fl-col w-perc-100 h-perc-lg-100">
                    <div className="dis-f mb-1 mb-sm-3 a-c">
                      <h3 className="fsize-500 fsize-sm-600 fweight-600">
                        <span>{getFirstName()}</span>
                        {translateTo('\'s offer', lang)}
                      </h3>
                      {
                        activeSingleOffer?.status && (
                          <div
                            className={`status-box dis-f a-b
                             ml-2 brdRadius px-1 py-small-4 bg${getOfferBackground()}100`}>
                            <BrixelIcon
                              iconSize='w-fix-16'
                              color={getOfferBackground()}
                              className='mr-1'
                              icon={getStatusIcon()}
                            />
                            <span className={`txt${getOfferTextColor()} fsize-200 fweight-500`}>{translateTo(activeSingleOffer?.status.charAt(0).toUpperCase() + activeSingleOffer?.status.slice(1), lang)}</span>
                          </div>
                        )
                      }
                    </div>
                    {
                      activeSingleOffer.id ? (
                        <div className="dis-fl-col-rev dis-fl-row-md">
                          <div className="w-perc-100 max-w-fix-md-344">
                            <div>
                              <h4
                                className="mb-2 fsize-500 fweight-600 mt-2 mt-md-0">{translateTo('Property details', lang)}</h4>
                              <MakeOfferPropertyCardVertical />
                            </div>

                            <div className="mt-3">
                              <h5 className="mb-2 fsize-500 fweight-600">{translateTo('Contact', lang)}</h5>
                              {
                                activeSingleDeal.user && (
                                  <ContactPageCard
                                    avatarIcon={{
                                      icon: 'key',
                                      color: 'red',
                                    }}
                                    className="mb-1"
                                    contactRole="Buyer"
                                    contactDetails={activeSingleDeal.user}
                                  />
                                )
                              }
                              <ContactPageCard />
                            </div>
                          </div>

                          <div className="pl-md-5 w-perc-md-70">
                            <h5 className="mb-2 fweight-600 mt-2 mt-md-0">{translateTo('Progress', lang)}</h5>

                            {
                              !activeSingleOffer?.id || activeSingleOffer?.status === 'accepted' && (
                                <BannerFullSize
                                  smallIcon
                                  className="mb-2"
                                  type="green"
                                  lang={lang}
                                  image={medelIcon}
                                  description={['Congratulations on reaching an agreement!', 'You will be contacted shortly to proceed with the next steps.']}
                                />
                              )
                            }

                            <MakeOfferTimeline
                              buyerInfo={activeSingleDeal.user}
                              activeSingleOffer={activeSingleOffer}
                              handleViewOffer={() => viewOffer()}
                              lang={lang}
                              isSeller
                            />

                          </div>


                        </div>
                      ) : (
                        <div>
                          <BannerFullSize
                            type="green"
                            lang={lang}
                            image={DocumentIcon}
                            title="Need a proof of financing?"
                            description={['Order a non-binding proof of financing from our trusted partners before making an offer. It can help you secure the best deal.']}
                            button={{
                              label: 'Apply',
                              iconRight: 'arrow-right',
                              onClick: () => history.push(`/buyer/${propID}/offerFlow/proofFinancing`),
                              type: 'primary',
                            }}
                          />

                          <BannerFullSize
                            className="mt-2"
                            type="default"
                            lang={lang}
                            image={BannerOfferDefault}
                            title="Ready to make an offer?"
                            description={['Send your proposal and take the first steps to buy your dream home.']}
                            button={{
                              label: 'Add offer',
                              iconLeft: 'plus',
                              onClick: () => history.push(`/buyer/${propID}/offerFlow/makeOffer`),
                              type: 'primary',
                            }}
                          />
                        </div>
                      )
                    }
                  </div>
                </div>

              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleOffer: state?.deal?.activeSingleOffer || {},
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleGetActiveDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  handleGetActiveSingleOffer: bindActionCreators(getActiveSingleOffer, dispatch),
  hanldeGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SingleOffer);
