import axios from 'axios';
import React from 'react';
import { memo, useEffect } from 'react';
import { ApexOptions } from "apexcharts";
import ReactApexChart from 'react-apexcharts';
import { Box, Tab, Tabs, Typography } from '@mui/material';

interface propTypes {
  coinNames: string;
}

const ChartView = memo<propTypes>(({...props}) => {
  const [range, setRange] = React.useState<number>(24 * 60 * 60 * 1000);
  const [data,setData] = React.useState<[]>([]);

  useEffect(() => {
    getKlinesData();
  },[range,props?.coinNames]);

  const handleChange = React.useCallback(
    (_: React.SyntheticEvent<Element, Event>, newValue: number) =>
      setRange(newValue),
    []
  );

  var interval =
  {
    86400000: "30m",
    2592000000: "12h",
    7776000000: "1d",
    15552000000: "3d",
    31104000000: "1w",
    93312000000: "1M",
  }[range];
          
  const getKlinesData = async () => {
    await axios.get(`https://api.binance.com/api/v3/klines?symbol=${props?.coinNames}&interval=${interval}&startTime=${new Date().getTime()-range}&endTime=${new Date().getTime()}`)
    .then(result => {
      setData(result.data)
    })
    .catch(error => {
      console.log("klines Error", error);
    })
  }

  var dataData:any[] = [];
  data?.map((item) => {
    dataData.push({
      x: new Date(item[0]),
      y: [item[1], item[2], item[3], item[4]]
    })
  })

  const options:ApexOptions = {
    chart: {
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      type: 'candlestick',
      height: 470,
    },
    xaxis: {
      min: range ? new Date().getTime() - range : undefined,
      max: new Date().getTime(),
      type: "datetime",
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      opposite: true,
      tooltip: {
        enabled: false,
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm",
      },
    },
  }

  var series = [
  {
    data: dataData && dataData
  },
  ];

  return (
    <Box sx={{background: 'white', width: '100%'}}>
      <Typography sx={{marginLeft: '12px', fontWeight: '700'}}>Chart Analysis</Typography>
        <div className='box-content box-content-height-nobutton'>
          <Tabs 
            value={range} 
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            
          >
            <Tab value={24 * 60 * 60 * 1000} label="30m"></Tab>
            <Tab value={24 * 60 * 60 * 1000 * 30} label="12h" />
            <Tab value={24 * 60 * 60 * 1000 * 30 * 3} label="1d" />
            <Tab value={24 * 60 * 60 * 1000 * 30 * 6} label="3d" />
            <Tab value={24 * 60 * 60 * 1000 * 30 * 12} label="1w" />
            <Tab value={24 * 60 * 60 * 1000 * 30 * 12 * 3} label="1M" />
          </Tabs>
          {dataData && (
            <ReactApexChart
              options={options}
              series={series}
              type='candlestick'
              height={470}             
            />
          )}
        </div>
    </Box>
  );
});

export default ChartView;