import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { BrixelIcon} from '@brixel-io/brixel-components';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {DateTime} from 'luxon';
import translateTo from '../../utils/translation';
import TimelineStubs from '../../resources/Utilities/timelineActionStubs';
import { getHistoryListings } from '../../actions/HistoryActions';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';

const TermsAcceptance = (props) => {
  const history = {
    push: useNavigate(),
  };

  // PROPS
  const {
    handleGetHistoryTerms,
    activeSinglePropertyHistory,
    lang,
  } = props;

  const match = useParams();
  // STATE

  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (propID) {
      const payloadPageHistory = {
        actionStubs: TimelineStubs.TermsAcceptance,
        parent: propID,
        resultsPerPage: 10,
        offset: 0,
        order: 'createdAt',
        direction: 'DESC',
        smallLoader: 'getPageHistory',
        type: 'page',
      };
      handleGetHistoryTerms(payloadPageHistory);
    }
  }, [propID]);

  if (activeSinglePropertyHistory.total > 0) {
    return (
      <>
        <div className="bgWhite p-4 mt-3 brdRadius">
          <div className="dis-f jc-b a-c mb-2">
            <h5>{translateTo('Terms Acceptance', lang)}</h5>
            <div className="px-1 dis-f py-small-2 bgGreen50 txtGreen brdRadius">
              <BrixelIcon
                color="primary"
                iconWidth="w-fix-12"
                icon="check-small"
                className='mr-1'
                iconSize='small'
              />
              <span className='fsize-300 fweight-500'>{translateTo('Accepted', lang)}</span>
            </div>
          </div>
          <p>
            <span>{translateTo('Terms accepted on', lang)}</span> <span className="fweight-600">{DateTime.fromMillis(get(activeSinglePropertyHistory.data[0], 'meta.acceptanceDate', 0), { locale: lang }).toFormat('dd LLL yyyy, H:mm')}</span>
          </p>

          <hr className="mt-3 lighter" />

          <BrixelButtonPrimary
            rounded
            label={translateTo('View terms', lang)}
            rightIcon="arrow-right"
            className="mt-3 mr-0 ml-a"
            onClick={() => history.push(`/${propID}/termsConditionPage`)}
          />

        </div>

      </>
    );
  } else return null
};

TermsAcceptance.propTypes = {
  activeSinglePropertyHistory: PropTypes.object.isRequired,
  handleGetHistoryTerms: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const activeSingleProperty = get(state, 'property.activeSingleProperty', {});
  return ({
    activeSingleProperty,
    lang: get(state, 'common.language', 'en'),
    activeSinglePropertyHistory: get(state, 'history.activeSinglePropertyHistory', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  handleGetHistoryTerms: bindActionCreators(getHistoryListings, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(TermsAcceptance);
