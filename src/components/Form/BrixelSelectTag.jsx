import React, {
  useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

const BrixelSelectTag = (props) => {
  const {
    className,
    options,
    selectedStatus,
    selectedTag,
  } = props;

  const [statusArray, setStatusArray] = useState(selectedTag);

  const removeEmptyStrings = (array) => {
    const newArray = array.filter((e) => e.replace(/(\r\n|\n|\r)/gm, ''));
    return newArray;
  };

  const updateTagList = (e, value) => {
    e.preventDefault();
    const statusArrayInner = cloneDeep(removeEmptyStrings(statusArray));
    if (statusArrayInner.includes(value)) {
      const index = statusArrayInner.indexOf(value);
      statusArrayInner.splice(index, 1);
    } else {
      statusArrayInner.push(value);
    }
    setStatusArray(statusArrayInner);
    selectedStatus(statusArrayInner);
  };

  useEffect(() => {
    setStatusArray(selectedTag);
  }, [selectedTag]);

  const activeClass = (i, value) => (statusArray.includes(value) ? 'active' : '');

  return (
    <div className={`selectTag ${className}`}>
      <span className="body2 fweight-400 dis-b tt-up mb-1"> Status </span>
      {
        options.map((item, i) => (
          <ul
            key={i.toString()}
            className="dis-fl"
          >
            <li
              className={`cur-poi fsize-200 px-2 ${activeClass(i, item.value)}`}
              onClick={(e) => {
                e.preventDefault();
                updateTagList(e, item.value);
              }}
            >
              {item.label}
            </li>
          </ul>
        ))
      }
    </div>
  );
};

BrixelSelectTag.propTypes = {
  className: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedStatus: PropTypes.func,
  selectedTag: PropTypes.arrayOf(PropTypes.any),
};

BrixelSelectTag.defaultProps = {
  className: '',
  selectedStatus: () => '',
  selectedTag: [],
};

export default BrixelSelectTag;
