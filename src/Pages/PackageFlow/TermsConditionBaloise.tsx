import React, {useRef, useEffect, useState} from 'react';
import {
  BrixelButtonPrimary,
  BrixelButtonText,
} from '@brixel-io/brixel-components';
import Slider from 'react-slick';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {compose} from 'redux';
import translateTo from '../../utils/translation';
import type {TermsConditionBaloiseType} from '../../@types/Pages/PackageFlow/TermConditionBaloise';
import iconFinancing from '../../images/policy/baloise/icon-financing-baloise.svg';
import iconLetter from '../../images/policy/baloise/letter-baloise.svg';
import iconPiggy from '../../images/policy/baloise/piggy-bank-baloise.svg';
import iconExclusive from '../../images/policy/baloise/exclusive-baloise.svg';

const TermsConditionBaloise = (props: TermsConditionBaloiseType) => {

  const {
    isSmallLoading,
    lang,
    onSaveData,
    windowDimensions,
  } = props;

  // STATE
  const [isDesktop, setIsDesktop] = useState(false);
  const sliderInstance = useRef(null);

  const settingSlider = {
    centerMode: true,
    slidesToShow: 1,
    speed: 500,
    autoPlay: true,
    arrows: false,
    focusOnSelect: true,
    dots: false,
    infinite: true,
    variableWidth: true,
    draggable: true,
    centerPadding: '8px',
  };


  useEffect(() => {
    if (get(windowDimensions, 'width', 0) > 768) setIsDesktop(true);
    else setIsDesktop(false);
  }, [get(windowDimensions, 'width', 0)]);

  const SignupDescription = (arg: string) => (
    [
      <div className="icon-wrap dis-fl-col a-c px-2 " key="1">
        <div className="icon-circle brdCircle as-fc dis-f jc-c">
          <img src={iconFinancing} alt="Icon Financing" width={154}
          />
        </div>
        <p className="pt-2 fsize-400 max-w-fix-136 max-w-fix-md-224 ml-a mr-a ta-c">
          {translateTo('Support on all financial questions', arg)}
        </p>
      </div>,
      <div className="icon-wrap dis-fl-col a-c px-2 " key="2">
        <div className="icon-circle brdCircle as-fc dis-f jc-c">
          <img loading="lazy" width={154} src={iconLetter} alt="Icon Calendar" />
        </div>
        <p className="pt-2 fsize-400 max-w-fix-136 max-w-fix-md-224 ml-a mr-a ta-c">
          {translateTo('Receive a free Financing Certificate', arg)}
        </p>
      </div>,
      <div className="icon-wrap dis-fl-col a-c px-2 " key="3">
        <div className="icon-circle brdCircle as-fc dis-f jc-c">
          <img loading="lazy" width={154} src={iconPiggy} alt="Icon offer" />
        </div>
        <p className="pt-2 fsize-400 max-w-fix-136 max-w-fix-md-224 ml-a mr-a ta-c">
          {translateTo('Benefit from 0.15% discount on your online mortgage', arg)}
        </p>
      </div>,
      <div className="icon-wrap dis-fl-col a-c px-2 " key="4">
        <div className="icon-circle brdCircle as-fc dis-f jc-c">
          <img loading="lazy" width={154} src={iconExclusive} alt="Finance" />
        </div>
        <p className="pt-2 fsize-400 max-w-fix-136 max-w-fix-md-224 ml-a mr-a ta-c">
          {translateTo('Get 10-days of exclusive access to new properties', arg)}
        </p>
      </div>,
    ]
  );

  const optInTitle = () => (
    <>
      <h2 lang={lang} className={`fsize-600 fsize-md-800 fweight-600 mb-2 ${lang === 'de' ? 'hyphens' : ''}`}>
        {translateTo('Benefit from the consulting services of our partner Baloise', lang)}
      </h2>
    </>
  );

  return (
    <div>
      <div className="row dis-fl-col-rev dis-fl-row-md bgWhite brdRadius max-w-fix-1200 px-0 mx-1 mr-a-sm ml-a-sm py-3 p-md-6 p-lg-9">
        <div className="col-12 col-md-6 max-w-fix-md-456 px-3 px-md-0">
          <div className="hide dis-b-md">
            {optInTitle()}
          </div>
          <div className="">
            <span className='dis-b fweight-600 txtText900 fsize-300 lh-20 pb-small-4'>
              {translateTo('Transmission of data to Baloise.', lang)}
            </span>
            <span className='dis-b fsize-300 lh-20'>
              {translateTo('I hereby agree that my data (surname, first name, phone number, e-mail) is transmitted to Baloise Insurance Ltd and to Baloise Bank Ltd so that I can get contacted regarding the financing of my self-occupied real estate incl. risk protection.', lang)}
            </span>
            <span className='dis-b fsize-300 lh-20 pt-2'>
              {translateTo('You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing carried out on the basis of the consent until revocation.', lang)}
            </span>
          </div>
          <div className="mt-4 mt-md-6">
            <BrixelButtonPrimary
              label= {translateTo('Accept &amp; continue', lang)}
              rounded
              className='mb-1'
              onClick={() => onSaveData('accept')}
              isLoading={isSmallLoading.sendData}
            />
            <BrixelButtonText
              label= {translateTo('Skip', lang)}
              rounded
              theme='text'
              themeSat={800}
              onClick={() => onSaveData()}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 px-0 px-md-2 max-w-fix-md-480 ml-a-md centerSliderbaloise-1">
          {
            isDesktop ? (
              <div className="two-col-grid w-perc-100">
                {SignupDescription(lang)}
              </div>
            ) : (
              <>
                <div className='px-3'>
                  {optInTitle()}
                </div>
                <div className="centerSlider w-perc-100 mb-4">
                  <Slider ref={sliderInstance} {...settingSlider}>
                    {SignupDescription(lang)}
                  </Slider>
                </div>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}


const mapStateToProps = (state) => ({
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps),
)(TermsConditionBaloise);
