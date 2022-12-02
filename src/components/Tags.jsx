import { BrixelIcon, translateTo } from '@brixel/brixel-components';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const Tags = (props) => {
  const {
    lang,
    message,
    status,
    text,
  } = props;
  
  const [tag, setTag] = useState({});
  
  const getColor = () => {
    if (status === 'accepted' || status === 'completed') {
      return 'Green';
    } else if (status === 'pending') {
      return 'Yellow';
    }
  };
  
  const getIcon = () => {
    if (status === 'accepted' || status === 'completed') {
      return 'check';
    } else if (status === 'pending') {
      return 'clock';
    }
  };
  
  useEffect(() => {
    setTag({...tag, text: text});
  }, [text]);
  
  
  return (
    <div className={`bg${getColor()}100 txt${getColor()}600 brdRadius px-1 py-small-6 fsize-300 dis-f a-c`}>
      <BrixelIcon
        size={16}
        color={getColor()}
        saturationTxt={600}
        icon={getIcon()}
      />
      <span className="ml-1">
        {translateTo(message[status], lang)}
      </span>
    </div>
  )
}

Tags.propTypes = {
  lang: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

export default Tags;
