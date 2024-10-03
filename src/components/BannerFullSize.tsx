import React from 'react';
import {translateTo} from '@brixel-io/brixel-components/dist';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';

type BannerFullSizeProps = {
  button?: {
    label: string
    iconRight?: string
    iconLeft?: string
    onClick: () => void
    type: 'primary' | 'secondary'
  }
  className?: string
  description?: string[]
  image?: string
  lang: string
  title?: string
  type: 'green' | 'default';
}

const BannerFullSize = ({
  button,
  className,
  description,
  image,
  lang,
  title,
  type,
}: BannerFullSizeProps) => {
  const bannerClass = type === 'green' ? 'bgGreen100 brdGreen200 brdSmall' : 'bgWhite brdText200 brdSmall';
  return (
    <div className={`${bannerClass} ${className} dis-f a-c jc-b p-3 brdRadius`}>
      {
        image && (
          <img
            src={image}
            alt={title}
            className="mr-3"
          />
        )
      }
      <div className="max-w-fix-576 ml-0 mr-a">
        {
          title && (
            <h6 className="fweight-600 fsize-500 mb-1">{translateTo(title, lang)}</h6>
          )
        }
        {
          description && (
            <div>
              {
                description.map((desc, index) => (
                  <p className="txtText800" key={index}>{translateTo(desc, lang)}</p>
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
                  onClick={() => button.onClick()}
                  leftIcon={button.iconLeft}
                  rightIcon={button.iconRight}
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

export default BannerFullSize;
