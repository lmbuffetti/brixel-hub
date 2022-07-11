/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { useLocation, useNavigate } from 'react-router-dom';
import { MarkerWithLabel } from '@googlemaps/markerwithlabel';
import { FormatValue, Helpers, translateTo } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { cutValue } from '../../utils/helpers';
import CoverPropertyImage from '../CoverPropertyImage';
import {
  setActiveMarketOverlayProperty,
} from '../../actions/PropertyActions';
import { setSplashType } from '../../actions/CommonActions';

const MarkerComponent = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeProperty,
    data,
    google,
    lang,
    onClick,
    onMarker,
    optMap,
    parentMarker,
    setMarketOverlayProperty,
    setSplashScreen,
    type,
  } = props;
  // STATE
  const [infowindow, setInfowindow] = useState({});
  const [selMarker, setSelMarker] = useState(null);

  const InfoWindowContent = (page, historyLocal) => {
    const openCard = () => {
      if (type === 'own') {
        historyLocal.push({
          pathname: `/${page.id}/home`,
          state: { section: 'Market' },
        });
      } else if (type === 'preMarket' || type === 'premium' || type === 'new') {
        setSplashScreen('marketOverlay');
        setMarketOverlayProperty(page);
      } else if (type === 'favorites') {
        historyLocal.push({
          pathname: `/buyer/${page.id}/property/page`,
          state: { section: 'Market' },
        });
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
                <span className="txtGreen400 fsize-300 fweight-500">{translateTo('On Request', lang)}</span>
              )
            }

          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const markers = [];
    if (optMap.zoom && data.length > 0) {
      data.forEach((item) => {
        let valid = true;
        parentMarker.forEach((mark) => {
          if (mark === item.id && valid) valid = false;
        });
        if (get(item, 'location.latitude', null) && get(item, 'location.longitude', null) && valid) {
          let price = get(item, 'price.total', 0);
          if (price > 0) price = cutValue(get(item, 'price.total', 0));
          else price = 'On request';
          const paras = document.getElementsByClassName('labelMarker');
          if (paras) {
            [...paras].forEach((el) => {
              if (el) {
                el.parentNode.removeChild(el);
              }
            });
          }
          if (get(item, 'tags', []).includes('pre-market') || item.status === 'sold') {
            markers[item.id] = new MarkerWithLabel({
              page: item,
              id: item.id,
              map: optMap,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#F9B1B9',
                fillOpacity: 0.6,
                strokeWeight: 0,
              },
              labelContent: '',
              // the CSS class for the label
              labelClass: `${activeProperty === item.id || selMarker === item.id ? 'labelMarker active' : 'labelMarker'} ${item.id}`,
              labelInBackground: true,
              // labelAnchor: new google.maps.Point(-75, -45),
              position: {
                lat: get(item, 'location.latitude', 200),
                lng: get(item, 'location.longitude', 200),
              },
            });
          } else {
            markers[item.id] = new MarkerWithLabel({
              page: item,
              id: item.id,
              map: optMap,
              icon: {
                url: 'empty',
              },
              labelContent: `<p>${price.toString()}</p>`,
              // the CSS class for the label
              labelClass: `${activeProperty === item.id || selMarker === item.id ? 'labelMarker active' : 'labelMarker'} ${item.id}`,
              labelInBackground: true,
              // labelAnchor: new google.maps.Point(-75, -45),
              position: {
                lat: get(item, 'location.latitude', 200),
                lng: get(item, 'location.longitude', 200),
              },
            });
          }
          const window = infowindow;
          if (!get(item, 'tags', []).includes('pre-market') && item.status !== 'sold') {
            markers[item.id].addListener('click', () => {
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
              window[item.id].open(optMap, markers[item.id]);
              setInfowindow(window);
              onClick(item.id);
            });
          } else {
            optMap.addListener('zoom_changed', () => {
              let scale = 10;
              if (optMap.zoom > 12) scale = 20;
              if (optMap.zoom > 14) scale = 40;
              if (optMap.zoom > 16) scale = 200;
              if (optMap.zoom > 18) scale = 1000;
              if (optMap.zoom > 20) scale = 1200;
              Object.keys(markers).forEach((key) => {
                markers[key].setIcon({
                  path: google.maps.SymbolPath.CIRCLE,
                  scale,
                  fillColor: '#F9B1B9',
                  fillOpacity: 0.6,
                  strokeWeight: 0,
                });
              });
            });
          }
        }
      });
      if (Object.keys(markers).length > 0) onMarker(Object.keys(markers));
    }
  }, [optMap, data, activeProperty]);

  return (
    <></>
  );
};

MarkerComponent.propTypes = {
  activeProperty: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  google: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onMarker: PropTypes.func.isRequired,
  optMap: PropTypes.object.isRequired,
  parentMarker: PropTypes.arrayOf(PropTypes.string).isRequired,
  setMarketOverlayProperty: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  type: PropTypes.string,
};

MarkerComponent.defaultProps = {
  activeProperty: null,
  type: null,
};

const mapDispatchToProps = (dispatch) => ({
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(null, mapDispatchToProps),
)(MarkerComponent);
