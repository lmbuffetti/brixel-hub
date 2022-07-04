import React, { useEffect, useState } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CompaniesData } from '../../resources/Layout/Companies';
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
  } = props;
  // STATE
  const [activeCompanyData, setActiveCompanyData] = useState({});
  
  useEffect(() => {
    if (CompaniesData[activeSingleCompany.stub]) setActiveCompanyData(CompaniesData[activeSingleCompany.stub].footer);
    else setActiveCompanyData(CompaniesData.default.footer);
  }, [activeSingleCompany.id]);
  

  console.log(activeSingleCompany);
  
  return (
    <>
      <footer className={`w-perc-100 ${className} ${activeSideBar ? 'footerWrap' : ''}`}>
        <div className="dis-f a-t jc-b p-3 txtAltGrey400 brdSmallTop brdLight200">
          <div>
            {
              get(activeCompanyData, 'leftLink', []).map((link, i) => (
                <a
                  key={`link${i.toString()}`}
                  href={link.link}
                  className={i > 0 ? 'ml-2' : ''}
                >
                  {link.label}
                </a>
              
              ))
            }
          </div>
          {
            get(activeCompanyData, 'logos', []).length > 0 && (
              <div className="dis-f a-c">
                <span className="mr-2">Powered by</span>
                {
                  get(activeCompanyData, 'logos', []).map((logo, i) => (
                    <img
                      key={`logo${i.toString()}`}
                      src={logo}
                      alt={`${activeSingleCompany.name} logo ${i}`}
                      className={i > 0 ? 'ml-2' : ''}
                    />
                  ))
                }
              </div>
            )
          }
          <div>
            @Brixel {new Date().getFullYear()}
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
};

PageFooter.defaultProps = {
  activeSideBar: false,
  className: '',
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
});

export default connect(mapStateToProps, null)(PageFooter);
