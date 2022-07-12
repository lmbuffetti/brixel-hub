import get from 'lodash/get';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../controllers/api/graphql';

const BannerBox = (props) => {
  const {
    activeSingleCompany,
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
  }, [activeSingleCompany]);

  if (!banner.title) return <></>;
  
  return (
    <div className="mt-6">
      {
        banner.title && (
          <h4>{banner.title}</h4>
        )
      }
  
      <div className="row-cols-3-gut-8 my-3">
      
      </div>
    </div>
  );
};

BannerBox.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  placementSlug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BannerBox;
