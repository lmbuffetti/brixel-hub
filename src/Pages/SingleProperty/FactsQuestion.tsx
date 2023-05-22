import React, {useEffect} from 'react';
import {BrixelButtonIcon, Helpers} from '@brixel/brixel-components';
import {change, MultiFileldsReduxForm} from '@brixel/brixel-components/dist/form';
import {diff} from 'deep-object-diff';
import get from 'lodash/get';
import unset from 'lodash/unset';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {saveActiveSingleProperty} from '../../actions/PropertyActions';
import {InputSheets} from '../../resources/SingleProperty/inputSheets';
import {keyify} from '../../utils/helpers';
import translateTo from '../../utils/translation';
import type {FactsQuestionType} from '../../@types/Pages/SingleProperty/FactsQuestion';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';

const FactsQuestion = (props: FactsQuestionType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    changeFieldValue,
    formValue,
    initValues,
    lang,
    quest,
  } = props;
  // PARAMS URL
  const propID = get(match, 'propID', null);
  const dashWrapperEl = document.getElementsByClassName('hubDashboard')[0];

  useEffect(() => {
    if (dashWrapperEl) dashWrapperEl.classList.add('secondLevelActive');
    return () => {
      if (dashWrapperEl) dashWrapperEl.classList.add('secondLevelActive');
    };
  }, [dashWrapperEl]);

  useEffect(() => {
    const fieldsChanged = diff(initValues, formValue);
    const keyChanged = keyify(fieldsChanged);
    keyChanged.forEach((item) => {
      InputSheets('facts', lang, changeFieldValue).forEach((singleQuest ) => {
        if (singleQuest.inputs) {
          singleQuest.inputs.forEach((input) => {
            if (input.condition) {
              if (get(input, 'condition.name', null)) {
                if (get(input, 'condition.name', null) === item) {
                  if (input.name && get(input, 'condition.value', null) !== get(formValue, item, null)) {
                    unset(formValue, input.name);
                  }
                }
              } else {
                input.condition.forEach((condition) => {
                  if (condition.name === item) {
                    if (input.name && condition.value !== get(formValue, item, null)) {
                      unset(formValue, input.name);
                    }
                  }
                });
              }
            }
          });
        }
      });
    });
  }, [formValue,lang]);

  return (
    <div
      className="questContent"
    >
      <div className="dis-f a-c jc-b pos-r mb-3">
        {
          get(quest, 'title', null) && (
            <h5 dangerouslySetInnerHTML={{ __html: Helpers.sanitizeText(translateTo(get(quest, 'title', ''), lang))}} />
          )
        }
        <BrixelButtonIcon
          icon="close-small"
          bgTransparent
          onClick={() => history.push(`/${propID}/property/facts`)}
        />
      </div>

      <MultiFileldsReduxForm
        autofocus={false}
        classNameBox={quest?.classNameBox}
        className="singleInput"
        form="Property"
        hintMessage
        disableNextBtn={false}
        formValue={formValue}
        inputs={quest?.inputs}
        onClick={() => ''}
        baseByData={baseByData}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', {}),
  initValues: get(state, 'brixelForm.Property.initialValues', {}),
  errorValue: get(state, 'brixelForm.syncErrors', {}),
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(FactsQuestion);
