import React from 'react';
import PropTypes from 'prop-types';
import { imageExists } from '../utils/helpers';

const AvatarImage = (props) => {
  const {
    avatarImg,
    name,
    size,
  } = props;

  const extractName = () => {
    const splitName = name ? name.split(' ') : null;
    if (splitName) {
      if (splitName.length > 1) return `${splitName[0].charAt(0).toUpperCase()}${splitName[1].charAt(0).toUpperCase()}`;
      return `${splitName[0].charAt(0).toUpperCase()}${splitName[0].charAt(1).toUpperCase()}`
    } else return '';
  };

  return (
    <>
      {
        avatarImg && imageExists(avatarImg) ? (
          <img
            src={avatarImg}
            alt={`Profile ${name}`}
            width={`${size}px`}
            className={`brdCircle cur-poi w-fix-${size} h-fix-${size}`}
          />
        ) : (
          <div className={`defaultAvt w-fix-${size} h-fix-${size}`}>
            {extractName()}
          </div>
        )
      }
    </>
  )
};

AvatarImage.propTypes = {
  avatarImg: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
};

AvatarImage.defaultProps = {
  avatarImg: null,
  name: null,
  size: 56,
};

export default AvatarImage;
