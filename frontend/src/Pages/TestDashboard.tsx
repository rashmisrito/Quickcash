import axios from 'axios';
import moment from 'moment';
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { jwtDecode } from 'jwt-decode';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Avatar from '@mui/material/Avatar';
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Tooltip from '@mui/material/Tooltip';
// Select
import { IconButton } from '@mui/material';
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import ButtonGroup from "@mui/material/ButtonGroup";
import getSymbolFromCurrency from 'currency-symbol-map';
import TableContainer from "@mui/material/TableContainer";
import React, { useEffect, useRef, useState } from "react";
import { Link, useOutletContext,useParams } from "react-router-dom";
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
// import { LineChart } from '@mui/x-charts/LineChart';
const marqueeData= [
  {icon:"BTCUSDT", name:"Bitcoin"},
  {icon:"BNBUSDT", name:"Binance Coin"},
  {icon:"ADAUSDT", name:"Cardano"},
  {icon:"SOLUSDT", name:"Solana"},
  {icon:"DOGEUSDT", name:"Dogecoin"},
  {icon:"LTCUSDT", name:"Litecoin"},
  {icon:"ETHUSDT", name:"Ethereum"},
  {icon:"SHIBUSDT", name:"Shiba Inu"}
];
const coinsUSD = [
  "BTCUSDT",
  "BNBUSDT",
  "ADAUSDT",
  "SOLUSDT",
  "DOGEUSDT",
  "LTCUSDT",
  "ETHUSDT",
  "SHIBUSDT",
];
const coinNames: { [key: string]: string } = {
  BTCUSDT: "Bitcoin",
  BNBUSDT: "Binance Coin",
  ADAUSDT: "Cardano",
  SOLUSDT: "Solana",
  DOGEUSDT: "Dogecoin",
  LTCUSDT: "Litecoin",
  ETHUSDT: "Ethereum",
  SHIBUSDT: "Shiba Inu",
};
const filterButtons = [
  { value: "1D", label: "Day" },
  { value: "5D", label: "Week" },
  { value: "1M", label: "Month" },
  { value: "12M", label: "year" },
];

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
  data: {
    defaultcurr: string;
    email: string;
    id: string;
    name: string;
    type: string;
  };
}

// marquee Start
const Marquee = () => {
  return (
    marqueeData.length!=0 ? (
      // @ts-ignore
      <marquee bgcolor="#001e3c" behavior="scroll" direction="left" scrollamount="5" scrolldelay="0" style={{ paddingTop: "5px" }}>
        <Grid sx={{ display: 'flex'}}>
         { marqueeData.map((data) => (
          <Grid style={{padding:"5px"}}>
          <Chip 
            avatar={
             <Avatar alt="Natacha" src={`https://assets.coincap.io/assets/icons/${data.icon.replace("USDT", "").toLowerCase()}@2x.png`} style={{width:"35px", height:"35px"}} />
            }
            label={data.name}
            style={{color:"#ffffff", fontSize:"18px"}}
          />
          </Grid>
         ))}
        </Grid>
        {/* @ts-ignore */}
      </marquee>
    ) :(
      ''
    )
  );
};
// marquee End
// Frist Section Card Component
// @ts-ignore }
function CardData({ icon, name, value, grow, index , theme }) {
  return (
    <Card key={index} sx={{ minWidth: '30%', margin: '0 8px', border: '1px solid white'  }}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <img
              className="grid-icon"
              src={`https://assets.coincap.io/assets/icons/${icon.replace("USDT","").toLowerCase()}@2x.png`}
              style={{ width: "35px" }}
              alt="coin"
            />
          </Grid>
          <Grid item xs={12} lg={9}>
            <Typography sx={{ fontSize: {md: '12px', lg: '22px'} }} component="div" className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
              {name}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography
              sx={{ fontSize: {md: '12px', lg: '22px'} }}
              marginTop="5px"
              fontWeight="Bolder"
              component="div"
              className={`${theme ? 'avatarDark' : 'avatarLight'}`}
            >
              ${value}
            </Typography>
          </Grid>
          <Grid item xs={4} style={{ paddingTop: "10px", paddingLeft: "20px" }}>
            <Chip
              label={grow + "%"}
              style={{
                color: grow > 0 ? "green" : "red",
                backgroundColor: grow > 0 ? "#e0fadaff" : "#FF000020",
              }}
              sx={{ fontSize: {md: '12px', lg: '19px'} }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// Second Section Components Start
// TransData (Recnet Transaction Data) Component
// @ts-ignore
function TransData({ icon, name, status, value, date, theme }) {
  const shortenedValue = parseFloat(value).toFixed(8); // "0.000021"
  return (
    <Box>
      <Grid container>
        <Grid item xs={2} sm={2} md={2}>
        {
          icon =="USDC_POLYGON_TEXT"?
          <img
            className="grid-icon"
            src={`https://assets.coincap.io/assets/icons/poly@2x.png`}
            style={{ width: "35px", position: "relative", top: "5px" }}
            alt="coin"
          /> 
          :
          <img
            className="grid-icon"
            src={`https://assets.coincap.io/assets/icons/${icon.replace("_TEST","").toLowerCase()}@2x.png`}
            style={{ width: "35px", position: "relative", top: "5px" }}
            alt="coin"
          />
        }
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <div style={{ float: "left", fontWeight: "bolder" }} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>{name?.replace("_TEST","")}</div>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <div
                style={{
                  float: "left",
                  fontSize: "12px",
                  color: status === "completed" ? "green" : "red",
                }}
              >
                {status}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <div style={{ float: "right", fontWeight: "bolder", cursor: 'pointer', fontSize:"14px" }}>
              <Tooltip title={value} placement="top-start">
                <div className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                  {shortenedValue}
                </div>
              </Tooltip>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <div
                style={{
                  float: "right",
                  fontSize: "10px",
                  fontWeight: "lighter",
                }}
                className={`${theme ? 'avatarDark' : 'avatarLight'}`}
              >
                {}
                {moment(date).format("MMMM Do YYYY, h:mm:ss A")}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
// End TransData Component
// Recent Transaction Card Component
function RecentTransactionCard({theme}:any) {

  const [list,setList] = React.useState<any>("");
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const params = useParams();

  useEffect(() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getList(accountId.data.id);
  },[params.id]);
  const getList = async(id:any) => {
    await axios.get(`/${url}/v1/walletaddressrequest/list/${id}`, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        console.log(result.data.data)
        setList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })  
  }

  return (
    <Card sx={{ borderRadius: "15px", height: "100%", border: '1px solid white' }}>
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={8} sm={8} md={8}>
            <span style={{ fontWeight: "bolder", fontSize: "18px" }} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
              Crypto Wallets
            </span>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <div style={{ float: "right" }}></div>
          </Grid>
        </Grid>
        {list.length != 0 ? (
          list.map((data:any) => (
            <Box sx={{ flexGrow: 1 }} style={{ padding: "10px" }}>
              <TransData
                icon={data.coin}
                name={data.coin}
                status={data.status}
                value={data.noOfCoins}
                date={data.createdAt}
                theme={theme}
              />
            </Box>
          ))
        ) : (
          <Box sx={{ flexGrow: 1 }} style={{ padding: "10px" }}>
            No data found
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
// End Recent Transaction Component
// Graph Chart Component
function GraphChartCard({theme}:any) {

  const [selectedFilter, setSelectedFilter] = useState("1D");
  const [symbol, setSymbol] = useState("BTCUSDT");
  
  const handleSymbolChange = (event: any) => {
    setSymbol(event.target.value);
  };

  return (
    <Card style={{ borderRadius: "15px", height: "100%", border: '1px solid white' }} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={1} sm={1} md={1}>
            <span style={{ fontWeight: "bolder", fontSize: "18px" }} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
              Analytics
            </span>
          </Grid>
          <Grid item xs={11} sm={11} md={11}>
            <div style={{ float: "right" }}>
              <Grid container spacing={3}>
                <Grid item>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="Basic button group"
                  >
                    {filterButtons.map((filter) => (
                      <Button
                        key={filter.value}
                        onClick={() => setSelectedFilter(filter.value)}
                        style={{
                          background:
                            selectedFilter === filter.value ? "#2196f3" : "white",
                          color:
                            selectedFilter === filter.value ? "#ffffff" : "",
                        }}
                      >
                        {filter.label}
                      </Button>
                    ))}
                    ;
                  </ButtonGroup>
                </Grid>
                <Grid item>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleSymbolChange}
                    value={symbol}
                    style={{ height: "40px", paddingTop: "10px", border: `${theme ? '1px solid white': '1px solid black'}` }}
                  >
                    {coinsUSD.map((item, index) => (
                      <MenuItem
                        key={index}
                        value={item}
                        className={`${theme ? "avatarDark" : "avatarLight"}`}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={4} sm={4} md={4}>
                            <img
                              className="grid-icon"
                              src={`https://assets.coincap.io/assets/icons/${item
                                .replace("USDT", "")
                                .toLowerCase()}@2x.png`}
                              style={{
                                width: "30px",
                              }}
                              alt="coin"
                            />
                          </Grid>
                          <Grid
                            item
                            xs={7}
                            sm={7}
                            md={7}
                          >
                            <span style={{ position: "relative", top: "2px" }}>
                              {coinNames[item]}
                            </span>
                          </Grid>
                        </Grid>
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Box sx={{ flexGrow: 1 }} style={{ padding: "10px", height: "350px" }}>
          <TradingViewWidget coin={symbol} filter={selectedFilter} />
        </Box>
      </CardContent>
    </Card>
  );
}
// End Graph Chart Component
function TradingViewWidget(coin: any, filter: any) {
  const container = useRef<any>();
  useEffect(() => {
    const scriptContent = `
      {
        "autosize": true,
        "symbol": "${coin.coin}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "2",
        "locale": "en",
        "range": "${coin.filter}",
        "hide_top_toolbar": true,
        "allow_symbol_change": true,
        "save_image": false,
        "calendar": false,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com"
      }
    `;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = scriptContent;

    // Remove any existing script tags to avoid duplicates
    if (container.current) {
      while (container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }
    }

    container.current.appendChild(script);
  }, [coin, filter]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}
// Second Section Components End
// Third Section Table (Component)

const ThirdSectionTable = (data:any) => {
  return (
    <Box sx={{ overflow: "auto" }}>
       <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Coin Name</TableCell>
                <TableCell align="right">No. Of Coins</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.slice(0,5)?.map((row:any,index:number) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {moment(row?.createdAt).format("YYYY-MM-DD hh:mm:ss A")}
                  </TableCell>
                  <TableCell align="right">{row?.coin?.replace("_TEST","")}</TableCell>
                  <TableCell align="right">{row?.noOfCoins}</TableCell>
                  <TableCell align="right">{row?.side}</TableCell>
                  <TableCell align="right">{getSymbolFromCurrency(row?.currencyType)}{row?.amount}</TableCell>
                  <TableCell align="right">
                  {row?.status == "pending" && 
                    <Chip label="Pending"  sx={{borderColor: 'orange', color: 'orange'}} variant="outlined" />
                  } 
                  {row?.status == "completed" && 
                    <Chip label="Success" color="success" variant="outlined" />
                  } 
                  {row?.status == "declined" &&
                    <Chip label="Rejected"  sx={{borderColor: 'red', color: 'red'}} variant="outlined" />
                  } 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
     </Box> 
    </Box>
  );
}
// First Section Box Component (Combined all components of first section)
function FirstSectionBox({data,theme}:any) {

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div style={{ paddingTop: '10px',paddingBottom:"10px" }}>
        <Box 
          ref={scrollRef} 
          sx={{
            display: {xs:'none', md:'flex'},
            overflowX: 'scroll',
            scrollbarWidth: 'none', // Hide scrollbar on Firefox
             '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar on Chrome
            width: '100%'
          }}>
          {data.length != 0 ? (
            data.map((card:any, index:any) => (
              <CardData
                icon={card.symbol}
                name={card.symbol}
                value={card.lastPrice}
                grow={card.priceChangePercent }
                index={index}
                theme={theme}
              />))   
            )
             : 
            (
             <Grid item xs={12} sm={12} md={12}>
              <Card style={{ borderRadius: "15px" }}>
                <CardContent>No data found</CardContent>
              </Card>
            </Grid>
            )}
        </Box>
        <Grid sx={{ display: {xs: 'block', md:'none'} }}>
          {data.length != 0 ? (
            data.map((card:any, index:any) => (
              <>
                <Grid sx={{ margin: '7px', width: '100%' }}>
                  <CardData
                    icon={card.symbol}
                    name={card.symbol}
                    value={card.lastPrice}
                    grow={card.priceChangePercent }
                    index={index}
                    theme={theme}
                  />
                </Grid>
              </>
              ))   
            )
             : 
            (
             <Grid item xs={12} sm={12} md={12}>
              <Card style={{ borderRadius: "15px" }}>
                <CardContent>No data found</CardContent>
              </Card>
            </Grid>
            )
          }
        </Grid>
        <Grid sx={{ display: {xs: 'none', md: 'inline-block'},  textAlign:"center",position:"absolute", top:"270px",right:"600px"}}>
          <IconButton
            onClick={scrollLeft}>
            <ArrowBackIosNew />
         </IconButton>
         <IconButton onClick={scrollRight}>
           <ArrowForwardIos />
         </IconButton>
       </Grid>
      </div>
    </>
  );
}
// Second Section Box
function SecondSectionBox({theme}:any) {
  return (
    <Box sx={{ flexGrow: 1 }} style={{ paddingTop: "30px" }}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={12} lg={8}>
          <GraphChartCard theme={theme} />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <RecentTransactionCard theme={theme} />
        </Grid>
      </Grid>
    </Box>
  );
}
// Third Section Box
function ThirdSectionBox() {

  useEffect(() => {
    getTransactionsList();
  },[]);  

  const [cryptoListTransaction,setCryptoListTransaction] = React.useState<any>([]);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const getTransactionsList = async() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/crypto/list/${accountId?.data?.id}`,
    {
      headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setCryptoListTransaction(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  return (
    <Grid sx={{paddingTop: "30px"}}>
      <ThirdSectionTable data = {cryptoListTransaction} />
    </Grid>
  );
}
// Page Layout
function Layout(props:any) {
  const [coinData, setCoinData] = useState("");
  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const response = await axios.get("https://api.binance.com/api/v3/ticker?symbols=[%22BTCUSDT%22,%22BNBUSDT%22,%22DOGEUSDT%22,%22ADAUSDT%22,%22SOLUSDT%22,%22LTCUSDT%22,%22ETHUSDT%22,%22SHIBUSDT%22]");
        setCoinData(response.data);
        console.log(response);
      } catch (err){
        console.log(err);
      }
    };
    fetchData();
  }, []);
  
  return (
    <>
      <Typography sx={{ fontWeight: '700' , fontSize: {md: '28px'} ,marginLeft: 'px',color: { xs: 'white', md: `${props?.theme ? 'white': 'black'}` }, marginBottom: '2px' }}>
        Dashboard
      </Typography>
      <Marquee />
      <FirstSectionBox data={coinData} theme={props?.theme} />
      <SecondSectionBox theme={props?.theme} />
      <ThirdSectionBox />
    </>
  );
}
// Exporting Full Page
export default function App() {
  const [theme]: any = useOutletContext();
  return <Layout theme={theme} />;
}
