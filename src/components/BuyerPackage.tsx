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

  const onOpenLink = () => {
    window.open(`https://brixel.ch/${lang}/buyer-package`, '_blank');
    onClose();
  }

  return (
    <div className='dis-fl-col jc-b flex-1'>
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

      <div className='p-3 ta-c max-w-fix-456 mx-a mt-a'>
        <img className="max-w-fix-88" src={BuyerPackageImage} alt="Buyer Package" />

        <h4 className="fSizePx24 fweight-600 mb-1 mt-2 max-w-fix-304 ml-a mr-a">{translateTo('Your Dream Property, Our Expertise', lang)}</h4>

        <p className="txtText700 pb-3">{translateTo('Introducing Brixel Guide - Your personal guide for buying your dream home.', lang)}</p>

      </div>
      <BrixelButtonPrimary
        className="mx-a mt-a mb-4 mb-sm-6"
        rounded
        label="Learn more"
        rightIcon="arrow-right"
        onClick={() => onOpenLink()}
      />
    </div>
  )
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

export default compose(
  connect(mapStateToProps, null),
)(BuyerPackage);
