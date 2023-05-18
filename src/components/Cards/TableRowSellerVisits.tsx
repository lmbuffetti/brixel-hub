import React, {useState, useEffect} from 'react';
import {
  BrixelAvatar,
  BrixelButtonText,
} from '@brixel/brixel-components';
import {useLocation, useNavigate} from 'react-router-dom';
import get from 'lodash/get';
import {DateTime} from 'luxon';
import api from '../../controllers/api/config';
import translateTo from '../../utils/translation';
import type {TableRowSellerVisitsType} from '../../@types/components/Cards/TableRowSellerVisits';
import {UserType} from '@brixel/brixel-components/dist/@types/Models/User';
import BrixelSingleTag from '@brixel/brixel-components/dist/components/BrixelSingleTag';

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

  useEffect(() => {
    if (visit.user) {
      api.user.getUserProfile(visit.user)
        .then((res) => {
          setUser(res.data);
        });
    }
  }, [visit.user]);

  const statusVisit = () => {
    let status = 'pending';
    if (visit.buyerStatus === 'accepted' && visit.sellerStatus === 'accepted') {
      if (visit.visit.date < +new Date().setHours(0, 0, 0, 0)) {status = 'visited';}
      else status = 'accepted';
    }
    if (visit.buyerStatus === 'rejected' || visit.sellerStatus === 'rejected') {
      status = 'rejected';
    }
    switch (status) {
      case 'accepted':
        return {
          text: 'Confirmed',
          txtColor: 'txtGreen400',
          bg: 'bgGreen100',
          status: 'accepted',
        }
      case 'pending':
        return {
          text: 'Pending',
          txtColor: 'txtYellow400',
          bg: 'bgGreen100',
          status: 'pending',
        }
      case 'rejected':
        return {
          text: 'Cancelled',
          txtColor: 'txtRed400',
          bg: 'bgRed100',
          status: 'rejected',
        }
      case 'visited':
        return {
          text: 'Visited',
          txtColor: 'txtBlue400',
          bg: 'bgBlue100',
          status: 'visited',
        }
      default:
        return {
          text: '',
          txtColor: 'txtText400',
          bg: '',
          status: '',
        }
    }
  }

  const classWidthTable = (id) => {
    if (id === 0) return 'w-perc-60 w-perc-md-30';
    if (id === 1) return 'w-perc-40 w-perc-md-25 mt-1 mt-md-0';
    // if (id === 2) return 'w-perc-40 w-perc-md-20';
    if (id === 3) return 'w-perc-20 w-perc-md-15 mt-1 mt-md-0';
    return 'w-perc-40 w-perc-md-20 mt-1 mt-md-0';
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
        className={`${classWidthTable(1)} order-3 order-md-2 cur-poi`}
        onClick={() => history.push(`/${activeSingleProperty.id}/prospect/${visit.deal}`)}
      >
        {
          visit.visit.date ? (
            <span
              className={`${statusVisit().txtColor} ${visit.buyerStatus === 'rejected' ? 'td-lt' : ''}`}
            >
              {DateTime.fromMillis(visit.visit.date, { locale: lang }).toFormat('d LLL yyyy, H:mm')}
            </span>
          ) : (
            <span>Awaiting confirmation</span>
          )
        }
      </p>
      <p className={`${classWidthTable(2)} ta-r ta-l-md order-3 order-md-4`}>
        <BrixelSingleTag
          lang={lang}
          message={{
            lang: lang,
            [statusVisit().status]: statusVisit().text,
          }}
          status={statusVisit().status}
          text={statusVisit().text}
        />
      </p>
      <p className={`${classWidthTable(4)} ta-r ta-l-md order-5`}>
        <BrixelButtonText
          label={translateTo('View details', lang)}
          onClick={() => history.push(`/${activeSingleProperty.id}/prospect/${visit.deal}`)}
        />
      </p>
    </div>
  )
}

export default TableRowSellerVisits;
