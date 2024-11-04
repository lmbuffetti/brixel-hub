import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import translateTo from '../../../../utils/translation';
import SectionMobileTitle from '../../../../components/SectionMobileTitle';
import BannerFullSize from '../../../../components/BannerFullSize';
import DocumentIcon from '../../../../images/documentsIcon/documentFull.svg'
import BannerOfferDefault from '../../../../images/dashboard/bannerOffer-deafault.svg';
import MoneySaverImg from '@brixel-io/brixel-components/dist/images/IconsColored/general/SavingMoney.svg';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {getActiveSingleOffer} from '../../../../actions/DealActions';
import {bindActionCreators} from 'redux';
import type {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';
import MakeOfferPropertyCardVertical from '../../../../components/Cards/MakeOfferPropertyCardVertical';
import ContactPageCard from '../../../../components/Cards/ContactPageCard';
import {setModal} from '../../../../actions/CommonActions';
import MakeOfferModalUpdate from './MakeOffer/MakeOfferModalUpdate';
import MakeOfferModalView from './MakeOffer/MakeOfferModalView';
import MakeOfferTimeline from './MakeOffer/MakeOfferTimeline';

type SingleOfferType = {
  activeSingleOffer: OfferType
  dealID: string
  handleGetActiveSingleOffer: (data: object) => void;
  handleSetModal: (data: object) => void;
  lang: string
}

const SingleOffer = ({
  activeSingleOffer,
  dealID,
  handleGetActiveSingleOffer,
  handleSetModal,
  lang,
}: SingleOfferType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const propID = match?.propID || '';

  useEffect(() => {
    if (dealID) {
      handleGetActiveSingleOffer({id: dealID, smallLoader: 'getOffer'});
    }
  }, [dealID]);

  const updateOffer = () => {
    handleSetModal({
      clickOutsideToClose: false,
      bodyClassColor: 'p-0 dis-fl-col',
      bodyInnerClass: 'h-perc-100 dis-fl-col flex-1',
      title: 'Make new offer',
      state: true,
      small: true,
      titleTop: true,
      layout: 'large',
      component: <MakeOfferModalUpdate closeModal={() => handleSetModal({})} />,
    })
  }

  const viewOffer = () => {
    handleSetModal({
      clickOutsideToClose: false,
      bodyClassColor: 'p-0 dis-fl-col',
      bodyInnerClass: 'h-perc-100 dis-fl-col flex-1',
      state: true,
      small: true,
      hideHeader: true,
      layout: 'fullscreen',
      component: <MakeOfferModalView closeModal={() => handleSetModal({})} />,
    })
  }

  if (!activeSingleOffer) {
    return <div/>
  }

  return (
    <>
      <h3 className="mb-3 hide dis-b-lg fweight-600">
        {translateTo(activeSingleOffer.id  ? 'Your Offer' : 'Offer', lang)}
      </h3>
      <div className="dis-f h-perc-lg-100">
        <div className="dis-fl-col w-perc-100 h-perc-lg-100">
          <SectionMobileTitle
            title={activeSingleOffer.id  ? 'Your Offer' : 'Offer'}
          />
          {
            activeSingleOffer.id ? (
              <div className="dis-f">
                <div className="w-perc-30">
                  <div>
                    <h4 className="mb-2 fsize-500 fweight-600">{translateTo('Property details', lang)}</h4>
                    <MakeOfferPropertyCardVertical />
                  </div>

                  <div className="mt-3">
                    <h5 className="mb-2 fsize-500 fweight-600">{translateTo('Contact', lang)}</h5>
                    <ContactPageCard />
                  </div>
                </div>

                <div className="pl-5 w-perc-70">
                  <h5 className="mb-2">Progress</h5>

                  {
                    !activeSingleOffer?.id || activeSingleOffer?.status === 'rejected' && (
                      <BannerFullSize
                        className="mb-2"
                        type="green"
                        lang={lang}
                        image={MoneySaverImg}
                        title="Let’s add a new offer!"
                        description={['Your offer was declined. Feel free to propose a new price if you\'re still interested!']}
                        button={{
                          label: 'Add new offer',
                          iconLeft: 'plus',
                          onClick: () => updateOffer(),
                          type: 'primary',
                        }}
                      />
                    )
                  }

                  <MakeOfferTimeline
                    activeSingleOffer={activeSingleOffer}
                    handleViewOffer={() => viewOffer()}
                    lang={lang}
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
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleOffer: state?.deal.activeSingleOffer || null,
  dealID: state?.deal?.activeSingleDeal?.id || null,
  lang: state?.common?.language || 'en',
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSingleOffer:bindActionCreators(getActiveSingleOffer, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleOffer);
