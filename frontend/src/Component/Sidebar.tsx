import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import ListItem from '@mui/material/ListItem';
import HomeIcon from '@mui/icons-material/Home';
import { Collapse, Divider, Tooltip } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';
import WalletIcon from '@mui/icons-material/Wallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddCardIcon from '@mui/icons-material/AddCard';
import ListItemText from '@mui/material/ListItemText';
import { AuthContext } from '../Contexts/AuthContext';
import Groups3Icon from '@mui/icons-material/Groups3';
import ListItemIcon from '@mui/material/ListItemIcon';
import React, {useState, useContext, useEffect } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListItemButton from '@mui/material/ListItemButton';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useLocation, useNavigate } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ScoreRoundedIcon from '@mui/icons-material/ScoreRounded';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const drawerWidth = 290;

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

export default function Sidebar(props:any) {

  const [open, setOpen] = useState(false);
  const [subMenu,setSubMenu] = useState<any>('');

  const handleClick = (val:any) => {
    val == subMenu && open == true ? setOpen(false) : setOpen(true);
    setSubMenu(val);
  };

  const {pathname} = useLocation();
  const {authenticated,setAuthenticated} = useContext(AuthContext);
  const navigate = useNavigate();
  const { window } = props;

  const handleDrawerClose = () => {
    props.setIsClosing(true);
    props.setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    props.setIsClosing(false);
  };

  const HandleClosenav = (data:any) => {
    props.setMobileOpen(false);
    props.setIsClosing(true);
    navigate(`/${data}`);
  }

  const [dataResult,setData] = useState<string>('');
  const [dataName,setDataName] = useState<string>('');

  useEffect(() => {
    if(localStorage.getItem('token')) {
      const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      setData(decoded?.data.email)
      setDataName(decoded?.data.id);
      getProfilePhoto();
    }
  },[]);
  
  const updateLoginSession = async () => {
    await axios.patch(`/api/v1/session/update`, {
      user:localStorage.getItem('usersessionid') ,
      isActiveNow:0
    })
    .then((result => {
      if(result.status == 200) {}
    }))
    .catch(error => {
      alertnotify(error.response.data.message, "error");
      console.log("Login api error", error);
    })
  }

  const [profilePic,setProfilePic] = React.useState<any>('');

  const getProfilePhoto = async () => {
    await axios.get(`/api/v1/user/profilephoto`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((result => {
      if(result?.data?.status == 201) {
        setProfilePic(result?.data?.data);
      }
    }))
    .catch(error => {
      alertnotify(error.response.data.message, "error");
      console.log("Login api error", error);
    })
  }

  const alertnotify = (text:any,type:any) => {
    if(type == "error") {
      toast.error(text, {
        position: "top-center",
        autoClose: 1900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    } else {
      toast.success(text, {
        position: "top-center",
        autoClose: 1900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    }
  }

  const drawer = (
    <div className={`${props?.theme ? 'bgWhite': 'bgBlack'}`} style={{  height: '260vh', borderRight: '2px solid transparent', borderBottom: '1px solid transparent' }}>
      <Toolbar>
        <Stack direction="row" spacing={2}>
          {
            profilePic != '' &&
            <img 
              src={`${import.meta.env.VITE_PUBLIC_URL}/storage/${dataName}/${profilePic}`} 
              width={50} 
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src=`${import.meta.env.VITE_APP_URL}/icons/avatar.png`;
              }}  
            />
          }
          {
            profilePic == "" &&
            <img 
            src={`${import.meta.env.VITE_APP_URL}/icons/avatar.png`} 
            width={50}  
          />
          }
          <Stack className={`${props.theme ? 'avatarDark': 'avatarLight'}`} direction="column" style={{flex:'row'}}>
            <div>Quick Cash</div>
            <div style={{ cursor: 'pointer' }}>
              <Tooltip title={dataResult} arrow>
                {/* @ts-ignore */}
                {dataResult?.length > 20 ? dataResult?.substring(0,20)+'...' : dataResult}
              </Tooltip>
            </div>
          </Stack>
        </Stack>
      </Toolbar>
      <Divider sx={{border: '1px solid lavender'}} />
      <List>
        <div onClick={() => HandleClosenav('home')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="0" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('home') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/dashboard.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('cards')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="1" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('cards') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                {/* <AddCardIcon className='listItemIcon'/> */}
                <img src={`${import.meta.env.VITE_APP_URL}/icons/card.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Cards"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('payments')} style={{display: 'none',textDecoration: 'none' , color: 'black'}}>
          <ListItem key="2" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('payments') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <AssignmentIcon className='listItemIcon'/>
              </ListItemIcon>
              <ListItemText primary={"Online Payments"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('members')} style={{display: 'none',textDecoration: 'none' , color: 'black'}}>
          <ListItem key="3" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('members') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <Groups3Icon className='listItemIcon'/>
              </ListItemIcon>
              <ListItemText primary={"Team Members"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('transactions')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="4" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('transactions') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                {/* <AccountBalanceWalletIcon className='listItemIcon'/> */}
                <img src={`${import.meta.env.VITE_APP_URL}/icons/transaction.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Transaction"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('statements')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="5" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('statements') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                {/* <ReceiptLongIcon className='listItemIcon' sx={{ color: `${props?.theme ? 'white': '#BF00D4'}` }} /> */}
                <img src={`${import.meta.env.VITE_APP_URL}/icons/statement.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Statement"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="6" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('crypto') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton onClick={() => handleClick('crypto')}>
            <ListItemIcon>
              {/* <InboxIcon className='listItemIcon'/> */}
              <img src={`${import.meta.env.VITE_APP_URL}/icons/crypto.png`} className='listItemIcon' width={30} />
            </ListItemIcon>
            <ListItemText primary="Crypto" />
            {open && subMenu == "crypto" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </ListItem>
        </div>

        <Collapse in={open && subMenu == "crypto" ? true : false} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('crypto-dashboard')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/spot-trade.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('spot')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/spot-trade.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary={"Spot Trade"} />
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('crypto/wallet')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/wallet.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Wallet Address" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('crypto')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/buysell.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Buy / Sell" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
          </List>
        </Collapse>

        <div onClick={() => HandleClosenav('user-profile')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="7" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('user-profile') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                {/* <PersonIcon className='listItemIcon'/> */}
                <img src={`${import.meta.env.VITE_APP_URL}/icons/userprofile.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"User Profile"} />
            </ListItemButton>
          </ListItem>
        </div>

        {/* <div onClick={() => HandleClosenav('spot')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="8" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('spot') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/spot-trade.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Spot Trade"} />
            </ListItemButton>
          </ListItem>
        </div> */}

        <div onClick={() => HandleClosenav('Company-Details')} style={{display: 'none',textDecoration: 'none' , color: 'black'}}>
          <ListItem key="9" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('Company-Details') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <Groups3Icon className='listItemIcon'/>
              </ListItemIcon>
              <ListItemText primary={"Company Details"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('help-center')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="10" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('help-center') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                {/* <Groups3Icon className='listItemIcon'/> */}
                <img src={`${import.meta.env.VITE_APP_URL}/icons/support.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Tickets"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('invite')}style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="11" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('invite') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                {/* <PersonIcon className='listItemIcon'/> */}
                <img src={`${import.meta.env.VITE_APP_URL}/icons/reward.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Refer & Earn"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="12" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('invoices') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton onClick={() => handleClick('invoices')}>
            <ListItemIcon>
              {/* <ReceiptIcon className='listItemIcon'/> */}
              <img src={`${import.meta.env.VITE_APP_URL}/icons/invoice.png`} className='listItemIcon' width={30} />
            </ListItemIcon>
            <ListItemText primary="Invoices" />
            {open && subMenu == "invoices" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </ListItem>
        </div>

        <Collapse in={open && subMenu == "invoices" ? true : false} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('invoices/Dashboard')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/invoice.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Invoice Dashboard" className='subitemText' sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('invoices/clients')}>
              <ListItemIcon>
                {/* <DoubleArrowIcon className='arrowClass' sx={{ color: `${props?.theme ? 'white': 'black'}` }} /> */}
                <img src={`${import.meta.env.VITE_APP_URL}/icons/group.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Clients" className='subitemText' sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4, background: `${pathname?.split('/')[2] == "category" ? '#FC762F': ''}` }} onClick={() => HandleClosenav('invoices/category')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/categories.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Categories" className='subitemText' sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4,background: `${pathname?.split('/')[2] == "product" ? '#FC762F': ''}` }} onClick={() => HandleClosenav('invoices/product')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/products.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText  className='subitemText' primary="Products" sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('invoices/quotes/list')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/quotes.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Quotes" className='subitemText' sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('invoices/template-settings')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/templates.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Invoice Templates" className='subitemText' sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('invoice-section')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/invoices.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Invoices" className='subitemText' sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('invoices/manual-payment')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/invoicepayment.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Manual Invoice Payment" className='subitemText' sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('invoices/transactions')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/invoicetransaction.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Invoice Transactions" className='subitemText' sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton>
            <ListItemButton className='subitem' sx={{ pl: 4 }} onClick={() => HandleClosenav('settings')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/settings.png`} className='listItemIcon' width={20} />
              </ListItemIcon>
              <ListItemText primary="Settings" className='subitemText' sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton>
          </List>
        </Collapse>
        
        {/* <div style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="10" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('ecommerce') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton onClick={() => handleClick('ecommerce')}>
            <ListItemIcon>
              <InboxIcon className='listItemIcon'/>
            </ListItemIcon>
            <ListItemText primary="Ecommerce" />
            {open && subMenu == "ecommerce" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </ListItem>
        </div>

        <Collapse in={open && subMenu == "ecommerce" ? true : false} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('ecommerce/list')}>
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
              <ListItemText primary="List" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
          </List>
        </Collapse> 
        */}

        {/* <div onClick={() => logout()} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="13" className={`${props.theme ? 'listHoverDark': 'listHover'}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <ExitToAppIcon className='listItemIcon'/>
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </div> */}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
  <>
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }}}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={props.mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
       {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
   </Box>
  </>
 )
}
