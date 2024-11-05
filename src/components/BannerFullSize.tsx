import React from 'react';
import {translateTo} from '@brixel-io/brixel-components/dist';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import {setWindowDimensions} from '../actions/CommonActions';
import get from 'lodash/get';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

type BannerFullSizeProps = {
  button?: {
    label: string
    iconRight?: string
    iconLeft?: string
    onClick: () => void
    type: 'primary' | 'secondary'
  }
  windowDimensions: { width: number, height: number }
  className?: string
  description?: string[]
  image?: string
  lang: string
  title?: string
  smallIcon?: boolean
  type: 'green' | 'default'
}

const BannerFullSize = ({
  button,
  className,
  description,
  image,
  lang,
  title,
  type,
  smallIcon,
  windowDimensions,
}: BannerFullSizeProps) => {
  const bannerClass = type === 'green' ? 'bgGreen100 brdGreen200 brdSmall' : 'bgWhite brdText200 brdSmall';
  return (
    <div className={`${bannerClass} ${className} dis-fl-col dis-fl-row-lg a-t a-c-lg jc-b p-2 p-lg-3 brdRadius`}>
      {
        image && (
          <img
            src={image}
            alt={title}
            className={`${smallIcon ? 'w-fix-40' : 'w-fix-40 w-fix-md-64'}  mr-2 mb-2 mb-lg-0`}
          />
        )
      }
      <div className={`max-w-fix-576 ml-0 mr-a ${button ? 'mb-2 mb-lg-0' : ''}`}>
        {
          title && (
            <h6 className="fweight-600 fsize-500 mb-1 mt-2 mt-lg-0">{translateTo(title, lang)}</h6>
          )
        }
        {
          description && (
            <div className=''>
              {
                description.map((desc, index) => (
                  <p className="txtText800 fsize-300 pr-2 pr-sm-4 mb-lg-0" key={index}>{translateTo(desc, lang)}</p>
                ))
              }
            </div>
          )
        }
      </div>
      {
        button && (
          <>
            {
              button.type === 'primary' && (
                <BrixelButtonPrimary
                  label={translateTo(button.label, lang)}
                  rounded
                  className='ws-nw'
                  onClick={() => button.onClick()}
                  leftIcon={button.iconLeft}
                  rightIcon={button.iconRight}
                  fullWidth={windowDimensions.width <= 1024}
                />
              )
            }
            {
              button.type === 'secondary' && (
                <BrixelButtonSecondary
                  bgTransparent
                  label={translateTo(button.label, lang)}
                  rounded
                  onClick={() => button.onClick()}
                  leftIcon={button.iconLeft}
                  rightIcon={button.iconRight}
                />
              )
            }
          </>
        )
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', { width: 0, height: 0 }),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(BannerFullSize);
