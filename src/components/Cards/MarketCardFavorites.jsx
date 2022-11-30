import { BrixelButtonText, FormatValue, Helpers } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { compose } from 'redux';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';

const MarketCardFavorites = (props) => {
  const {
    activeSingleProperty,
    lang,
  } = props;
  
  const settingSlider = {
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: '8px',
    arrows: false,
    dots: true,
    lazyLoad: 'progressive',
  };
  
  const isPreMarket = () => get(activeSingleProperty, 'tags', []).includes('pre-market');
  
  return (
    <>
      <div className="dis-f a-c">
        <div>
          {
            get(activeSingleProperty, 'photos', []).length > 0 ? (
              <div className="h-fix-208">
                <Slider {...settingSlider}>
                  {
                    activeSingleProperty.photos.map((photo, index) => (
                      <div
                        key={`itm_${index.toString()}`}
                        className={`${isPreMarket() ? 'pre-market' : ''} ${get(activeSingleProperty, 'tags', []).join(' ')} cover mb-1 w-perc-100 h-fix-200 h-perc-100 pos-r`}
                      >
                        <img src={`${baseByData.shortPath}${photo.path}`} key={`photo${index.toString()}`} />
                      </div>
                    ))
                  }
                </Slider>
              </div>
            ) : (
              <CoverPropertyImage
                className={`${isPreMarket() ? 'pre-market' : ''} ${get(activeSingleProperty, 'tags', []).join(' ')} cover mb-1 w-perc-100 h-perc-100 h-fix-208 pos-r`}
                coverPhoto={get(activeSingleProperty, 'coverPhoto.galleryThumbnailPath', undefined)}
                propertyType={get(activeSingleProperty, 'properties.propertyType', undefined)}
              />
            )
          }
        </div>
        
        <div>
          <span className="fsize-300 txtAltGrey700 mb-1 ta-l">
            {get(activeSingleProperty, 'location.zip', '')} {get(activeSingleProperty, 'location.city', '')}
            {
              get(activeSingleProperty, 'location.countryCode', 'CH') === 'CH' && (
                <>
                  {` (${get(activeSingleProperty, 'location.stateCode', '')})`}
                </>
              )
            }
          </span>
          <h3>
            {activeSingleProperty.title}
          </h3>
          <BrixelButtonText
            label="View property page"
            iconRight="link-open"
            bgTransparent
          />
  
          <div className="fsize-300 pt-1 txtDark400 pb-1">
            <div className="dis-f a-c jc-fs flex-wrap w-perc-100">
  
              <div className="bottom a-c txtDark700 mt-2 mb-2 brdSmallRight brdAltGrey200 pr-6 mr-6">
                <span className="fsize-300 dis-b txtAltGrey400">
                  {translateTo('Price', lang)}
                </span>
                {
                  activeSingleProperty && get(activeSingleProperty, 'price.total', 0) !== 0 && get(activeSingleProperty, 'status', null) === 'on-sale' ? (
                    <div className="txtGreen400 dis-f a-b">
                      <span className="fsize-300 ff-mono notranslate">
                        {get(activeSingleProperty, 'price.currency', '')}
                      </span>
                      <span className="fsize-500 ff-mono notranslate ml-1">
                        {Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))}
                      </span>
                    </div>
                  ) : (
                    <span className="txtGreen400 fsize-500">
                      {translateTo(get(activeSingleProperty, 'status', null) === 'sold' ? 'Sold' : 'On Request', lang)}
                    </span>
                  )
                }
  
              </div>
              
              <div>
                <span className="fsize-300 dis-b txtAltGrey400">
                  {translateTo('Rooms', lang)}
                </span>
                <span className="ff-mono fszie-400 txtBlack">
                  {FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH'))}
                </span>
              </div>
              <div className="mx-4">
                <span className="fsize-300 dis-b txtAltGrey400">
                  {translateTo('Size', lang)}
                </span>
                <span className="ff-mono fszie-400 txtBlack">
                  {get(activeSingleProperty, 'properties.typology.livingArea.value', 0)} m2
                </span>
              </div>
              <div>
                <span className="fsize-300 dis-b txtAltGrey400">
                  {translateTo('Year built', lang)}
                </span>
                <span className="ff-mono fszie-400 txtBlack">
                  {get(activeSingleProperty, 'properties.building.built', 0)}
                </span>
              </div>
            </div>
          </div>
          
          
        </div>
      </div>
    </>
  );
};

MarketCardFavorites.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  wishlistProperties: get(state, 'market.wishlistProperties.data', []),
});


export default compose(
  connect(mapStateToProps, null),
)(MarketCardFavorites);
