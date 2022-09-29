import translateTo from '../../utils/translation';
import React, { useEffect, useState } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CompaniesData } from '../../resources/Companies/Companies';
// import { connect } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';

function PageFooter(props) {
  // const history = {
  //   push: useNavigate(),
  //   location: useLocation(),
  // };
  // PROPS
  const {
    activeSideBar,
    activeSingleCompany,
    className,
    lang,
  } = props;
  // STATE
  const [activeCompanyData, setActiveCompanyData] = useState({});

  useEffect(() => {
    if (CompaniesData[activeSingleCompany.stub]) setActiveCompanyData(CompaniesData[activeSingleCompany.stub].footer);
    else setActiveCompanyData(CompaniesData.default.footer);
  }, [activeSingleCompany.id]);

  return (
    <>
      <footer className={`footerWrap w-perc-100 ${className} ${activeSideBar ? 'leftPadding' : ''}`}>
        <div className="dis-f flex-wrap jc-b p-1 p-sm-2 px-sm-3 brdSmallTop brdAltGrey100">
          {
            get(activeCompanyData, 'logos', []).length > 0 && (
              <div className="dis-f a-c jc-c jc-fs-sm flex-wrap">
                {
                  activeSingleCompany.stub === 'baloise' && <span className="mr-2 fsize-300 txtAltGrey400">{translateTo('Powered by', lang)}</span>
                }
                {
                  activeSingleCompany.stub === 'ubs' && <span className="mr-2 fsize-300 txtAltGrey400">{translateTo('Your partner for financial questions', lang)}</span>
                }
                <div className="h-fix-20 h-fix-lg-24">
                  {
                    get(activeCompanyData, 'logos', []).map((logo, i) => (
                      <img
                        loading="lazy"
                        key={`logo${i.toString()}`}
                        src={logo}
                        alt={`${activeSingleCompany.name} logo ${i}`}
                        className={`${i > 0 ? 'ml-2 brdSmallLeft brdAltGrey300 pl-2' : ''} h-perc-100`}
                      />
                    ))
                  }
                </div>
              </div>
            )
          }
          <div className="dis-f jc-fe flex-wrap">
            {
              get(activeSingleCompany, 'links.privacy', null) && (
                <a
                  href={get(activeSingleCompany, 'links.privacy', null)}
                  className="fsize-300 txtAltGrey400 link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {translateTo('Privacy Policy', lang)}
                </a>
              )
            }
            {
              get(activeSingleCompany, 'links.privacy', null) && (
                <a
                  href={get(activeSingleCompany, 'links.terms', null)}
                  className="ml-2 fsize-300 txtAltGrey400 link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {translateTo('Terms and Conditions', lang)}
                </a>
              )
            }

            <div className="ta-r ml-1">
              <span className="fsize-300 txtAltGrey400">@Brixel {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

PageFooter.propTypes = {
  activeSideBar: PropTypes.bool,
  activeSingleCompany: PropTypes.object.isRequired,
  className: PropTypes.string,
  lang: PropTypes.string.isRequired,
};

PageFooter.defaultProps = {
  activeSideBar: false,
  className: '',
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  lang: get(state, 'common.language', {}),
});

export default connect(mapStateToProps, null)(PageFooter);
