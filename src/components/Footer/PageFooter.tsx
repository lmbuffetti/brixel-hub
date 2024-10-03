import get from 'lodash/get';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {CompaniesData} from '../../resources/Companies/Companies';
import translateTo from '../../utils/translation';
import type {PageFooterType} from '../../@types/components/Footer/PageFooter';

function PageFooter(props: PageFooterType) {
  // PROPS
  const {
    activeSideBar = false,
    activeSingleCompany,
    className = '',
    lang,
    translations,
  } = props;
  // STATE
  const [activeCompanyData, setActiveCompanyData] = useState({});

  useEffect(() => {
    if (CompaniesData[activeSingleCompany.stub]) setActiveCompanyData(CompaniesData[activeSingleCompany.stub].footer);
    else setActiveCompanyData(CompaniesData.default.footer);
  }, [activeSingleCompany.id, translations]);

  return (
    <>
      <footer className={`footerWrap w-perc-100 ${className} ${activeSideBar ? 'leftPadding' : ''}`}>
        <div className="dis-f flex-wrap jc-b p-1 p-sm-2 px-sm-3 brdSmallTop brdText50">
          {
            activeSingleCompany.stub === 'brixel_boutique' ? (
              <div>
                <span className="fsize-300 txtText400">{translateTo('Boutique is part of', lang)}</span>
                <a href="https://brixel.ch" className="fsize-300 txtText400 link ml-small-4 td-u" target="_blank" rel="noreferrer">
                  Brixel
                </a>
              </div>
            ) : (
              <>
                {
                  get(activeCompanyData, 'logos', []).length > 0 && (
                    <div className="dis-f a-c jc-c jc-fs-sm flex-wrap">
                      {
                        activeSingleCompany.stub === 'baloise' && <span className="mr-2 fsize-300 txtText400">{translateTo('Powered by', lang)}</span>
                      }
                      {
                        activeSingleCompany.stub === 'ubs' && <span className="mr-2 fsize-300 txtText400">{translateTo('Your partner for financial questions', lang)}</span>
                      }
                      <div className="h-fix-20 min-h-fix-16 h-fix-lg-24 dis-f">
                        {
                          get(activeCompanyData, 'logos', []).map((logo, i) => (
                            <img
                              loading="lazy"
                              key={`logo${i.toString()}`}
                              src={logo}
                              alt={`${get(activeSingleCompany, 'name', '')} logo ${i}`}
                              className={`min-h-fix-16 ${i > 0 ? 'ml-2 brdSmallLeft brdText200 pl-2' : ''} h-perc-100`}
                            />
                          ))
                        }
                      </div>
                    </div>
                  )
                }
              </>
            )
          }
          <div className="dis-f jc-fe flex-wrap">
            {
              get(activeSingleCompany, 'links.privacy', null) && (
                <a
                  href={get(activeSingleCompany, 'links.privacy', '')}
                  className="fsize-300 txtText400 link"
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
                  href={get(activeSingleCompany, 'links.terms', '')}
                  className="ml-2 fsize-300 txtText400 link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {translateTo('Terms and Conditions', lang)}
                </a>
              )
            }

            <div className="ta-r ml-1">
              <span className="fsize-300 txtText400">@Brixel {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  lang: get(state, 'common.language', {}),
  translations: get(state, 'translations', {}),
});

export default connect(mapStateToProps, null)(PageFooter);
