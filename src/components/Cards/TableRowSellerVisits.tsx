import React, {useState, useEffect} from 'react';
import {
  BrixelAvatar,
  BrixelButtonText,
  Helpers,
} from '@brixel-io/brixel-components';
import {useLocation, useNavigate} from 'react-router-dom';
import get from 'lodash/get';
import {DateTime} from 'luxon';
import api from '../../controllers/api/config';
import translateTo from '../../utils/translation';
import type {TableRowSellerVisitsType} from '../../@types/components/Cards/TableRowSellerVisits';
import {UserType} from '@brixel-io/brixel-components/dist/@types/Models/User';
import BrixelSingleTag from '@brixel-io/brixel-components/dist/components/BrixelSingleTag';

const TableRowSellerVisits = (props: TableRowSellerVisitsType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleProperty,
    lang,
    visit,
  } = props;
  // STATE
  const [user, setUser] = useState<UserType>();
  const [visitStatus, setVisitStatus] = useState<{status: string; text: string; color: string;}>(Helpers.visitDateStatus(visit));

  useEffect(() => {
    if (visit.user) {
      api.user.getUserProfile(visit.user)
        .then((res) => {
          setUser(res.data);
          setVisitStatus(Helpers.visitDateStatus(visit));
        });
    }
  }, [visit.user]);

  const classWidthTable = (id) => {
    if (id === 0) return 'w-perc-100 w-perc-md-30';
    if (id === 1) return 'w-perc-100 w-perc-md-25 mt-1 mt-md-0';
    // if (id === 2) return 'w-perc-40 w-perc-md-20';
    if (id === 3) return 'w-perc-50 w-perc-md-15 mt-1 mt-md-0';
    return 'w-perc-50 w-perc-md-20 mt-1 mt-md-0';
  };

  if (!user) {
    return (
      <div
        className="dis-f jc-b a-c w-perc-100 brdSmallTop my-2 pt-2 brdText50 px-2 flex-wrap"
      >
        <h4 className="skeletonh4" />
      </div>
    )

  }

  return (
    <div
      className="dis-f jc-b a-c w-perc-100 brdSmallTop my-2 pt-2 brdText50 px-2 flex-wrap"
    >
      <div
        className={`dis-f a-c ${classWidthTable(0)} order-1 cur-poi`}
        onClick={() => history.push(`/${activeSingleProperty.id}/prospect/${visit.deal}`)}
      >
        <BrixelAvatar
          avatarImg={get(user, 'avatarUrl', undefined)}
          name={get(user, 'name', '') ? get(user, 'name', '') : 'No Name'}
          size="M"
        />
        <p className="ml-2">
          {get(user, 'name', '')}
        </p>
      </div>
      <p
        className={`${classWidthTable(1)} order-3 order-md-2 cur-poi txtText700 fsize-300`}
        onClick={() => history.push(`/${activeSingleProperty.id}/prospect/${visit.deal}`)}
      >
        {
          visit.visit.date ? (
            <span
              className={`${visitStatus.color} ${visitStatus.status === 'cancelled' ? 'td-lt' : ''}`}
            >
              {DateTime.fromMillis(visit.visit.date, { locale: lang }).toFormat('d LLL yyyy, H:mm')}
            </span>
          ) : (
            <span>{translateTo('Awaiting confirmation', lang)}</span>
          )
        }
      </p>
      <p className={`${classWidthTable(2)} ta-r ta-l-md order-3 order-md-4`}>
        <BrixelSingleTag
          lang={lang}
          message={{
            lang: lang,
            [visitStatus.status]: translateTo(visitStatus.text, lang),
          }}
          status={visitStatus.status}
          text={translateTo(visitStatus.text, lang)}
        />
      </p>
      <p className={`${classWidthTable(4)} ta-r ta-l-md order-5`}>
        <BrixelButtonText
          className='ml-a'
          label={translateTo('View details', lang)}
          onClick={() => history.push(`/${activeSingleProperty.id}/prospect/${visit.deal}`)}
        />
      </p>
    </div>
  )
}

export default TableRowSellerVisits;
