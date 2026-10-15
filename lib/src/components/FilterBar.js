/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import { compose } from 'redux';
import queryString from 'query-string';
import { BrixelButtonText, BrixelIcon, FactsOptions, useOutsideAlerter } from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
const { factsOptions, } = FactsOptions;
const FilterBar = (props) => {
    const { activeCompany = '', activeSortDirection, activeSortOrderType, applyFilter, className, dealsFilter = false, filterDeals, filterModalData = '', lang, } = props;
    const [filterMenu, setFilterMenu] = useState(false);
    const [activeData, setActiveData] = useState(queryString.parse(filterModalData));
    const propertyFilterRef = useRef(null);
    // filter by progress and status
    const processFilter = (text, type, direction, company, filterModal = activeData) => {
        let filterData = filterModal || '';
        if (filterModal && !dealsFilter) {
            filterData = '';
            Object.keys(filterModal).forEach((key, i) => {
                if (key !== '' && key !== null && key) {
                    if (i > 0) {
                        filterData += `&${key}=${filterModal[key].toString()}`;
                    }
                    else {
                        filterData += `${key}=${filterModal[key].toString()}`;
                    }
                }
            });
        }
        if (filterModal && dealsFilter) {
            if (filterData.status === 'all')
                applyFilter(text, type, direction, company, '');
            else
                applyFilter(text, type, direction, company, filterData.status);
        }
        applyFilter(text, type, direction, company, filterData);
    };
    useEffect(() => {
        if (dealsFilter === true) {
            const status = get(filterDeals, 'status', 'all');
            const index = findIndex(factsOptions.dealsStatusHub, (el) => el.value === status);
            setActiveData({
                label: get(factsOptions, `dealsStatusHub[${index}].label`, ''),
                status: get(factsOptions, `dealsStatusHub[${index}].value`, ''),
            });
        }
    }, [dealsFilter]);
    const getLabel = () => {
        const status = get(filterDeals, 'status', 'all');
        const index = findIndex(factsOptions.dealsStatusHub, (el) => el.value === status);
        // setActiveData({
        //   label: factsOptions.dealsStatusHub[index].label,
        //   status: factsOptions.dealsStatusHub[index].value,
        // });
        return get(factsOptions, `dealsStatusHub[${index}].label`, 'All Deals');
    };
    // FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT
    useOutsideAlerter(propertyFilterRef, {
        action: 'function',
        func: () => {
            if (filterMenu)
                setFilterMenu(false);
        },
    });
    return (React.createElement("nav", { className: `filter-bar ${className}` },
        React.createElement("div", { className: "type-filter dis-f a-c w-perc-100 jc-c jc-fe-md}" }, dealsFilter && (React.createElement("div", { className: "deals-filter pos-r as-fe dis-f", ref: propertyFilterRef },
            React.createElement(BrixelButtonText, { className: "ml-2", theme: "black", rounded: true, label: translateTo(`${getLabel()}`, lang), leftIcon: "filter", onClick: () => setFilterMenu(!filterMenu) }),
            filterMenu && (React.createElement("div", { className: "filterHolder w-fix-240 brdRadius bgWhite pos-a x-r zIndex3 shadow-3dp pb-2" },
                React.createElement("div", { className: "p-2" },
                    React.createElement("div", { className: "body2 fweight-500 txtText900" }, translateTo('Filter', lang)),
                    React.createElement(BrixelIcon, { className: "pos-a x-r cur-poi mt-2 mr-2 fsize-400", icon: "close", color: "text", onClick: () => setFilterMenu(!filterMenu) })),
                get(factsOptions, 'dealsStatusHub', []).map((item, i) => (React.createElement("div", { className: "statusList dis-fl-col", key: `fctOpt_${i.toString()}` },
                    React.createElement("div", { className: "statusItem p-1 cur-poi dis-fl-row", onClick: () => {
                            setFilterMenu(!filterMenu);
                            setActiveData({
                                label: translateTo(item.label, lang),
                                status: item.value,
                            });
                            processFilter('', activeSortOrderType, activeSortDirection, activeCompany, {
                                label: translateTo(item.label, lang),
                                status: item.value,
                            });
                        } },
                        (item.value === activeData.status) && (React.createElement(BrixelIcon, { className: "statusIcon txtText900", icon: "check" })),
                        React.createElement("span", { className: "statusLabel txtText900" }, translateTo(item.label, lang)))))))))))));
};
const mapStateToProps = (state) => ({
    isSmallLoading: get(state, 'common.isSmallLoading', ''),
    isSuperAdmin: get(state, 'common.superAdmin', false),
});
export default compose(connect(mapStateToProps, null))(FilterBar);
