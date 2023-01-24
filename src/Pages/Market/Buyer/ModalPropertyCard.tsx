import React, {useState} from 'react';
import {BrixelButtonText, BrixelIcon, FormatValue} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {BrixelMap} from '@brixel/brixel-components/dist/map';
import get from 'lodash/get';
import translateTo from '../../../utils/translation';
import type {ModalPropertyCardType} from '../../../@types/Pages/Market/Buyer/ModalPropertyCard';

const ModalPropertyCard = (props: ModalPropertyCardType) => {
  const {
    isFavorite,
    lang,
    onClose,
    onRemoveProperty,
    property,
    saveFavorite,
  } = props;
  // STATE
  const [isShowMoreInfo, setIsShowMoreInfo] = useState(false);

  return (
    <div className="dis-fl-col po-r">
      <BrixelIcon
        rounded
        background="white"
        saturation={0}
        className="pos-a-fix x-r-3 x-t-3 zIndex10"
        onClick={() => onClose()}
        icon="close-small"
      />
      <BrixelMap
        baseByData={baseByData}
        gestureHandling="auto"
        lang={lang}
        externalControls
        hideLocation={true}
        className="w-perc-100 h-fix-400"
        center={{
          lat: property.location.latitude,
          lng: property.location.longitude,
        }}
        type={'satellite'}
        marker={property}
        zoom={15}
      />
      <div className="px-sm-3 px-2 pt-3 pb-1">
        <div className="mt-2 mb-1">
          <h4 className='fweight-600'>{get(property, 'title', '')}</h4>
        </div>

        <h6 className="fsize-300 dis-f">
          <span>{translateTo('This is a Pre-Market property.', lang)}</span>
          <button
            className="ml-1 txtGreen400 td-u fweight-600"
            onClick={() => setIsShowMoreInfo(!isShowMoreInfo)}
          >
            <span>{translateTo('What can I do?', lang)}</span>
            <BrixelIcon
              color="green"
              icon={isShowMoreInfo ? 'arrow-simple-up' : 'arrow-simple-down'}
            />
          </button>
        </h6>
      </div>
      {
        isShowMoreInfo && (
          <p className="fsize-300 px-2 px-sm-3 txtAltGrey700">
            {translateTo('This property is not for sale yet and all personal data are hidden until it gets on the market. You can like the property and be informed about any important updates.', lang)}
          </p>
        )
      }

      <div className="px-2 px-sm-3 mt-5">
        <hr className="lighter" />
      </div>

      <div className="dis-f a-t jc-b flext-wrap p-2 p-sm-3">
        <div>
          <span className="fsize-300 dis-b txtAltGrey400">
            {translateTo('Property Type', lang)}
          </span>
          <span className="ff-mono fszie-400 txtBlack">
            {translateTo(get(property, 'properties.propertyType', ''), lang)}
          </span>
        </div>
        <div>
          <span className="fsize-300 dis-b txtAltGrey400">
            {translateTo('Rooms', lang)}
          </span>
          <span className="ff-mono fszie-400 txtBlack">
            {FormatValue.formatRooms(get(property, 'properties.typology.bedrooms', 0), get(property, 'location.countryCode', 'CH'))}
          </span>
        </div>
        <div>
          <span className="fsize-300 dis-b txtAltGrey400">
            {translateTo('Size', lang)}
          </span>
          <span className="ff-mono fszie-400 txtBlack">
            {get(property, 'properties.typology.livingArea.value', 0)} m2
          </span>
        </div>
        <div>
          <span className="fsize-300 dis-b txtAltGrey400">
            {translateTo('Year built', lang)}
          </span>
          <span className="ff-mono fszie-400 txtBlack">
            {get(property, 'properties.building.built', 0)}
          </span>
        </div>
        <div>
          <span className="fsize-300 dis-b txtAltGrey400">
            {translateTo('Location', lang)}
          </span>
          <span className="fsize-300 txtDark700 mt-1 notranslate">
            {get(property, 'location.zip', '')} {get(property, 'location.city', '')}
            {
              get(property, 'location.countryCode', 'CH') === 'CH' && (
                <>
                  {` (${get(property, 'location.stateCode', '')})`}
                </>
              )
            }
          </span>
        </div>
      </div>

      <hr className="lighter mt-a" />

      <div className="row-cols-3-gut-1 p-2 p-sm-3">
        <div>
          <BrixelButtonText
            className="td-u"
            bgTransparent
            theme="altGrey"
            label="Close"
            onClick={() => onClose()}
          />
        </div>
        <div className="dis-f jc-c a-c">
          <BrixelIcon
            className="mx-1 brdSmall brdBlue700"
            color="blue"
            saturationTxt={700}
            rounded
            background="white"
            saturation={0}
            icon="eye-hidden"
            onClick={() => onRemoveProperty()}
          />
          <BrixelIcon
            className="brdSmall brdRed400"
            rounded
            background="white"
            saturation={0}
            icon={isFavorite ? 'favorite-fill' : 'favorite'}
            color="red"
            onClick={() => saveFavorite(isFavorite ? 'remove' : 'add')}
          />
        </div>
      </div>
    </div>
  )
};

export default ModalPropertyCard;
