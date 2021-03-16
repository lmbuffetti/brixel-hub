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
    avatarImg,
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
          <div className="dis-f a-c notranslate">
            {
              isNew ? (
                <div className="dis-fl-row a-c">
                  <BrixelStatus
                    className="mr-1 zIndex0"
                    color="primary"
                  />
                  <span className="date fsize-200 fweight-600 txtDark700">
                    {date}
                  </span>
                </div>
              ) : (
                <span className="date fsize-100 txtDark200">
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
  className: PropTypes.string,
  name: PropTypes.string,
  parentOnClick: PropTypes.func,
  archOnClick: PropTypes.func,
  date: PropTypes.string,
  avatarImg: PropTypes.string,
  profileId: PropTypes.string,
  hasMessage: PropTypes.string,
  offer: PropTypes.string,
  archived: PropTypes.bool,
  isWinner: PropTypes.bool,
  isNew: PropTypes.bool,
  lastAction: PropTypes.object,
};

DealsCard.defaultProps = {
  className: '',
  name: '',
  parentOnClick: () => '',
  archOnClick: () => '',
  date: '',
  avatarImg: '',
  hasMessage: '',
  profileId: '',
  offer: null,
  archived: false,
  isWinner: false,
  isNew: false,
  lastAction: {},
};

export default DealsCard;
