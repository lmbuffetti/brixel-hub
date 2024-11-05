import React from 'react';
import {
  BrixelIcon,
  BrixelAvatar,
  BrixelButtonContactIcon,
  Helpers} from '@brixel-io/brixel-components';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {ContactType} from '@brixel-io/brixel-components/dist/@types/Models/Property';

type ContactPageCardType = {
  avatarIcon?: {
    icon: string
    color?: string
  }
  className?: string
  contactPage: ContactType
  contactDetails?: ContactType
  contactRole?: string
}

const ContactPageCard = ({
  avatarIcon,
  className,
  contactRole,
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
        {
          avatarIcon ? (
            <BrixelIcon
              rounded
              className="mr-2"
              icon={avatarIcon.icon}
              color={avatarIcon.color || 'green'}
              background={avatarIcon.color || 'green'}
              saturation={50}
            />
          ) : (
            <BrixelAvatar
              avatarImg={contactDetails?.name ? contactDetails?.avatar?.avatarUrl : contactPage?.avatar?.avatarUrl}
              name={contactDetails?.name || contactPage?.name}
              profileId={contactPage?.avatar?.id}
            />
          )
        }
        <div className="ml-2">
          <h6>
            {contactDetails?.name || contactPage?.name}
          </h6>
          {
            contactRole && (
              <p className="fsize-300 txtText600">
                {contactRole}
              </p>
            )
          }
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
