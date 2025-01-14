import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import React, { useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useOutletContext } from "react-router-dom";
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { Closebtn, Colorbtn, Successbtn } from '../../Component/Button/ColorButton';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Avatar, Badge, Box, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Menu, MenuItem, Select, TextField } from '@mui/material';
import { Paper, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NotificationContext from '../../Provider/NotificationProvider';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { Table,Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
   event: React.MouseEvent<HTMLButtonElement>,
   newPage: number,
  ) => void;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function TablePaginationActions(props:TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  
  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };
  
  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };
  
  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };
  
  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
       {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
   );
}
  
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  
  const columns = [
    { id: 'ticketid', label: 'Ticket Id', minWidth: 170},
    { id: 'date', label: 'Date', minWidth: 170 },
    { id: 'username', label: 'Username', minWidth: 170 },
    { id: 'subject', label: 'Subject', minWidth: 100 },
    { id: 'message', label: 'Message', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'action', label: 'Action', minWidth: 120}
  ];
  
  function createData(id:any,ticketid:any,date:any,username:String,subject:String,message:any, status:any) {
    return {id,ticketid,date,username,subject,message,status };
  }
  
  const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'right',
    height: '100%',
    '& .ant-empty-img-1': {
      fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
      fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
      fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
      fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
      fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
      fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
  }));
  
  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>No Data found</Box>
      </StyledGridOverlay>
    );
  }

export default function Tickets() {

  const { adminTickNotify , setAdminTicketNotify }:any = useContext(NotificationContext);
  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [comment,setComment] = React.useState<any>('');
  const [history,setHistory] = React.useState<any>([]);
  const [status,setStatus] = React.useState<any>('all');
  const [currentWalletId,setCurrentWallletId] = React.useState<any>('');
  const [currentUserId,setCurrentUserId] = React.useState<any>('');
  const [currentTicketRequestStatus,setcurrentTicketRequestStatus] = React.useState<any>('');
  
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const handleClickOpen = (value: any,value2:any) => {
    setCurrentWallletId(value);
    setCurrentUserId(value2);
    setOpen3(true);
  };

  let rows = [];
  rows = [
    list?.map((item:any) => (
      createData(item?._id,item?.ticketId,item?.createdAt, item?.userDetails?.[0]?.name, item?.subject, item?.message, item?.status)
    ))
  ].sort((a, b) => (a.date < b.date ? -1 : 1));

  const rowsNew = rows[0] || [];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    console.log("New Page", event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    getListData();
  },[status]);

  const getListData = async() => {
    const statusVal = status == "all" ? '' : status;
    await axios.get(`/${url}/v1/admin/usertickets?status=${statusVal}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setList(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [moreVal,setMoreVal] = React.useState<any>('');
  const open2 = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    var valpo = event.currentTarget.value.split('-');
    setMoreVal(valpo[0]);
    setAnchorEl(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
   setOpen3(false);
  };

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

  const handleClickOpen3 = (id:any) => {
    // @ts-ignore
    const deleteElement = adminTickNotify.filter(e => e !== id);
    setAdminTicketNotify(deleteElement);
    HandleGetHistory(id);
    setCurrentWallletId(id);
    setTimeout(() => {
      setDisplayChat(true);
    },200);
  };

  const HandleGetHistory = async(id:any, flag = "") => {
    if(flag) {
      // @ts-ignore
      const deleteElement = adminTickNotify.filter(e => e !== id);
      setAdminTicketNotify(deleteElement);
    }
    await axios.get(`/${url}/v1/support/adminlist/${id}`,{
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
       setHistory(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message, "error");
    })
  }

  const HandleUpdateStatus = async(id:any,userid:any) => {
    await axios.patch(`/${url}/v1/support/updateStatus/${id}`,
    {
      status: currentTicketRequestStatus,
      comment: comment,
      user: userid
    }, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
        alertnotify(result.data.message, "Success");
        setOpen3(false);
        getListData();
        setAnchorEl(null);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message, "error");
    })
  }

  const handleClose3 = () => {
    setOpen3(false);
  };

  const handleClose5 = () => {
    setOpen5(false);
  }
  
  const messagesEndRef = React.useRef<null | HTMLDivElement>(null)
  const [message,setMessage] = React.useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const HandleMessage = (event:any,val1:any,val2:any) => {
    setMessage(event.target.value);
    if (event.key === 'Enter') {
      HandleReplySupport(val1,val2);
    }
  }

  const [displayChat,setDisplayChat] = React.useState<boolean>(false);  
  const [attachmentPreview,setAttachmentPreview] = React.useState<any>({preview: "", raw: ""});

  const HandleAttachment = (event:any) => {
    if(event?.target?.files.length) {
      const maxAllowedSize = 5 * 1024 * 1024;
      if (event?.target?.files[0]?.size > maxAllowedSize) {
      	// Here we can ask your users to load correct file
        alertnotify("Maximum 5mb size attachment are allowed to share", "error");
       	event.target.value = ''
      } else {
        setAttachmentPreview({
          preview: URL.createObjectURL(event.target.files[0]),
          raw: event.target.files[0]
        });
        setMessage(event.target.files[0]?.name+" Attachment");
      }
    }
  }

  const HandleReplySupport = async (id:any,userid:any) => {
    // if(!validate('message',message)) {
    await axios.post(`/${url}/v1/support/admin-replyticket`, {
      "support": id,
      "user":  userid,
      "message": message,
      "from": "Admin",
      "to": "User",
      "attachment": attachmentPreview?.raw
     }, 
     {
      headers: {
       'Content-Type':  'multipart/form-data',
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
     })
     .then(result => {
      if(result.data.status == "201") {
        setMessage('');
        setAttachmentPreview({preview: '', raw: ''});
        HandleGetHistory(id);
      }
     })
     .catch(error => {
       console.log("error", error);
      //  alertnotify(error.response.data.message,"error");
     })
    // }else{
    //   if(validate('subject',subject)){
    //     const result = validate('subject',subject);
    //   }
    //   if(validate('message',message)){
    //     const result = validate('message',message);
    //   }
    // }
  }

  return (
    <>
      <Box sx={{ marginLeft: {md: '7%'} , marginTop: {xs:'-10px',md:'12px'} , fontSize: '15px', width: {md: '91%'}}}>
        {
          !displayChat ?
          <Select value={status} onChange={(e) => setStatus(e.target.value)} sx={{width: '200px', marginBottom: '10px',border: `${theme ? '1px solid white':''}`}}>
          <MenuItem value="all" sx={{ color: `${theme ? 'white': 'black'}` }}>All Status</MenuItem>
          <MenuItem value="close" sx={{ color: `${theme ? 'white': 'black'}` }}>Close</MenuItem>
          <MenuItem value="open" sx={{ color: `${theme ? 'white': 'black'}` }}>Open</MenuItem>
          </Select>
          :
          null
        }
        {
          !displayChat ?
          <Grid sx={{display: 'flex',flexDirection: 'column',gap: '20px',borderRadius: '.5rem',fontWeight: '700',background: `${theme ? '#183153' : 'white'}`, color: `${theme ? 'white' : 'black'}`,padding: '3px'}}>
           {/* @ts-ignore */}
           <Table style={{ background: `${theme ? '' : '#F2F3FE'}`, color: `${theme ? 'white' : 'black'}` }}>
            <Thead>
              <Tr className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
               {columns.map((column) => (
              <Td
                key={column.id}
                width="220"
                style={{ padding: '12px', background: '#8657E5', color: 'white' }}
              >
              {column.label}
              </Td>
             ))}
            </Tr>
            </Thead>
            <TableBody>
              {(rowsPerPage > 0
               ? rowsNew?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
               : rowsNew
              ).map((row: any) => (
              <Tr key={row?.ticketid}>
                <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                {row?.ticketid}
               </Td>
               <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                {moment(row?.date).format("YYYY-MM-DD")}
               </Td>
               <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                {row?.username}
               </Td>
               <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                {row?.subject}
               </Td>
               <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                {row?.message}
               </Td>
               <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                {(row?.status === 'close') && <span style={{ border: `${theme ? '1px solid green' : '1px solid green'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'green' : ''}` }}>Close</span> }
                {(row.status === 'open') && <span style={{ border: `${theme ? '1px solid blue' : '1px solid blue'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'blue' : ''}` }}>Open</span> }
                {(row.status === 'pending') && <span style={{ border: `${theme ? '1px solid orange' : '1px solid orange'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'orange' : ''}` }}>Pending</span> }
               </Td>
               <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                 <Grid sx={{display: 'flex', flexDirection: 'row', gap: '12px'}}>
                  <Grid>
                    <Colorbtn onClick={() => handleClickOpen3(row?.id)}>View</Colorbtn>
                    {
                      adminTickNotify.includes(row?.id) ?
                      <Badge badgeContent={"New"} color="success"></Badge>
                      :
                      null
                    }
                  </Grid>
                  <Grid>                  
                    <Successbtn onClick={() => handleClickOpen(row?.id,row?.user)}>Update</Successbtn>   
                  </Grid>
                 </Grid>
              </Td>
              </Tr>
            ))}
            {rowsNew?.length == 0 && (
              <Tr>
                <Td colSpan={7}>
                  <CustomNoRowsOverlay />
                </Td>
              </Tr>
            )}
          </TableBody>
          <TableFooter sx={{ background: `${theme ? 'white': ''}`, color: 'black' }}>
            <Tr>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={7}
                count={rowsNew.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                  inputProps: {
                  'aria-label': 'rows per page',
                  },
                  native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </Tr>
           </TableFooter>
          </Table>
         </Grid>
        :
        null
      }

      {
        displayChat ?
        <Grid sx={{display: 'flex', marginTop: '20px', flexDirection: 'column', justifyContent: 'normal', gap: '20px'}}>
          <Grid onClick={() => setDisplayChat(!displayChat)}>
            <Colorbtn endIcon={<ArrowBackIcon />}></Colorbtn>
          </Grid>
          <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'normal', gap: '12px'}}>
            <Grid sx={{ color: `${theme ? 'white': 'black'}` }}>Chat History ({history?.[0]?.subject}) 
            {
              adminTickNotify.includes(history?.[0]?._id) ?
              <Successbtn onClick={() => HandleGetHistory(history?.[0]?._id,'1')} sx={{ marginLeft: '12px' }} endIcon={<ArrowDownwardIcon />}>New Unread Message</Successbtn>
              :
              null
            }
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid silver', padding: '6px 12px' , borderRadius: '12px', height: '410px', overflowY: 'scroll'}}>
            {
              history?.[0]?.chat?.map((item:any,index:number) => (
                item?.from == "Admin" ?
                <>
                  <Grid sx={{display: 'flex', flexDirection: 'row', gap: '12px'}} key={index}>
                    <Grid>
                      <Avatar>A</Avatar>
                    </Grid>
                    <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                      <Grid sx={{border: '1px solid #7269ef', color: 'white', background:'#7269ef', padding:'6px', height: '20px', width: '12px', borderTopLeftRadius: '100%'}}></Grid>
                        <Grid>
                          <Grid sx={{border: '1px solid #7269ef', color: 'white', background:'#7269ef', padding: '12px 14px', borderBottomRightRadius: '12px',  borderTopRightRadius: '12px' }}>
                          <>
                              {
                                item?.attachment ?
                                <>
                                  <Grid sx={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                    {
                                      !item?.attachment.includes("pdf") ?
                                      <>
                                        <Grid>
                                          {
                                            !item?.attachment.includes("doc") ?
                                            !item?.attachment.includes("xlsx") ?
                                              <img 
                                                src={`${import.meta.env.VITE_PUBLIC_URL}/${item?.attachment}`} 
                                                alt={item?.message} 
                                                height="200" 
                                                width="200" 
                                                onError={({ currentTarget }) => {
                                                  currentTarget.onerror = null; // prevents looping
                                                  currentTarget.src=`${import.meta.env.VITE_APP_URL}/otherdocs.png`;
                                                }}  
                                              />
                                              :
                                              <img 
                                                src={`${import.meta.env.VITE_APP_URL}/xls.jpg`} 
                                                alt={item?.message} 
                                                height="100" 
                                                width="100" 
                                              />
                                            :
                                            <img 
                                              src={`${import.meta.env.VITE_APP_URL}/docx.png`} 
                                              alt={item?.message} 
                                              height="100" 
                                              width="100" 
                                            />
                                          } 
                                        </Grid>
                                      </>
                                      :
                                      <>
                                        <Grid>
                                         <img src={`${import.meta.env.VITE_APP_URL}/pdf.png`} alt={item?.message} height="100" width="100" />
                                        </Grid>
                                      </>
                                    }
                                    <Grid>
                                      <a  target='_blank' href={`${import.meta.env.VITE_PUBLIC_URL}/${item?.attachment}`} style={{ textDecoration: 'none', color: 'white', background: 'purple',cursor: 'pointer',padding: '12px 12px'}}>View</a>
                                    </Grid>
                                  </Grid>
                                </>
                                :
                                item?.message
                              }
                            </>
                          </Grid>
                          <Grid sx={{ color: `${theme ? 'white': 'black'}` }}>
                           {moment(item?.createdAt).format('YYYY-MM-DD hh:mm:ss A')}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                  :
                  <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '12px'}} key={index}>
                    <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                      <Grid>
                        <Grid  sx={{border: '1px solid silver', color: 'white', background:'silver', padding: '12px 14px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px'  }}>
                        <>
                          {
                            item?.attachment ?
                            <>
                              <Grid sx={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                              {
                                !item?.attachment.includes("pdf") ?
                                <>
                                  <Grid>
                                  {
                                    !item?.attachment.includes("doc") ?
                                    !item?.attachment.includes("xlsx") ?
                                    <img 
                                      src={`${import.meta.env.VITE_PUBLIC_URL}/${item?.attachment}`} 
                                      alt={item?.message} 
                                      height="200" 
                                      width="200" 
                                      onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src=`${import.meta.env.VITE_APP_URL}/otherdocs.png`;
                                      }}  
                                    />
                                    :
                                    <img 
                                      src={`${import.meta.env.VITE_APP_URL}/xls.jpg`} 
                                      alt={item?.message} 
                                      height="100" 
                                      width="100" 
                                    />
                                    :
                                    <img 
                                      src={`${import.meta.env.VITE_APP_URL}/docx.png`} 
                                      alt={item?.message} 
                                      height="100" 
                                      width="100" 
                                    />
                                  } 
                                </Grid>
                              </>
                              :
                              <>
                                <Grid>
                                  <img src={`${import.meta.env.VITE_APP_URL}/pdf.png`} alt={item?.message} height="100" width="100" />
                                </Grid>
                              </>
                            }
                              <Grid>
                                <a target='_blank' href={`${import.meta.env.VITE_PUBLIC_URL}/${item?.attachment}`} style={{ textDecoration: 'none', color: 'white', background: 'purple',cursor: 'pointer',padding: '12px 12px'}}>View</a>
                              </Grid>
                            </Grid>
                         </>
                          :
                          item?.message
                        }
                        </>
                      </Grid>
                      <Grid sx={{ color: `${theme ? 'white': 'black'}` }}>
                       {moment(item?.createdAt).format('YYYY-MM-DD hh:mm:ss A')}
                      </Grid>
                      </Grid>
                      <Grid sx={{border: '1px solid silver', color: 'black', background:'silver', padding:'6px', height: '20px', width: '12px',  borderBottomRightRadius: '100%'}}></Grid>
                    </Grid>
                  <Grid>
                   <Avatar>U</Avatar>
                  </Grid>
                </Grid>
               ))
             }
             <div ref={messagesEndRef} />
    
             {/* Chat Input Box */}
               

              </Grid>
              
              {
                history?.[0]?.status == "open" ?
                <>
                  <Grid sx={{ borderRadius: '12px'}}>
                    <Grid container sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Grid item xs={12} md={10} sx={{ marginTop: {xs: "15px", md: '0px' } }}>
                        <TextField value={message} sx={{ border: `${theme ? '1px solid white': '1px solid transparent'}` }} onKeyDownCapture= {(e) => HandleMessage(e,history?.[0]?._id,history?.[0]?.user)} onChange={(e) => HandleMessage(e,'','')} fullWidth placeholder='Enter Message...' />
                      </Grid>
                       <Grid item xs={12} md={2}  sx={{ marginTop: {xs: "15px", md: '0px' } ,width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '6px', padding: '12px 14px'}}>
                        <Grid>
                          <Colorbtn
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            sx={{ height: '53px', marginTop: '-12px' }}
                          >
                            <AttachFileIcon  />
                            <VisuallyHiddenInput type="file" onChange={(e) => HandleAttachment(e)}/>
                          </Colorbtn>
                        </Grid>
                        <Grid>
                          <Colorbtn sx={{ height: '53px', marginTop: '-12px' }} onClick={() => HandleReplySupport(history?.[0]?._id,history?.[0]?.user)}><SendIcon /></Colorbtn>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
                :
                null
              }
              
            </Grid>
          </Grid>
          :
          null
        }  


      </Box> 

       {/**Update Status Dialog Box**/}
       <Dialog
        open={open3}
        onClose={handleClose3}
        fullWidth
        maxWidth="md"
       >
         <DialogTitle className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Update Support/Ticket Request</DialogTitle>
         <DialogContent>
          <label style={{ color: `${theme ? 'white': 'black'}` }}>Status</label>
          <Select sx={{ border: `${theme ? '1px solid white': ''}` }} fullWidth value={currentTicketRequestStatus} onChange={(e) => setcurrentTicketRequestStatus(e.target.value)} placeholder="Select Status">
            <MenuItem value="close" sx={{ color: `${theme ? 'white': ''}` }}>Close</MenuItem>
            <MenuItem value="open" sx={{ color: `${theme ? 'white': ''}` }}>Open</MenuItem>
          </Select>
          <label className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Reason</label>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="email"
            type="email"
            fullWidth
            rows={4}
            sx={{ border: `${theme ? '1px solid white': ''}` }} 
            variant="standard"
            onChange={(e) => setComment(e.target.value)}
            multiline={true}
          />
         </DialogContent>
         <DialogActions>
          <Closebtn onClick={handleClose3}>Cancel</Closebtn>
          <Colorbtn type="button" onClick={() => HandleUpdateStatus(currentWalletId,currentUserId)}>Save</Colorbtn>
         </DialogActions>
       </Dialog>
      {/**Update Status Dialog Box**/}



    </>
  )
}
