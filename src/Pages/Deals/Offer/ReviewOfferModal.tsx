import React from 'react';
import {connect} from 'react-redux';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';
import PageHeader from '../../../components/Header/PageHeader';
import PageFooter from '../../../components/Footer/PageFooter';
import {DealType} from '@brixel-io/brixel-components/dist/@types/Model';
import ResumeOffer from './ResumeOffer';
import AddCommentReview from './AddCommentReview';
import ReviewOfferThankYou from './ReviewOfferThankYou';
import api from '../../../controllers/api/config'
import {bindActionCreators} from 'redux';
import {getActiveSingleOffer} from '../../../actions/DealActions';
import {spinnerSmall} from '../../../actions/CommonActions';


type ReviewOfferModalType = {
  activeSingleDeal: DealType
  dealID: string
  activeSingleOffer: OfferType
  handleGetOffer: (data: object) => void
  handleSetSmallLoading: (data: object) => void
  isSmallLoading: { saveData?: boolean }
  closeModal: () => void
  lang: string
}

type FormValueType = {
  status: 'accepted' | 'rejected'
  note: string
}

const ReviewOfferModal = ({
  handleGetOffer,
  handleSetSmallLoading,
  isSmallLoading,
  activeSingleDeal,
  activeSingleOffer,
  closeModal,
  dealID,
  lang,
}: ReviewOfferModalType) => {

  const [formValue, setFormValue] = React.useState<FormValueType>({
    status: 'accepted',
    note: '',
  });
  const [formStep, setFormStep] = React.useState<number>(0);

  const changeStep = (isBack = false) => {
    if (isBack) setFormStep(formStep - 1)
    else setFormStep(formStep + 1)
  }

  const onChangeValue = (name: string, value: string) => {
    setFormValue((prev) => ({...prev, [name]: value}))
  }

  const saveData = () => {
    handleSetSmallLoading({saveOffer: true})
    api.deal.reviewOffer(dealID, formValue)
      .then(() => {
        handleGetOffer({id: dealID, smallLoader: 'saveOffer'})
        changeStep()
      })
  }

  return (
    <div className={`dis-fl-col flex-1 ${formStep === 2 ? 'bgGreen25' : 'bgText25'}`}>
      <PageHeader
        isFlow
        onClose={() => closeModal()}
        showFooter
      />
      <div className="max-w-fix-600 px-3 mx-a w-perc-100 h-perc-100">
        {
          formStep === 0 && (
            <ResumeOffer
              lang={lang}
              activeSingleDeal={activeSingleDeal}
              activeSingleOffer={activeSingleOffer}
              closeModal={() => closeModal()}
              onClick={(action: 'accepted' | 'rejected') => {
                onChangeValue('status', action)
                changeStep()
              }}
            />
          )
        }
        {
          formStep === 1 && (
            <AddCommentReview
              lang={lang}
              changeStep={(isBack: boolean) => changeStep(isBack)}
              onChangeValue={(name, value) => onChangeValue(name, value)}
              onClick={() => saveData()}
              status={formValue.status}
              isLoadingSave={isSmallLoading.saveData || false}
            />
          )
        }
        {
          formStep === 2 && (
            <ReviewOfferThankYou
              closeModal={() => closeModal()}
              lang={lang}
            />
          )
        }
      </div>
      <PageFooter />
    </div>
  )
  ;
}


const mapStateToProps = (state) => ({
  activeSingleProperty: state?.property?.activeSingleProperty || null,
  activeSingleOffer: state?.deal?.activeSingleOffer || {},
  dealID: state?.deal?.activeSingleDeal?.id || '',
  formValue: state?.brixelForm?.makeOffer?.values || {},
  isSmallLoading: state?.isSmallLoading || {},
  lang: state?.common?.language || 'en',
  activeSingleDeal: state?.deal?.activeSingleDeal || {},
});

const mapDispatchToProps = (dispatch) => ({
  handleGetOffer: bindActionCreators(getActiveSingleOffer, dispatch),
  handleSetSmallLoading: bindActionCreators(spinnerSmall, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewOfferModal);
