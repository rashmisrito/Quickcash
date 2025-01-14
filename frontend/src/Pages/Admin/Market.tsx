import axios from 'axios';
import { Box } from '@mui/material';
import MiniChartView from './MiniChartView';
import React, { memo, useEffect } from 'react';

const Market = memo(() => {

  const [cdata,setCData] = React.useState<any>([]);
  const coinsData = ["BTCUSDT","BNBUSDT","ADAUSDT","SOLUSDT","DOGEUSDT"];

  useEffect(() => {
   getCoinsData();
  },[]);

  const getCoinsData = async () => {
    coinsData?.map(async item => {
      await axios.get(`https://api.binance.com/api/v3/ticker?symbol=${item}`)
      .then(result => {
        setCData((prevData:any) => [...prevData,result.data])
      })
      .catch(error => console.log(error));
    })
  }

  return (
    <Box>
      <table width="100%" style={{borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{padding: '10px', borderBottom: '3px solid black'}}>
            {/* <th>Date</th> */}
            <th>Coin</th>
            <th>High Price</th>
            <th>Low Price</th>
            <th>Current Price</th>
            <th>Change (%)</th>
            <th>Chart</th>
          </tr>
        </thead>
        <tbody>
        {cdata?.map((item:any,index:number) => (
          <tr key={index}>
            {/* <td style={{padding: '10px', borderBottom: '1px solid black'}}>{moment(item?.closeTime).format('llll')}</td> */}
            <td style={{padding: '10px', borderBottom: '1px solid black'}}>
              <td style={{border: '0'}}><img src={`https://assets.coincap.io/assets/icons/${item?.symbol.replace('USDT','').toLowerCase()}@2x.png`} style={{width: '30px'}} /></td>
              <td style={{border: '0'}} align="right">{item?.symbol}</td>
            </td>
            <td style={{padding: '10px', borderBottom: '1px solid black'}}>{item?.highPrice}</td>
            <td style={{borderBottom: '1px solid black', padding: '10px'}}>{item?.lowPrice}</td>
            <td style={{borderBottom: '1px solid black', padding: '10px'}}>{item?.lastPrice}</td>
            <td style={{borderBottom: '1px solid black', padding: '10px'}}>{item?.priceChangePercent}</td>
            <td style={{borderBottom: '1px solid black'}}><MiniChartView coinNames={item?.symbol}/></td>
          </tr>
        ))}
        </tbody>
      </table>
    </Box>
  );
});

export default Market;