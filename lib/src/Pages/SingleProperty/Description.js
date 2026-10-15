import React, { useEffect, useState } from 'react';
import { BrixelButtonIcon, BrixelButtonText, BrixelIcon, BrixelProgressBar, Helpers } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import last from 'lodash/last';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setPageData } from '../../actions/CommonActions';
import { InputSheets } from '../../resources/SingleProperty/inputSheets';
import { checkBrowser } from '../../utils/helpers';
import translateTo from '../../utils/translation';
// COMPONENTS
import FactsQuestion from './FactsQuestion';
import SectionMobileTitle from '../../components/SectionMobileTitle';
const Description = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const { formValue, handleSaveData, lang, windowDimensions, } = props;
    // STATE
    const Questions = InputSheets('description', lang);
    const [selectedQuest, setSelectedQuest] = useState();
    const [isReady, setIsReady] = useState(false);
    // PARAMS URL
    const propID = get(match, 'propID', null);
    const getFact = () => last(history.location.pathname.split('/'));
    // FUNCTION TO CHECK IF MAIN SECTION IS FINISH OR NOT
    const checkSectionDone = (val, act = 'section') => {
        let sectionDone = true;
        val.inputs.map((item) => {
            if (item.validation) {
                const nameCondition = get(item, 'condition.name', '');
                const valA = get(formValue, nameCondition, 'a');
                if (item.conditions) {
                    item.conditions.map((cond) => {
                        if (sectionDone) {
                            const valB = get(formValue, cond.name, 'a');
                            if (valB === cond.value && (get(formValue, item.name, 'ayc') === 'ayc' || get(formValue, item.name, 'ayc') === null))
                                sectionDone = false;
                        }
                        return null;
                    });
                }
                else if (sectionDone && (!item.condition || (item.condition && valA === item.condition.value))) {
                    if (get(formValue, `inputSheet.skipSection[${item.name}]`, true) !== true) {
                        sectionDone = false;
                    }
                    else if (get(formValue, item.name, 'ayc') === 'ayc' || get(formValue, item.name, 'ayc') === null) {
                        sectionDone = false;
                    }
                }
            }
            else if (Helpers.isEmpty(get(formValue, item.name, '')))
                sectionDone = false;
            return null;
        });
        if (act === 'section')
            return sectionDone;
        return null;
    };
    // ON CHANGE HISTORY SELECT THE CORRECT QUESTIONS
    useEffect(() => {
        if (history && !selectedQuest && getFact() !== 'facts') {
            const quest = Questions.find((item) => item.history === getFact());
            setSelectedQuest(quest);
        }
        else if (getFact() === 'facts') {
            setSelectedQuest(undefined);
        }
    }, [history, getFact()]);
    // ON CLICK SELECT THE RIGHT QUESTIONS AND CHANGE THE URL
    const onSelectQuest = (quest) => {
        // TODO
        setTimeout(() => {
            history.push(`/${propID}/property/facts/${quest.history}`);
            setSelectedQuest(quest);
        }, 0);
    };
    // FUNCTION TO GO TO NEXT QUESTIONS LIST
    const onNextSection = (act = '') => {
        const findCurrentId = Questions.findIndex((quest) => quest.history === get(selectedQuest, 'history', null));
        if (findCurrentId > -1 && Questions[findCurrentId + 1]) {
            if (act === 'label') {
                return Questions[findCurrentId + 1].title || '';
            }
            if (act === 'click') {
                onSelectQuest(Questions[findCurrentId + 1]);
                const scrollElement = document.getElementById('bodyScroll');
                const scrollElementMobile = document.getElementById('factsQuestion');
                if (checkBrowser() > 0) {
                    if (scrollElement && scrollElement.scrollTop)
                        scrollElement.scrollTop = 0;
                    if (scrollElementMobile && scrollElementMobile.scrollTop)
                        scrollElementMobile.scrollTop = 0;
                }
                else {
                    if (scrollElement && scrollElement.scrollTo)
                        scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
                    if (scrollElementMobile && scrollElementMobile.scrollTo)
                        scrollElementMobile.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
            handleSaveData('saveFacts');
        }
        return null;
    };
    setTimeout(() => { setIsReady(true); }, 300);
    return (React.createElement(React.Fragment, null, isReady ? (React.createElement(React.Fragment, null,
        React.createElement("h3", { className: "mb-3 hide dis-b-lg" }, translateTo('Facts', lang)),
        React.createElement("div", { className: "dis-f h-perc-lg-100" },
            React.createElement("div", { className: `secondLevel w-perc-100 h-perc-lg-100 ${getFact() !== 'facts' && windowDimensions.width >= 1024 ? 'hide' : 'dis-fl-col'}` },
                React.createElement(SectionMobileTitle, { title: "Facts" }),
                React.createElement("div", { className: "boxCard flex-1" },
                    React.createElement("div", { className: "dis-fl-col" },
                        React.createElement("div", { className: "mt-0 mb-3" },
                            React.createElement(BrixelProgressBar, { rounded: true, saturation: 700, large: true, barBackground: "Red", backgroundSaturation: 100, progressValue: get(formValue, 'inputSheet.totalComplete', 0) }),
                            React.createElement("h6", { className: "mt-1 ff-mono txtPrimary700" },
                                React.createElement("span", { className: "notranslate" },
                                    get(formValue, 'inputSheet.totalComplete', 0),
                                    "%"),
                                React.createElement("span", null, "\u00A0"),
                                React.createElement("span", null, translateTo('complete', lang)))),
                        React.createElement("div", { className: "inputSheet" }, Questions.map((quest, i) => (React.createElement("button", { type: "button", className: `dis-b w-perc-100 accordWrap cur-poi ${selectedQuest && selectedQuest.history === quest.history ? 'active' : ''}`, key: `qst_${i.toString()}`, onClick: () => onSelectQuest(quest), "aria-label": quest.title },
                            React.createElement("div", { className: "accordControl dis-f a-c jc-b py-small-14" },
                                React.createElement("div", { className: "accordTitle dis-f a-c" },
                                    React.createElement(BrixelIcon, { icon: "check", color: "green", saturationTxt: 400, className: `${checkSectionDone(quest) ? 'opacity10' : 'opacity0'} mx-1 dis-b fsize-400` }),
                                    React.createElement("h4", { className: `body ml-1 fweight-400 ${checkSectionDone(quest) ? 'txtText600 td-lt' : 'txtText600'}`, dangerouslySetInnerHTML: { __html: translateTo(quest.title || '', lang) } })),
                                React.createElement(BrixelIcon, { className: "fsize-400 mr-1 onHover", icon: "arrow-simple-right", color: "text", saturationTxt: 200 }))))))))),
            selectedQuest && getFact() !== 'facts' && (React.createElement("div", { className: "dis-f w-perc-100" },
                React.createElement(BrixelButtonIcon, { className: "hide dis-b-md", icon: "arrow-left-small", bgTransparent: true, theme: "text", onClick: () => history.push(`/${propID}/property/facts`) }),
                React.createElement("div", { className: "thirdLevel inputSheet dis-fl-col w-perc-100 ml-lg-2", id: "factsQuestion" },
                    React.createElement("div", { className: "boxCard" },
                        React.createElement("div", { className: "" },
                            selectedQuest && (React.createElement(FactsQuestion, { quest: selectedQuest })),
                            React.createElement("div", { className: "dis-f jc-fe mb-1" }, onNextSection('label') && (React.createElement(BrixelButtonText, { rightIcon: "arrow-right", onClick: () => onNextSection('click'), label: onNextSection('label') || '' }))))))))))) :
        (React.createElement("div", { className: "secondLevel dis-fl-col w-perc-100 h-perc-lg-100" },
            React.createElement("div", { className: "max-w-fix-1024 mt-10 pt-1 pt-lg-0 mt-lg-0 h-perc-100" },
                React.createElement("p", { className: "h-fix-24 h-fix-lg-40 mb-3 skeletonBg w-perc-15" }, " "),
                React.createElement("div", { className: 'w-perc-100 brdRadius skeletonBg h-perc-100' }))))));
};
const mapStateToProps = (state) => ({
    errorValue: get(state, 'brixelForm.Property.syncErrors', {}),
    formValue: get(state, 'brixelForm.Property.values', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    activeSingleUser: get(state, 'user.activeSingleUser', {}),
    singleUserPropertyList: get(state, 'property.singleUserPropertyList', []),
    notification: get(state, 'common.notification', []),
    initial: get(state, 'brixelForm.Property.initial', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleSaveData: bindActionCreators(setPageData, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Description);
