import axios from 'axios';
import moment from 'moment';
import { useContext } from "react";
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useKyc } from '../Hooks/useKyc';
import Header from '../Component/Header';
import AppBar from '@mui/material/AppBar';
import Switch from '@mui/material/Switch';
import Sidebar from '../Component/Sidebar';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import React , {useEffect, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, Outlet, useNavigate } from "react-router-dom";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationContext from '../Provider/NotificationProvider';
import { Badge, Grid, IconButton,Menu,MenuItem,Tooltip, Typography } from '@mui/material';

const drawerWidth = 290 ;

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

export default function UserLayout() {

  const navigate = useNavigate();
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);
  const [theme, settheme] = useState(false); 

  const [themeCustom,setThemeCustom] = useState("light");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing]   = React.useState(false);
  const { notifications }:any = useContext(NotificationContext);
  const [unReadNotification,setUnReadNotification] = React.useState<any>([]);

  const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);

  const { kcyDetails } = useKyc(accountId?.data?.id); 

  const [kycFlag,setKycFlag] = React.useState<boolean>(false);

  useEffect(() => {
    setTimeout(()=> {
      setKycFlag(true);
    },10);
  },[]);

  useEffect(() => {
   if(localStorage.getItem('themeColor') && localStorage.getItem('themeColor') == "dark") {
    settheme(true);
    setThemeCustom("dark");
   } else {
    setThemeCustom("light");
   }
  },[]);

  const handleChange = (event:any) => { 
    if(event.target.checked) {
      localStorage.setItem('themeColor', 'dark');
      setThemeCustom("dark");
    } else {
      localStorage.setItem('themeColor', 'light');
      setThemeCustom("light");
    }
    settheme(event.target.checked); 
  }
  
  const newhandleChange = (event:any) => { 
    if(event == "dark") {
      localStorage.setItem('themeColor', 'light');
      setThemeCustom("light");
      settheme(false); 
    } else {
      localStorage.setItem('themeColor', 'dark');
      setThemeCustom("dark");
      settheme(true); 
    }
  }

  const [notifyBell,setNotifyBell] = React.useState<boolean>(false);
  const currentUser = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);

  useEffect(() => {
    notifications?.map((item:any) => {
      console.log("user", item?.user,currentUser);
      if((item?.type == "user" || item?.type == "crypto" || item?.type == "kyc") && item?.user == currentUser?.data?.id) {
        setNotifyBell(true);
        console.log("4");
      } else if(item?.type == "all") {
        setNotifyBell(true);
        console.log("5");
      }
    });
  },[notifications])

  useEffect(() => {
    getAllUnreadNotification();
  },[]);

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const getAllUnreadNotification = async () => {
    await axios.get(`/${url}/v1/admin/notification/unread`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.data?.status == "201") {
        setUnReadNotification(result?.data?.data);
        if(result?.data?.data?.length > 0) {
          if(result?.data?.usersGroup && result?.data?.usersGroup.includes(currentUser?.data?.id)) {
            console.log("1");
            setNotifyBell(true);
          } 
          
          result?.data?.data?.map((item:any) => {
            if(item?.user == currentUser?.data?.id) {
              console.log("2");
              setNotifyBell(true);
            }
            if(item?.user == currentUser?.data?.id && item?.read == false) {
              console.log("3");
              setNotifyBell(true);
            }
          });

        }
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const darkTheme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          scrollBar: {
            scrollbarColor: "#6b6b6b #fff",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: "#2b2b2b",
              width: '6px'
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 1,
              backgroundColor: "#6b6b6b",
              minHeight: 24,
              border: "1px solid #2b2b2b",
              scrollbarWidth: 'thin',
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
              backgroundColor: "#959595",
              scrollbarWidth: 'thin',
            },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
              backgroundColor: "#959595",
              scrollbarWidth: 'thin',
            },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#959595",
              scrollbarWidth: 'thin',
            },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
              backgroundColor: "#2b2b2b",
              scrollbarWidth: 'thin',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: theme ? '#183153': 'light',
            borderRight: theme ? '1px solid transparent': '1px solid #F5F5F5 !important',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          ...{'root': {
            outline: '01px solid white'
          }}
        }
      },
      MuiSelect: {
        styleOverrides: {
          ...{'root': {
            outline: '0.1px solid white'
          }}
        }
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: theme ? 'dark': 'light',
            backgroundImage: 'unset'
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          root: {
            background: theme ? 'dark': 'light'
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: theme ? 'white': 'black'
          }
        }
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: '0px',
            paddingBottom: '0px'
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: theme ? '#183153' : '#F5F5F5',
            text: theme ? '#fff' : '#fff'
          },
        },
      },
    },
    palette: { 
      //mode: theme ? 'dark' : 'light',
      primary: {
        main: '#183153',
        light: "#FFFFFF",
        dark: "#FFFFFF",
      }, 
      secondary: {
        main: '#F5F5F5',
        light: "#F5F5F5",
        dark: "black",
      },
      background: {
        default: theme ? '#183153' : '#F5F5F5',
      },
      text: {
        primary: theme ? '#FFFFFF' : '#183153',
        secondary: theme ? '#183153' : '#183153',
      },
      contrastThreshold: 4,
    }, 
  });

  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const open2 = Boolean(anchorEl2);
  const [open2, setIsOpen2] = useState(false);

  const toggleNotificationCenter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(!isOpen);
    setNotifyBell(false);
  };

  const close = () => {
    setAnchorEl(null);
  };

  const updateUnReadAllMessage = async () => {
    if(unReadNotification?.length > 0) {
      await axios.patch(`/${url}/v1/admin/notification/update-unread`,{
        "user": currentUser?.data?.id
      }, {
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result?.data?.status == "201") {
          getAllUnreadNotification();
          console.log(result?.data?.data);
        }
      })
      .catch(error => {
        console.log("error", error);
      });
    }
  }

  const updateLoginSession = async () => {
    await axios.patch(`/myapp/v1/session/update`, {
      user:localStorage.getItem('usersessionid') ,
      isActiveNow:0
    })
    .then((result => {
      if(result.status == 200) {}
    }))
    .catch(error => {
      console.log("Login api error", error);
    })
  }

  const logout = () => {
    updateLoginSession();
    localStorage.clear();
    alertnotify("Logout Successfully!!!", "success");
    navigate('/');
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

  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    setAnchorEl2(event.currentTarget);
    setIsOpen2(!open2);
  };

  return (
  <>
   <ThemeProvider theme={darkTheme}>
    <CssBaseline />
     <Box sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex' }}>
       <AppBar
         position="fixed"
         color={theme ? 'primary': 'secondary'}
         enableColorOnDark
         sx={{
          width: {md: `calc(100% - ${drawerWidth}px)`},
          ml: {md: `${drawerWidth}px`},
          boxShadow: {md: `none`},
          backgroundImage: 'black',
          color: {xs:  `${theme ? 'white': 'black'}` },
          background: {xs: '#8657E5', sm: `${theme ? '#183153': '#F5F5F5'}`}
         }}
       >
        <Header theme={theme} change={handleChange} mobileOpen={mobileOpen} isClosing={isClosing} setMobileOpen={setMobileOpen} setIsClosing={setIsClosing} />
      </AppBar>
      <Sidebar theme={theme} change={handleChange} mobileOpen={mobileOpen} isClosing={isClosing} setMobileOpen={setMobileOpen} setIsClosing={setIsClosing} />
    </Box>
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, background: { sm: `${theme ? '#183153' : '#F5F5F5'}` }, width: { md: `calc(100% - ${drawerWidth}px)` } }}
    >
      <Toolbar />
      <Grid style={{position: 'fixed',top: '10px', right: '20px', zIndex: '900000'}}> 
        <Grid sx={{display: { xs: 'none', sm: 'flex' }, flexDirection: 'row' , flexWrap: 'wrap', gap: '50px' , margin: {md: '20px'}}}>
          { kycFlag && 
            kcyDetails?.[0]?.status == "completed" &&
            <>
              <Tooltip title="Kyc Verified" sx={{ cursor: 'pointer' }} placement="top-start">
                <img src={`${import.meta.env.VITE_APP_URL}/icons/kycverify.png`} className='listItemIcon' width={30} />
              </Tooltip>
            </>
          }
          {
            kycFlag && kcyDetails?.[0]?.status == "Pending" &&
            <>
              <Tooltip title="Kyc Pending" sx={{ cursor: 'pointer' }} placement="top-start">
                <img src={`${import.meta.env.VITE_APP_URL}/icons/kycpending.png`} className='listItemIcon' width={30} />
              </Tooltip>
            </>
          }
          <Grid>
            <Box sx={{ margin: "-2px" }}>
              <div className="notification">
                  <IconButton className="notification-btn" size="small" onClick={toggleNotificationCenter}>
                    <Badge variant="dot" invisible={!notifyBell} color="primary">
                      <NotificationsIcon sx={{ color: `${theme ? 'white': 'black'}` }}/>
                    </Badge>
                  </IconButton>
                  <div className="dropdown-content">
                    <div className="button-container">
                      <button className="view-all-btn" onClick={() => window.location.href = 'notificationall'}>View All</button>
                      <button className="mark-read-btn" onClick={() => updateUnReadAllMessage()}>Mark All Read</button>
                    </div>
                    <div className="notification-list">
                      
                      {
                        unReadNotification?.map((notification:any) => (
                        <>
                        {
                          (notification?.notifyType == "user" || notification?.notifyType == "crypto" || notification?.notifyType == "kyc" || notification?.notifyType == "transaction" || notification?.notifyType == "ticket") && notification?.user == currentUser?.data?.id ?
                          <>
                            <p>
                            <Grid sx={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                              <Grid sx={{color: 'black', padding: '3px 2px', fontSize: '14px', marginLeft: '12px'}}>{moment(notification?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</Grid>
                                <Grid>
                                  <Typography sx={{color: 'black', padding: '3px 2px',fontSize: '14px', marginLeft: '12px'}}>
                                   <Link to="#" style={{textDecoration: 'none'}}>{notification?.title}</Link>
                                  </Typography>
                                </Grid>
                            </Grid>
                            </p>
                          </>
                            :
                            null
                          }
                          {
                            notification?.notifyType == "all" ?
                            <>
                              <Grid sx={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                                <Grid sx={{color: 'black', padding: '3px 2px', fontSize: '14px', marginLeft: '12px'}}>{moment(notification?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</Grid>
                                  <Grid>
                                    <Typography sx={{color: 'black', padding: '3px 2px',fontSize: '14px', marginLeft: '12px'}}>
                                      <Link to="#" style={{textDecoration: 'none'}}>{notification?.title}</Link>
                                    </Typography>
                                  </Grid>
                                </Grid>
                            </>
                            :
                            null
                          }
                        </>
                        ))
                      }
                    </div>
                    {
                      unReadNotification?.length == 0 || !notifyBell &&
                      <p style={{ textAlign: 'center', padding: '30px' }}>No notification found</p>
                    }
                  </div>
               </div>
            </Box>
          </Grid>
          <Grid sx={{ cursor: 'pointer' }}>
          {
            themeCustom == "light" ?
            <Tooltip title="Light Mode" sx={{ cursor: 'pointer' }} placement="top-start">
              <LightModeIcon onClick={() => newhandleChange("light")} />
            </Tooltip>
            :
            <Tooltip title="Dark Mode" sx={{ cursor: 'pointer' }} placement="top-start">
              <DarkModeIcon sx={{ color: 'white' }} onClick={() => newhandleChange("dark")}  />
            </Tooltip>
          }
          </Grid>
          <Grid sx={{ cursor: 'pointer', color: `${theme ? 'white': 'black'}` }} onClick={() => navigate('/help-center')}>
            <>
              <Tooltip title="Ticket Support" sx={{ cursor: 'pointer' }} placement="top-start">
                <SupportAgentIcon />
              </Tooltip>
            </>
          </Grid>
          <Grid sx={{ cursor: 'pointer', color: `${theme ? 'white': 'black'}` }} onClick={() => logout()}>
            <Tooltip title="Logout" sx={{ cursor: 'pointer' }} placement="top-start">
              <img src={`${import.meta.env.VITE_APP_URL}/icons/logout.png`} className='listItemIcon' width={24} />
            </Tooltip>
          </Grid>
        </Grid>
        <Grid sx={{display: { xs: 'flex', sm: 'none' }, flexDirection: 'row' , flexWrap: 'wrap', gap: '50px' , margin: {md: '20px'}}}>
          <IconButton
            aria-label="more"
            aria-expanded={open2 ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(e) => handleClick(e)}
            sx={{ color: 'white' }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl2} open={open2}>
            <MenuItem><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`} onClick={() => navigate('/kyc')}>KYC</span></MenuItem>
            <MenuItem><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`} onClick={() => navigate('/help-center')}>Ticket</span></MenuItem>
            <MenuItem><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`} onClick={() => logout()}>Logout</span></MenuItem>
          </Menu>
        </Grid>  
      </Grid> 
      <Outlet context={[theme]} />
     </Box>
    </Box>
   </ThemeProvider>
  </>  
 )
}
