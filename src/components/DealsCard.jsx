import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import {
  BrixelButtonIcon, BrixelAvatar, BrixelStatus,
} from '@brixel/brixel-components';

const DealsCard = (props) => {
  const {
    className,
    name,
    parentOnClick,
    archOnClick,
    date,
    offer,
    profileId,
    archived,
    isWinner,
    isNew,
    lastAction,
    hasMessage,
  } = props;

  const returnMessage = () => {
    if (Object.keys(lastAction).length > 0) {
      if (lastAction.actionStub === 'user-add-favorite') return 'Marked page as favorite';
      if (lastAction.actionStub === 'user-schedule') return 'Requested showing';
      if (lastAction.actionStub === 'user-get-document') return 'Requested documents';
      if (lastAction.actionStub === 'user-phone-call') return 'Made a phone call';
      if (lastAction.actionStub === 'user-portal-create-message') return `<span><span>Sent new message on</span> <span>${lastAction.meta.portal}</span></span>`;
      if (lastAction.actionStub === 'user-send-message') {
        return `"${lastAction.meta.message}"`;
      }
    } else if (hasMessage === 'phone-call') {
      return 'Made a phone call.'; // TODO
    } else if (offer === '') return 'Made an offer';
    return '';
  };

  return (
    <>
      <div
        className={`dealsCard ${archived ? '' : 'cur-as'} dis-f p-2 mb-3 shadow-1dp brdRadius h-fix-120 ${className}`}
        onClick={() => parentOnClick()}
      >
        <div className="leftPanel pr-2">
          <BrixelAvatar
            baseURL={get(getConfigEnv, 'shortPath', '')}
            name={name}
            profileId={profileId}
            className="notranslate"
          />
        </div>
        <div className="rightPanel dis-fl-col jc-b">
          <div className="topPart">
            <span className={`name dis-b notranslate fweight-500 ${name === 'No name' ? 'txtDark100' : 'txtDark700'}`}> {name} </span>
            <span
              className="metaMessage fsize-300 txtDark700 dis-b"
              dangerouslySetInnerHTML={{
                __html: returnMessage(),
              }}
            />
          </div>
          <div className="dis-f a-c">
            {
              isNew ? (
                <div className="dis-fl-row a-c notranslate">
                  <BrixelStatus
                    className="mr-1 zIndex0"
                    color="primary"
                  />
                  <span className="date fsize-200 fweight-600 txtDark700 notranslate">
                    {date}
                  </span>
                </div>
              ) : (
                <span className="date fsize-100 txtDark200 notranslate">
                  {date}
                </span>
              )
            }
            {
              isWinner && (
                <span className="cardTag green ml-1"> Winner </span>
              )
            }
          </div>
        </div>
      </div>
      <BrixelButtonIcon
        theme="dark"
        ghost
        small
        icon="archive"
        className="archiveBtn zIndex1 pos-a bt x-r mr-1 mb-1"
        onClick={(e) => {
          e.preventDefault();
          archOnClick();
        }}
        label={archived ? 'Unarchive' : 'Archive'}
      />
    </>
  );
};

DealsCard.propTypes = {
  archOnClick: PropTypes.func,
  archived: PropTypes.bool,
  className: PropTypes.string,
  date: PropTypes.string,
  hasMessage: PropTypes.string,
  isNew: PropTypes.bool,
  isWinner: PropTypes.bool,
  lastAction: PropTypes.object,
  name: PropTypes.string,
  offer: PropTypes.string,
  parentOnClick: PropTypes.func,
  profileId: PropTypes.string,
};

DealsCard.defaultProps = {
  archOnClick: () => '',
  archived: false,
  className: '',
  date: '',
  hasMessage: '',
  isNew: false,
  isWinner: false,
  lastAction: {},
  name: '',
  offer: null,
  parentOnClick: () => '',
  profileId: '',
};

export default DealsCard;
