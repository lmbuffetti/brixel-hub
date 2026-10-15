import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import get from 'lodash/get';
import { BrixelButtonIcon, BrixelButtonSecondary, useOutsideAlerter } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import { change } from '@brixel-io/brixel-components/dist/form';
import { ReactSortable } from 'react-sortablejs';
import cloneDeep from 'lodash/cloneDeep';
import { diff } from 'deep-object-diff';
import { deleteImg, reorderImages } from '../../../actions/UploadActions';
import DetailMedia from './DetailMedia';
import uploadFloorPlansEmpty from '../../../images/Upload/upload_floorPlans_empty.svg';
import { checkBrowser, Truncate } from '../../../utils/helpers';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';
import getUrlImg from '@brixel-io/brixel-components/dist/utils/ImageUrl';
import SectionMobileTitle from '../../../components/SectionMobileTitle';
import { spinnerSmall } from '../../../actions/CommonActions';
import multiUpload from '@brixel-io/brixel-components/dist/helpers/uploads/MultiUpload';
import { getActiveSingleProperty } from '../../../actions/PropertyActions';
const Plans = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleProperty, changeFieldValue, formValue, handleDeleteImg, handleChangeOrder, handleSpinnerSmall, handleGetActiveSingleProperty, isSmallLoading, lang, windowDimensions, } = props;
    const { floorPlans } = formValue;
    // STATE
    const [fixPhotos, setFixPhotos] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [btnActive, setBtnActive] = useState();
    const [newImages, setNewImages] = useState([]);
    const [isReady, setIsReady] = useState(false);
    // GET URL PARAMS
    const propID = get(match, 'propID', null);
    // REF
    // eslint-disable-next-line no-unused-vars
    const arrayImg = [...Array(floorPlans ? floorPlans.length : 0)].map(() => React.createRef());
    const wrappImg = useRef(arrayImg);
    // COMPARE FLOOR PLANS AND fixPhotos TO ADD THE PREVIEW FLOOR PLANS ON UPLOADING
    useEffect(() => {
        if (floorPlans && Object.keys(diff(floorPlans, fixPhotos)).length > 0 && !isSmallLoading.uploadMedia) {
            setNewImages([]);
            setConfirmDelete(null);
            setBtnActive(undefined);
            const defPhotos = (floorPlans ? cloneDeep(floorPlans) : []);
            setFixPhotos(defPhotos);
        }
    }, [floorPlans, isSmallLoading]);
    // FUNCTION TO DELETE FLOOR PLAN
    const deleteImage = (id) => {
        const data = {
            photoID: id,
            pageID: propID,
            type: 'floorPlan',
            smallLoader: 'deleteMedia',
        };
        // eslint-disable-next-line no-alert
        handleDeleteImg(data);
    };
    // DROPZONE SETTINGS
    const onDrop = async (acceptedFiles) => {
        if (activeSingleProperty.id) {
            handleSpinnerSmall({ uploadMedia: true });
            multiUpload(acceptedFiles, 'floorPlanImage', { pageID: activeSingleProperty.id, companyID: '' })
                .then(() => {
                handleGetActiveSingleProperty({
                    id: activeSingleProperty.id,
                    smallLoader: 'uploadMedia',
                });
            });
        }
    };
    // DROPZONE SETTINGS - SUPPORTED EXTENSIONS AND MAX SIZE AND OTHER SETTINGS
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg', '.jpeg'],
            'application/pdf': ['.pdf'],
        },
        minSize: 0,
        maxSize: 1e+7,
    });
    // ORDER IMAGE SETTINGS
    const changeOrder = (order) => {
        const imgArray = [];
        // eslint-disable-next-line array-callback-return
        order.map((item) => {
            if (item.createdAt) {
                delete item.chosen;
                delete item.selected;
                imgArray.push(item);
            }
            return null;
        });
        if (formValue.floorPlans) {
            const idPhotos = imgArray.map((item) => item.id);
            const idOriginalPhotos = formValue.floorPlans.map((item) => item.id);
            const difference = idOriginalPhotos.toString() !== idPhotos.toString();
            if (difference) {
                changeFieldValue('photos', imgArray);
                const data = {
                    pageID: activeSingleProperty.id,
                    type: 'floorPlan',
                    data: {
                        floorPlanIds: idPhotos,
                    },
                    smallLoader: 'reorderImg',
                };
                handleChangeOrder(data);
            }
        }
    };
    // FUCNTION FOR REAL DELETE
    const onConfirmDelete = (id) => {
        setBtnActive('delete');
        setConfirmDelete(id);
    };
    // CLICK OUTSIDE OF IMAGES
    useOutsideAlerter(wrappImg, {
        id: confirmDelete || 0,
        action: 'function',
        func: () => { setConfirmDelete(null); },
    });
    const scrollToTopEdit = () => {
        const scrollEl = document.getElementsByClassName('hubDasContent')[0];
        if (checkBrowser() > 0 && scrollEl) {
            scrollEl.scrollTop = 0;
        }
        else if (scrollEl) {
            scrollEl.scrollTo({ top: 10, behavior: 'smooth' });
        }
    };
    setTimeout(() => { setIsReady(true); }, 200);
    return (React.createElement(React.Fragment, null, isReady ? (React.createElement(React.Fragment, null,
        React.createElement("h3", { className: "mb-3 hide dis-b-lg" }, translateTo('Floor Plans', lang)),
        React.createElement("div", { className: "plansWrapper dis-f" },
            React.createElement("div", { className: "secondLevel dis-fl-col" },
                React.createElement(SectionMobileTitle, { title: "Floor Plans" }),
                (!fixPhotos || (fixPhotos && fixPhotos.length === 0)) && (React.createElement("span", { className: 'mb-3 mb-md-5 txtRed400' }, translateTo('You have uploaded 0 plans.', lang))),
                React.createElement("div", { className: `boxCard mb-5 ${(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? 'emptyMedia' : ''}` },
                    React.createElement("div", { className: `${fixPhotos && fixPhotos.length > 0 ? 'uploadPanel dis-fl-col' : 'empty-state dis-fl-col a-c'}` },
                        React.createElement(React.Fragment, null,
                            (!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? ('') : (React.createElement(React.Fragment, null,
                                React.createElement("p", { className: 'fweight-600' },
                                    translateTo('Drag the files to move and rearrange', lang),
                                    " "),
                                React.createElement("p", { className: 'fsize-300 txtText400 mb-2' },
                                    translateTo('Choose the order you like', lang),
                                    " "))),
                            React.createElement("div", { className: `${(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? 'emptyState' : 'hasImages bgGreen50 mb-3 py-2'} upload-container dis-fl-col a-c ta-c`, ...getRootProps() },
                                React.createElement("input", { ...getInputProps() }),
                                React.createElement("div", { className: `dis-fl-col ${(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? 'max-w-fix-304' : ''}` },
                                    isSmallLoading.uploadMedia ? (React.createElement(React.Fragment, null,
                                        React.createElement("div", { className: `${!fixPhotos || (fixPhotos && fixPhotos.length === 0) ? 'h-fix-128' : 'h-fix-64'} dis-f a-c` },
                                            React.createElement("div", { className: 'loaderX ml-a mr-a' },
                                                React.createElement("div", { className: 'loader-wheel' }))))) : (React.createElement(React.Fragment, null,
                                        React.createElement("img", { loading: "lazy", className: !fixPhotos || (fixPhotos && fixPhotos.length === 0) ? 'h-fix-128' : 'h-fix-64', src: uploadFloorPlansEmpty, alt: "Empty State" }))),
                                    React.createElement("p", { className: "mt-2 txtGreen400" },
                                        React.createElement("span", { className: 'td-u fweight-500' }, translateTo('Click to upload', lang)),
                                        React.createElement("span", null,
                                            " ",
                                            translateTo('or drag and drop files here', lang))),
                                    (!fixPhotos || (fixPhotos && fixPhotos.length === 0)) && (React.createElement("span", { className: 'brdSmallTop brdText100 w-fix-104 my-2 ml-a mr-a' })),
                                    React.createElement("span", { className: "fsize-300 txtText400 max-width-304" }, translateTo('All standard formats are supported, with a maximum file size of 10 MB', lang))))),
                        (fixPhotos && fixPhotos.length > 0) && (React.createElement(React.Fragment, null,
                            React.createElement(ReactSortable, { scroll: true, bubbleScroll: true, tag: "ul", className: "image-list row-cols-2-gut-1 row-cols-lg-3-gut-1", list: cloneDeep(fixPhotos).concat(newImages), setList: (order) => {
                                    changeOrder(order);
                                } },
                                fixPhotos.filter((img) => img.url).map((item, i) => (React.createElement("li", { className: "cur-poi pos-r", "data-id": JSON.stringify(item), key: `pht_${i.toString()}` },
                                    React.createElement("div", { className: "square media-image-container dis-fl-row a-c jc-b w-perc-100 shadow-2dp brdRadius ov-h", onClick: () => (windowDimensions.width < 1025 ? history.push(`/${propID}/property/floorPlans/${item.id}/edit/floorPlans`) : '') },
                                        React.createElement("div", { className: "w-perc-100 square dis-fl-row imgConver", style: { backgroundImage: `url(${getUrlImg(item.url, { size: 'M' })})` } },
                                            React.createElement("div", { className: `photo-action a-c hide dis-f-md ${confirmDelete === i ? 'show' : 'hoverShow'}`, ref: wrappImg.current[i] },
                                                React.createElement(BrixelButtonSecondary, { rounded: true, theme: "red", rightIcon: "bin", label: translateTo('delete?', lang), className: `${confirmDelete === i ? '' : 'hide'}`, onClick: () => deleteImage(item.id), isLoading: isSmallLoading.deleteMedia && btnActive === 'delete' }),
                                                React.createElement(BrixelButtonIcon, { ghost: true, theme: "red", icon: "bin", className: `${confirmDelete === i ? 'hide' : ''}`, onClick: () => onConfirmDelete(i) }),
                                                React.createElement(BrixelButtonIcon, { ghost: true, icon: "edit", className: `ml-1 ${confirmDelete === i ? 'hide' : ''}`, onClick: () => {
                                                        history.push(`/${propID}/property/floorPlans/${item.id}/edit/floorPlans`);
                                                        scrollToTopEdit();
                                                    } })))),
                                    item.description && (React.createElement("p", { className: "ta-l mt-1 fsize-200 txtText900 w-prec-100" }, translateTo(Truncate(item.description, 60), lang)))))),
                                newImages.filter((img) => img.url).map((upImg, i) => (React.createElement("li", { className: "cur-poi pos-r", key: (fixPhotos.length + i).toString(), "data-id": JSON.stringify(fixPhotos[0]) }, isSmallLoading.uploadMedia && (React.createElement("div", { className: "square media-image-container dis-fl-row a-c jc-b w-perc-100 shadow-2dp brdRadius ov-h" },
                                    React.createElement("div", { className: "perc-r w-perc-100 square dis-fl-row imgConver", style: { backgroundImage: upImg.url } }))))))))))),
                get(activeSingleProperty, 'servicePackages', []).length === 0 && (React.createElement(BrixelUpgradeMessage, { lang: lang, unlockFunction: false, title: translateTo('You don\'t have a plan?', lang), description: translateTo('Accurate floor plans are important for your potential buyers. Request a free photo shooting by one of our experts to get your own plan.', lang), btnLabel: translateTo('Request photo shoot', lang), redirectUrl: `/${activeSingleProperty.id}/trialRequest`, trialRequest: true }))),
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/:imgId/edit/:editType", element: React.createElement(DetailMedia, null) }),
                React.createElement(Route, { path: "*", element: null }))))) : (React.createElement("div", { className: "secondLevel dis-fl-col" },
        React.createElement("div", { className: "max-w-fix-1024 mt-10 pt-1 pt-lg-0 mt-lg-0 h-perc-100" },
            React.createElement("p", { className: "h-fix-24 h-fix-lg-40 mb-3 skeletonBg w-perc-15" }, " "),
            React.createElement("div", { className: 'w-perc-100 brdRadius skeletonBg h-fix-400' }),
            React.createElement("div", { className: 'w-perc-100 mt-5 brdRadius skeletonBg h-fix-296' }))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    formValue: get(state, 'brixelForm.Property.values', {}),
    imageType: get(state, 'images.imageType', []),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('Property', field, value));
    },
    handleChangeOrder: bindActionCreators(reorderImages, dispatch),
    handleDeleteImg: bindActionCreators(deleteImg, dispatch),
    handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
    handleSpinnerSmall: bindActionCreators(spinnerSmall, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Plans);
