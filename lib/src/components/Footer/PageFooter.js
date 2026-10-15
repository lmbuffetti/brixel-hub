import get from 'lodash/get';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CompaniesData } from '../../resources/Companies/Companies';
import translateTo from '../../utils/translation';
function PageFooter(props) {
    // PROPS
    const { activeSideBar = false, activeSingleCompany, className = '', lang, translations, } = props;
    // STATE
    const [activeCompanyData, setActiveCompanyData] = useState({});
    useEffect(() => {
        if (CompaniesData[activeSingleCompany.stub])
            setActiveCompanyData(CompaniesData[activeSingleCompany.stub].footer);
        else
            setActiveCompanyData(CompaniesData.default.footer);
    }, [activeSingleCompany.id, translations]);
    return (React.createElement(React.Fragment, null,
        React.createElement("footer", { className: `footerWrap w-perc-100 ${className} ${activeSideBar ? 'leftPadding' : ''}` },
            React.createElement("div", { className: "dis-f flex-wrap jc-b p-1 p-sm-2 px-sm-3 brdSmallTop brdText50" },
                activeSingleCompany.stub === 'brixel_boutique' ? (React.createElement("div", null,
                    React.createElement("span", { className: "fsize-300 txtText400" }, translateTo('Boutique is part of', lang)),
                    React.createElement("a", { href: "https://brixel.ch", className: "fsize-300 txtText400 link ml-small-4 td-u lh-in", target: "_blank", rel: "noreferrer" }, "Brixel"))) : (React.createElement(React.Fragment, null, get(activeCompanyData, 'logos', []).length > 0 && (React.createElement("div", { className: "dis-f a-c jc-c jc-fs-sm flex-wrap" },
                    activeSingleCompany.stub === 'baloise' && React.createElement("span", { className: "mr-2 fsize-300 txtText400" }, translateTo('Powered by', lang)),
                    activeSingleCompany.stub === 'ubs' && React.createElement("span", { className: "mr-2 fsize-300 txtText400" }, translateTo('Your partner for financial questions', lang)),
                    React.createElement("div", { className: "h-fix-20 min-h-fix-16 h-fix-lg-24 dis-f" }, get(activeCompanyData, 'logos', []).map((logo, i) => (React.createElement("img", { loading: "lazy", key: `logo${i.toString()}`, src: logo, alt: `${get(activeSingleCompany, 'name', '')} logo ${i}`, className: `min-h-fix-16 ${i > 0 ? 'ml-2 brdSmallLeft brdText200 pl-2' : ''} h-perc-100` })))))))),
                React.createElement("div", { className: "dis-f jc-fe flex-wrap" },
                    get(activeSingleCompany, 'links.privacy', null) && (React.createElement("a", { href: get(activeSingleCompany, 'links.privacy', ''), className: "fsize-300 txtText400 link", target: "_blank", rel: "noreferrer" }, translateTo('Privacy Policy', lang))),
                    get(activeSingleCompany, 'links.privacy', null) && (React.createElement("a", { href: get(activeSingleCompany, 'links.terms', ''), className: "ml-2 fsize-300 txtText400 link", target: "_blank", rel: "noreferrer" }, translateTo('Terms and Conditions', lang))),
                    React.createElement("div", { className: "ta-r ml-1" },
                        React.createElement("span", { className: "fsize-300 txtText400" },
                            "@Brixel ",
                            new Date().getFullYear())))))));
}
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    lang: get(state, 'common.language', {}),
    translations: get(state, 'translations', {}),
});
export default connect(mapStateToProps, null)(PageFooter);
