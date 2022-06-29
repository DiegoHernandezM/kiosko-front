import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

DataChart.propTypes = {
  associates: PropTypes.array
};

export default function DataChart({ associates }) {
  const [labels, setLabels] = useState([]);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    const aLabels = [];
    const aTasks = [];
    associates.map((item) => {
      aLabels.push(item.name);
      aTasks.push(item.tasks.length);
      return item;
    });
    setLabels(aLabels);
    setCounts(aTasks);
  }, [associates]);

  const dataSeries = [
    {
      name: 'Actividades',
      type: 'column',
      data: counts
    }
  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '10%' } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels,
    xaxis: { type: 'string' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)}`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Actividades esta semana" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={dataSeries} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
