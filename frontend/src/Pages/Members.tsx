import axios from 'axios';
import moment from 'moment';
import Menu from '@mui/material/Menu';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button, { ButtonProps } from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Grid, MenuItem, Select } from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate , useOutletContext } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#2196f3",
  '&:hover': {
    backgroundColor: "#2196f3",
  },
}));

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

export default function Members() {
  const navigate = useNavigate();
  const [theme]:any = useOutletContext();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [lists,setLists] = useState<any>([]);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [moreVal,setMoreVal] = useState<any>('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    var valpo = event.currentTarget.value.split('-');
    setMoreVal(valpo[0]);
    setAnchorEl(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl(null);
  };

  const HandleCustomData = (e:any) => {
    e.preventDefault();
    if(startDate == undefined || endDate == undefined) {
      alertnotify("Both date's are mandatory to fill", "error");
    } else {
      const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      if(endDate) {
        getMembersList(decoded.data.id,1,activeDuration,moment(startDate.$d).format("YYYY-MM-DD"),moment(endDate.$d).format("YYYY-MM-DD"));
        alertnotify("Success", "success");
      }
    }
  };

  const itemsPerPage = 10;
  const [activeDuration,setactiveduration] = useState<any>(1);
  const [pageCount, setPageCount] = useState(0);
  const [totalItems,setTotalItems] = useState(0);
  const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    
   useEffect(() => {
     const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
     getMembersList(decoded?.data.id,1,1,'','');
   },[]);

  const getMembersList = async (id:any,selectedPage:any,days:any,from:any, to:any) => {
    await axios.get(`/${url}/v1/member/list/${id}?page=${selectedPage}&size=${itemsPerPage}&days=${days}&from=${from}&to=${to}`,
     {
       headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setLists(result.data.data);
        setPageCount(result.data.totalPages);
        setTotalItems(result.data.totalCount);
      }
    })
    .catch(error => {
      console.log("error", error);
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

  const deleteMemb = async (id:any) => {
    if(confirm("Are you sure to want to Delete?") == true) {
      await axios.delete(`/${url}/v1/member/delete/${id}`,
      {
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == "201") {
          alertnotify(result.data.message,"success");
          const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
          getMembersList(decoded?.data.id,1,1,'','');
        }
      })
      .catch(error => {
        console.log("error", error);
      })
    } else {
      return false;
    }    
  }

   const viewMemb = (id:any) => {
     navigate(`/view-details/${id}`);
   }

   const HandleDurationFilter = (days:any) => {
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getMembersList(decoded?.data.id,1,days,'','');
    setactiveduration(days);
   }

  return (
    <>
      <Box sx={{ marginLeft: {md:'7%'} , marginTop: '12px' , fontSize: '15px', width: '90%'}}>
         <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '10px'}}>
             <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
                <Grid>
                  <ColorButton variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/add-member')}>
                    Add Team Member
                  </ColorButton>
                </Grid>
                <Grid>
                  <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '10px 1px' }}>
                    <Grid>Team Members</Grid>
                  </Grid>
                  <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                    <Grid>
                      <Diversity3Icon sx={{ fontSize: '59px' }}/>
                    </Grid>
                    <Grid sx={{ padding: '20px 12px' }}>
                     { lists.length == 0 ? 'No team members to show yet!' : 
                      <>
                       {lists?.length}
                      </>
                     }
                    </Grid>
                  </Grid>
                  <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '10px 1px' }}>
                    { lists.length == 0 &&
                     <>
                       There is no team member
                     </>
                    }
                  </Grid>
                </Grid>
             </Grid>

            <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
             <Box>
              <label className='mx-3'>Filter</label>
              <Select name="duration" id="duration" onChange={(e) => HandleDurationFilter(e.target.value)} style={{border: '1px solid silver' , height: '36px', width: '100%'}}>
                <MenuItem value="1"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Today</span></MenuItem>
                <MenuItem value="7"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Last 7 days</span></MenuItem>
                <MenuItem value="30"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>1 Month</span></MenuItem>
                <MenuItem value="custom"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Custom</span></MenuItem>
              </Select>

              {
               activeDuration && activeDuration == "custom" &&
               <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid sx={{display: 'flex' , gap: '10px' , color: 'white' , marginTop: '10px'}}>
                    
                    <DatePicker 
                      label="Start Date" 
                      value={startDate} 
                      onChange={(newValue) => setStartDate(newValue)} 
                      sx={{border: '1px solid silver'}}
                      slotProps={{
                        layout: {
                          sx: {
                            color: '#ad1457',
                            borderRadius: '2px',
                            borderWidth: '1px',
                            borderColor: '#e91e63',
                            border: '1px solid',
                            backgroundColor: 'white',
                          }
                        }
                      }} 
                    />
                    <DatePicker 
                      label="End Date" 
                      value={endDate} 
                      onChange={(newValue) => setEndDate(newValue)} 
                      sx={{border: '1px solid silver'}}
                      slotProps={{
                        layout: {
                          sx: {
                            color: '#ad1457',
                            borderRadius: '2px',
                            borderWidth: '1px',
                            borderColor: '#e91e63',
                            border: '1px solid',
                            backgroundColor: 'white',
                          }
                        }
                      }}  
                    />
                    <ColorButton sx={{width: '100px'}} onClick={(e) => HandleCustomData(e)}>Submit</ColorButton>
                  </Grid>
                </LocalizationProvider>  
               </>     
              }

             </Box>
             <Box className="crypto">
               <table>
                  <caption>Member List</caption>
                  <thead>
                    <tr>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Mobile</th>
                      <th scope="col">From Date</th>
                      <th scope="col">To Date</th>
                      <th scope="col">Created At</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    lists?.map((item:any,index:number) => (
                    <tr key={index}>
                      <td data-label="Username" style={{ wordWrap: 'break-word' }}>{item.username}</td>
                      <td data-label="Email" style={{ wordWrap: 'break-word' }}>{item.email}</td>
                      <td data-label="Mobile" style={{ wordWrap: 'break-word' }}>{item.mobile}</td>
                      <td data-label="FromDate" style={{ wordWrap: 'break-word' }}>{moment(item.date_from).format('MMMM Do YYYY, h:mm:ss A')}</td>
                      <td data-label="ToDate" style={{ wordWrap: 'break-word' }}>{moment(item.date_to).format('MMMM Do YYYY, h:mm:ss A')}</td>
                      <td data-label="CreatedAt" style={{ wordWrap: 'break-word' }}>{item.createdAt}</td>
                      <td data-label="Action" style={{ wordWrap: 'break-word' }}>
                        {/* <EditIcon sx={{cursor: 'pointer' }} onClick={() => navigate(`/edit-member/${item._id}`)} />
                        <VisibilityIcon sx={{cursor: 'pointer', marginLeft:'12px' }} onClick={() => viewMemb(item._id)} />
                        <DeleteIcon sx={{cursor: 'pointer', marginLeft:'12px' }} onClick={() => deleteMemb(item._id)} /> */}
                        <IconButton
                          aria-label="more"
                          id={`long-button${item?._id}`}
                          aria-controls={open2 ? `long-menu${item?._id}` : undefined}
                          aria-expanded={open2 ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={handleClick}
                        >
                          <MoreVertIcon sx={{color: 'black'}}/>
                        </IconButton>
                        <Menu
                          key={item?._id}
                          id={`long-menu${item?._id}`}
                          MenuListProps={{
                          'aria-labelledby': `long-button${item?._id}`,
                          }}
                          anchorEl={anchorEl}
                          open={open2}
                          onClose={handleClose2}
                        >
                          <MenuItem><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}><VisibilityIcon sx={{ cursor: 'pointer' }} onClick={() => viewMemb(item._id)}/></span></MenuItem>
                          <MenuItem><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}><EditIcon sx={{ cursor: 'pointer' }} onClick={() => navigate(`/edit-member/${item._id}`)} /></span></MenuItem>
                          <MenuItem><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}><DeleteIcon sx={{ cursor: 'pointer' }} onClick={() => deleteMemb(item._id)} /></span></MenuItem>
                        </Menu>
                      </td>
                    </tr>
                    ))}
                    {
                      lists.length == 0 && 
                      <>
                        <tr>
                          <td colSpan={7}>No Data Found</td>
                        </tr>
                      </>
                    }
                  </tbody>
              </table>
             </Box>
            </Grid>
         </Grid>
      </Box>
    </>
  )
}
