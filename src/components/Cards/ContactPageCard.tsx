import React from 'react';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {ContactType} from '@brixel-io/brixel-components/dist/@types/Models/Property';
import {
  BrixelAvatar,
  BrixelButtonContactIcon,
  Helpers,
} from '@brixel-io/brixel-components';

type ContactPageCardType = {
  className?: string
  contactPage: ContactType
  contactDetails?: ContactType
}

const ContactPageCard = ({
  className,
  contactDetails,
  contactPage,
}: ContactPageCardType) => {
  let contactPhone = contactPage?.phone;
  let contactEmail = contactPage?.email;
  if (contactDetails?.name) contactPhone = contactDetails?.phone
  if (contactDetails?.name) contactEmail = contactDetails?.email
  return (
    <div className={`dis-f a-c jc-b bgWhite brdRadius p-2 w-perc-100 dis-f a-c jc-b ${className}`}>
      <div className="dis-f a-c">
        <BrixelAvatar
          name={contactDetails?.name || contactPage?.name}
          profileId={contactPage?.avatar?.id}
        />
        <div className="ml-2">
          <h6>
            {contactDetails?.name || contactPage?.name}
          </h6>
        </div>
      </div>
      <div>
        {
          contactEmail && (
            <BrixelButtonContactIcon
              data={contactEmail}
              icon="mail"
            />
          )
        }
        {
          contactPhone && (
            <BrixelButtonContactIcon
              className="ml-2"
              data={Helpers.telephoneFormat(contactPhone, false, false, false, false, true)}
              icon="phone"
            />
          )
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  contactPage: get(state, 'property.activeSingleProperty.contacts[0]', {}),
  lang: state?.common?.language || 'en',
});

export default connect(mapStateToProps, null)(ContactPageCard);
