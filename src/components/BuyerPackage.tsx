import React from 'react';
import get from 'lodash/get';
import {
  BrixelButtonPrimary,
} from '@brixel-io/brixel-components';
import {compose} from 'redux';
import {connect} from 'react-redux';
import translateTo from '../utils/translation';
import type {BuyerPackageType} from '../@types/components/BuyerPackage';
import BrixelButtonIcon from '@brixel-io/brixel-components/dist/components/BrixelButtonIcon';
import BuyerPackageImage from '../images/buyerPackage.svg';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const BuyerPackage = (props: BuyerPackageType) => {
  const {
    lang,
    onClose,
  } = props;


  const onCloseModal = () => {
    cookies.set('brixelBuyerPackage', 'true');
    onClose();
  }

  return (
    <div className='dis-fl-col flex-1 h-perc-100 jc-b'>
      <div className="dis-f jc-fe a-c p-2">
        <BrixelButtonIcon
          bgTransparent
          className="zIndex11"
          theme="text"
          themeSat={400}
          icon="close"
          onClick={() => onCloseModal()}
        />
      </div>
      <div className="ta-c">
        <img className="max-w-fix-88" src={BuyerPackageImage} alt="Buyer Package" />
      </div>
      <div className='p-3 ta-c max-w-fix-456 mx-a'>

        <h4 className="fSizePx24 fweight-600 mb-1">{translateTo('Your Dream Property, Our Expertise', lang)}</h4>

        <p className="txtText700">{translateTo('Introducing Brixel Guide - Your personal guide for buying your dream home.', lang)}</p>

        <BrixelButtonPrimary
          className="mx-a mt-3"
          rounded
          label="Learn more"
          rightIcon="arrow-right"
          onClick={() => window.open(`https://brixel.ch/${lang}/guide`, '_blank')}
        />
      </div>
    </div>
  )
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

export default compose(
  connect(mapStateToProps, null),
)(BuyerPackage);
