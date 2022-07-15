import { BrixelButtonSecondary } from '@brixel/brixel-components';
import React from 'react';
import PropTypes from 'prop-types';

const ContentCard = (props) => {
  const {
    href,
    image,
    previewCopy,
    title,
  } = props;

  return (
    <div className="mb-3 mb-sm-0">
      <a href={href} target="_blank" rel="noreferrer">
        <img width="100%" src={image.url} alt={image.alt} />
      </a>
      <a href={href} target="_blank" rel="noreferrer">
        <h5 className="mt-2 mb-2 mb-sm-5 txtBlue400 fweight-600">{title}</h5>
      </a>
      <p className="fsize-300">{previewCopy}</p>
      <BrixelButtonSecondary
        bgTransparent
        className="mt-2 mt-sm-4"
        rounded
        label="Read more"
        theme="blue"
        onClick={() => window.open(href, '_blank')}
      />
    </div>
  );
};

ContentCard.propTypes = {
  href: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  previewCopy: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ContentCard;
