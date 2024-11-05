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


type ReviewOfferModalType = {
  activeSingleDeal: DealType
  dealID: string
  activeSingleOffer: OfferType
  closeModal: () => void
  lang: string
}

const ReviewOfferModal = ({
  activeSingleOffer,
  closeModal,
  dealID,
  lang,
  activeSingleDeal,
}: ReviewOfferModalType) => {

  const [formValue, setFormValue] = React.useState({
    status: '',
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
    api.deal.reviewOffer(dealID, formValue)
      .then(() => {
        changeStep()
      })
  }

  return (
    <div className="dis-fl-col bgText25 flex-1">
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
            />
          )
        }
        {
          formStep === 2 && (
            <ReviewOfferThankYou
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
  lang: state?.common?.language || 'en',
  activeSingleDeal: state?.deal?.activeSingleDeal || {},
});

export default connect(mapStateToProps, null)(ReviewOfferModal);
