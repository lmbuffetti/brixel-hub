import { BrixelButtonPrimary } from '@brixel/brixel-components';
import get from 'lodash/get';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../controllers/api/graphql';

const BannerBox = (props) => {
  const {
    activeSingleCompany,
    className,
    lang,
    placementSlug,
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

  if (!banner.title) return <></>;
  
  return (
    <div className={`pos-r p-5 brdRadius bgWhite ${className}`}>
      <div className="dis-f a-t">
        <div>
          <img src={banner.mainImage[0].url} alt={banner.mainImage[0].alt} />
        </div>
        <div className="ml-4">
          <h5>{banner.title}</h5>
          <p className="fsize-300 my-3">{banner.description}</p>
          <BrixelButtonPrimary
            rounded
            onClick={() => window.open(banner.buttonLink, '_blank')}
            label={banner.buttonLabel}
          />
        </div>
      </div>
      <div className="pos-a-fix x-r-2 x-t-2 w-fix-72">
        <img src={banner.logo[0].url} alt={banner.logo[0].alt} />
      </div>
    </div>
  );
};

BannerBox.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  placementSlug: PropTypes.string.isRequired,
};

export default BannerBox;
