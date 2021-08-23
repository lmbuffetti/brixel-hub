/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import {
  Helpers,
} from '@brixel/brixel-components';

const IntroUpgrade = (props) => {
  // PROPS
  const { packages } = props;
  // STATE
  const [filteredPackages, setFilteredPackages] = useState([]);

  useEffect(() => {
    let filtPkg = packages.filter((pkg) => pkg.type === 'one' || pkg.type === 'premium' || pkg.type === 'private');
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
          <span className="dis-b">Basic</span>
        </h4>

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
      </div>

      <div className="dis-f">
        {
          filteredPackages.map((pkg, i) => (
            <div
              className={`packageBox w-perc-100 ${pkg.type} dis-fl-col jc-b`}
              key={i.toString()}
            >
              <div className="p-4">
                <h5>{pkg.name}</h5>
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
  packages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  packages: get(state, 'companies.activeSingleCompany.servicePackages', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = () => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(IntroUpgrade);
