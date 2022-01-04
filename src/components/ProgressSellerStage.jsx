import React from 'react';
import PropTypes from 'prop-types';
import {
  BrixelIcon, FactsOptions,
} from '@brixel/brixel-components';

const { factsOptions } = FactsOptions;

const ProgressSellerStage = (props) => {
  const {
    stepIndexProgress,
  } = props;

  const convertLabel = (progress) => {
    switch (progress.value) {
      case 'sales-lead':
        return 'Onboarding';
      case 'advertising':
        return 'Marketing';
      default:
        return progress.label;
    }
  };

  return (
    <div className="progress-stage dis-f jc-b pos-r">
      {
        factsOptions.progressBarOptions.map((progress, i) => (
          <div className={`step-item ${stepIndexProgress === i ? 'active' : ''} ${stepIndexProgress > i ? 'done' : ''}`} key={i.toString()}>
            <div className="wrap-step">
              <div className="circle">
                {
                  stepIndexProgress > i ? (
                    <BrixelIcon
                      iconWidth="w-fix-flex-32 pos-r zIndex2"
                      icon="check-small-fill"
                      color="altGreen"
                      saturationTxt={300}
                    />
                  ) : (
                    <span>{i + 1}</span>
                  )
                }
              </div>
              <span>{convertLabel(progress)}</span>
            </div>
          </div>
        ))
      }
    </div>
  );
};

ProgressSellerStage.propTypes = {
  stepIndexProgress: PropTypes.number.isRequired,
};

export default ProgressSellerStage;
