import get from 'lodash/get';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../controllers/api/graphql';
import { transformInternalLink } from '../../utils/helpers';
import ContentCard from './ContentCard';
const ArticlesBox = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const { activeSingleCompany, activeSingleProperty, lang, placementSlug, className, } = props;
    const [placement, setPlacement] = useState({});
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (activeSingleCompany.stub) {
            const data = {
                placementSlug,
                partner: activeSingleCompany.type !== 'partner' ? 'brixel' : activeSingleCompany.stub,
                language: lang,
                queryType: 'articles',
            };
            api.craftCMS.getHubContent(data)
                .then((res) => {
                setPlacement(get(res, 'data.placementEntries[0]', []));
                setArticles(get(res, 'data.placementEntries[0].placementContent', []));
                setIsLoading(false);
            })
                .catch(() => {
                setIsLoading(false);
            });
        }
    }, [activeSingleCompany, lang]);
    const onClickBanner = (url, target) => {
        if (!url.includes('PAGE_ID')) {
            window.open(url, target);
        }
        else {
            const internalLink = transformInternalLink(url, { activeSingleProperty });
            history.push(internalLink);
        }
    };
    const skeltons = document.querySelectorAll('.skeltonWrap');
    useEffect(() => {
        if (skeltons) {
            setTimeout(() => {
                // skeltonWrap.classList.add('hide');
                skeltons.forEach(function (o) {
                    o.classList.add('hide');
                });
            }, 2000);
        }
    }, [skeltons]);
    if ((get(activeSingleCompany, 'stub', '') !== 'ubs' && get(activeSingleCompany, 'stub', '') !== 'baloise'))
        return React.createElement(React.Fragment, null);
    return (React.createElement("div", { className: className },
        articles.length > 0 ? (React.createElement("div", { className: `dis-f flex-wrap jc-b mt-6 ${placement.mainTitle ? 'mb-3' : ''}` },
            React.createElement(React.Fragment, null,
                placement.mainTitle && (React.createElement("h5", { className: "fweight-600" }, placement.mainTitle)),
                React.createElement("div", { className: "dis-f a-c flex-wrap mt-1 mt-lg-0" },
                    placement.subtitle && (React.createElement("span", { className: "fsize-300 txtText400 mr-2" }, placement.subtitle)),
                    React.createElement("div", { className: "div" }, placement.logo && get(placement, 'logo[0]', null) && (React.createElement("img", { loading: "lazy", className: "h-fix-20 h-fix-lg-24", src: placement.logo[0].url, alt: placement.logo[0].alt }))))))) : (React.createElement("div", { className: 'dis-f w-perc-100 h-fix-24 jc-b mb-3 skeltonWrap mt-6' },
            React.createElement("div", { className: 'w-perc-40 h-fix-24 skeletonBg' }),
            React.createElement("div", { className: 'w-perc-20 h-fix-24 skeletonBg' }))),
        React.createElement("div", { className: "row-cols-sm-3-gut-4 mb-3" }, isLoading ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "skeltonWrap" },
                React.createElement("div", { className: "h-fix-144 skeletonBg" }),
                React.createElement("div", { className: "h-fix-16 mt-2 skeletonBg" }),
                React.createElement("div", { className: "h-fix-16 mt-2 skeletonBg" }),
                React.createElement("div", { className: "h-fix-16 w-perc-50 mt-2 skeletonBg" })),
            React.createElement("div", { className: 'skeltonWrap' },
                React.createElement("div", { className: "h-fix-144 skeletonBg" }),
                React.createElement("div", { className: "h-fix-16 mt-2 skeletonBg" }),
                React.createElement("div", { className: "h-fix-16 mt-2 skeletonBg" }),
                React.createElement("div", { className: "h-fix-16 w-perc-50 mt-2 skeletonBg" })),
            React.createElement("div", { className: 'skeltonWrap' },
                React.createElement("div", { className: "h-fix-144 skeletonBg" }),
                React.createElement("div", { className: "h-fix-16 mt-2 skeletonBg" }),
                React.createElement("div", { className: "h-fix-16 mt-2 skeletonBg" }),
                React.createElement("div", { className: "h-fix-16 w-perc-50 mt-2 skeletonBg" })))) : (React.createElement(React.Fragment, null, articles.map((card) => (React.createElement(ContentCard, { key: get(card, 'id', ''), image: get(card, 'mainImage[0]', undefined), title: get(card, 'cardTitle', ''), previewCopy: get(card, 'previewCopy', ''), hrefUrl: get(card, 'cardLink.url', ''), hrefTitle: get(card, 'cardLink.text', ''), hrefTarget: get(card, 'cardLink.target', ''), hrefOnClick: (url, target) => onClickBanner(url, target) }))))))));
};
export default ArticlesBox;
