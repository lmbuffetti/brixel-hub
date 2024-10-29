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
  contactPage: ContactType
}

const ContactPageCard = ({ contactPage }: ContactPageCardType) => {
  return (
    <div className="dis-f a-c jc-b bgWhite brdRadius p-2 w-perc-100 dis-f a-c jc-b">
      <div className="dis-f a-c">
        <BrixelAvatar
          name={contactPage?.name}
          profileId={contactPage?.avatar?.id}
        />
        <div className="ml-2">
          <h6>
            {contactPage?.name}
          </h6>
        </div>
      </div>
      <div>
        <BrixelButtonContactIcon
          data={contactPage?.email}
          icon="mail"
        />
        {
          contactPage?.phone && (
            <BrixelButtonContactIcon
              className="ml-2"
              data={Helpers.telephoneFormat(contactPage?.phone, false, false, false, false, true)}
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
