import React from 'react';
import { BrixelIcon, BrixelAvatar, BrixelButtonContactIcon, Helpers } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import { connect } from 'react-redux';
const ContactPageCard = ({ avatarIcon, className, contactRole, contactDetails, contactPage, }) => {
    let contactPhone = contactPage?.phone;
    let contactEmail = contactPage?.email;
    if (contactDetails?.name)
        contactPhone = contactDetails?.phone;
    if (contactDetails?.name)
        contactEmail = contactDetails?.email;
    return (React.createElement("div", { className: `dis-f a-c jc-b bgWhite brdRadius brdSmall brdText100 p-2 w-perc-100 dis-f a-c jc-b ${className}` },
        React.createElement("div", { className: "dis-f a-c flex-1" },
            avatarIcon ? (React.createElement(BrixelIcon, { rounded: true, iconSize: 'w-fix-32 h-fix-32', icon: avatarIcon.icon, color: avatarIcon.color || 'green', background: avatarIcon.color || 'green', saturation: 50 })) : (React.createElement(BrixelAvatar, { size: 'XXS', avatarImg: contactDetails?.name ? contactDetails?.avatar?.avatarUrl : contactPage?.avatar?.avatarUrl, name: contactDetails?.name || contactPage?.name, profileId: contactPage?.avatar?.id })),
            React.createElement("div", { className: "ml-2" },
                React.createElement("h6", null, contactDetails?.name || contactPage?.name),
                contactRole && (React.createElement("p", { className: "fsize-300 txtText600" }, contactRole)))),
        React.createElement("div", { className: 'dis-f flex-wrap jc-fe' },
            contactEmail && (React.createElement(BrixelButtonContactIcon, { data: contactEmail, icon: "mail", className: 'w-fix-32 h-fix-32' })),
            contactPhone && (React.createElement(BrixelButtonContactIcon, { className: "ml-1", data: Helpers.telephoneFormat(contactPhone, false, false, false, false, true), icon: "phone" })))));
};
const mapStateToProps = (state) => ({
    contactPage: get(state, 'property.activeSingleProperty.contacts[0]', {}),
    lang: state?.common?.language || 'en',
});
export default connect(mapStateToProps, null)(ContactPageCard);
