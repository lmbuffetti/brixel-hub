import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import MarkerWithLabel from '@googlemaps/markerwithlabel';
import { FormatValue, Helpers } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { cutValue } from '../../utils/helpers';
import CoverPropertyImage from '../CoverPropertyImage';
import {
  setActivePremarketProperty,
} from '../../actions/PropertyActions';
import { setSplashType } from '../../actions/CommonActions';

const MarkerComponent = (props) => {
  const {
    activeProperty,
    data,
    google,
    history,
    onClick,
    optMap,
    type,
    setSplashScreen,
    setPreMarketProperty,
  } = props;
  // STATE
  const [, setMarkerList] = useState([]);
  const [infowindow, setInfowindow] = useState({});
  const [selMarker, setSelMarker] = useState(null);

  const InfoWindowContent = (page, historyLocal) => {
    const openCard = () => {
      if (type === 'own') {
        historyLocal.push({
          pathname: `/${page.id}/rewards`,
          state: { section: 'Market' },
        });
      } else if (type === 'favorites') {
        historyLocal.push({
          pathname: `/buyer/property/${page.id}/page`,
          state: { section: 'Market' },
        });
      } else if (type === 'preMarket') {
        setSplashScreen('preMarket');
        setPreMarketProperty(page);
      } else window.open(`${baseByData.pageUrl}${page.stub}`, '_blank');
    };
    return (
      <div>
        <div className="coverWrapper brdRadius ov-h h-fix-200">
          <CoverPropertyImage
            // loadedImg={(val) => setCoverImgLoaded(val)}
            onClick={() => openCard()}
            className="cover w-perc-100 h-perc-100 h-fix-200 pos-r cur-poi"
            coverPhoto={get(page, 'coverPhoto.galleryThumbnailPath', undefined)}
            propertyType={get(page, 'properties.propertyType', undefined)}
          />
        </div>
        <div className="info dis-fl-col jc-b">
          <div className="top dis-fl-col">
            <span
              className="fweight-600 fsize-300 txtDark700 ellipsis one cur-poi"
              onClick={() => openCard()}
            >
              {get(page, 'title', '')}
            </span>
            <span className="fsize-300 txtDark700">
              {get(page, 'location.zip', '')} {get(page, 'location.city', '')}
              {
                get(page, 'location.countryCode', 'CH') === 'CH' && (
                  <>
                    {` (${get(page, 'location.stateCode', '')})`}
                  </>
                )
              }
            </span>
          </div>
          <div className="mid dis-fl-row a-c fsize-300 pt-1 txtDark400">
            <span>{get(page, 'properties.propertyType', '')} </span> <span className="px-1"> &middot; </span>
            <span>
              <span>
                {FormatValue.formatRooms(get(page, 'properties.typology.bedrooms', 0), get(page, 'location.countryCode', 'CH'))}
              </span>
            </span>
            {
              get(page, 'properties.typology.bedrooms', 0) && (
                <span className="px-1"> &middot; </span>
              )
            }
            {
              get(page, 'properties.typology.livingArea.value', 0) && (
                <span>
                  <span>
                    {get(page, 'properties.typology.livingArea.value', 0)}
                  </span>
                  <span> m2</span>
                </span>
              )
            }
          </div>
          <div className="bottom a-c txtDark700 pt-1">

            {
              get(page, 'price.total', 0) !== 0 ? (
                <>
                  <span className="fsize-300 fweight-600">{get(page, 'price.currency', '')} &nbsp; </span>
                  <span className="fsize-300 fweight-600">{Helpers.formatNumberValue(get(page, 'price.total', 0), get(page, 'price.currency', ''))}</span>
                </>
              ) : (
                <span className="txtGreen400 fsize-300 fweight-500">On Request</span>
              )
            }

          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (optMap.zoom && data.length > 0) {
      const markers = [];
      data.forEach((item) => {
        let price = get(item, 'price.total', 0);
        if (price > 0) price = cutValue(get(item, 'price.total', 0));
        else price = 'On request';
        const marker = new MarkerWithLabel({
          page: item,
          id: item.id,
          map: optMap,
          icon: {
            url: '',
          },
          labelContent: `<p>${price.toString()}</p>`,
          // the CSS class for the label
          labelClass: activeProperty === item.id || selMarker === item.id ? 'labelMarker active' : 'labelMarker',
          labelInBackground: true,
          labelAnchor: new google.maps.Point(-75, -45),
          position: {
            lat: get(item, 'location.latitude', 200),
            lng: get(item, 'location.longitude', 200),
          },
        });
        const window = infowindow;
        marker.addListener('click', () => {
          if (selMarker !== item.id) setSelMarker(item.id);
          Object.keys(window).forEach((key) => {
            infowindow[key].close();
            const menu = document.querySelector('body');
            menu.classList.toggle('hidden-phone');
          });
          const contentWrapper = document.createElement('div');
          ReactDOM.render(
            React.Children.only(InfoWindowContent(item, history)),
            contentWrapper,
          );
          window[item.id] = new google.maps.InfoWindow({
            class: 'test',
            pixelOffset: new google.maps.Size(0, -45),
            maxWidth: 308,
          });
          google.maps.event.addListener(window[item.id], 'closeclick', () => {
            onClick(null);
            setSelMarker(null);
          });
          window[item.id].setContent(contentWrapper);
          window[item.id].open(optMap, marker);
          setInfowindow(window);
          onClick(item.id);
        });
        markers.push(marker);
      });
      setMarkerList(markers);
    }
  }, [optMap, data, activeProperty, selMarker]);

  return (
    <></>
  );
};

MarkerComponent.propTypes = {
  activeProperty: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  google: PropTypes.object.isRequired,
  optMap: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  // icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  setPreMarketProperty: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  type: PropTypes.string,
};

MarkerComponent.defaultProps = {
  activeProperty: null,
  type: null,
};

const mapDispatchToProps = (dispatch) => ({
  setPreMarketProperty: bindActionCreators(setActivePremarketProperty, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(MarkerComponent);
