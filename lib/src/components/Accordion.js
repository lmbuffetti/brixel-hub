import React, { lazy, Suspense, useEffect, useState } from 'react';
const BrixelIcon = lazy(() => import('@brixel-io/brixel-components/dist/components/BrixelIcon'));
const Accordion = (props) => {
    const { children = '', className = '', color = 'green', contentClass = '', isExpanded = false, onExpand, paddingContent = 'pl-4', saturationTxt = 200, singleItem = false, smallRightIcon = false, title = '', titleClass = '', } = props;
    const [open, setOpen] = useState(isExpanded);
    useEffect(() => {
        setOpen(isExpanded);
    }, [isExpanded]);
    const onClickExpand = (val) => {
        if (onExpand) {
            onExpand(val);
        }
        else {
            setOpen(val);
        }
    };
    return (React.createElement(Suspense, null,
        React.createElement("div", { className: `accordion ${className} ${open ? 'open' : 'close'}` },
            React.createElement("button", { type: "button", className: `title ${singleItem ? 'cur-def' : 'cur-poi'} ${titleClass} dis-f a-t`, onClick: () => {
                    if (!singleItem)
                        onClickExpand(!open);
                } },
                !smallRightIcon && !singleItem && (React.createElement(BrixelIcon, { color: "green", saturationTxt: 200, iconWidth: "w-fix-24", className: "mt-small-4 mr-small-8", icon: !open ? 'arrow-right' : 'arrow-down' })),
                React.createElement("span", { className: "txtText900" }, title),
                smallRightIcon && !singleItem && (React.createElement(BrixelIcon, { color: color, saturationTxt: saturationTxt, iconWidth: "w-fix-24", className: "mt-small-4 mr-small-8", icon: !open ? 'arrow-simple-right' : 'arrow-simple-down' }))),
            React.createElement("div", { className: `content ${paddingContent} ${!open ? 'collapsed' : ''}` },
                React.createElement("div", { className: contentClass }, children)))));
};
export default Accordion;
