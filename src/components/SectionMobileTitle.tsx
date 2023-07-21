import React from 'react';
import {BrixelIcon} from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
import type {SectionMobileTitleType} from '../@types/components/SectionMobileTitle';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';

const SectionMobileTitle = (props: SectionMobileTitleType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };

  const {
    activeSingleProperty,
    lang,
    title,
  } = props;

  const isBuyer = history.location.pathname.includes('buyer');

  const onClickGoBack = () => {
    if (isBuyer) {
      history.push(`/buyer/${activeSingleProperty.id}/home`);
    } else {
      history.push(`/${activeSingleProperty.id}/home`);
    }
  }

  return (
    <div className="dis-fl-col backPanel hide-lg">
      <BrixelIcon
        className="ml-0 mr-a mt-2"
        icon="arrow-left"
        onClick={() => onClickGoBack()}
      />
      <h5 className="sectionTitle">{translateTo(title, lang)}</h5>
    </div>
  )
}

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  lang: get(state, 'common.language', 'en'),
});

export default connect(mapStateToProps, null)(SectionMobileTitle);
