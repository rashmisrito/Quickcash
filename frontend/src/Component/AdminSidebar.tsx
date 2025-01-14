import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import { Collapse } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import ListItem from '@mui/material/ListItem';
import { deepPurple } from '@mui/material/colors';
import ListItemText from '@mui/material/ListItemText';
import { AuthContext } from '../Contexts/AuthContext';
import ListItemIcon from '@mui/material/ListItemIcon';
import {useState, useContext, useEffect } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import { useLocation, useNavigate } from 'react-router-dom';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
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
    superadmin: boolean;
    profile: string;
  };
}

export default function AdminSidebar(props:any) {

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
    navigate(`/admin/${data}`);
  }

  const [dataResult,setData] = useState<string>('');
  const [dataName,setDataName] = useState<string>('');
  const [IsSuperAdmin,setSuperAdmin] = useState<boolean>(false);
  const [profileImage,setProfileImage] = useState<any>('');

  useEffect(() => {
    if(localStorage.getItem('admintoken')) {
      const decoded = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
      setData(decoded?.data?.email)
      setDataName(decoded?.data?.name);
      setSuperAdmin(decoded?.data?.superadmin);
      setProfileImage(decoded?.data?.profile);
    }
  },[]);

  const logout = () => {
    setAuthenticated(false);
    localStorage.clear();
    alertnotify("Logout Successfully!!!", "success");
    navigate('/myapp/admin');
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
    <div className={`${props?.theme ? 'bgWhite': 'bgBlack'}`}>
      <Toolbar>
        <Stack direction="row" spacing={2}>
          <Avatar 
            src={`${import.meta.env.BASE_URL}/${profileImage }`}
            sx={{ bgcolor: deepPurple[500] }} 
            variant='rounded'>{dataName?.substring(0,2).toUpperCase()}
          </Avatar>
          <Stack className={`${props.theme ? 'avatarDark': 'avatarLight'}`} direction="column" style={{flex:'row'}}>
            <div>{dataName}</div>
            <div>{dataResult}</div>
          </Stack>
        </Stack>
      </Toolbar>
      {/* <Divider /> */}
      <List>
        <div onClick={() => HandleClosenav('dashboard')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="0" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('dashboard') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/dashboard.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="3" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('userlist') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton onClick={() => handleClick('userlist')}>
            <ListItemIcon>
              <img src={`${import.meta.env.VITE_APP_URL}/icons/userprofile.png`} className='listItemIcon' width={30} />
            </ListItemIcon>
            <ListItemText primary="User" />
            {open && subMenu == "userlist" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </ListItem>
        </div>

        <Collapse in={open && subMenu == "userlist" ? true : false} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('userlist')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/list.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary="User List" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
          </List>
        </Collapse>

        <div style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="3" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('fiat') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton onClick={() => handleClick('total-transactions')}>
            <ListItemIcon>
              <img src={`${import.meta.env.VITE_APP_URL}/icons/adminFiat.png`} className='listItemIcon' width={30} />
            </ListItemIcon>
            <ListItemText primary="Fiat" />
            {open && subMenu == "total-transactions" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </ListItem>
        </div>

        <Collapse in={open && subMenu == "total-transactions" ? true : false} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('total-transactions')}>
              <ListItemIcon>
               
              </ListItemIcon>
              <ListItemText primary="Total Transactions" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('bank-transfer-request')}>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary="Pending Transactions" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
          </List>
        </Collapse>

        <div style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="3" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('crypto') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton onClick={() => handleClick('wallet-request')}>
            <ListItemIcon>
              <img src={`${import.meta.env.VITE_APP_URL}/icons/crypto.png`} className='listItemIcon' width={30} />
            </ListItemIcon>
            <ListItemText primary="Crypto" />
            {open && subMenu == "wallet-request" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </ListItem>
        </div>

        <Collapse in={open && subMenu == "wallet-request" ? true : false} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('wallet-request')}>
              <ListItemIcon>
                {/* <ArrowForwardIcon /> */}
              </ListItemIcon>
              <ListItemText primary="Wallet Request" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('transactions')}>
              <ListItemIcon>
                {/* <ArrowForwardIcon /> */}
              </ListItemIcon>
              <ListItemText primary="Crypto Transfer Request" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
            {/* <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('spots')}>
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
              <ListItemText primary="Spots" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton> */}
          </List>
        </Collapse>

        <div style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="3" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('admins') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton onClick={() => handleClick('profile')}>
            <ListItemIcon>
             <img src={`${import.meta.env.VITE_APP_URL}/icons/admin.png`} className='listItemIcon' width={30} />
            </ListItemIcon>
            <ListItemText primary="Admin" />
            {open && subMenu == "profile" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </ListItem>
        </div>

        <Collapse in={open && subMenu == "profile" ? true : false} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          {
              IsSuperAdmin &&
              <>
                <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('profile')}>
                  <ListItemIcon>
                    
                  </ListItemIcon>
                  <ListItemText primary="Profile" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
                  </ListItemButton>
              
                <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('admin-users')}>
                  <ListItemIcon>
                    
                  </ListItemIcon>
                  <ListItemText primary="Users" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
                </ListItemButton>
              </>
          }
            {/* <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('admin-bank')}>
              <ListItemIcon>
                
              </ListItemIcon>
              <ListItemText primary="Admin Bank" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton> */}
            {/* <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('common-bank')}>
              <ListItemIcon>
                
              </ListItemIcon>
              <ListItemText primary="Common Bank" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton> */}
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('revenue')}>
              <ListItemIcon>
               
              </ListItemIcon>
              <ListItemText primary="Total Revenue" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
          </List>
        </Collapse>

        {/* {
              IsSuperAdmin &&
              <>
                <div onClick={() => HandleClosenav('admin-users')} style={{textDecoration: 'none' , color: 'black'}}>
                  <ListItem key="0" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('admin-users') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
                    <ListItemButton>
                      <ListItemIcon>
                        <AdminPanelSettingsIcon className='listItemIcon'/>
                      </ListItemIcon>
                      <ListItemText primary={"Admin Users"} />
                    </ListItemButton>
                  </ListItem>
                </div>
              </>
            } 
        */}

        <div onClick={() => HandleClosenav('spots')} style={{display: 'none',textDecoration: 'none' , color: 'black'}}>
          <ListItem key="1" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('spots') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <RecentActorsIcon className='listItemIcon'/>
              </ListItemIcon>
              <ListItemText primary={"Spots"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="3" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('fee-structure') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton onClick={() => handleClick('fee-structure')}>
            <ListItemIcon>
              <img src={`${import.meta.env.VITE_APP_URL}/icons/fee.png`} className='listItemIcon' width={30} />
            </ListItemIcon>
            <ListItemText primary="Fee Details" />
            {open && subMenu == "fee-structure" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </ListItem>
        </div>

        <Collapse in={open && subMenu == "fee-structure" ? true : false} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('fee-structure')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/list.png`} className='subitem' width={30} />
              </ListItemIcon>
              <ListItemText primary="List" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
          </List>
        </Collapse>

        <div onClick={() => HandleClosenav('referrals')} style={{display: 'none',textDecoration: 'none' , color: 'black'}}>
          <ListItem key="4" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('referrals') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <AccountBalanceWalletIcon className='listItemIcon'/>
              </ListItemIcon>
              <ListItemText primary={"Referrals"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('kyc')}style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="6" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('kyc') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/kycverify.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"KYC"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('tickets')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="7" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('tickets') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/support.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Tickets"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('notifications')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="16" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('notifications') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/notifications.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Notifications"} />
            </ListItemButton>
          </ListItem>
        </div>

        <div onClick={() => HandleClosenav('currency-list')} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="16" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('currency-list') ? `${props.theme ? 'active__hover__listhoverDark' : 'active__hover__listhover'}` : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/currencylist.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Currency List"} />
            </ListItemButton>
          </ListItem>
        </div>

        {/* <div onClick={() => HandleClosenav('email-template')}style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="6" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('email-template') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <CurrencyBitcoinIcon className='listItemIcon'/>
              </ListItemIcon>
              <ListItemText primary={"Email Template"} />
            </ListItemButton>
          </ListItem>
        </div> */}

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
        </Collapse> */}

        <div style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="9" className={`${props.theme ? 'listHoverDark': 'listHover'} ${pathname.includes('invoices') ? 'active__hover__listhover' : ''}`} style={{cursor: 'pointer'}}>
            <ListItemButton onClick={() => handleClick('invoices')}>
            <ListItemIcon>
              <img src={`${import.meta.env.VITE_APP_URL}/icons/invoices.png`} className='listItemIcon' width={30} />
            </ListItemIcon>
            <ListItemText primary="Invoices" />
            {open && subMenu == "invoices" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </ListItem>
        </div>

        <Collapse in={open && subMenu == "invoices" ? true : false} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('invoices/taxes')}>
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
              <ListItemText primary="Tax" sx={{color: `${props?.theme ? 'white': 'black'}` }}/>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('invoices/payment-qr-codes')}>
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
              <ListItemText primary="Payment QR Code" sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('invoices/template-settings')}>
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
              <ListItemText primary="Invoice Templates" sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton> */}
            <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('invoice-section')}>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/list.png`} className='subitem' width={30} />
              </ListItemIcon>
              <ListItemText primary="List" sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton>
            {/* <ListItemButton sx={{ pl: 4 }} onClick={() => HandleClosenav('settings')}>
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" sx={{color: `${props?.theme ? 'white': 'black'}` }} />
            </ListItemButton> */}
          </List>
        </Collapse>

        <div onClick={() => logout()} style={{textDecoration: 'none' , color: 'black'}}>
          <ListItem key="10" className={`${props.theme ? 'listHoverDark': 'listHover'}`} style={{cursor: 'pointer'}}>
            <ListItemButton>
              <ListItemIcon>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/logout.png`} className='listItemIcon' width={30} />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </div>
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
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth , padding:'0px' },
      }}
      open
    >
      {drawer}
    </Drawer>
   </Box>
  </>
 )
}
