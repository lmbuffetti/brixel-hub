import {BrixelButtonPrimary, BrixelButtonSecondary} from '@brixel-io/brixel-components';
import {BrixelCheckboxSingle} from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import translateTo from '../../../utils/translation';
import {setModal} from '../../../actions/CommonActions';
import ConfirmIconImg from '../../../images/Market/confirmIcon.svg';
import {setCookie} from '../../../utils/helpers';
import type {LearnMoreListingsPropertyType} from '../../../@types/Pages/Market/Buyer/NotInterestedConfirmModal';

const LearnMoreListingsProperty = (props: LearnMoreListingsPropertyType) => {
  const {
    handleSetModal,
    isSmallLoading,
    id,
    lang,
    onClick,
  } = props;
  // STATE
  const [isHideModal, seiIsHideModal] = useState(false);

  useEffect(() => {
    if (isSmallLoading[`notInterested-${id}`] === false) {
      handleSetModal({state: false})
    }
  }, [isSmallLoading[`notInterested-${id}`]]);


  const onSaveData = () => {
    if (isHideModal) setCookie('brixelHideNotInterested', 'true');
    onClick()
  }
  console.log(lang);
  return (
    <>
      <div className="dis-f a-t jc-b mt-a mt-sm-0">
        <img className="mr-5 pl-2" src={ConfirmIconImg} alt="Pre Image Published" />
        <div>
          <h5 className="mb-2 fweight-600">{translateTo('Are you sure you want to hide this property?', lang)}</h5>
          <p>{translateTo('If you are not interested in this property, you can hide it not to see it in the list anymore.', lang)}</p>

          <BrixelCheckboxSingle
            className="mt-2"
            input={{
              name: 'hideModal',
              value: isHideModal,
              onChange: (val) => seiIsHideModal(val),
            }}
            options={{value: true, label: translateTo('Don’t ask me again.', lang)}}
          />

        </div>
      </div>
      <div className="dis-f a-c jc-fe mt-a pt-2">
        <BrixelButtonSecondary
          rounded
          label={translateTo('No, keep it', lang)}
          onClick={() => handleSetModal({state: false})}
        />
        <BrixelButtonPrimary
          className="ml-1"
          rounded
          label={translateTo('Yes, hide it', lang)}
          onClick={() => onSaveData()}
          isLoading={isSmallLoading[`notInterested-${id}`]}
        />
      </div>

    </>
  )
}

const mapStateToProps = (state) => ({
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(LearnMoreListingsProperty);
