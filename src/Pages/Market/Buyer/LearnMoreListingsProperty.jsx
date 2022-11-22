import { BrixelButtonPrimary, BrixelButtonSecondary, BrixelProgressBar, translateTo } from '@brixel/brixel-components';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../../actions/CommonActions';
import PreImagePublishedImg from '../../../images/Market/preImagePublished.svg';

const LearnMoreListingsProperty = (props) => {
  const {
    handleSetModal,
    lang,
  } = props;
  const [step, setStep] = useState(1);
  return (
    <div className="mt-6-neg ov-v">
      <p className="txtGreen400">
        <span>{translateTo('Step', lang)}</span>
        <span className="mx-small-4">{step}</span>
        <span>{translateTo('of', lang)}</span>
        <span className="ml-small-4">3</span>
      </p>
      <div className="mt-3 mb-5">
        <BrixelProgressBar
          barBackground="altGrey"
          rounded
          progressValue={(step * 100) / 3}
        />
      </div>
  
      {
        step === 1 && (
          <div>
            <img className="mb-5" src={PreImagePublishedImg} alt="Pre Image Published" />
            <h4 className="mb-2">{translateTo('Published and Pre-Market Properties', lang)}</h4>
            <p>{translateTo('General explanation of published and pre-market properties', lang)}</p>
          </div>
        )
      }
  
      {
        step === 2 && (
          <div>
            <img className="mb-5" src={PreImagePublishedImg} alt="Pre Image Published" />
            <h4 className="mb-2">{translateTo('Published Properties', lang)}</h4>
            <p>{translateTo('Explain what published properties are, like: properties already for sale that people could potentially buy. you can see real image, price, more info etc...', lang)}</p>
          </div>
        )
      }
  
      {
        step === 3 && (
          <div>
            <img className="mb-5" src={PreImagePublishedImg} alt="Pre Image Published" />
            <h4 className="mb-2">{translateTo('Pre-Market Properties', lang)}</h4>
            <p>{translateTo('Explain what pre-market properties are, like: not for sale - no price, no image, just very basic information, no personal detail, fav to get notified if it\'s for sale etc...', lang)}</p>
          </div>
        )
      }
      
      <div className="dis-f a-c jc-fe brdSmallTop brdAltGrey200 mt-2 pt-2">
        <BrixelButtonSecondary
          rounded
          label="Back"
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
        />
        {
          step < 3 ? (
            <BrixelButtonPrimary
              rightIcon="arrow-right"
              className="ml-1"
              rounded
              label="Next"
              onClick={() => setStep(step + 1)}
            />
          ) : (
            <BrixelButtonPrimary
              rightIcon="check"
              className="ml-1"
              rounded
              label="Done"
              onClick={() => handleSetModal({state: false})}
            />
          )
        }
      </div>
      
    </div>
  )
}

LearnMoreListingsProperty.propTypes = {
  handleSetModal: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
})

export default compose(
  connect(null, mapDispatchToProps),
)(LearnMoreListingsProperty);
