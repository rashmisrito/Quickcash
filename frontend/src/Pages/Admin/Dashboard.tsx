import {Box,colors,Divider,Grid,MenuItem,Select,Typography} from "@mui/material";
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import {Card,CardContent} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { CardHeader } from '@mui/material';
import RecentTrade from '../../Component/Spot/RecentTrade';
// Icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DescriptionIcon from '@mui/icons-material/Description';

// Dialog

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Table Start
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// PieChart
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import axios from "axios";
import React, { useEffect } from "react";
import moment from "moment";
import getSymbolFromCurrency from "currency-symbol-map";
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import { useOutletContext } from "react-router-dom";
import { Closebtn, Colorbtn, Dangerbtn } from "../../Component/Button/ColorButton";
import Backdrop from '@mui/material/Backdrop';

import { Table,Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

function FCfComponent({Icon,color,name,count}:any) {
const [theme]:any = useOutletContext();
return(
  <Card sx={{border: `${theme ?  '2px solid white' :  '1px solid transparent'}`}}>
    <CardContent>
      <Grid container>
        <Grid item xs={9}>
          <Icon style={{color:color,fontSize:"38px"}}/>
        </Grid>
        <Grid item xs={3}>
          <Grid container>
            <Grid item xs={12} sx={{color:"#141b3dff"}} style={{color: `${theme ? 'white': '#141b3dff'}`}}>
              {count}
            </Grid>
            <Grid item xs={12} sx={{fontSize:"12px", fontWeight:"bolder",color:"#141b3dff"}} style={{color: `${theme ? 'white': 'black'}`}}>
              {name}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)
}
const FCsComponent = (result:any) => {
  const [theme]:any = useOutletContext();
  const data = [
    { value: 50 },
    { value: 30 },
    { value: 85 },
    { value: 50 },
    { value: 100 },
  ];
  return(
    <>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <span style={{fontWeight:"bold", color: `${theme ? 'white' : 'black'}`}}>Total Transactions</span>
      </Grid>
      <Grid item xs={9}>
        <div className="bar-graph">
          {data.map((item, index) => (
            <div className="bar" key={index} style={{ height: `${item.value}%` }}>
              {/*add a tooltip or a value inside the bar if needed */}
            </div>
          ))}
        </div>
      </Grid>
      <Grid item xs={3}>
        <Box>
          <Typography sx={{fontWeight:"bold",color: `${theme ? 'white': ''}`}}> ${parseFloat(result?.data || 0).toFixed(2)}</Typography>
        </Box>
        <Box>
          <Grid container spacing={0}style={{textAlign:"center"}}>  
            <Grid item xs={6}>
              <TrendingUpIcon sx={{color: `${theme ? 'white': 'green'}` }}/>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{fontSize:"12px",color: `${theme ? 'white': 'green'}`}}>Growth</Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
    </> 
  );
}

function FCtComponent({Icon, color,title,count}:any){
return(
  <>
  <Card>
    <CardHeader 
    titleTypographyProps={{fontWeight: 'bold' }}
    title={title} 
    style={{background:"#f5f6f7"}}/>
    <CardContent>
      <Grid >
        <Grid item xs={12} style={{textAlign:"center",color:"white"}}>
          <Badge 
          badgeContent={count} 
          color="info" 
          showZero 
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{'& .MuiBadge-badge': {color: 'white',}, }}>
            <Icon style={{color:color, fontSize:"36px"}}/>
          </Badge>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
  </>
);
}

const FCftComponent = ({datas,mode}:any) => {

  var data:any = [];

  if(datas) { 
    for (const [key, value] of Object.entries(datas)) {
      data.push({
        /** @ts-ignore **/
        value: value / localStorage.getItem('totalw') *100,
        label: key?.replace("_TEST","")
      })
    }
  }

  return(
    <>
    <Card sx={{ border: `${mode ? '1px solid white': 'black'}` }}>
     <CardHeader title={"Wallet Overview"}
        titleTypographyProps={{fontWeight: 'bold' }}
        style={{background:"#f5f6f7"}}/>
        <CardContent>
          {
            data?.length == 0 ?
            <span style={{ color: `${mode ? 'white': 'black'}`, textAlign: 'center' }}>No Data to display</span>
            :
            <PieChart
              series={[
              {
                arcLabel: (item) => `${parseFloat(item.value).toFixed(2)}%`,
                  data,
                  innerRadius:50
                },
              ]}
              slotProps={{ legend: { 
                labelStyle: {
                fontSize: 14,
                fill: `${mode ? 'white': 'black'}`,
              }, } }}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: 'white',
                  fontWeight: 'bold',
                  fontSize: '10px'
                }
              }}
              /** @ts-ignore **/
              width="400"
              /** @ts-ignore **/
              height="200"
            />
          }
         
        </CardContent>
    </Card>
    </>
  );
}
function FCfivComponent({mode}:any){
  return(
    <>
    <Box sx={{ overflow: "auto" }}>
    <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
      <Box sx={{borderRadius: '12px',boxShadow: '3', background: `${mode ? '#183153': 'white'}`, height: '60vh'}}>
        <Typography sx={{padding: '12px', fontWeight:"bold",color: `${mode ? 'white': 'black'}`}}>
          Recent Trades
        </Typography>
        <hr />
        <RecentTrade coin={"BTCUSDT"} />
      </Box>
      </Box>
      </Box>
    </>
  );
}
const ConatinerFirst = ({summary,mode}:any) => {
  return(
    <>
      <Grid container spacing={4}>
      {/* First Container First Component */}
      <Grid item xs={12}>
        <FCfComponent Icon={PersonOutlineOutlinedIcon} color="#00a86b" name="Total Account" count={summary?.totalAccount} />
      </Grid>
      <Grid item xs={12}>
        <FCfComponent Icon={HourglassEmptyIcon} color="#00a86b" name="Total Wallet" count={summary?.wallet} />
      </Grid>
      {/* End First Container First Component */}
      {/* First Conatiner Second Component */}
      <Grid item xs={12}>
        <Card style={{height:"120px", border: `1px solid white`}}>
          <CardContent>
            <FCsComponent data={summary?.transactionsallTotal}/>
          </CardContent>
        </Card>
      </Grid>
      {/* End First Container Second Component */}
      {/* First Container Third Component */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FCtComponent Icon={ReceiptIcon} color={"#3e8ef7"} title={`Invoice`} count={summary?.totalInvoice} />
          </Grid> 
          <Grid item xs={6}>
            <FCtComponent Icon={DescriptionIcon} color={"#0bb2d4"} title={`Ticket`} count={summary?.totalTicket} />
          </Grid>
          <Grid item xs={6}>
            <FCtComponent Icon={AccountBalanceWalletIcon} color={"#ff4f54"} title={`Wallet`} count={summary?.totalAccount} />
          </Grid>
          <Grid item xs={6}>
            <FCtComponent Icon={CurrencyBitcoinIcon} color={"#00a86bff"} title={`Crypto Wallet`} count={summary?.wallet} />
          </Grid>
        </Grid>
      </Grid>
        {/* End First Container Third Component */}
        {/* First Conainer Fourth Components */}
        <Grid item xs={12}>
          <FCftComponent datas={summary?.walletItems} mode={mode} />
        </Grid>
        {/* End First container Foruth Components */}
        {/* First Container Fifth Components */}
        <Grid item xs={12} sx={{ display: { xs: 'none', lg: 'flex' } }}>
          <FCfivComponent mode={mode} />
        </Grid>
        {/* End First Container Fifth Components */}
      </Grid>
    </>
  );
}

function SCfComponent({Icon, color, name, value, total,mode}:any){

  return(
    <>
      <Gauge 
        minwidth={250} 
        height={160} 
        value={value} 
        startAngle={-120} 
        innerRadius={'60%'}
        endAngle={120} 
        text={
          ({}) => `${total}`
        }
        sx={(theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 15,
            fontWeight:"bold",
            transform: 'translate(4px, 46px)'
          },
          [`& .${gaugeClasses.valueText} text`]: {
            fill: `${mode ? 'white': 'black'}` 
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: color,
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: `${mode ? 'white' : theme.palette.text.disabled}`
          }
      })}
      >
      </Gauge>
      <Grid sx={{position:'relative',top: {lg: '-100px', xs: '-80px'},textAlign:"center"}} >
        <Grid container spacing={1} style={{position:'relative',right:"0px"}}>
          <Grid item xs={12}>
            <Icon sx={{fontSize: {lg: '60px', xs: '20px'},color:color}}/>
          </Grid>
          <Grid item xs={12}>
            <span style={{fontSize:"10px",position:'relative',top:'-20px',fontWeight:"900", color: `${mode ? 'white': 'black'}`}}>{name}</span>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

function SCsComponent({count, color, Icon, title}:any){
  return(
    <>
      <Card style={{height:"120px", background:color,color:"white"}}>
        <CardContent>
          <Grid container>
            <Grid item xs={8} spacing={3}>
              <Grid container>
                <Grid item xs={12}>
                  <span style={{fontSize:"28px"}}>{count}</span>
                </Grid>
                <Grid item xs={12} style={{fontSize:"10px"}}>
                {title}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4} style={{textAlign:"center",position:"relative",top:"15px"}}>
              <Icon style={{fontSize:"65px"}}/>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

const SCtComponent = ({data,mode}:any) => {
  return(
    <>
      <Typography
        sx={{paddingLeft:"10px",paddingTop:"10px",background:"#673ab7",fontWeight: "bold", color:"white"}}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Recent Transactions
      </Typography>
       
        <Divider />
        {/* @ts-ignore */}
        <Table style={{ background: `${mode ? '' : '#F2F3FE'}`, color: 'black' }}>
          <Thead>
            <Tr>
              <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Date</Td>
              <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Trx</Td>
              <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Type</Td>
              <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Amount</Td>
              <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Details</Td>
              <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Status</Td>
            </Tr>
          </Thead>
          <TableBody>
            {data?.slice(0,5)?.map((row:any) => (
              <Tr
                key={row.date}
              >
                <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }} scope="row">
                  {moment(row.createdAt).format("YYYY-MM-DD")}
                </Td>
                <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }} scope="row">{row.trx}</Td>
                <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }}>{row.trans_type}</Td>
                <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }}>{getSymbolFromCurrency(row?.from_currency)}{row.amount}</Td>
                <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }}>{row?.info}</Td>
                <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }}>
                  {(row?.status === 'Decline' || row.status === 'Decline') && 
                    <span>Decline</span>
                  }
                  {(row?.status === 'succeeded' || row.status === 'Success' || row?.status == "Complete") && 
                  <span style={{ border: `${mode ? '1px solid green' : '1px solid green'}`, padding: '12px', borderRadius: '20px', background: `${mode ? 'green' : ''}` }}>Success</span>
                  }
                  {(row?.status === 'cancelled') || (row?.status === "Cancelled") && 
                  <span style={{ border: `${mode ? '1px solid red' : '1px solid red'}`, padding: '12px', borderRadius: '20px', background: `${mode ? 'red' : ''}` }}>Cancelled</span>
                  }
                  {(row?.status === 'pending') && 
                  <span style={{ border: `${mode ? '1px solid orange' : '1px solid orange'}`, padding: '12px', borderRadius: '20px', background: `${mode ? 'orange' : ''}` }}>Pending</span>
                  }
                </Td>
              </Tr>
            ))}

          {data?.data?.length == 0 && 
            <Tr colSpan={4}>
              <Td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No Transactions found</Td>
            </Tr>
          }
          </TableBody>
        </Table>
    </>
  );
}

const SCftComponent = ({data,mode}:any) => {
  return(
    <>
    <Typography
      sx={{paddingLeft:"10px", width: '100%',paddingTop:"10px",background:"#673ab7",fontWeight:"bold",color:"white"}}
      variant="h6"
      id="tableTitle"
      component="div"
    >
      Crypto Transactions
    </Typography>
      <Divider />
      {/* @ts-ignore */}
      <Table style={{ background: `${mode ? '' : '#F2F3FE'}`, color: 'black' }}>
        <Thead>
          <Tr>
            <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Date</Td>
            <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Coin</Td>
            <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Payment Type</Td>
            <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>No of Coins</Td>
            <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Side</Td>
            <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Amount</Td>
            <Td style={{ padding: '12px', background: '#8657E5', color: 'white' }}>Status</Td>
          </Tr>
        </Thead>
        <TableBody>
          {data?.slice(0,5)?.map((row:any) => (
            <Tr
              key={row.date}
            >
              <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }} scope="row">
                {moment(row.createdAt).format("YYYY-MM-DD")}
              </Td>
              <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }} scope="row">
                {row?.coin?.replace("_TEST","")}
              </Td>
              <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }}>{row?.paymentType == "" ? 'NA' : row?.paymentType}</Td>
              <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }}>{row.noOfCoins}</Td>
              <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }}>{row.side}</Td>
              <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }}>{getSymbolFromCurrency(row?.currencyType)}{row.amount}</Td>
              <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400', color: `${mode ? 'white' : 'black'}` }}>
                {(row.status === 'completed') && <span style={{ border: `${mode ? '1px solid green' : '1px solid green'}`, padding: '12px', borderRadius: '20px', background: `${mode ? 'green' : ''}` }}>Success</span>}
                {(row.status === 'cancelled') && <span style={{ border: `${mode ? '1px solid red' : '1px solid red'}`, padding: '12px', borderRadius: '20px', background: `${mode ? 'red' : ''}` }}>Cancelled</span>}
                {(row.status === 'declined') && <span style={{ border: `${mode ? '1px solid red' : '1px solid red'}`, padding: '12px', borderRadius: '20px', background: `${mode ? 'red' : ''}` }}>Decline</span>}
                {(row.status === 'pending') && <span style={{ border: `${mode ? '1px solid orange' : '1px solid orange'}`, padding: '12px', borderRadius: '20px', background: `${mode ? 'orange' : ''}` }}>Pending</span>}
              </Td>
            </Tr>
          ))}

          {data?.data?.length == 0 && 
            <Tr colSpan={4}>
              <Td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No Transactions found</Td>
            </Tr>
          }
        </TableBody>
      </Table>
    </>
  );
}

const ContainerSecond = ({summary,mode}:any) => {
  // FirstComponentData
  // value={dashboardData?.depositTotal > 0 ? parseFloat(parseFloat(dashboardData?.depositTotal) / parseFloat(dashboardData?.depositTotal + dashboardData?.debitTotal) * 100).toFixed(2) : '0'} 
  const firstComponentData = [
    {Icon:ArrowUpwardOutlinedIcon,color:"#65d1bc",name:"Credit",value:`${summary?.credit > 0 ? parseFloat(summary?.credit) / parseFloat(summary?.credit+summary?.debit) * 100 : '0'}`,total:`$${parseFloat(summary?.credit || 0).toFixed(2)}` },
    {Icon:ArrowDownwardOutlinedIcon,color:"#fc762f",name:"Debit",value:`${summary?.credit > 0 ? parseFloat(summary?.debit) / parseFloat(summary?.credit+summary?.debit) * 100 : '0'  }`,total:`$${parseFloat(summary?.debit || 0).toFixed(2)}` },
    {Icon:AttachMoneyIcon,color:"#8657e5",name:"Revenue",value:`${summary?.totalRevenue > 0 ? parseFloat(summary?.totalRevenue) / parseFloat(summary?.credit+summary?.debit) * 100 : '0'  }`,total:`$${parseFloat(summary?.totalRevenue || 0).toFixed(2)}` },
  ];
  // SecondComponentData
  const SecondComponentData = [
    {Icon:PersonIcon,count:`${summary?.totalUsers || 0}`,title:"Total Users",color:"#80982a"},
    {Icon:AccountBalanceOutlinedIcon,count:`${summary?.totalUsers - summary?.pendingUsers || 0}`,title:"New Users",color:"#00a86b"},
    {Icon:AccountBalanceWalletIcon,count:`${summary?.pendingUsers || 0}`,title:"Pending Users",color:"#0bb2d4"}
  ];

  return(
    <>
    <Grid container spacing={4}>
      {/* Second Container first Component */}
      <Grid item xs={12} sm={12} md={12}>
        {firstComponentData.length != 0 && (
        <Card style={{ height:"200px", border: '2px solid white'}}>
          <CardContent>
          <Grid container spacing={4}>
          { firstComponentData.map((data) => (
            <Grid item xs={4}>
              <SCfComponent Icon={data.Icon} color={data.color} name={data.name} value={data.value} total={data.total} mode={mode} />
            </Grid>
          ))}
            </Grid>
          </CardContent>
        </Card>
        )}
      </Grid>
      {/* End Second Container First Component */}
      {/* First Conatiner Second Component */}
      <Grid item xs={12}>
        {SecondComponentData.length !=0 && (
        <Grid container spacing={3}>
          {SecondComponentData.map((data) => (
          <Grid item xs={12} md={6} lg={4}>
            <SCsComponent count={data.count} color={data.color} Icon={data.Icon} title={data.title} />
          </Grid>
          ))}
        </Grid>
        )}
      </Grid>
      {/* End First Container Second Component */}
      {/* First Container Third Component */}
      <Grid item xs={12}>
        <SCtComponent data={summary?.transactions} mode={mode} />
      </Grid>
      {/* End First Container Third Component */}
      {/* First Container Fourth Component */}
      <Grid item xs={12}>
        <SCftComponent data={summary?.crypto_transactions} mode={mode} />
      </Grid>
      {/* End First Container Fourth Component */}
    </Grid>
    </>
  );
}

const Layout = () => {

  const [theme]:any = useOutletContext();
  const [startDate,setStartDate] = React.useState<any>('');
  const [endDate,setEndDate]     = React.useState<any>('');
  const [selectFilter,setSelectFilter] = React.useState<any>('7');
  const [loaderResult,setLoaderResult] = React.useState<boolean>(false);
  const [displayFilter,setDisplayFilter] = React.useState<boolean>(false);
  const [customStartDate,setcustomStartDate] = React.useState<any>('');
  const [customEndDate,setcustomEndDate] = React.useState<any>('');
  
  useEffect(() => {
    if(localStorage.getItem('admintoken')) {
     setLoaderResult(true);
     getDetails();
    } 
  },[selectFilter]);
 
  // dashboardDetails
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [summary,setSummary] = React.useState<any>('');

  const getDetails = async() => {
   await axios.get(`/${url}/v1/admin/dashboarddetails?filter=7&start=${startDate}&end=${endDate}`,
   {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
     }
   })
   .then(result => {
     if(result.data.status == 201) {
       setTimeout(() => {
        setLoaderResult(false);
        setSummary(result?.data?.summary?.[0]);
        localStorage.setItem("totalw",result?.data?.summary?.[0]?.wallet);
       },300);
     }
   })
   .catch(error => {
     console.log(error);
     setLoaderResult(false);
   })
  }

  const handleClose = () => {
    setDisplayFilter(false);
    setSelectFilter('7');
    setStartDate(moment().format('YYYY-MM-DD'));
    setEndDate(moment().subtract(7,'d').format('YYYY-MM-DD'));
  };

  const HandleFilter = async (e:any) => {
    if(e == "custom") {
      setDisplayFilter(true);
      setSelectFilter(e);
    } else {
      setSelectFilter(e);
      setLoaderResult(true);
      setcustomStartDate('');
      setcustomEndDate('');
      if(e == '30') {
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().subtract(30,'d').format('YYYY-MM-DD'));
      } else {
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().subtract(7,'d').format('YYYY-MM-DD'));
      }    
    }
  }

  const HandleCustomFilter = async () => {
    console.log("customEndDate", customStartDate,customEndDate);
    if(customEndDate != "" && customStartDate != "") {
      setSelectFilter('custom');
      setDisplayFilter(false);
      await axios.get(`/${url}/v1/admin/dashboarddetails?filter=${selectFilter}&start=${customEndDate}&end=${customStartDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
          }
        })
        .then(result => {
          if(result.data.status == 201) {
            setTimeout(() => {
             setLoaderResult(false);
             setSummary(result?.data?.summary?.[0]);
             localStorage.setItem("totalw",result?.data?.summary?.[0]?.wallet);
            },300);
          }
        })
        .catch(error => {
          console.log(error);
          setLoaderResult(false);
        })
    } else {
      alert("Please fill start and end Date");
    }
  }

  return(
  <>
    <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loaderResult}
        onClick={handleClose}
      >
        fetching details ...<CircularProgress color="inherit" />
    </Backdrop>
    <Box sx={{ flexGrow: 1, marginTop: '16px' }}>

      <Grid container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Grid item xs={12} sm={9}>
          <Typography variant="h4" style={{ fontWeight: '900', marginBottom: '12px', color: `${theme ? 'white': ''}`}}>Dashboard</Typography>
        </Grid>
        {
          !displayFilter && customStartDate && customEndDate &&
          <Grid item xs={12} sm={9} sx={{marginTop: '16px'}}>
           <Typography sx={{ color: `${theme ? 'white': 'black'}` }}>Date Range : <>{"("}{customStartDate}-{customEndDate}{")"}</> 
            {" "}
            <Dangerbtn onClick={() => {
              setSelectFilter('7');
              setcustomStartDate('');
              setcustomEndDate('');
              setStartDate(moment().format('YYYY-MM-DD'));
              setEndDate(moment().subtract(7,'d').format('YYYY-MM-DD'));
            }}>Reset</Dangerbtn>
           </Typography> 
          </Grid>
        }
        <Grid item xs={12} sm={3} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'normal', marginBottom: '12px', gap: '5px' }}>
          <Select fullWidth value={selectFilter} sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => HandleFilter(e.target.value)}>
            <MenuItem value="7" style={{ color: `${theme ? 'white': 'black'}` }}>7 days</MenuItem>
            <MenuItem value="30" style={{ color: `${theme ? 'white': 'black'}` }}>30 days</MenuItem>
            <MenuItem value="custom" style={{ color: `${theme ? 'white': 'black'}` }}>Custom</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={5}>
        {/* Conatiner First */}
        <Grid item xs={12} sm={12} md={4} >
          <ConatinerFirst summary={summary}  mode={theme ? true : false}/>
        </Grid>
        {/* Conatiner Second */}  
        <Grid item xs={12} sm={12} md={8} >
          <ContainerSecond summary={summary} mode={theme ? true : false} />
        </Grid>
      </Grid>
    </Box>

    <Dialog
      fullWidth
      maxWidth={'sm'}
      open={displayFilter}
      onClose={handleClose}
    >
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <label htmlFor="Start Date" style={{ color: `${theme ? 'white' : 'black'}` }}>Start Date</label>
            <TextField type="date" sx={{ border: `${theme ? '1px solid white' : 'black'}` }} value={customStartDate} onChange={(e) => setcustomStartDate(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} style={{ color: `${theme ? 'white' : 'black'}` }}>
           <label htmlFor="End Date">End Date</label>
           <TextField 
              type="date" 
              sx={{ border: `${theme ? '1px solid white' : 'black'}` }}
              value={customEndDate} 
              onChange={(e) => setcustomEndDate(e.target.value)}
              inputProps={{  
                min: customStartDate ? customStartDate : new Date().toISOString().substring(0, 10)
              }}   
              fullWidth 
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Colorbtn onClick={() => HandleCustomFilter()}>Apply</Colorbtn>
        <Closebtn onClick={() => handleClose()}>Close</Closebtn>
      </DialogActions>
    </Dialog>
  </>
  );
}

export default function Dashboard() {
 return  <Layout />
}