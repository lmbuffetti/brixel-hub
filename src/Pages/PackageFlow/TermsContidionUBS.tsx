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
import type {TermsConditionUBSType} from '../../@types/Pages/PackageFlow/TermConditionUBS';
import iconFinancing from '../../images/policy/icon-financing.svg';
import iconLetter from '../../images/policy/letter.svg';
import iconPiggy from '../../images/policy/piggy-bank.svg';
import iconExclusive from '../../images/policy/exclusive.svg';

const TermsContidionUBS = (props: TermsConditionUBSType) => {

  const {
    onSaveData,
    windowDimensions,
    lang,
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
        <p className="pt-2 fsize-400 fsize-md-500 max-w-fix-136 max-w-fix-md-192 ml-a mr-a ta-c">
          {translateTo('Support on all financial questions', arg)}
        </p>
      </div>,
      <div className="icon-wrap dis-fl-col a-c px-2 " key="2">
        <div className="icon-circle brdCircle as-fc dis-f jc-c">
          <img loading="lazy" width={154} src={iconLetter} alt="Icon Calendar" />
        </div>
        <p className="pt-2 fsize-400 fsize-md-500 max-w-fix-136 max-w-fix-md-192 ml-a mr-a ta-c">
          {translateTo('Receive a free property appraisal', arg)}
        </p>
      </div>,
      <div className="icon-wrap dis-fl-col a-c px-2 " key="3">
        <div className="icon-circle brdCircle as-fc dis-f jc-c">
          <img loading="lazy" width={154} src={iconPiggy} alt="Icon offer" />
        </div>
        <p className="pt-2 fsize-400 fsize-md-500 max-w-fix-136 max-w-fix-md-192 ml-a mr-a ta-c">
          {translateTo('Benefit from a 0.30% interest rate reduction', arg)}
        </p>
      </div>,
      <div className="icon-wrap dis-fl-col a-c px-2 " key="4">
        <div className="icon-circle brdCircle as-fc dis-f jc-c">
          <img loading="lazy" width={154} src={iconExclusive} alt="Finance" />
        </div>
        <p className="pt-2 fsize-400 fsize-md-500 max-w-fix-136 max-w-fix-md-192 ml-a mr-a ta-c">
          {translateTo('Get access to the exclusive UBS pre-market', arg)}
        </p>
      </div>,
    ]
  );

  const optInTitle = () => (
    <>
      <h2 className="fsize-600 fsize-md-800 fweight-600 mb-2">
        {translateTo('Activate your UBS advantages now', lang)}
      </h2>
      <h4 className="fsize-500 fsize-md-600 mb-3 mb-md-4 fweight-400">
        {translateTo('Our partner UBS provides you support on all financial questions and access to exclusive benefits.', lang)}
      </h4>
    </>
  );

  return (
    <div>
      <div className="row dis-fl-col-rev dis-fl-row-md bgWhite brdRadius max-w-fix-1200 px-0 mx-1 mr-a-sm ml-a-sm py-3 p-md-6 p-lg-9">
        <div className="col-12 col-md-6 max-w-fix-md-456 px-3 px-md-0">
          <div className="hide dis-b-md">
            {optInTitle()}
          </div>
          <span className="txtText700">
            <span className='dis-b fsize-200 lh-20'>
              {translateTo('I agree that my data (surname, first name, telephone number, e-mail) may be transmitted to UBS Switzerland AG. Furthermore, I authorise UBS Switzerland AG to check whether I am already a client of UBS Switzerland AG by comparing my data with my existing data at UBS Switzerland AG.', lang)}
            </span>
            <span className='dis-b fsize-200 lh-20'>
              {translateTo('This consent can be revoked at any time for the future. The revocation of consent does not affect the legality of the data processing carried out on the basis of the consent until revocation.', lang)}
            </span>
          </span>
          <div className="mt-4 mt-md-6">
            <BrixelButtonPrimary
              label= {translateTo('Accept &amp; continue', lang)}
              rounded
              className='mb-1'
              onClick={() => onSaveData('accept')}
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
        <div className="col-12 col-md-6 px-0 px-md-2 max-w-fix-md-480 ml-a-md centerSliderUbs">
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
  windowDimensions: get(state, 'common.windowDimensions', {}),
  lang: get(state, 'common.language', 'en'),
});

export default compose(
  connect(mapStateToProps),
)(TermsContidionUBS);
