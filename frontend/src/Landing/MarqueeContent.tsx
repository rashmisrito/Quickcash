import { Grid, Stack } from '@mui/material'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Marquee from "react-fast-marquee";

export default function MarqueeContent() {

   const [coinData, setCoinData] = useState([]);
   useEffect(()=>{
    const fetchData = async ()=>{
    try {
      const response = await axios.get("https://api.binance.com/api/v3/ticker?symbols=[%22BTCUSDT%22,%22BNBUSDT%22,%22SOLUSDT%22,%22SHIBUSDT%22,%22ETHUSDT%22,%22DOGEUSDT%22,%22USDCUSDT%22,%22ADAUSDT%22,%22XRPUSDT%22]");
      setCoinData(response.data);
    } catch (err){
       console.log(err);
    }
    };
    fetchData();
    }, []);   

  return (
    <section>
      <Stack>
        <Grid container sx={{ background: '#F2F3FF', height: 'auto', padding: '10px', width: '100%' }}>   
          <Marquee speed={100}>
            <Grid sx={{display:'flex', flexDirection: 'row', justifyContent:'space-between', gap: '200px'}}>
            {
              coinData?.map((item:any,index:number) => (
              <Grid sx={{display: 'flex', fontWeight: '700', flexDirection: 'row', alignItems: 'center', gap: '10px'}} key={index}>
                <Grid><img src={`https://assets.coincap.io/assets/icons/${item?.symbol.replace("USDT","").toLowerCase()}@2x.png`} /></Grid>
                  <Grid sx={{ color: "#483594" }}>{item?.symbol}</Grid>
                  <Grid>${item?.lastPrice}</Grid>
                  <Grid>{Math.sign(item?.priceChangePercent) == -1 ? 
                  <span style={{ color: 'red', fontWeight: '700' }}>{item?.priceChangePercent}%</span>
                  : 
                  <span style={{ color: 'green', fontWeight: '700' }}>{item?.priceChangePercent}%</span>
                  }
                  </Grid>
                </Grid>
                ))
            }
            <Grid></Grid>
            </Grid>
          </Marquee>
         </Grid>
       </Stack> 
    </section>
  )
}
