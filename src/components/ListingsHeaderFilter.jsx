/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { BrixelIcon } from '@brixel/brixel-components';

const ListingsHeaderFilter = (props) => {
  const {
    activeCompany,
    activeSearchText,
    activeSortDirection,
    applyFilter,
    className,
    labels,
    searchType,
  } = props;

  const disableReorder = [
    'owner',
    'progress',
    'status',
    'tags',
    'team',
  ];
  const [activeSort, setActiveSort] = (searchType === 'Properties' ? useState('Updated') : useState('Signup Date'));
  const [previousSort, setPreviousSort] = (searchType === 'Properties' ? useState('Updated') : useState('Signup Date'));
  const [activeLabel, setActiveLabel] = (searchType === 'Properties' ? useState('Updated') : useState('Signup Date'));
  const [enterCounter, setEnterCounter] = useState(0);

  let dir = '';

  const processFilter = (text, type, direction, company) => {
    let processedType = type.toLowerCase();

    if (disableReorder.includes(processedType)) {
      return false;
    }
    setActiveSort(type);
    // Exception for 'updatedAt'
    if (processedType.includes('last login')) {
      processedType = 'lastLogin';
    }
    if (processedType.includes('signup date')) {
      processedType = 'createdAt';
    }
    if (processedType.includes('channel')) {
      processedType = 'signupChannel';
    }
    if (processedType.includes('updated')) {
      processedType = 'updatedAt';
    }

    if ((previousSort === 'Signup Date' && type === 'Last login') ||
        (previousSort === 'Last login' && type === 'Signup Date') ||
        ((previousSort === 'Name' || previousSort === 'Email' || previousSort === 'Signup channel') && (type === 'Signup Date' || type === 'Last login'))) {
      if (direction === 'DESC') dir = 'DESC';
      if (direction === 'ASC') dir = 'DESC';
    } else if (searchType === 'Users' && previousSort === 'Signup Date' && type === 'Signup Date' && enterCounter === 0) {
      dir = direction;
      setEnterCounter(1);
    } else if (searchType === 'Properties' && enterCounter === 0) {
      dir = direction;
      setEnterCounter(1);
    } else if (direction === 'DESC') dir = 'ASC';
    else if (direction === 'ASC') dir = 'DESC';

    applyFilter(text, processedType, dir, company);
    return null;
  };

  // add class when listings are scrolling
  useEffect(() => {
    const scrollContent = document.getElementsByClassName('content')[0];
    // const listingSection = document.getElementsByClassName('top-header')[0];
    const listingHeaderFilter = document.getElementsByClassName('listings-header-filter')[0];
    // const contentWrapper = document.getElementsByClassName('content-wrapper')[0];
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 1024; // todo import windowdimention function

    if (listingHeaderFilter && scrollContent) {
      scrollContent.addEventListener('scroll', () => {
        if (scrollContent.scrollTop > 0) {
          if (isMobile) scrollContent.classList.add('slideUp');
          listingHeaderFilter.classList.add('fixed');
        } else {
          if (isMobile) scrollContent.classList.remove('slideUp');
          listingHeaderFilter.classList.remove('fixed');
        }
      });
    }
  });

  useEffect(() => {
    processFilter(activeSearchText, activeLabel, activeSortDirection, activeCompany);
  }, [previousSort, activeLabel]);

  return (
    <div className={`listings-header-filter dis-fl-row row-cols-${labels.length + 1} px-2 ${className}`}>
      <div className="header p-1 tt-up avatar-space" label="avatar-space" />
      {
        labels.map((label, i) => (
          <div
            key={`lstHdr_${i.toString()}`}
            className="header dis-f a-c tt-up p-1"
          >
            <div
              onClick={() => {
                setPreviousSort(activeSort);
                if (label === activeLabel) {
                  processFilter(activeSearchText, activeLabel, activeSortDirection, activeCompany);
                } else {
                  setActiveLabel(label);
                }
              }}
              className="wrapper pos-r dis-fl-row a-c"
            >
              <p className={`label overline ${activeSort === label ? 'active fweight-500' : ''} ${!disableReorder.includes(label.toLowerCase()) ? 'cur-poi' : ''} mr-1 `}>{label}</p>
              {
                !disableReorder.includes(label.toLowerCase()) && (
                  <p className="dis-fl-col">
                    <BrixelIcon
                      icon="arrow-up-small"
                      color="dark"
                      saturationTxt={700}
                      className={`fsize-400 ${(activeSort === label && activeSortDirection === 'ASC') ? 'active' : 'hide'}`}
                    />
                    <BrixelIcon
                      icon="arrow-down-small"
                      color="dark"
                      saturationTxt={700}
                      className={`fsize-400 ${(activeSort === label && activeSortDirection === 'DESC') ? 'active' : 'hide'}`}
                    />
                  </p>
                )
              }
            </div>
          </div>
        ))
      }
    </div>
  );
};

ListingsHeaderFilter.propTypes = {
  activeCompany: PropTypes.string,
  activeSearchText: PropTypes.string,
  activeSortDirection: PropTypes.string.isRequired,
  applyFilter: PropTypes.func.isRequired,
  className: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchType: PropTypes.string,
};

ListingsHeaderFilter.defaultProps = {
  activeCompany: '',
  activeSearchText: '',
  className: null,
  searchType: '',
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ListingsHeaderFilter);
