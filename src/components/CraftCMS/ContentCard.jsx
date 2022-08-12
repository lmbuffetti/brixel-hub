import { BrixelButtonText } from '@brixel/brixel-components';
import React from 'react';
import PropTypes from 'prop-types';

const ContentCard = (props) => {
  const {
    hrefUrl,
    hrefTitle,
    hrefTarget,
    image,
    previewCopy,
    title,
  } = props;

  const articleLink =()=> {window.open(`${hrefUrl}`, '_blank');}

  return (
    <div className="mb-3 mb-sm-0">
      <div className="dis-f max-h-fix-112 ov-h a-b cur-poi" onClick={()=> articleLink()} target="_blank" rel="noreferrer">
        <img width="100%" src={image.url} alt={image.alt} />
      </div>
      <a href={hrefUrl} target="_blank" rel="noreferrer">
        <h5 className="mt-2 mb-2 mb-sm-3 txtDark700 fSizePx18 fweight-600 tt-break-hy">{title}</h5>
      </a>
      <p className="fsize-300">{previewCopy}</p>
      <BrixelButtonText
        bgTransparent
        className="mt-2"
        rounded
        label={hrefTitle}
        onClick={() => window.open(hrefUrl, hrefTarget)}
      />
    </div>
  );
};

ContentCard.propTypes = {
  hrefUrl: PropTypes.string.isRequired,
  hrefTitle: PropTypes.string.isRequired,
  hrefTarget: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  previewCopy: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ContentCard;
