import { BrixelButtonText } from '@brixel/brixel-components';
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

const ContentCard = (props) => {
  const {
    hrefOnClick,
    hrefTarget,
    hrefTitle,
    hrefUrl,
    image,
    previewCopy,
    title,
  } = props;

  return (
    <div className="mb-3 mb-sm-0">
      {
        get(image, 'url', null) && (
          <a href={hrefUrl}
            className="dis-f ov-h a-b cur-poi"
            target="_blank" rel="noreferrer"
          >
            <img loading="lazy" className="of-co max-h-fix-sm-120 max-h-fix-lg-144" width="100%" src={image.url} alt={image.alt} />
          </a>
        )
      }
      <a href={hrefUrl} target="_blank" rel="noreferrer">
        <h5 className="mt-2 mb-2 mb-sm-3 txtDark700 fSizePx18 fweight-600 tt-break-hy">{title}</h5>
      </a>
      <p className="fsize-300">{previewCopy}</p>
      <BrixelButtonText
        bgTransparent
        className="mt-2"
        rounded
        label={hrefTitle}
        onClick={() => hrefOnClick(hrefUrl, hrefTarget)}
      />
    </div>
  );
};

ContentCard.propTypes = {
  hrefOnClick: PropTypes.func.isRequired,
  hrefTarget: PropTypes.string.isRequired,
  hrefTitle: PropTypes.string.isRequired,
  hrefUrl: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  previewCopy: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ContentCard;
