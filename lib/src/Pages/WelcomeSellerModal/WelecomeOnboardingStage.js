import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import { BrixelButtonPrimary, FactsOptions } from '@brixel-io/brixel-components';
import translateTo from '../../utils/translation';
import { BrixelRadioButton, change } from '@brixel-io/brixel-components/dist/form';
import ApartmentImg from '../../images/welcomeOnboarding/apartment.svg';
import HouseImg from '../../images/welcomeOnboarding/house.svg';
import BuildingLandImg from '../../images/welcomeOnboarding/buildingLand.svg';
import CommercialImg from '../../images/welcomeOnboarding/commercial.svg';
const { factsOptions } = FactsOptions;
const WelecomeOnboardingStage = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const [step, setStep] = useState(1);
    const [imgProperty, setImgProperty] = useState(null);
    const { activeSingleProperty, changeFieldValue, lang, } = props;
    const onChangeStep = () => {
        setStep(step + 1);
        history.push(`/packageFlow/${activeSingleProperty.id}/welcomeSeller/${factsOptions.progressBarOptions[0].value}/step${step + 1}`);
    };
    useEffect(() => {
        if (activeSingleProperty?.properties?.propertyType) {
            let img;
            switch (activeSingleProperty.properties.propertyType) {
                case 'Apartment':
                    img = ApartmentImg;
                    break;
                case 'House':
                    img = HouseImg;
                    break;
                case 'Commercial':
                    img = CommercialImg;
                    break;
                case 'Building land':
                    img = BuildingLandImg;
                    break;
                default:
                    img = null;
            }
            setImgProperty(img);
        }
    }, [activeSingleProperty]);
    const onChange = (val) => {
        switch (val) {
            case 'testDrive':
                changeFieldValue('scanFlow', 'analysis', 'on-site');
                changeFieldValue('scanFlow', 'bookType', 'online');
                history.push(`/${activeSingleProperty.id}/trialRequest/on-site?url=/${activeSingleProperty.id}/home`);
                break;
            case 'overview':
                history.push(`/${activeSingleProperty.id}/home`);
                break;
            case 'discuss':
                changeFieldValue('scanFlow', 'analysis', 'remote');
                changeFieldValue('scanFlow', 'bookType', 'whereby');
                history.push(`/${activeSingleProperty.id}/trialRequest/remote?url=/${activeSingleProperty.id}/home`);
                break;
            default:
                return null;
        }
    };
    switch (step) {
        case 1:
            return (React.createElement("div", { className: "multiFieldWrap w-perc-100" },
                React.createElement("div", { className: "dis-f jc-b h-perc-100 a-c" },
                    React.createElement("div", { className: "dis-fl-col jc-c a-c w-perc-100 pos-r pt-2" },
                        imgProperty && (React.createElement("img", { loading: "lazy", width: 315, src: imgProperty, alt: activeSingleProperty.title })),
                        React.createElement("p", { className: "txtText900 mt-4 mt-sm-7 fweight-600 fsize-600 fsize-sm-700 max-w-fix-424 mx-a" },
                            React.createElement("span", null, translateTo('Great.', lang)),
                            React.createElement("span", { className: "mx-small-4" },
                                "\u201C",
                                activeSingleProperty.title,
                                "\u201D"),
                            React.createElement("span", null, translateTo('is ready.', lang))),
                        React.createElement("p", { className: "mt-3 txtBlack max-w-fix-448 m-a fweight-400 fsize-500 fsize-sm-600" }, translateTo('Are you ready too?', lang)),
                        React.createElement(BrixelButtonPrimary, { type: "submit", className: "mx-a mt-5", rounded: true, label: translateTo('Yes, let\'s go.', lang), rightIcon: "arrow-right-small", onClick: () => onChangeStep() })))));
        case 2:
            return (React.createElement("div", null,
                React.createElement("div", { className: "ta-c mb-6" },
                    React.createElement("h3", { className: "fweight-600 txtText900" }, translateTo('Choose your next step', lang))),
                React.createElement(BrixelRadioButton, { className: "radioBtnImg", label: "", icons: true, cardLayout: true, stretched: true, pdClass: "py-1 pb-sm-3 pt-sm-4", isHorizontal: true, disableDelay: true, options: [
                        {
                            color: 'blue',
                            img: '',
                            label: translateTo('Because you would not buy a car without driving it.', lang),
                            title: translateTo('Test drive our service', lang),
                            value: 'testDrive',
                        },
                        {
                            color: 'blue',
                            img: '',
                            label: translateTo('For all the explorers who like to click things.', lang),
                            title: translateTo('Explore the tool on your own', lang),
                            value: 'overview',
                        },
                        {
                            color: 'blue',
                            img: '',
                            label: translateTo('Yes, a real human expert who is happy to help.', lang),
                            title: translateTo('Talk to a human', lang),
                            value: 'discuss',
                        },
                    ], input: {
                        name: 'userType',
                        onChange: (val) => onChange(val),
                    } })));
        default:
            return null;
    }
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(form, field, value) {
        dispatch(change(form, field, value));
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(WelecomeOnboardingStage);
