import React from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';
import { BrixelButtonPrimary, BrixelButtonBox } from '@brixel/brixel-components';
import uploadMedia from '../../../images/secondLevel/uploadMedia.svg';

const MediaRewards = (props) => {
  const {
    documents,
    floorPlans,
    history,
    match,
    photos,
  } = props;
  // PARAMS URL
  const propID = get(match, 'params.propId', '');

  // FUNCTION TO SHOW/HIDE THE INTRO
  const showIntro = () => {
    const idStorageProp = localStorage.getItem('donMediaExplanation') || 0;
    if (documents.length === 0 && floorPlans.length === 0 && photos.length === 0 && idStorageProp !== propID) {
      return false;
    }
    return false;
  };

  return (
    <main id="rewards" className="w-perc-100 h-perc-100 dis-fl-col a-c">
      {
        showIntro() ? (
          <>
            <div className="dis-fl-col a-c">
              <h5 className="ta-c mb-2">Time to upload some media.</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300">Learn how to manage your photos, floorplans and much more.</p>
              <div className="ta-c my-5">
                <img className="h-fix-120" src={uploadMedia} alt="Done Market Check" />
              </div>
            </div>
            <div>
              <BrixelButtonPrimary
                label="Show me"
                rounded
                rightIcon="arrow-right"
                className="m-a"
                onClick={() => history.push(`/${propID}/rewards/achievement/media`)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="dis-fl-col a-c">
              <div>
                <h5 className="ta-c mb-2">Let’s upload some media.</h5>
                <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300">Upload at least one photo, plan and document to achieve this reward.</p>
                <div className="dis-f m-a mt-5 max-w-fix-376">
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon={photos.length > 0 ? 'check' : 'gallery'}
                    label="Photos"
                    labelClass="fweight-400"
                    subtitle="<span>Upload 1 photo<span>"
                    subtitleClass={`fsize-200 txtDark200 pt-small-6 ${photos.length > 0 ? 'td-lt' : ''}`}
                    className="w-perc-100 mr-1 shadow-1dp brdMedium p-2 brdTrans"
                    colorIcon={photos.length > 0 ? 'green400' : 'primary700'}
                    backIcon={photos.length > 0 ? 'green100' : 'primary100'}
                    onClick={() => history.push(`/${propID}/property/photos`)}
                    selected
                  />
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon={floorPlans.length > 0 ? 'check' : 'plans'}
                    label="Plans"
                    labelClass="fweight-400"
                    subtitle="<span>Upload 1 plan</span>"
                    subtitleClass={`fsize-200 txtDark200 pt-small-6 ${floorPlans.length > 0 ? 'td-lt' : ''}`}
                    className="w-perc-100 ml-1 shadow-1dp brdMedium p-2 brdTrans"
                    colorIcon={floorPlans.length > 0 ? 'green400' : 'primary700'}
                    backIcon={floorPlans.length > 0 ? 'green100' : 'primary100'}
                    onClick={() => history.push(`/${propID}/property/floorPlans`)}
                  />
                </div>
                <div className="dis-f m-a mt-2 max-w-fix-376">
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon="tour"
                    label="3D tour"
                    labelClass="fweight-400"
                    subtitle={'<span class="txtRed400">Premium Feature<span>'}
                    subtitleClass="fsize-200 txtDark200 pt-small-6"
                    className="w-perc-100 mr-1 shadow-1dp brdMedium p-2 brdTrans"
                    colorIcon="primary700"
                    backIcon="primary100"
                    onClick={() => history.push(`/${propID}/property/tour`)}
                    selected
                  />
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon={documents.length > 0 ? 'check' : 'folder'}
                    label="Docubox"
                    labelClass="fweight-400"
                    subtitle="<span>Upload 1 document</span>"
                    subtitleClass={`fsize-200 txtDark200 pt-small-6 ${documents.length > 0 ? 'td-lt' : ''}`}
                    className="w-perc-100 ml-1 shadow-1dp brdMedium p-2 brdTrans"
                    colorIcon={documents.length > 0 ? 'green400' : 'primary700'}
                    backIcon={documents.length > 0 ? 'green100' : 'primary100'}
                    onClick={() => history.push(`/${propID}/property/documents`)}
                  />
                </div>

              </div>
            </div>
          </>
        )
      }
    </main>
  );
};

MediaRewards.propTypes = {
  documents: Proptypes.arrayOf(Proptypes.object).isRequired,
  floorPlans: Proptypes.arrayOf(Proptypes.object).isRequired,
  history: Proptypes.object.isRequired,
  match: Proptypes.object.isRequired,
  photos: Proptypes.arrayOf(Proptypes.object).isRequired,
};

MediaRewards.defaultProps = {
};

const mapStateToProps = (state) => ({
  documents: get(state, 'brixelForm.Property.values.documents', []),
  floorPlans: get(state, 'brixelForm.Property.values.floorPlans', []),
  photos: get(state, 'brixelForm.Property.values.photos', []),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(MediaRewards);
