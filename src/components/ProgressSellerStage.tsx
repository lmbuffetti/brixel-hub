import React from 'react';
import {BrixelIcon, FactsOptions} from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
import type {ProgressSellerStageType} from '../@types/components/ProgressSellerStage';

const { factsOptions } = FactsOptions;

const ProgressSellerStage = (props: ProgressSellerStageType) => {
  const {
    className = '',
    lang,
    smallLayout = false,
    stepIndexProgress,
    xSmallMobile = false,
  } = props;

  const convertLabel = (progress) => {
    switch (progress.value) {
      case 'sales-lead':
        return translateTo('Onboarding', lang);
      case 'advertising':
        return translateTo('Marketing', lang);
      default:
        return translateTo(progress.label, lang);
    }
  };

  return (
    <div className={`progress-stage dis-f a-c pos-r ${className}`}>
      {
        factsOptions.progressBarOptions.map((progress, i) => (
          <div
            className={`step-item ${stepIndexProgress === i ? 'active' : ''} ${xSmallMobile ? 'xsmall' : ''} ${stepIndexProgress > i ? 'done' : ''}`}
            key={`fctOpts_${i.toString()}`}
          >
            <div className={`wrap-step ${xSmallMobile ? 'xsmallStep' : ''} ${smallLayout ? 'smallStep' : ''}`}>
              <div className="circle">
                {
                  stepIndexProgress > i ? (
                    <BrixelIcon
                      iconWidth="w-fix-flex-24 pos-r zIndex2"
                      icon="check"
                      color="primary"
                    />
                  ) : (
                    <span className="stepNumber fsize-300">{i + 1}</span>
                  )
                }
              </div>
              {
                (!smallLayout || stepIndexProgress === i) && !xSmallMobile && (
                  <span className="fsize-300 stepLabel ff-mono">{convertLabel(progress)}</span>
                )
              }
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default ProgressSellerStage;
