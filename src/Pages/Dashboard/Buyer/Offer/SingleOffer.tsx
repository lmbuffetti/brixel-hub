import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import translateTo from '../../../../utils/translation';
import SectionMobileTitle from '../../../../components/SectionMobileTitle';
import BannerFullSize from '../../../../components/BannerFullSize';
import DocumentIcon from '../../../../images/documentsIcon/documentFull.svg'
import BannerOfferDefault from '../../../../images/dashboard/bannerOffer-deafault.svg';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

type SingleOfferType = {
  lang: string
}

const SingleOffer = (props: SingleOfferType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    lang,
  } = props;
  const propID = match?.propID || '';
  return (
    <>
      <h3 className="mb-3 hide dis-b-lg  fweight-600">{translateTo('Offer', lang)}</h3>
      <div className="dis-f h-perc-lg-100">
        <div className="dis-fl-col w-perc-100 h-perc-lg-100">
          <SectionMobileTitle
            title="Offer"
          />
          <div>
            <BannerFullSize
              type="green"
              lang={lang}
              image={DocumentIcon}
              title="Need a proof of financing?"
              description={['Order a non-binding proof of financing from our trusted partners before making an offer. It can help you secure the best deal.']}
              button={{
                label: 'Apply',
                iconRight: 'arrow-right',
                onClick: () => history.push(`/buyer/${propID}/offerFlow/proofFinancing`),
                type: 'primary',
              }}
            />

            <BannerFullSize
              className="mt-2"
              type="default"
              lang={lang}
              image={BannerOfferDefault}
              title="Ready to make an offer?"
              description={['Send your proposal and take the first steps to buy your dream home.']}
              button={{
                label: 'Add offer',
                iconLeft: 'plus',
                onClick: () => history.push(`/buyer/${propID}/offerFlow/makeOffer`),
                type: 'primary',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  lang: state?.common?.language || 'en',
});

export default compose(
  connect(mapStateToProps, null),
)(SingleOffer);
