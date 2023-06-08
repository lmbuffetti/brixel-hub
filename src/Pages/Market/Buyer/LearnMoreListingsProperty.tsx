import React from 'react';
import {
  BrixelProgressBar,
} from '@brixel-io/brixel-components';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {setModal} from '../../../actions/CommonActions';
import learMoreImg1 from '../../../images/Market/learMoreImg1.svg';
import learMoreImg2 from '../../../images/Market/learMoreImg2.svg';
import learMoreImg3 from '../../../images/Market/learMoreImg3.svg';
import learMoreImg4 from '../../../images/Market/learMoreImg4.svg';
import learMoreImg5 from '../../../images/Market/learMoreImg5.svg';
import translateTo from '../../../utils/translation';
import type {LearnMoreListingsPropertyType} from '../../../@types/Pages/Market/Buyer/LearnMoreListingProperty';

const LearnMoreListingsProperty = (props: LearnMoreListingsPropertyType) => {
  const stepsNumber = 5;
  const {
    lang,
    step,
  } = props;

  return (
    <div className="px-1 px-sm-0">
      <div className='mt-7-neg'>
        <p className="fsize-300 txtText700">
          <span>{translateTo('Step', lang)}</span>
          <span className="mx-small-4">{step}</span>
          <span>{translateTo('of', lang)}</span>
          <span className="ml-small-4">{stepsNumber}</span>
        </p>
        <div className="mt-3 mb-5">
          <BrixelProgressBar
            barBackground="text"
            rounded
            progressValue={(step * 100) / stepsNumber}
          />
        </div>
      </div>
      <div className="">

        <div style={{ display: step === 1 ? 'block' : 'none' }}>
          <img className="mb-5 w-perc-100" src={learMoreImg1} alt="Pre Image Published" />
          <h5 className="mb-2 fweight-600">{translateTo('Welcome 👋', lang)}</h5>
          <p>
            <span>{translateTo('This is your Brixel Hub space.', lang)}</span>
            <span className="dis-b">{translateTo('A place where you can do great things and find your dream home.', lang)}</span>
          </p>
          <p className="pt-1">
            {translateTo('Let’s find out what you can do here! 🚀', lang)}
          </p>
        </div>

        <div style={{ display: step === 2 ? 'block' : 'none' }}>
          <img className="mb-5 w-perc-100" src={learMoreImg2} alt="Pre Image Published" />
          <h5 className="mb-2 fweight-600">{translateTo('Search Profile', lang)}</h5>
          <p>{translateTo('To find exactly what you’re looking for you can first create a Search Profile.', lang)}</p>
          <p>{translateTo('By telling us your preferences, we can show you the right properties so you’re more likely to find your dream house!', lang)}</p>
        </div>

        <div style={{ display: step === 3 ? 'block' : 'none' }}>
          <img className="mb-5 w-perc-100" src={learMoreImg3} alt="Pre Image Published" />
          <h5 className="mb-2 fweight-600">{translateTo('Pre-Market Properties', lang)}</h5>
          <p>{translateTo('Discover exclusive properties which are not on sale yet, but waiting for your first move.', lang)}</p>
          <p>{translateTo('Pre-Market properties have no price or real image, just really basic informations and no seller details.', lang)}</p>
        </div>

        <div style={{ display: step === 4 ? 'block' : 'none' }}>
          <img className="mb-5 w-perc-100" src={learMoreImg4} alt="Pre Image Published" />
          <h5 className="mb-2 fweight-600">{translateTo('Published properties', lang)}</h5>
          <p>{translateTo('Explore our properties that are already on sale with 3D tour, real pictures, documentation and verified informations.', lang)}</p>
          <p>{translateTo('You found your dream house? You can already start an offer!', lang)}</p>
        </div>

        <div style={{ display: step === 5 ? 'block' : 'none' }}>
          <img className="mb-5 w-perc-100" src={learMoreImg5} alt="Pre Image Published" />
          <h5 className="mb-2 fweight-600">{translateTo('Property card actions', lang)}</h5>
          <ul className="pl-3">
            <li>{translateTo('Easily see property location;', lang)}</li>
            <li className="my-1">{translateTo('Hide a property if you’re not interested;', lang)}</li>
            <li>{translateTo('Like properties to add them to your saved list. If you save a Pre-Market property, you get notified when it’ll be available on the market.', lang)}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
})

export default compose(
  connect(null, mapDispatchToProps),
)(LearnMoreListingsProperty);
