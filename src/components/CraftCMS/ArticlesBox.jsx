import get from 'lodash/get';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../controllers/api/graphql';
import ContentCard from '../Cards/ContentCard';

const ArticlesBox = (props) => {
  const {
    activeSingleCompany,
    lang,
    placementSlug,
    title,
  } = props;

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (activeSingleCompany.stub) {
      const data = {
        placementSlug,
        partner: activeSingleCompany.stub,
        language: lang,
        queryType: 'articles'
      };
      api.craftCMS.getHubContent(data)
        .then((res) => {
          setArticles(get(res, 'data.data.placementEntries[0].placementContent', []))
        });
    }

  }, [activeSingleCompany]);

  if (articles.length === 0) return <></>;

  return (
    <div className="mt-5">
      {
        title && (
          <h5 className="fweight-600">{title}</h5>
        )
      }

      <div className="row-cols-sm-3-gut-4 my-3">
        {
          articles.map((card) => (
            <ContentCard
              key={ card.id }
              image={ card.mainImage[ 0 ] }
              title={ card.title }
              previewCopy={ card.previewCopy }
              href={ card.url }
            />
          ))
        }
      </div>
    </div>
  );
};

ArticlesBox.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  placementSlug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ArticlesBox;
