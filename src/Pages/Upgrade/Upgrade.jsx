/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { UpgradeQuestions } from '../../resources/SingleProperty/Upgrade';
import { getActiveSingleCompanyPackages } from '../../actions/CompanyActions';

const Upgrade = (props) => {

  // PROPS
  const {
    activeSingleCompany,
    handleGetActiveSingleCompanyPackages,
  } = props;
  // STATE

  const [quest] = useState(UpgradeQuestions()[0]);

  // REF
  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);


  useEffect(() => {
    if (activeSingleCompany.id) {
      handleGetActiveSingleCompanyPackages({id: activeSingleCompany.id, smallLoader: 'getPackages'})
    }
  }, [activeSingleCompany.id]);


  return (
    <div id="bodyModalWrapper" className={`withHeader getStarted`}>

      <div
        className={`bodyModal dis-fl-col`}
      >
        <form
          id="multiStepForm"
          autoComplete="off"
          className={`interactive dis-fl-col jc-b`}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep zIndex1 jc-c`}>
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && !get(quest, 'cardType', null) && (
                    <div className={`dis-fl-col flex-wrap`}>
                      {
                        quest.title && (
                          <h2 className={`fweight-600 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                        )
                      }

                    </div>
                  )
                }
                {
                  get(quest, 'cardType', null) === 'loadComponent' && (
                    React.createElement(
                      quest.component,{
                        ...quest,
                      },
                    )
                  )
                }

              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

Upgrade.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  handleGetActiveSingleCompanyPackages: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', { }),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSingleCompanyPackages: bindActionCreators(getActiveSingleCompanyPackages, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Upgrade);
