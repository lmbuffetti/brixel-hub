import get from 'lodash/get';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../controllers/api/graphql';
import ContentCard from './ContentCard';

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
              key={ get(card, 'cardLink.card.id', '') }
              image={ get(card, 'cardLink.element.mainImage[0]', null) }
              title={ get(card, 'cardLink.element.title', '') }
              previewCopy={ get(card, 'cardLink.card.previewCopy', '') }
              href={ get(card, 'cardLink.card.url', '') }
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
