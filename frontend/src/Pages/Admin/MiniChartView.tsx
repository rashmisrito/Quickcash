import axios from 'axios';
import { Box } from '@mui/material';
import { ApexOptions } from "apexcharts";
import React , {memo, useEffect} from 'react';
import ReactApexChart from 'react-apexcharts';

interface propTypes {
  coinNames: string;
}

const MiniChartView = memo<propTypes>(({...props}) => {
  const [range] = React.useState<number>(24 * 60 * 60 * 1000);
  const [data,setData] = React.useState<[]>([]);

  useEffect(() => {
    getKlinesData();
  },[range,props?.coinNames]);

  const interval =
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
      type: 'candlestick',
      height: 100,
      toolbar: {
        show: false
      }
    },
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
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
    dataLabels: {
      enabled: false,
    },
  }

  var series = [
  {
    data: dataData && dataData
  },
  ];

  return (
    <Box sx={{background: 'white', width: '100%'}}>
      {dataData && (
      <ReactApexChart
        options={options}
        series={series}
        type='candlestick'
        height={150}           
      />
     )}
    </Box>
  );
});

export default MiniChartView;