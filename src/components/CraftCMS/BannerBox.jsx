import { BrixelButtonPrimary } from '@brixel/brixel-components';
import get from 'lodash/get';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import api from '../../controllers/api/graphql';

const BannerBox = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleCompany,
    activeSingleProperty,
    className,
    lang,
    placementSlug,
    title,
  } = props;

  const [banner, setBanner] = useState([]);

  useEffect(() => {
    if (activeSingleCompany.stub) {
      const data = {
        placementSlug,
        partner: activeSingleCompany.stub,
        language: lang,
        queryType: 'banners'
      };
      api.craftCMS.getHubContent(data)
        .then((res) => {
          setBanner(get(res, 'data.data.bannersEntries[0]', {}))
        });
    }
  }, [activeSingleCompany, lang]);
  
  const onClickBanner = (url) => {
    const mapObj = {
      DOMAIN_HUB: '',
      PAGE_ID: activeSingleProperty.id,
      'http://': '',
      'https://': '',
    };
    if (!url.includes('PAGE_ID')) {
      window.open(url, '_blank');
    } else {
      const internalLink = url.replace(/PAGE_ID|DOMAIN_HUB|http:\/\/|https:\/\//gi, function(matched){
        return mapObj[matched];
      });
      history.push(internalLink);
    }
  }

  if (!banner.title) return <></>;

  return (
    <div className={className}>
      {
        title && (
          <h5 className="mb-3">{title}</h5>
        )
      }
      <div className="pos-r p-3 p-sm-5 brdRadius bgWhite">
        <div className="dis-fl-col dis-fl-row-sm a-t">
          {
            get(banner, 'mainImage[0].url', null) && (
              <img className="" width="124" src={get(banner, 'mainImage[0].url', '')} alt={banner.mainImage[0].alt} />
            )
          }
          <div className="ml-0 ml-sm-4">
            <h5 className="mt-3 mt-sm-0 fweight-600">{banner.title}</h5>
            <p className="fsize-300 my-3">{banner.description}</p>
            {
              banner.buttonLink && banner.buttonLabel && (
                <BrixelButtonPrimary
                  rounded
                  onClick={() => onClickBanner(banner.buttonLink)}
                  label={banner.buttonLabel}
                />
              )
            }
          </div>
        </div>
        {
          get(banner, 'logo[0].url', null) && (
            <div className="pos-a-fix x-r-2 x-t-2 w-fix-72">
              <img src={banner.logo[0].url} alt={banner.logo[0].alt} />
            </div>
          )
        }
      </div>
    </div>
  );
};

BannerBox.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  placementSlug: PropTypes.string.isRequired,
  title: PropTypes.string,
};

BannerBox.defaultProps = {
  title: null,
}

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(BannerBox);
