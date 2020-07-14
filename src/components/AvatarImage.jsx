import React from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon } from '@brixel/brixel-components';
import { imageExists } from '../utils/helpers';

const AvatarImage = (props) => {
  const {
    avatarImg,
    isIcon,
    name,
    size,
    onClick,
  } = props;

  const extractName = () => {
    const splitName = name ? name.split(' ') : null;
    if (splitName) {
      if (splitName.length > 1) return `${splitName[0].charAt(0).toUpperCase()}${splitName[1].charAt(0).toUpperCase()}`;
      return `${splitName[0].charAt(0).toUpperCase()}${splitName[0].charAt(1).toUpperCase()}`;
    } return '';
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
            onClick={() => onClick()}
          />
        ) : (
          <div className={`defaultAvt flex-${size} w-fix-${size} h-fix-${size} ${isIcon ? 'withIcon' : ''}`} onClick={() => onClick()}>
            {
              isIcon ? (
                <BrixelIcon iconSize={`fSizePx${size / 2 + 2}`} saturationTxt={700} icon="user-solid" color="primary" />
              ) : (
                extractName()
              )
            }
          </div>
        )
      }
    </>
  );
};

AvatarImage.propTypes = {
  avatarImg: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func,
  isIcon: PropTypes.bool,
};

AvatarImage.defaultProps = {
  avatarImg: null,
  name: null,
  size: 56,
  isIcon: true,
  onClick: () => '',
};

export default AvatarImage;
