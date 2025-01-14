import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import Box from '@mui/material/Box';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import React , {useEffect, useState} from 'react';
import AdminHeader from '../Component/AdminHeader';
import CssBaseline from '@mui/material/CssBaseline';
import AdminSidebar from '../Component/AdminSidebar';
import { LogoutOutlined } from '@mui/icons-material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LightModeIcon from '@mui/icons-material/LightMode';
import { CommonProvider } from "../Contexts/CommonContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationContext from "../Provider/NotificationProvider";
import { Badge, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material';

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

export default function AdminLayout() {

  const navigate = useNavigate();
  const [theme, settheme] = useState(false); 
  const [themeCustom,setThemeCustom] = useState("light");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing]   = React.useState(false);
  const { adminNotifications }:any = useContext(NotificationContext);

  useEffect(() => {
   if(localStorage.getItem('themeColor') && localStorage.getItem('themeColor') == "dark") {
    settheme(true);
    setThemeCustom("dark");
   } else {
    setThemeCustom("light");
   }
  },[]);

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

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

  useEffect(() => {
    if(localStorage.getItem('admintoken')) {
      getAllUnreadNotification();
    } else {
      navigate('/myapp/admin');
    }
  },[adminNotifications]);

  const [unReadNotification,setUnReadNotification] = React.useState<any>([]);

  const getAllUnreadNotification = async () => {
    await axios.get(`/${url}/v1/admin/notification/admin-unread`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result?.data?.status == "201") {
        setUnReadNotification(result?.data?.data);
        if(result?.data?.data?.length > 0) {          
          setNotifyBell(true);
        }
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const [isOpen, setIsOpen] = useState(false);
  const [notifyBell,setNotifyBell] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // @ts-ignore
    adminNotifications?.map((item:any) => {
      setNotifyBell(true);
    });
  },[adminNotifications])

  const toggleNotificationCenter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(!isOpen);
    setNotifyBell(false);
  };

  const updateUnReadAllMessage = async () => {
    const currentUser = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    if(unReadNotification?.length > 0) {
      await axios.patch(`/${url}/v1/admin/notification/admin-update-unread`,{
        "user": currentUser?.data?.id
      }, {
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
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
      MuiInputBase: {
        styleOverrides: {
          input: {
            color: theme ? 'white': '#183153',
          }
        }
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
      MuiTablePagination: {
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
        dark: "#F5F5F5",
      },
      background: {
        default: theme ? '#183153' : '#F5F5F5',
      },
      text: {
        primary: theme ? '#183153' : '#183153',
        secondary: theme ? '#183153' : '#183153',
      },
      contrastThreshold: 4,
    }, 
  });

  const [open2, setIsOpen2] = useState(false);
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    setAnchorEl2(event.currentTarget);
    setIsOpen2(!open2);
  };

  const logout = () => {
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

  return (
  <>
   <ThemeProvider theme={darkTheme}>
    <CommonProvider>
    <CssBaseline />
     <Box sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex' }}>
       <AppBar
         position="fixed"
         color={theme ? 'primary': 'secondary'}
         sx={{
          width: {md: `calc(100% - ${drawerWidth}px)`},
          ml: {md: `${drawerWidth}px`},
          boxShadow: {md: `none`},
          backgroundImage: 'black',
          color: {xs: 'white', sm: 'black'},
          background: {xs: '#8657E5', sm: `${theme ? '#183153': '#F5F5F5'}`}
         }}
         enableColorOnDark
       >
        <AdminHeader theme={theme} change={handleChange} mobileOpen={mobileOpen} isClosing={isClosing} setMobileOpen={setMobileOpen} setIsClosing={setIsClosing} />
      </AppBar>
      <AdminSidebar theme={theme} change={handleChange} mobileOpen={mobileOpen} isClosing={isClosing} setMobileOpen={setMobileOpen} setIsClosing={setIsClosing} />
    </Box>
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, background: { xs: `${theme ? '#183153' : '#F5F5F5'}` },width: { md: `calc(100% - ${drawerWidth}px)` } }}
    >
      <Toolbar />
      <Grid style={{position: 'absolute', top: '10px', right: '20px', zIndex: '900000'}}> 
      <Grid sx={{display: { xs: 'none', sm: 'flex' }, flexDirection: 'row' , flexWrap: 'wrap', gap: '50px' , margin: {md: '20px'}}}>
          <Grid>
            <Box sx={{ margin: "-2px" }}>
               <div className="notification">
                  <IconButton className="notification-btn" size="small" onClick={toggleNotificationCenter}>
                    <Badge variant="dot" invisible={!notifyBell} color="primary">
                      <NotificationsIcon color="action" sx={{ color: `${theme ? 'white': 'black'}` }} />
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
                          (notification?.notifyFrom == "user") ?
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
                      unReadNotification?.length == 0 &&
                      <p style={{ textAlign: 'center', padding: '30px' }}>No notification found</p>
                    }
                  </div>
               </div>
            </Box>
          </Grid>
          <Grid sx={{ cursor: 'pointer' }}>
          {
            themeCustom == "light" ?
            <LightModeIcon onClick={() => newhandleChange("light")} /> :
            <DarkModeIcon sx={{ color: 'white' }} onClick={() => newhandleChange("dark")}  />
          }
          </Grid>
          <Grid sx={{ cursor: 'pointer', color: `${theme ? 'white': 'black'}` }} onClick={() => logout()}><LogoutOutlined /></Grid>
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
          <Menu
            anchorEl={anchorEl2}
            open={open2}
          >
            <MenuItem><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`} onClick={() => logout()}>Logout</span></MenuItem>
          </Menu>
        </Grid>  
      </Grid>
      <Outlet context={[theme]} />
      </Box>
    </Box>
    </CommonProvider>
   </ThemeProvider>
  </>  
 )
}

