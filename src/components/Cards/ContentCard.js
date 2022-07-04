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
    <div>
      <a href={href} target="_blank" rel="noreferrer">
        <img src={image.url} alt={image.alt} />
      </a>
      <a href={href} target="_blank" rel="noreferrer">
        <h5 className="mt-2 mb-4 txtGreen400">{title}</h5>
      </a>
      <p className="fsize-300">{previewCopy}</p>
      <BrixelButtonSecondary
        bgTransparent
        className="mt-2"
        rounded
        label="Read more"
        onClick={window.open(href, '_blank')}
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
