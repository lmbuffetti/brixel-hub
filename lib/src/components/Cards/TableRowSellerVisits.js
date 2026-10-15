import React, { useState, useEffect } from 'react';
import { BrixelAvatar, BrixelButtonText, Helpers, } from '@brixel-io/brixel-components';
import { useLocation, useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import { DateTime } from 'luxon';
import api from '../../controllers/api/config';
import translateTo from '../../utils/translation';
import BrixelSingleTag from '@brixel-io/brixel-components/dist/components/BrixelSingleTag';
const TableRowSellerVisits = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const { activeSingleProperty, lang, visit, } = props;
    // STATE
    const [user, setUser] = useState();
    const [visitStatus, setVisitStatus] = useState(Helpers.getDataByStatus(visit));
    useEffect(() => {
        if (visit.user) {
            api.user.getUserProfile(visit.user)
                .then((res) => {
                setUser(res.data);
                setVisitStatus(Helpers.getDataByStatus(visit));
            });
        }
    }, [visit.user]);
    const classWidthTable = (id) => {
        if (id === 0)
            return 'w-perc-100 w-perc-md-30';
        if (id === 1)
            return 'w-perc-100 w-perc-md-25 mt-1 mt-md-0';
        // if (id === 2) return 'w-perc-40 w-perc-md-20';
        if (id === 3)
            return 'w-perc-50 w-perc-md-15 mt-1 mt-md-0';
        return 'w-perc-50 w-perc-md-20 mt-1 mt-md-0';
    };
    if (!user) {
        return (React.createElement("div", { className: "dis-f jc-b a-c w-perc-100 brdSmallTop my-2 pt-2 brdText50 px-2 flex-wrap" },
            React.createElement("h4", { className: "skeletonh4" })));
    }
    return (React.createElement("div", { className: "dis-f jc-b a-c w-perc-100 brdSmallTop my-2 pt-2 brdText50 px-2 flex-wrap" },
        React.createElement("div", { className: `dis-f a-c ${classWidthTable(0)} order-1 cur-poi`, onClick: () => history.push(`/${activeSingleProperty.id}/prospect/${visit.deal}`) },
            React.createElement(BrixelAvatar, { avatarImg: get(user, 'avatarUrl', undefined), name: get(user, 'name', '') ? get(user, 'name', '') : 'No Name', size: "M", profileId: get(user, 'id', '') }),
            React.createElement("p", { className: "ml-2" }, get(user, 'name', ''))),
        React.createElement("p", { className: `${classWidthTable(1)} order-3 order-md-2 cur-poi txtText700 fsize-300`, onClick: () => history.push(`/${activeSingleProperty.id}/prospect/${visit.deal}`) }, visit?.visit?.date ? (React.createElement("span", { className: `${visitStatus.color} ${visitStatus.status === 'cancelled' ? 'td-lt' : ''}` }, DateTime.fromMillis(visit?.visit?.date, { locale: lang }).toFormat('d LLL yyyy, H:mm'))) : (React.createElement("span", null, translateTo('Awaiting confirmation', lang)))),
        React.createElement("p", { className: `${classWidthTable(2)} ta-r ta-l-md order-3 order-md-4` },
            React.createElement(BrixelSingleTag, { lang: lang, message: {
                    lang: lang,
                    [visitStatus.status]: translateTo(visitStatus.text, lang),
                }, status: visitStatus.status, text: translateTo(visitStatus.text, lang) })),
        React.createElement("p", { className: `${classWidthTable(4)} ta-r ta-l-md order-5` },
            React.createElement(BrixelButtonText, { className: 'ml-a', label: translateTo('View details', lang), onClick: () => history.push(`/${activeSingleProperty.id}/prospect/${visit.deal}`) }))));
};
export default TableRowSellerVisits;
