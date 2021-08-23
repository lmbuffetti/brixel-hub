/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import {
  Helpers,
} from '@brixel/brixel-components';
import { getPackageProperty } from '../../actions/PropertyActions';

const IntroUpgrade = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    activeSinglePropertyPackage,
    handleGetPackageProperty,
    packages,
  } = props;
  // STATE
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [packageName, setPackageName] = useState({ type: '', name: '' });

  useEffect(() => {
    if (activeSingleProperty.id) {
      const payloadPackage = {
        id: activeSingleProperty.id,
        limit: 20,
        offset: 0,
        direction: 'ASC',
        order: 'name',
        smallLoader: 'getPackage',
      };
      handleGetPackageProperty(payloadPackage);
    }
  }, [activeSingleProperty]);

  useEffect(() => {
    if (activeSinglePropertyPackage && packages.length > 0) {
      const sortedPackage = {};
      const activePackage = activeSinglePropertyPackage.find((item) => item.started);
      if (activePackage) {
        const filtPackages = packages.find((item) => activePackage.servicePackage === item.id);
        if (filtPackages) {
          setPackageName({
            type: filtPackages.type,
            name: filtPackages.name,
          });
        } else {
          setPackageName({
            type: 'Basic',
            name: 'basic',
          });
        }
      } else if (sortedPackage[0]) {
        const filtPackage = packages.find((item) => sortedPackage[0].servicePackage === item.id);
        setPackageName({
          type: filtPackage.type,
          name: filtPackage.name,
        });
      } else {
        setPackageName({
          type: 'Basic',
          name: 'basic',
        });
      }
    }
  }, [activeSinglePropertyPackage, packages]);

  useEffect(() => {
    let filtPkg = packages.filter((pkg) => pkg.type === 'one' || pkg.type === 'premium' || pkg.type === 'private');
    // eslint-disable-next-line no-return-assign
    filtPkg.map((pkg) => pkg.price.total = +pkg.price.total);
    filtPkg = orderBy(filtPkg, ['price.total'], ['asc']);
    setFilteredPackages(filtPkg);
  }, [packages]);

  return (
    <main id="rewards" className="introScanFlow pb-2 pb-sm-4 h-perc-100 txtDark700">

      <h2 className="mb-0 mb-lg-5 ta-c fweight-600">
        Boost your private sale with an upgrade.
      </h2>

      <div className="dis-f mb-8">
        <h4 className="mr-5 w-perc-100 max-w-fix-384">
          <span>Your current plan</span>
          <span className={`dis-b ${packageName.type} fweight-600`}>{packageName.name}</span>
        </h4>

        {
          packageName.type === 'basic' && (
            <ul className="fullGreenList">
              <li>
                <div>
                  <b>Brixel Hub</b>
                  <p>Your client portal to digitalize your property</p>
                </div>
              </li>

              <li>
                <div>
                  <b>Pre-market</b>
                  <p>Test your demand anonymously</p>
                </div>
              </li>

              <li>
                <div>
                  <b>Brixel Page</b>
                  <p>Your property website to share in your network</p>
                </div>
              </li>

            </ul>
          )
        }
      </div>

      <div className="dis-f">
        {
          filteredPackages.map((pkg, i) => (
            <div
              className={`packageBox w-perc-100 ${pkg.type} dis-fl-col jc-b`}
              key={i.toString()}
            >
              <div className="p-4">
                <h5 className="fweight-600">{pkg.name}</h5>
                <p className="mt-2">
                  {pkg.description}
                </p>

                <ul className="checked">
                  {
                    pkg.details && get(pkg, 'details', []).map((detail, f) => (
                      <li
                        key={f.toString()}
                        className={i > 0 && f === 0 ? 'fweight-700' : ''}
                      >
                        {detail.description}
                      </li>
                    ))
                  }
                </ul>
              </div>
              <h6
                className="px-4 py-2"
              >
                <span>{pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, pkg.price.currency)}</span>
                <small>inc VAT</small>
              </h6>
            </div>
          ))
        }
      </div>
    </main>
  );
};

IntroUpgrade.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyPackage: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetPackageProperty: PropTypes.func.isRequired,
  packages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyPackage: get(state, 'property.activeSinglePropertyPackage', []),
  packages: get(state, 'companies.activeSingleCompany.servicePackages', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(IntroUpgrade);
