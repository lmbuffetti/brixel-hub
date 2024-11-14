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
    <div className={`title dis-fl-row a-c py-2 ${className}`}>
      <span className="fweight-500 fsize-500 txtText900 mr-1 tt-c">{translateTo(title, lang)}</span>
      <span className="notranslate">({total})</span>
    </div>
  );
};

export default DealsTitle;
