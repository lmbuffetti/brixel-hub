import React from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';
import { BrixelButtonPrimary, BrixelButtonBox } from '@brixel/brixel-components';

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

  const showIntro = () => {
    const idStorageProp = localStorage.getItem('donMediaExplanation') || 0;
    if (documents.length === 0 && floorPlans.length === 0 && photos.length === 0 && idStorageProp !== propID) {
      return true
    }
    return false;
  }

  return (
    <div>
      {
        showIntro() ? (
          <>
            <h5 className="ta-c mt-3 mb-2">Time to upload some media.</h5>
            <p className="max-w-fix-376 m-a ta-c txtDark200 mb-3">Learn how to manage your phtos, floorplans and much more.</p>
            <BrixelButtonPrimary
              label="Show me"
              rounded
              rightIcon="arrow-right"
              className="min-w-fix-216 m-a"
              onClick={() => history.push(`/${propID}/rewards/achievement/media`)}
            />
          </>
        ) : (
          <>
            <div className="dis-f mt-2">
              <BrixelButtonBox
                verticalView
                bgTransparent
                icon={photos.length > 0 ? "check" : "gallery"}
                label="Photos"
                labelClass="fweight-400"
                subtitle={`<span>Upload 1 photo<span>`}
                subtitleClass={`fsize-200 txtDark200 pt-small-6 ${photos.length > 0 ? 'td-lt' : ''}`}
                className={`w-perc-100 mr-1 shadow-1dp brdMedium p-2 brdTrans`}
                colorIcon={photos.length > 0 ? "green400" :  "primary700"}
                backIcon={photos.length > 0 ? "green100" :  "primary100"}
                onClick={() => history.push(`/${propID}/property/photos`)}
                selected
              />
              <BrixelButtonBox
                verticalView
                bgTransparent
                icon={floorPlans.length > 0 ? "check" : "plans"}
                label="Plans"
                labelClass="fweight-400"
                subtitle={`<span>Upload 1 plan</span>`}
                subtitleClass={`fsize-200 txtDark200 pt-small-6 ${floorPlans.length > 0 ? 'td-lt' : ''}`}
                className={`w-perc-100 ml-1 shadow-1dp brdMedium p-2 brdTrans`}
                colorIcon={floorPlans.length > 0 ? "green400" :  "primary700"}
                backIcon={floorPlans.length > 0 ? "green100" :  "primary100"}
                onClick={() => history.push(`/${propID}/property/floorPlans`)}
              />
            </div>
            <div className="dis-f mt-2">
              <BrixelButtonBox
                verticalView
                bgTransparent
                icon="tour"
                label="3D Tour"
                labelClass="fweight-400"
                subtitle={`<span class="txtRed400">Premium Feature<span>`}
                subtitleClass="fsize-200 txtDark200 pt-small-6"
                className={`w-perc-100 mr-1 shadow-1dp brdMedium p-2 brdTrans`}
                colorIcon="primary700"
                backIcon="primary100"
                onClick={() => history.push(`/${propID}/property/tour`)}
                selected
              />
              <BrixelButtonBox
                verticalView
                bgTransparent
                icon={documents.length > 0 ? "check" : "folder"}
                label="Docubox"
                labelClass="fweight-400"
                subtitle={`<span>Upload 1 document</span>`}
                subtitleClass={`fsize-200 txtDark200 pt-small-6 ${documents.length > 0 ? 'td-lt' : ''}`}
                className={`w-perc-100 ml-1 shadow-1dp brdMedium p-2 brdTrans`}
                colorIcon={documents.length > 0 ? "green400" :  "primary700"}
                backIcon={documents.length > 0 ? "green100" :  "primary100"}
                onClick={() => history.push(`/${propID}/property/documents`)}
              />
            </div>
            <h5 className="ta-c mt-3 mb-2">Let’s upload some media.</h5>
            <p className="max-w-fix-376 m-a ta-c txtDark200 mb-3">Upload at least one photo, plan and document to achieve this reward.</p>
            <BrixelButtonPrimary
              label="Edit property"
              rounded
              rightIcon="arrow-right"
              className="min-w-fix-216 m-a"
              onClick={() => history.push(`/${propID}/property/photos`)}
            />
          </>
        )
      }
    </div>
  )
};

MediaRewards.propTypes = {
  documents: Proptypes.arrayOf(Proptypes.object),
  floorPlans: Proptypes.arrayOf(Proptypes.object),
  history: Proptypes.object.isRequired,
  match: Proptypes.object.isRequired,
  photos: Proptypes.arrayOf(Proptypes.object),
}

MediaRewards.defaultProps = {
  totalComplete: 9,
}

const mapStateToProps = (state) => ({
  documents: get(state, 'form.Property.values.documents', []),
  floorPlans: get(state, 'form.Property.values.floorPlans', []),
  photos: get(state, 'form.Property.values.photos', []),
})

export default compose (
  withRouter,
  connect(mapStateToProps, null)
)(MediaRewards);
