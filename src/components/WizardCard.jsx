import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonPrimary,
} from '@brixel/brixel-components';
import { setWizard } from '../actions/CommonActions';
import WizardText from '../resources/Wizard';
import { setCookie } from '../utils/helpers';

const WizardCard = (props) => {
  const {
    handleSetWizard,
    wizard,
  } = props;

  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [text, setText] = useState({});
  const [el, setEl] = useState(null);
  const currentWizard = WizardText[wizard.type];

  useEffect(() => {
    if (wizard.step > 0) {
      const getElement = document.getElementById(`wizard-${wizard.type}-${wizard.step}`);
      if (getElement) {
        const parent = document.getElementById(`wizard-${wizard.type}-parent`).getBoundingClientRect();
        setPosX(getElement.getBoundingClientRect().left - parent.left);
        setPosY(getElement.getBoundingClientRect().top - parent.top);
        setText(currentWizard[`step${wizard.step}`]);
      }

      const copyEl = document.getElementsByClassName(`wizardCopy-${wizard.type}-${wizard.step}`);
      if (copyEl && copyEl[0]) {
        const parent = document.getElementById(`wizard-${wizard.type}-parent`).getBoundingClientRect();
        setEl({
          component: copyEl[0].outerHTML,
          posX: copyEl[0].getBoundingClientRect().left - parent.left,
          posY: copyEl[0].getBoundingClientRect().top - parent.top,
          width: copyEl[0].clientWidth,
          height: copyEl[0].clientHeight,
        });
      } else {
        setEl(null);
      }
    }
  }, [wizard.step]);

  const onClickNext = () => {
    if (Object.keys(currentWizard).length === wizard.step) {
      handleSetWizard({});
    } else {
      handleSetWizard({ ...wizard, step: wizard.step + 1 });
      if (wizard.type === 'preMarketOverlay') setCookie('wizardPreMarket', true);
    }
  };

  return (
    <div id="wizard">
      <div
        className={`${text.className} brdRadius p-3 ${text.position} hintMessage`}
        style={{
          left: posX,
          top: posY,
        }}
      >
        <small className="mb-1 dis-b fsize-300 txtDark400"><span>Step</span> <span>{wizard.step}</span> <span>of</span> <span>{Object.keys(currentWizard).length}</span></small>
        <h5 className="mb-1 fweight-600">{text.title}</h5>
        <p className="fsize-300 txtDark700">{text.description}</p>
        <BrixelButtonPrimary
          className="mt-3"
          rounded
          onClick={() => onClickNext()}
          label="Got it"
        />
      </div>
      {
        el && (
          <div
            className={`copyElement ${wizard.step === 3 ? 'bottomBar' : ''}`}
            style={{
              left: el.posX,
              top: el.posY,
              width: el.width,
              height: el.height,
            }}
            dangerouslySetInnerHTML={{ __html: el.component }}
          />
        )
      }
    </div>
  );
};

WizardCard.propTypes = {
  handleSetWizard: PropTypes.func.isRequired,
  wizard: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wizard: get(state, 'common.wizard', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetWizard: bindActionCreators(setWizard, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(WizardCard);
