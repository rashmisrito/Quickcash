import axios from 'axios';
import { useEffect, useState } from 'react';

export default function OrderBook({coin}:any) {
  
 const [recentOrders,setRecentOrders] = useState<any>([]);
 useEffect(() => {
  getRecentOrderbook(coin);
 },[coin]);
  
 const getRecentOrderbook = async (coin:any) => {
  await axios.get(`https://api.binance.com/api/v3/depth?symbol=${coin}&limit=14`).
  then(result => {
    setRecentOrders(result.data);
  })
  .catch(error => {
    console.log("error", error);
  })
 }

 console.log("Order Book", recentOrders);
  
 return (
  <div>
    <table width="100%" style={{fontSize: '13px', fontFamily: 'mono' , borderCollapse: 'collapse'}}>
      <thead>
        <tr>
          <td align='center'>Price (USDT)</td>
          <td align='center'>Size</td>
          <td align='center'>Total</td>
        </tr>
      </thead>
      <tbody>
      {
        recentOrders?.asks?.map((item:any,key:any) => (
        <>
          <tr key={key}>
            <td align='center' style={{color: 'green', fontWeight:'900'}}>{item[0]}</td>
            <td align='center' style={{fontWeight: '900', color: 'black'}}>{item[1]}</td>
            <td align='center' style={{fontWeight: '900', color: 'black'}}>
             {parseFloat(item[0]+item[1])}
            </td>
          </tr>
        </>
       ))
      }
      </tbody>
    </table>
   </div>
  )
}
