import React from 'react';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {
  BrixelButtonText,
  Helpers,
} from '@brixel-io/brixel-components';
import CoverPropertyImage from '../CoverPropertyImage';
import translateTo from '../../utils/translation';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';

type MakeOfferPropertyCardVerticalType = {
  activeSingleProperty: PropertyType
  lang: string
}

const MakeOfferPropertyCardVertical = ({ activeSingleProperty, lang }: MakeOfferPropertyCardVerticalType) => {
  return (
    <div className="max-w-fix-800 w-perc-100">
      <div className="dis-f-col a-c jc-b bgWhite brdRadius mb-1 ov-h brdSmall brdText100 pb-3">
        <div>
          <CoverPropertyImage
            coverPhoto={activeSingleProperty?.coverPhoto?.url}
            size="M"
          />
        </div>
        <div className="w-perc-100 px-3 mt-3">
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
        </div>

        <BrixelButtonText
          className="mt-2"
          label={translateTo('View propertypage ', lang)}
          rightIcon="link-open"
          onClick={() => window.open(`${baseByData.pageUrl}${lang}/${activeSingleProperty.stub}`, '_blank')}
        />
      </div>

      <div className="dis-f a-c jc-b bgWhite brdRadius p-3 brdSmall brdText100">
        <p className="fsize-300 txtText600">
          {translateTo('Listing price', lang)}
        </p>
        <div>
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

export default connect(mapStateToProps, null)(MakeOfferPropertyCardVertical);
