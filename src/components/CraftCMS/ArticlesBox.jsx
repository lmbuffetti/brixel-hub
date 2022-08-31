import get from 'lodash/get';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../controllers/api/graphql';
import { transformInternalLink } from '../../utils/helpers';
import ContentCard from './ContentCard';

const ArticlesBox = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleCompany,
    activeSingleProperty,
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

  const onClickBanner = (url, target) => {
    if (!url.includes('PAGE_ID')) {
      window.open(url, target);
    } else {
      const internalLink = transformInternalLink(url, { activeSingleProperty });
      history.push(internalLink);
    }
  }
  const skeltons = document.querySelectorAll('.skeltonWrap');

  useEffect(() => {
    if (skeltons) {
      setTimeout(() => {
        // skeltonWrap.classList.add('hide');
        skeltons.forEach(function(o){
          o.classList.add('hide');
        });
      }, 100);
    }
  }, [skeltons]);

  if ((get(activeSingleCompany, 'stub', '') !== 'ubs' && get(activeSingleCompany, 'stub', '') !== 'baloise')) return <></>;

  return (
    <div className={className}>
      {
        articles.length !== 0 ? (
          <div className={`dis-f flex-wrap jc-b mt-6 ${placement.mainTitle ? 'mb-3' : ''}`}>
            <>
              {
                placement.mainTitle && (
                  <h5 className="fweight-600">{placement.mainTitle}</h5>
                )
              }
              <div className="dis-f a-c flex-wrap mt-1 mt-lg-0">
                {
                  placement.subtitle && (
                    <span className="fsize-300 txtAltGrey400">{placement.subtitle}</span>
                  )
                }
                <div className="div">
                  {
                    get(placement, 'logo[0]', null) && (
                      <img loading="lazy" className="ml-0 ml-sm-2 h-fix-20 h-fix-lg-24" src={placement.logo[0].url} alt={placement.logo[0].alt} />
                    )
                  }
                </div>
              </div>
            </>
          </div>
        ) : (
          <div className='dis-f w-perc-100 h-fix-24 jc-b mb-3 skeltonWrap mt-6'>
            <div className='w-perc-40 h-fix-24 skeletonBg'/>
            <div className='w-perc-20 h-fix-24 skeletonBg'/>
          </div>
        )
      }
      <div className="row-cols-sm-3-gut-4 mb-3">
        {
          !articles.length ? (
            <>
              <div className="skeltonWrap">
                <div className="h-fix-144 skeletonBg"/>
                <div className="h-fix-16 mt-2 skeletonBg"/>
                <div className="h-fix-16 mt-2 skeletonBg"/>
                <div className="h-fix-16 w-perc-50 mt-2 skeletonBg"/>
              </div>
              <div className='skeltonWrap'>
                <div className="h-fix-144 skeletonBg"/>
                <div className="h-fix-16 mt-2 skeletonBg"/>
                <div className="h-fix-16 mt-2 skeletonBg"/>
                <div className="h-fix-16 w-perc-50 mt-2 skeletonBg"/>
              </div>
              <div className='skeltonWrap'>
                <div className="h-fix-144 skeletonBg"/>
                <div className="h-fix-16 mt-2 skeletonBg"/>
                <div className="h-fix-16 mt-2 skeletonBg"/>
                <div className="h-fix-16 w-perc-50 mt-2 skeletonBg"/>
              </div>
            </>
          ) : (
            <>
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
                    hrefOnClick={(url, target) => onClickBanner(url, target)}
                  />
                ))
              }
            </>
          )
        }
      </div>
    </div>
  );
};

ArticlesBox.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  placementSlug: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ArticlesBox;
