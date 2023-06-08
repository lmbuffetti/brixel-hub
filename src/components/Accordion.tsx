import React, {lazy, Suspense, useEffect, useState} from 'react';
import type {AccordionType} from '../@types/components/Accordion';

const BrixelIcon =  lazy(() => import('@brixel-io/brixel-components/dist/components/BrixelIcon'));

const Accordion = (props: AccordionType) => {
  const {
    children = '',
    className = '',
    color = 'green',
    contentClass = '',
    isExpanded = false,
    onExpand,
    paddingContent = 'pl-4',
    saturationTxt = 200,
    singleItem = false,
    smallRightIcon = false,
    title = '',
    titleClass = '',
  } = props;

  const [open, setOpen] = useState(isExpanded);

  useEffect(() => {
    setOpen(isExpanded);
  }, [isExpanded]);

  const onClickExpand = (val) => {
    if (onExpand) {
      onExpand(val);
    } else {
      setOpen(val);
    }
  };

  return (
    <Suspense>
      <div
        className={`accordion ${className} ${open ? 'open' : 'close'}`}
      >
        <button
          type="button"
          className={`title ${singleItem ? 'cur-def' : 'cur-poi'} ${titleClass} dis-f a-t`}
          onClick={() => {
            if (!singleItem) onClickExpand(!open);
          }}
        >
          {
            !smallRightIcon && !singleItem && (
              <BrixelIcon
                color="green"
                saturationTxt={200}
                iconWidth="w-fix-24"
                className="mt-small-4 mr-small-8"
                icon={!open ? 'arrow-right' : 'arrow-down'}
              />
            )
          }
          <span className="txtText900">{title}</span>
          {
            smallRightIcon && !singleItem && (
              <BrixelIcon
                color={color}
                saturationTxt={saturationTxt}
                iconWidth="w-fix-24"
                className="mt-small-4 mr-small-8"
                icon={!open ? 'arrow-simple-right' : 'arrow-simple-down'}
              />
            )
          }
        </button>

        <div className={`content ${paddingContent} ${!open ? 'collapsed' : ''}`}>
          <div className={contentClass}>
            {children}
          </div>
        </div>

      </div>
    </Suspense>
  );
};

export default Accordion;
