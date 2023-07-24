import React, {useState} from 'react';
import get from 'lodash/get';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {BrixelButtonIcon, BrixelImage} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import {setModal} from '../../../actions/CommonActions';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';
import type {TourType} from '../../../@types/Pages/SingleProperty/Media/Tour';
import SectionMobileTitle from '../../../components/SectionMobileTitle';

const Tour = (props: TourType) => {
  // PROPS
  const {
    formValue,
    lang,
    handleSetModal,
  } = props;
  // URL PARAMS
  const [isReady, setIsReady] = useState(false);

  const open3dTour = (url: string | null = null) => {
    const urlTour = url || `https://my.matterport.com/show/?m=${get(formValue, 'virtual.matterport', null)}&help=0&hl=2&nt=1&play=1&brand=0&mls=2&wh=0`
    handleSetModal({
      state: true,
      small: true,
      layout: 'fullscreen',
      body: `<iframe
                            class="matterportIframeModal"
                            width="100%"
                            height="100%"
                            src="${urlTour}"
                            allow="vr"
                            frameBorder="0"
                            allowFullScreen
                            title={get(formValue, 'virtual.matterport', null)}
                          />`,
    })
  }
  setTimeout(() => {setIsReady(true)}, 200);
  return (
    <>
      {
        isReady ? (
          <>
            <h3 className="mb-3 hide dis-b-lg">{translateTo('3D tour', lang)}</h3>
            <div className="tourWrapper h-perc-lg-100">
              <div className="secondLevel dis-fl-col">
                <SectionMobileTitle
                  title="3d Tour"
                />
                {
                  get(formValue, 'virtual.matterport', null) ? (
                    <div className="tour boxCard mb-5">
                      <div className="pos-r brdRadius ov-h max-h-fix-344">
                        {
                          get(formValue, 'virtual.matterport', null) && (
                            <BrixelImage
                              loading="lazy"
                              className="dis-b w-perc-100"
                              url={get(formValue, 'coverPhoto.url', '')}
                              alt="Cover"
                              size="L"
                            />
                          )
                        }
                        <div className="pos-a w-perc-100 h-perc-100 bgBlack opacity5" />
                        <div className="pos-a xy-c">
                          <BrixelButtonIcon
                            ghost
                            icon="play-fill"
                            className="m-a opacity8"
                            onClick={() => open3dTour(null)}
                          />
                          <p className="ta-c txtWhite mt-2">{translateTo('Start 3D tour', lang)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="tour brixel-upgrade-message rewardsSplash">
                      <BrixelUpgradeMessage
                        lang={lang}
                        onOpentour={(url) => open3dTour(url)}
                        unlockFunction={false}
                        title={translateTo('Do you want a 3D tour for your property?', lang)}
                        description={translateTo('A 3D tour helps you to avoid unnecessary showings and increases the attention of your property in the market. Request a free scan by one of our experts to get your own tour.', lang)}
                        btnLabel={translateTo('Request scan', lang)}
                        redirectUrl={`/${formValue.id}/trialRequest`}
                        virtualTour="https://my.matterport.com/show/?m=ctWod3ggrZi&help=0&hl=2&nt=1&play=1&brand=0&mls=2&mt=0&wh=0"
                        trialRequest
                      />
                    </div>
                  )
                }
              </div>
            </div>
          </>
        ) : (
          <div className="secondLevel dis-fl-col">
            <div className="max-w-fix-1024 mt-10 pt-1 pt-lg-0 mt-lg-0 h-perc-100">
              <p className="h-fix-24 h-fix-lg-40 mb-3 skeletonBg w-perc-15"> </p>
              <div className='w-perc-100 mt-1 brdRadius skeletonBg h-perc-100'/>
            </div>
          </div>
        )
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser', { }),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Tour);
