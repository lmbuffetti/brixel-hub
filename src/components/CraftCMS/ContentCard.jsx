import { BrixelButtonSecondary } from '@brixel/brixel-components';
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

  return (
    <div className="mb-3 mb-sm-0">
      <a className="dis-f h-fix-sm-112 a-b" href={hrefUrl} target="_blank" rel="noreferrer">
        <img width="100%" src={image.url} alt={image.alt} />
      </a>
      <a href={hrefUrl} target="_blank" rel="noreferrer">
        <h5 className="mt-2 mb-2 mb-sm-3 txtBlue400 fweight-600">{title}</h5>
      </a>
      <p className="fsize-300">{previewCopy}</p>
      <BrixelButtonSecondary
        bgTransparent
        className="mt-2 mt-sm-4"
        rounded
        label={hrefTitle}
        theme="blue"
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
