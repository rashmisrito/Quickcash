import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom';
import { Colorbtn } from '../Component/Button/ColorButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Box, Grid, TextField, Toolbar, Typography } from '@mui/material';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';

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

export default function EditMember() {
  const params = useParams();
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [theme]:any = useOutletContext();
  const [list,setList] = useState<any>();
  const [mobile,setMobile] = useState("");
  const [date_to,setDateTo] = useState("");
  const [comment,setComment] = useState("");
  const [username,setUsername] = useState("");
  const [date_from,setDateFrom] = useState("");
  const [newList,setNewList] = useState<any>([]);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);

  useEffect(() => {
    getMemberDetailsbyId(params.id);
  },[params.id]);

  const getMemberDetailsbyId = async (id:any) => {
    await axios.get(`/${url}/v1/member/details/${id}`,
    {
      headers: 
      {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
    if(result.data.status == "201") {
      setUsername(result.data.data[0].username);
      setMobile(result.data.data[0].mobile);
      setEmail(result.data.data[0].email);
      setDateFrom(result.data.data[0].date_from);
      setDateTo(result.data.data[0].date_to);
      setComment(result.data.data[0].comment);
      setNewList(result.data.data[0].permissionlist);
    }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const permissions = [
    { value: 'cards', label: 'CARDS' },
    { value: 'payments', label: 'PAYMENTS' },
    { value: 'members', label: 'MEMBERS' },
    { value: 'statements', label: 'STATEMENTS' },
    { value: 'profile', label: 'PROFILE' }
  ]

  const defaultPermissions = () => {
    let defaultOptions:any[] = [];
    if(newList.length > 0) {
      newList.map((item:any) => {
        defaultOptions.push({
          value:item,
          label: item.toUpperCase() 
        })
      })
      return defaultOptions;
    } else {
      return;
    }
  }

    const HandlePermissionList = (e:any) => {
      setList(Array.isArray(e) ? e.map(x => x.value) : []);
    } 

    const HandlEditMemberAccount = async (e:any) => {
      e.preventDefault();
      await axios.patch(`/${url}/v1/member/update`, {
        "username": username.replace(" ",''),
        "user":  decoded.data?.id,
        "member_id": params.id,
        "mobile":mobile,
        "email": email,
        "date_from": date_from,
        "date_to": date_to,
        "comment": comment,
        "permissionlist":list
      }, 
      {
        headers: 
        {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
       if(result.data.status == "201") {
         alertnotify(result.data.message,"success");
         navigate('/members');
       }
      })
      .catch(error => {
        console.log("error", error);
        alertnotify(error.response.data.message,"error");
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

  return (
    <>
      <Box sx={{ marginTop: '0%', borderRadius: '.5rem', marginLeft: {md: '7%'}, width: {xs: '100%', md: '87%'} }}>
        <KeyboardBackspaceIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} onClick = {() => navigate('/members')} sx={{cursor: 'pointer'}} />
      </Box>
       <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', marginLeft: {md: '7%'}, background: 'white' , width: {lg: '80%'} }}>
         <Box sx={{ marginTop: '0%', borderRadius: '.5rem', width: {xs: '100%', md: '87%'} }}>
           <Typography variant="h6" gutterBottom>
            Edit Member
           </Typography>
           <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <label>UserName</label>
                <TextField
                  required
                  id="accountname"
                  name="accountname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  sx={{border: '1px solid silver' , borderRadius: '9px'}}
                />
              </Grid>
               <Grid item xs={12} sm={6} sx={{position: 'relative', zIndex: '1000'}}>
                <label>Permissions</label>
                {
                  defaultPermissions() &&
                  <Select 
                    options={permissions} 
                    name="name"
                    id="name"
                    isMulti
                    classNamePrefix="select"                  
                    defaultValue={defaultPermissions()}
                    onChange={(e) => HandlePermissionList(e)}
                    className="permission__Select"
                    placeholder="Choose permission"
                  />
                }
               </Grid>
               <Grid item xs={12} sm={6}>
               <label>Phone Number</label>
               <TextField
                 required
                 id="mobile"
                 name="mobile"
                 fullWidth
                 value={mobile}
                 onChange={(e) => setMobile(e.target.value)}
                 sx={{border: '1px solid silver' , borderRadius: '9px'}}
               />
               </Grid>
               <Grid item xs={12} sm={6}>
               <label>Email</label>
               <TextField
                 required
                 id="email"
                 name="email"
                 value={email}
                 fullWidth
                 onChange={(e) => setEmail(e.target.value)}
                 sx={{border: '1px solid silver' , borderRadius: '9px'}}
               />
               </Grid>
               <Grid item xs={12} sm={12}>
                 <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>Account Access Date Range</span>
                 <hr />
               </Grid>
               <Grid item xs={12} sm={6}>
                <label>From</label>
               <TextField
                 required
                 id="iban"
                 name="iban"
                 type="date"
                 value={moment(date_from).format('YYYY-MM-DD')}
                 fullWidth
                 onChange={(e) => setDateFrom(e.target.value)}
                 sx={{border: '1px solid silver' , borderRadius: '9px'}}
               />
               </Grid>
               <Grid item xs={12} sm={6}>
                <label>To</label>
               <TextField
                 required
                 id="iban"
                 name="iban"
                 type="date"
                 value={moment(date_to).format('YYYY-MM-DD')}
                 fullWidth
                 onChange={(e) => setDateTo(e.target.value)}
                 sx={{border: '1px solid silver' , borderRadius: '9px'}}
               />
               </Grid>
               <Grid item xs={12}>
                <label>Comments (Optional)</label>
                <TextField
                  id="address2"
                  name="address2"
                  fullWidth
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  multiline={true}
                  minRows="5"
                  autoComplete="shipping address-line2"
                  sx={{border: '1px solid silver' , borderRadius: '9px'}}
                />
               </Grid>
               <Grid item xs={12}>
                <Colorbtn color="primary" onClick={(e) => HandlEditMemberAccount(e)}>
                  <DoneOutlineOutlinedIcon sx={{ mr: 1 }} />
                  Submit
                </Colorbtn>
               </Grid>
           </Grid>
       </Box>
      </Toolbar>
    </>
  )
}
