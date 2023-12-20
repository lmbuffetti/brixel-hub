import {BrixelButtonSecondary} from '@brixel-io/brixel-components';
import get from 'lodash/get';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {compose} from 'redux';
import api from '../../controllers/api/graphql';
import {transformInternalLink} from '../../utils/helpers';
import type {BannerBoxType, BannerStateType} from '../../@types/components/CraftCMS/BannerBox';

const BannerBox = (props: BannerBoxType) => {
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

  const [banner, setBanner] = useState<BannerStateType>({});

  useEffect(() => {
    if (activeSingleCompany.stub) {
      const data = {
        bannerSlug: placementSlug,
        partner: activeSingleCompany.type !== 'partner' ? 'brixel' : activeSingleCompany.stub,
        language: lang,
        queryType: 'banners',
      };
      api.craftCMS.getHubContent(data)
        .then((res) => {
          setBanner(get(res, 'data.bannersEntries[0]', {}))
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }, [activeSingleCompany, lang]);

  const onClickBanner = (url) => {
    if (!url.includes('PAGE_ID')) {
      window.open(url, '_blank');
    } else {
      const internalLink = transformInternalLink(url, { activeSingleProperty });
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
        <div className="dis-fl-col-rev dis-fl-row-sm a-c-sm jc-b">
          <div className="max-w-fix-512 w-perc-100">
            <h5 className="mt-3 mt-sm-0 fweight-600 fsize-400 fsize-lg-600">{banner.title}</h5>
            <p className="fsize-300 my-1 my-sm-3">{banner.description}</p>
            {
              get(banner, 'bannerButton.text', null) && get(banner, 'bannerButton.url', null) && (
                <BrixelButtonSecondary
                  rounded
                  className='mt-2 mt-sm-0 w-perc-100 w-auto-md'
                  onClick={() => onClickBanner(get(banner, 'bannerButton.url', ''))}
                  label={get(banner, 'bannerButton.text', '')}
                />
              )
            }
          </div>
          {
            get(banner, 'mainImage[0].url', null) && (
              <div className='ml-0 ml-sm-4 px-2 pb-1 pb-sm-0 p-sm-0 dis-f a-c jc-sm-fe'>
                <img loading="lazy" className="w-fix-64 w-fix-md-120" src={get(banner, 'mainImage[0].url', '')} alt={get(banner, 'mainImage[0].alt', '')} />
              </div>
            )
          }
        </div>
        {
          get(banner, 'logo[0].url', null) && (
            <div className="pos-a-fix x-r-2 x-t-2 w-fix-72">
              <img loading="lazy" src={get(banner, 'logo[0].url', '')} alt={get(banner, 'logo[0].alt', '')} />
            </div>
          )
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(BannerBox);
