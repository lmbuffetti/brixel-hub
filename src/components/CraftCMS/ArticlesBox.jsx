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
    className,
  } = props;

  const [placement, setPlacement] = useState([]);
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
          setPlacement(get(res, 'data.data.placementEntries[0]', []));
          setArticles(get(res, 'data.data.placementEntries[0].placementContent', []));
        });
    }

  }, [activeSingleCompany, lang]);

  if (articles.length === 0) return <></>;

  return (
    <div className={`mt-5 ${className}`}>
      <div className="dis-f flex-wrap jc-b">
        {
          placement.mainTitle && (
            <h5 className="fweight-600">{placement.mainTitle}</h5>
          )
        }
        <div className="dis-f a-c flex-wrap mt-1 mt-sm-0">
          {
            placement.subtitle && (
              <span className="fsize-300 txtAltGrey400">{placement.subtitle}</span>
            )
          }
          <div className="div">
            {
              get(placement, 'logo[0]', null) && (
                <img className="ml-2 h-fix-24" src={placement.logo[0].url} alt={placement.logo[0].alt} />
              )
            }
          </div>
        </div>
      </div>
      <div className="row-cols-sm-3-gut-4 my-3">
        {
          articles.map((card) => (
            <ContentCard
              key={ get(card, 'id', '') }
              image={ get(card, 'mainImage[0]', null) }
              title={ get(card, 'cardTitle', '') }
              previewCopy={ get(card, 'previewCopy', '') }
              hrefUrl={ get(card, 'cardLink.url', '') }
              hrefTitle={get(card, 'cardLink.text', '')}
              hrefTarget={ get(card, 'cardLink.target', '') }
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
  className: PropTypes.string
};

export default ArticlesBox;
