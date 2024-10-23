import React from 'react';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {Helpers} from '@brixel-io/brixel-components';
import CoverPropertyImage from '../../../../../components/CoverPropertyImage';
import translateTo from '../../../../../utils/translation';

type MakePropertyCardType = {
  activeSingleProperty: PropertyType
  lang: string
}

const MakeOfferPropertyCard = ({ activeSingleProperty, lang }: MakePropertyCardType) => {
  return (
    <div className="dis-f a-c jc-b bgWhite brdRadius mb-5">
      <div>
        <CoverPropertyImage
          coverPhoto={activeSingleProperty?.coverPhoto?.url}
          size="XS"
        />
      </div>
      <div className="w-perc-100 p-3">
        <div>
          <p className="fsize-300 txtText600">
            {Helpers.formatAddress(activeSingleProperty.location)}
          </p>
          <h5 className="fsize-400 fweight-600">{activeSingleProperty?.title}</h5>
        </div>
        <div className="dis-f a-c">
          <p className="ff-mono fsize-300 txtText600">
            <span>{activeSingleProperty.properties?.typology?.bedrooms}</span>
            <span className="ml-small-4">{translateTo('rooms', lang)}</span>
          </p>
          <span className="dis-b brdFullRadius bgText800 w-fix-small-4 h-fix-small-4 mx-1"></span>
          <p className="ff-mono fsize-300 txtText600">
            <span>{activeSingleProperty.properties?.typology?.livingArea?.value}</span>
            <span className="ml-small-4">{translateTo('m2', lang)}</span>
          </p>
          <span className="dis-b brdFullRadius bgText800 w-fix-small-4 h-fix-small-4 mx-1"></span>
          <p className="ff-mono fsize-300 txtText600">
            <span>{activeSingleProperty.properties?.building?.built}</span>
          </p>
        </div>
        <div className="mt-3">
          <h6 className="fsize-300 txtText600">Listing price:</h6>
          {
            activeSingleProperty?.status === 'on-sale' && activeSingleProperty?.price?.total && (
              <p className="txtGreen400">
                <span>CHF</span>
                <span className="ff-mono fsize-500">{Helpers.formatNumberValue(activeSingleProperty.price.total, activeSingleProperty?.price?.currency || 'CHF')}
                </span>
              </p>
            )
          }
          {
            activeSingleProperty?.status === 'on-request' && (
              <span className="txtText700">{translateTo('On Request', lang)}</span>
            )
          }
          {
            activeSingleProperty?.status === 'sold' && (
              <span className="txtText700">{translateTo('Sold', lang)}</span>
            )
          }
          {
            activeSingleProperty?.status === 'reserved' && (
              <span className="txtText700">{translateTo('Reserved', lang)}</span>
            )
          }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  lang: state?.common?.language || 'en',
});

export default connect(mapStateToProps, null)(MakeOfferPropertyCard);
