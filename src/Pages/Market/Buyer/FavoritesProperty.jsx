import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../../actions/CommonActions';
import MarketCardFavorites from '../../../components/Cards/MarketCardFavorites';

const LearnMoreListingsProperty = (props) => {
  const {
    handleSetModal,
    lang,
    mapStateToProps,
    wishlistProperties,
  } = props;
  const [step, setStep] = useState(1);
  return (
    <div className="mt-6-neg ov-v">
      {
        get(wishlistProperties, 'data', []).map((item, index) => (
          <MarketCardFavorites
            key={`cardFavorites-${index.toString()}`}
            activeSingleProperty={item}
            lang={lang}
          />
        ))
      }
    </div>
  )
}

LearnMoreListingsProperty.propTypes = {
  handleSetModal: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  wishlistProperties: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  wishlistProperties: get(state, 'market.wishlistProperties', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(LearnMoreListingsProperty);
