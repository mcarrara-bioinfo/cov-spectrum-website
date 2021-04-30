import { omit, uniqBy } from 'lodash';
import React, { useMemo, useState } from 'react';
import * as zod from 'zod';
import { Plot } from '../components/Plot';
import { globalDateCache, UnifiedIsoWeek } from '../helpers/date-cache';
import { fillFromWeeklyMap } from '../helpers/fill-missing';
import { AsyncZodQueryEncoder } from '../helpers/query-encoder';
import { NewSampleSelectorSchema } from '../helpers/sample-selector';
import { SampleSet, SampleSetWithSelector } from '../helpers/sample-set';
import { getNewSamples, getCountries } from '../services/api';
import { Country, CountrySchema } from '../services/api-types';
import { Widget } from './Widget';
import { ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartAndMetricsWrapper, ChartWrapper, colors, Wrapper } from '../charts/common';
import Select, { StylesConfig } from 'react-select';
import chroma from 'chroma-js';

const CHART_MARGIN_RIGHT = 15;
interface Props {
  country: Country;
  logScale?: boolean;
  variantInternationalSampleSet: SampleSetWithSelector;
  wholeInternationalSampleSet: SampleSetWithSelector;
}

const VariantInternationalComparisonPlot = ({
  country,
  logScale,
  variantInternationalSampleSet,
  wholeInternationalSampleSet,
}: Props) => {
  const variantSamplesByCountry = useMemo(() => variantInternationalSampleSet.groupByField('country'), [
    variantInternationalSampleSet,
  ]);

  const countryOptions: CountryOption[] = Array.from(variantSamplesByCountry.keys()).map(countryName => ({
    value: countryName,
    label: countryName,
    color:
      countryName === 'Switzerland'
        ? chroma('red').hex()
        : countryName === country
        ? chroma('blue').hex()
        : chroma.random().darken().hex(),
    isFixed: true,
  }));
  console.log(countryOptions);

  const wholeSamplesByCountry = useMemo(() => wholeInternationalSampleSet.groupByField('country'), [
    wholeInternationalSampleSet,
  ]);

  const countriesToPlotList = useMemo(
    () =>
      uniqBy(
        [
          { name: 'United Kingdom', color: 'black' },
          { name: 'Denmark', color: 'green' },
          { name: 'Switzerland', color: 'red' },
          { name: country, color: 'blue' },
        ],
        c => c.name
      ),
    [country]
  );

  const plotData = useMemo(() => {
    console.log('Variant samples by country', variantSamplesByCountry);
    console.log('Whole samples by country', wholeSamplesByCountry);
    // console.log('Variant samples set', variantSampleSet);
    interface ProportionCountry {
      countryName: string;
      data: {
        dateString: string;
        proportion: number;
      }[];
    }
    const proportionCountries: ProportionCountry[] = countriesToPlotList.map(({ name: country }) => {
      const variantSampleSet = new SampleSet(variantSamplesByCountry.get(country) ?? [], null);
      const wholeSampleSet = new SampleSet(wholeSamplesByCountry.get(country) ?? [], null);
      const filledData = fillFromWeeklyMap(variantSampleSet.proportionByWeek(wholeSampleSet), {
        count: 0,
        proportion: 0,
      })
        .filter(({ value: { proportion } }) => proportion !== undefined && (!logScale || proportion > 0))
        .map(({ value: { proportion, ...restValue }, key }) => ({
          key,
          value: { ...restValue, proportion: proportion! },
        }));
      console.log('international filled data', filledData);
      return {
        countryName: country,
        data: filledData.map(entry => ({
          dateString: entry.key.firstDay.string,
          proportion: entry.value.proportion,
        })),
      };
    });

    const dateMap: Map<string, any> = new Map();

    for (let { countryName, data } of proportionCountries) {
      for (let { dateString, proportion } of data) {
        if (!dateMap.has(dateString)) {
          dateMap.set(dateString, {
            dateString,
          });
        }
        dateMap.get(dateString)[countryName] = Math.max(proportion, 0);
      }
    }

    const result = [...dateMap.values()].sort((a, b) => Date.parse(a.dateString) - Date.parse(b.dateString));
    console.log('result is', result);
    return result;
  }, [countriesToPlotList, variantSamplesByCountry, wholeSamplesByCountry, logScale]);

  const xTickVals = useMemo(() => {
    const relevantWeeks = countriesToPlotList.flatMap(({ name }) =>
      (variantSamplesByCountry.get(name) ?? []).map(s => s.date.isoWeek)
    );
    return globalDateCache
      .weeksFromRange(globalDateCache.rangeFromWeeks(relevantWeeks))
      .map(w => w.firstDay.string);
  }, [countriesToPlotList, variantSamplesByCountry]);


//  OptionsType<{
//     value: string;
//     label: string;
//     color: string;
//     isFixed: boolean;
// }>
  interface CountryOption {
    value: string;
    label: string;
    color: string;
    isFixed: boolean;
  }

// const onChange = (value: any, { action: any, removedValue: any }) => {
//     switch (action) {
//       case 'remove-value':
//       case 'pop-value':
//         if (removedValue.isFixed) {
//           return;
//         }
//         break;
//       case 'clear':
//         value = colourOptions.filter(v => v.isFixed);
//         break;
//     }

    const onChange = (value: any) => {
          setSelectedCountryOptions(value);
          console.log(value);
        }
  const [selectedCountryOptions, setSelectedCountryOptions] = useState<any>([{
    value: "Switzerland",
    label: "Switzerland",
    color: chroma('red').hex(),
    isFixed: false,
  }]);
  return (
    <Wrapper>
      <Select
        closeMenuOnSelect={false}
        // defaultValue={[colourOptions[0], colourOptions[1]]}
        placeholder='Select countries...'
        isMulti
        options={countryOptions}
        styles={colourStyles}
        onChange={onChange}
        value={selectedCountryOptions}
        // isClearable={this.state.value.some(v => !v.isFixed)}
      />
      <ChartAndMetricsWrapper>
        <ChartWrapper>
          <ResponsiveContainer>
            <ComposedChart data={plotData} margin={{ top: 6, right: CHART_MARGIN_RIGHT, left: 0, bottom: 0 }}>
              <XAxis dataKey='dateString' />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string, props: unknown) => (value * 100).toFixed(2) + '%'}
                labelFormatter={label => {
                  return 'Date: ' + label;
                }}
              />
              {countriesToPlotList.map(country => (
                <Line
                  type='monotone'
                  dataKey={country.name}
                  strokeWidth={3}
                  dot={false}
                  stroke={country.color}
                  // isAnimationActive={false}
                  key={country.name}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartAndMetricsWrapper>
    </Wrapper>
  );
};

export const VariantInternationalComparisonPlotWidget = new Widget(
  new AsyncZodQueryEncoder(
    zod.object({
      country: CountrySchema,
      logScale: zod.boolean().optional(),
      variantInternationalSampleSelector: NewSampleSelectorSchema,
      wholeInternationalSampleSelector: NewSampleSelectorSchema,
    }),
    async (decoded: Props) => ({
      ...omit(decoded, ['variantInternationalSampleSet', 'wholeInternationalSampleSet']),
      variantInternationalSampleSelector: decoded.variantInternationalSampleSet.sampleSelector,
      wholeInternationalSampleSelector: decoded.wholeInternationalSampleSet.sampleSelector,
    }),
    async (encoded, signal) => ({
      ...omit(encoded, ['variantInternationalSampleSelector', 'wholeInternationalSampleSelector']),
      variantInternationalSampleSet: await getNewSamples(encoded.variantInternationalSampleSelector, signal),
      wholeInternationalSampleSet: await getNewSamples(encoded.wholeInternationalSampleSelector, signal),
    })
  ),
  VariantInternationalComparisonPlot,
  'VariantInternationalComparisonPlot'
);

//intentional any type
const colourStyles: any = {
  control: (styles: Object) => ({ ...styles, backgroundColor: 'white' }),
  multiValue: (styles: any, { data }: any) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles: any, { data }: any) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles: any, { data }: any) => ({
    ...styles,
    'color': data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};
