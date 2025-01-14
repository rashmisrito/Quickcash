import axios from 'axios';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Table,Thead, Tbody, Tr, Td } from 'react-super-responsive-table';

export default function RecentTrade({coin}:any) {
  
 const [theme]:any = useOutletContext(); 
 const [recentTrades,setRecentTrades] = useState<any>([]);

 useEffect(() => {
  getRecentTrade(coin);
 },[coin]);
  
 const getRecentTrade = async (coin:any) => {
  await axios.get(`https://api.binance.com/api/v3/trades?symbol=${coin}&limit=14`).
  then(result => {
   setRecentTrades(result.data);
  })
  .catch(error => {
    console.log("error", error);
  })
 }
  
 return (
  <>
    {/* @ts-ignore */}
    <Table style={{ background: `${theme ? '#183153' : '#F2F3FE'}`, color: `${theme ? 'white': 'black'}` }}>
      <Thead>
        <Tr>
          <Td 
            width="220"
            style={{ padding: '12px', background: '#8657E5', color: 'white' }}
          >
            Price (USDT)
          </Td>
          <Td  
            width="220"
            style={{ padding: '12px', background: '#8657E5', color: 'white' }}
          >
            Qty (BTC)
          </Td>
          <Td  
            width="220"
            style={{ padding: '12px', background: '#8657E5', color: 'white' }}
          >
            Time
          </Td>
        </Tr>
      </Thead>
      <Tbody>
      {
        recentTrades?.map((item:any,index:any) => (
        <>
          <Tr key={index}>
            <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }}>{item?.price}</Td>
            <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }}>{item?.qty}</Td>
            <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }}>
            {new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(item?.time)}
            </Td>
          </Tr>
        </>
       ))
      }
      </Tbody>
    </Table>
  </>
  )
}
