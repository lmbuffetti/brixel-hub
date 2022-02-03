import React from 'react';
import { Element } from 'react-faux-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import first from 'lodash/first';
import last from 'lodash/last';
import get from 'lodash/get';
import { DataByCountry } from '@brixel/brixel-components';
import { formatNum } from '../../utils/helpers';
import { generalTranslate } from '../../utils/translation';

function RangePriceChart(props) {
  const {
    currency,
    properties,
    type,
    bestimate,
    title,
    showTopLabel,
    subtitle,
    lang,
  } = props;
  const cfg = {
    barTransitionDuration: 800,
    step: properties[0] + 1,
    label: currency,
    labelPosition: 'preffix',
    localString: currency === 'EUR' ? 'it-IT' : 'de-CH',
  };
  const margin = {
    top: type === 'bestimate' ? 0 : 100,
    bottom: 30,
    left: 0,
    right: 0,
  };
  const randomID = `rangePriceChart${type}`;
  const transformation = properties.map((el) => ({
    priceRangeStart: el ? +el.priceRangeStart : 0,
    numberOfProperties: el ? +el.numberOfProperties : 0,
    variation: el ? +el.variation : 0,
  }));

  const getPosition = properties.findIndex((val) => val.curEl);
  const firstRange = first(transformation) ? first(transformation).priceRangeStart : 0;
  const lastRange = last(transformation) ? last(transformation).priceRangeStart : 0;
  const scope = {
    rangeType: '<',
    rangeData: '<',
    rangeStep: properties[0].rangeStep + 1,
    normalize: '<',
    labelPosition: '@',
    configData: '<',
    activeFilters: '<',
    readOnly: '<',
    highlightValue: '<',
    onSelectedRangeUpdate: '&',
  };

  const discreteDomainMapper = (continuousDomainValue) => {
    const idx = Math.floor(continuousDomainValue / scope.rangeStep);
    const resRangeStart = idx * Number(scope.rangeStep);
    if (resRangeStart > lastRange) {
      return lastRange;
    } if (resRangeStart < firstRange) {
      return firstRange;
    }
    return resRangeStart;
  };

  const plot = (chart, width, height, el) => {
    const d3Elem = d3.select(el);
    cfg.width = width;
    cfg.height = height;
    cfg.minValue = firstRange;
    cfg.maxValue = lastRange;
    // removing svg artifacts
    d3Elem.select('.svg-range-container').remove();
    d3Elem.selectAll('.js-hover-tip').remove();
    d3Elem.selectAll('.js-highlight-tip').remove();
    // create scales!
    const xScale = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.6)
      .domain(properties.map((d) => (d ? d.priceRangeStart : 0)))
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(properties, (d) => (d ? d.numberOfProperties + 1 : 1))])
      .range([height, 0]);

    chart
      .append('text')
      .style('text-anchor', 'start')
      .style('font-size', '12px')
      .attr('transform', `translate(${xScale(firstRange)}, ${Math.round(cfg.height + 25)})`)
      .text(() => {
        if (cfg.label === 'm2') {
          return `${formatNum(firstRange, "'", ',', cfg.localString)} ${cfg.label}`;
        }
        if (type !== 'bestimate') {
          return `${cfg.label} ${formatNum(+firstRange.toFixed(0), "'", ',', cfg.localString)} +`;
        }
        return '';
      });

    chart
      .append('text')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('text-align', 'right')
      .attr('transform', `translate(${xScale(lastRange) + xScale.bandwidth()} , ${Math.round(cfg.height + 25)})`)
      .text(() => {
        if (cfg.label === 'm2') {
          return `${formatNum(lastRange, "'", ',', cfg.localString)} ${cfg.label} +`;
        }
        if (type !== 'bestimate') {
          return `${cfg.label} ${formatNum(+lastRange.toFixed(0), "'", ',', cfg.localString)} +`;
        }
        return '';
      });

    chart.selectAll('.filter-bar')
      .data(properties)
      .enter()
      .append('rect')
      .classed('filter-bar', true)
      .attr('id', (d) => `bar${d.id}`)
      .attr('x', (d) => (d ? xScale(d.priceRangeStart) : 0))
      .attr('y', () => 0)
      .attr('height', () => height)
      .attr('width', () => 5)
      .style('fill', () => '#FFFFFF')
      .style('fillOpacity', '0.2');

    chart.selectAll('.bar')
      .data(properties)
      .enter()
      .append('rect')
      .classed('orange-bar filter-bar', true)
      .attr('x', (d) => (d ? xScale(d.priceRangeStart) : 0))
      .attr('y', (d) => (d ? yScale(d.numberOfProperties) : 0))
      .attr('height', (d) => (height - yScale(d.numberOfProperties)))
      .attr('width', () => 5)
      .style('fill', (d) => {
        if (bestimate && d) {
          if (d.priceRangeStart >= bestimate.lowerValue && d.priceRangeStart <= bestimate.higherValue) {
            return '#004D71';
          }
          return '#ABB0B3';
        }
        return '#004D71';
      });

    chart.selectAll('.bar-label')
      .data(properties)
      .enter()
      .append('rect')
      .classed('bar-label', true)
      .attr('x', (d) => (d ? xScale(d.priceRangeStart) : 0))
      .attr('y', () => 0)
      .attr('height', () => height)
      .attr('width', () => 5)
      .style('fill', () => 'transparent')
      .text((d) => d.value)
      .on('mouseover', (e, data) => {
        let transform = 'transform: translate(-50%,0);';
        // let left = '50%';
        if (e && xScale(data.priceRangeStart) < 70) {
          transform = 'transform: translate(-1%, 0)';
          // left = 0;
        }
        const circle = d3.select(`#${randomID}`);
        circle.append('div')
          .attr('id', `tooltip${randomID}`)
          .attr('class', 'range-tip')
          .attr('style', `left: ${data ? xScale(data.priceRangeStart) : 0}px; ${transform}`)
          .html(`<p class="txtDark700"><span class="txtDark700">Properties</span><span class="txtDark700">: ${data ? data.numberOfProperties : 0}</span></p><span class="data-range info">${cfg.label} ${data.rangePrice}</span>`);
      })
      .on('mouseout', () => {
        const circle = d3.select(`#tooltip${randomID}`);
        circle.remove();
      });

    chart.append('g')
      .attr('transform', `translate(0,${height})`)
      .attr('class', 'axis axis--x')
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .style('opacity', 0);

    chart.append('g')
      .classed('y axis', true);

    chart.select('.axis--x')
      .append('text')
      .attr('x', width / 2)
      .attr('y', 60)
      .attr('fill', '#000')
      .style('font-size', '20px')
      .style('text-anchor', 'middle');

    chart.append('g')
      .attr('class', 'slider')
      .attr('transform', `translate(0,${height})`);

    if (type === 'bestimate') {
      chart.select('.slider')
        .append('line')
        .attr('class', 'trackback')
        .attr('fill', '#00FF00')
        .attr('x1', () => 13)
        .attr('x2', () => {
          const calcMax = xScale(discreteDomainMapper(cfg.maxValue)) + xScale.bandwidth();
          return calcMax;
        });
    }

    chart.select('.slider')
      .append('line')
      .attr('class', 'track')
      .attr('fill', '#555762')
      .attr('x1', () => {
        let calcMin = xScale(discreteDomainMapper(cfg.minValue));
        if (type === 'bestimate' && properties) {
          const getMinVal = properties.find((val) => +val.priceRangeStart >= +bestimate.lowerValue);
          calcMin = getMinVal ? xScale(getMinVal.priceRangeStart) : 0;
        }
        return calcMin;
      })
      .attr('x2', () => {
        let calcMax = xScale(discreteDomainMapper(cfg.maxValue)) + xScale.bandwidth();
        if (type === 'bestimate' && properties) {
          const getMaxVal = properties.find((val) => +val.priceRangeStart >= +bestimate.higherValue);
          calcMax = getMaxVal ? xScale(getMaxVal.priceRangeStart) : 0;
        }
        return calcMax;
      });

    if (type !== 'bestimate') {
      chart.append('line')
        .attr('x1', properties[getPosition] ? xScale(properties[getPosition].priceRangeStart) + 8 : 8)
        .attr('x2', properties[getPosition] ? xScale(properties[getPosition].priceRangeStart) + 8 : 8)
        .attr('y1', -20)
        .attr('y2', height)
        .style('stroke', '#003A5D')
        .style('stroke-width', 1)
        .style('stroke-dasharray', 6);

      setTimeout(() => {
        d3.select(`#${randomID}`).selectAll('.tooltip-marker').remove();
        d3.select(`#${randomID}`).selectAll('#tooltip-new').remove();
        d3.select(`#${randomID}`)
          .append('div')
          .style('left', `${properties[getPosition] ? xScale(properties[getPosition].priceRangeStart) + 8 : 8}px`)
          .style('transform', 'translateX(-50%)')
          .attr('class', 'tooltip-marker');

        d3.select(`#${randomID}`)
          .append('div')
          .attr('id', 'tooltip-new')
          .attr('class', 'range-tip')
          .style('z-index', '99')
          .style('opacity', '1')
          .style('position', 'absolute')
          .style('left', `${properties[getPosition] ? xScale(properties[getPosition].priceRangeStart) + 8 : 75}px`)
          .style('top', '0')
          .style('transform', 'translateX(-50%)')
          .html(() => {
            let titleTooltip = '';
            switch (type) {
              case 'priceRange':
                titleTooltip = generalTranslate(lang, 'Median price');
                break;
              case 'priceM2':
                titleTooltip = generalTranslate(lang, 'Median price/m2');
                break;
              default:
                titleTooltip = '';
                break;
            }
            return `
                <p>${titleTooltip}</p>
                <span class="curr">${cfg.label} </span>
                <span class="num">${formatNum(properties[0].median, "'", ',', cfg.localString)}</span>
              `;
          });
      }, 0);
    } else if (showTopLabel) {
      setTimeout(() => {
        d3.select(`#${randomID}`)
          .append('p')
          .attr('class', 'value')
          .html(`<span class="ng-binding">${cfg.label} ${formatNum(bestimate.lowerValue, "'", ',', cfg.localString)}</span> <span class="value__separator"> - </span> <span class="ng-binding">${cfg.label} ${formatNum(bestimate.higherValue, "'", ',', cfg.localString)}</span>`);
      }, 0);
    }
  };

  const drawChart = () => {
    const width = 350;
    const height = type !== 'bestimate' ? 280 : 200;

    const el = new Element('div');
    el.setAttribute('id', randomID);
    el.setAttribute('class', 'wrapChart');
    const svg = d3.select(el)
      .append('svg')
      .attr('id', 'chart')
      .attr('width', width)
      .attr('height', height);

    const chart = svg.append('g')
      .classed('display', true)
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    plot(chart, chartWidth, chartHeight, el);

    return el.toReact();
  };

  return (
    <div className="price-graph">
      {
        title && (
          <h4>{title}</h4>
        )
      }
      {
        subtitle && (
          <h3
            dangerouslySetInnerHTML={{ __html: `<span>${cfg.label}</span> ${formatNum(+properties[0].median, "'", ',', cfg.localString)}` }}
            className="price"
          />
        )
      }
      <div className="rangeGraph" style={{ marginTop: '0', position: 'relative' }}>
        {drawChart()}
      </div>
    </div>
  );
}

RangePriceChart.propTypes = {
  bestimate: PropTypes.object,
  currency: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  showTopLabel: PropTypes.bool,
  subtitle: PropTypes.bool,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  lang: PropTypes.string,
};

RangePriceChart.defaultProps = {
  bestimate: null,
  lang: 'en',
  showTopLabel: true,
  subtitle: false,
  title: null,
};

const mapStateToProps = (state) => {
  const countryCode = get(state, 'brixelForm.Property.values.location.countryCode', 'CH');
  return ({
    currency: DataByCountry(countryCode),
    lang: get(state, 'common.language', {}),
  });
};

export default compose(
  connect(mapStateToProps, null),
)(RangePriceChart);
