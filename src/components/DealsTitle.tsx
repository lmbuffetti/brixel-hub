import translateTo from '../utils/translation';
import React from 'react';
import type {DealsTitleType} from '../@types/components/DealsTitle';

const DealsTitle = (props: DealsTitleType) => {
  const {
    className = '',
    lang,
    title = '',
    total = 0,
  } = props;

  return (
    <div className={`title dis-fl-row a-c jc-b pl-2 py-2 ${className}`}>
      <span className="fweight-500 fsize-500 txtDark700 mr-1 tt-c">{translateTo(title, lang)}</span>
      <span className="fweight-300 fsize-200 txtLight500"><span>{translateTo('Total', lang)}</span>&nbsp;<span className="notranslate">{total}</span></span>
    </div>
  );
};

export default DealsTitle;
