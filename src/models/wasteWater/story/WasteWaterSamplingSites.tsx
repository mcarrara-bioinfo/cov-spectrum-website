import { filterByDateRange, getMaxDateRange, useWasteWaterData } from './WasteWaterSamplingSitesHooks';
import React, { useState } from 'react';
import { DateRangeSelector, SpecialDateRangeSelector } from '../../../data/DateRangeSelector';
import Loader from '../../../components/Loader';
import DateRangePicker from '../../../components/DateRangePicker';
import { GridCell, PackedGrid } from '../../../components/PackedGrid';
import { WasteWaterLocationTimeWidget } from '../WasteWaterLocationTimeWidget';
import { ShowMoreButton } from '../../../helpers/ui';

export const WasteWaterSamplingSites = () => {
  const wasteWaterData = useWasteWaterData();
  const [dateRangeSelector, setDateRangeSelector] = useState<DateRangeSelector>(
    new SpecialDateRangeSelector('Past6M')
  );

  if (!wasteWaterData) {
    return <Loader />;
  }

  const dataInTimeRange = filterByDateRange(wasteWaterData, dateRangeSelector.getDateRange());
  const dateRange = getMaxDateRange(dataInTimeRange);

  return (
    <>
      <DateRangePicker dateRangeSelector={dateRangeSelector} onChangeDate={setDateRangeSelector} />

      <PackedGrid maxColumns={2}>
        {dataInTimeRange.map(dataset => (
          <GridCell minWidth={600} key={dataset.location}>
            <WasteWaterLocationTimeWidget.ShareableComponent
              country='Switzerland'
              location={dataset.location}
              title={dataset.location}
              variants={dataset.variantsTimeseriesSummaries}
              dateRange={dateRange}
              height={300}
              toolbarChildren={[
                <ShowMoreButton
                  to={'/story/wastewater-in-switzerland/location/' + dataset.location}
                  key={`showmore${dataset.location}`}
                />,
              ]}
            />
          </GridCell>
        ))}
      </PackedGrid>
    </>
  );
};
