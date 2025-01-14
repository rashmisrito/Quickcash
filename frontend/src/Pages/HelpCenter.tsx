import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';
import useValidation from '../Hooks/useValidation';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useOutletContext } from "react-router-dom";
import DialogTitle from '@mui/material/DialogTitle';
import React, { useContext, useEffect } from 'react';
import LastPageIcon from '@mui/icons-material/LastPage';
import DialogContent from '@mui/material/DialogContent';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NotificationContext from '../Provider/NotificationProvider';
import { Thead, Tr, Td } from 'react-super-responsive-table';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Closebtn, Colorbtn, Successbtn } from '../Component/Button/ColorButton';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { Table,TableBody,TableFooter,TablePagination,Box,Grid,IconButton,TextField,FormControl,FormHelperText,Chip,Avatar,Badge,Typography,TableContainer, Paper, TableCell, TableRow, TableHead } from '@mui/material';

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
    { id: 'createdAt', label: 'Created At', minWidth: 100 },
    { id: 'subject', label: 'Subject', minWidth: 100 },
    { id: 'message', label: 'Message', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'action', label: 'Action', minWidth: 100 }
  ];
  
  function createData(id:any,ticketid:any,createdAt:any,subject:String,message:String,status: any) {
    return { id,ticketid,createdAt,subject,message,status};
  }
  
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

export default function HelpCenter() {
  const { errors, validate } = useValidation();
// ticketUserNotify , adminTickNotify
  const [open, setOpen] = React.useState(false);
  const { ticketUserNotify , setUserTicketNotify }:any = useContext(NotificationContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenreply = (val:any) => {
    // @ts-ignore
    const deleteElement = ticketUserNotify.filter(e => e !== val);
    setUserTicketNotify(deleteElement);
    getById(val);
    setTimeout(() => {
      setDisplayChat(true);
    },200);
  };

  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  useEffect(() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getTransactionsList(accountId.data.id);
  },[]);

  const getTransactionsList = async(id:any) => {
    await axios.get(`/${url}/v1/support/list/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.status == 201) {
        setList(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }  

  const [listDetails,setListDetails] = React.useState<any>([]);

  const messagesEndRef = React.useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom();
  }, [listDetails]);

  const getById = async(id:any, flag="") => {
    if(flag) {
      // @ts-ignore
      const deleteElement = ticketUserNotify.filter(e => e !== id);
      setUserTicketNotify(deleteElement);
    }
    await axios.get(`/${url}/v1/support/listbyid/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setListDetails(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }  

  let rows = [];

  rows = [
    list?.map((item:any) => (
      createData(item?._id,item?.ticketId,item?.createdAt, item?.subject, item?.message, item?.status)
    ))
  ].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

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
    console.log("Rows Per Page", event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    console.log("rows p p", rowsPerPage);
  };

  const [subject,setSubject] = React.useState('');
  const [message,setMessage] = React.useState('');

  const HandleSupport = async () => {
  if(!validate('subject',subject) && !validate('message',message)){
  const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
  await axios.post(`/${url}/v1/support/add`, {
    "user":  accountId?.data?.id,
    "subject": subject,
    "message": message,
    "status": "Pending"
   }, 
   {
    headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
   })
   .then(result => {
    if(result.data.status == "201") {
      setOpen(false);
      alertnotify(result.data.message,"success");
      setSubject('');
      setMessage('');
      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      getTransactionsList(accountId.data.id);
    }
   })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
   })
  }else{
    if(validate('subject',subject)){
      const result = validate('subject',subject);
    }
    if(validate('message',message)){
      const result = validate('message',message);
    }
  }
  }

  const HandleReplySupport = async (id:any,userid:any) => {
    if(!validate('message',message)) {
    await axios.post(`/${url}/v1/support/replyticket`, {
      "support": id,
      "user":  userid,
      "message": message,
      "from": "User",
      "to": "Admin",
      "attachment": attachmentPreview?.raw
     }, 
     {
      headers: {
       'Content-Type':  'multipart/form-data',
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
     })
     .then(result => {
      if(result.data.status == "201") {
        setMessage('');
        setAttachmentPreview({preview: '', raw: ''});
        const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
        getTransactionsList(accountId.data.id);
        getById(id);
      }
     })
     .catch(error => {
       console.log("error", error);
       //alertnotify(error.response.data.message,"error");
     })
    } else {
      if(validate('subject',subject)){
        const result = validate('subject',subject);
      }
      if(validate('message',message)){
        const result = validate('message',message);
      }
    }
  }

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
  const handleBlur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, value);
    console.log(returnValue);
  };

  return (
    <>
      <Box sx={{ marginTop: {xs:'0px', md:'12px'} , fontSize: '15px' }}>
        {
          !displayChat ?
          <>
            <Grid sx={{display: 'flex', flexDirection: 'row' , flexWrap: 'wrap', justifyContent: 'space-between', gap: '10px'}}>
              <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ fontSize: '22px' }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ color: {xs:`${theme ? 'white': 'black'}`, sm:`${theme ? 'white': 'black'}`} }}>
                  <Link underline="hover" href="/home" sx={{ color: {xs:`${theme ? 'white': 'black'}`, sm:`${theme ? 'white': 'black'}`} }}>
                    Home
                  </Link>
                  <Typography component={'span'} sx={{ color: {xs:`${theme ? 'white': 'black'}`, sm:`${theme ? 'white': 'black'}`} }}>Support</Typography>
                </Breadcrumbs>
              </Grid>
              <Grid>
                <Colorbtn variant="outlined" onClick={handleClickOpen} sx={{marginBottom: '12px'}}>
                  Create Ticket
                </Colorbtn>
              </Grid>
           </Grid>
            <Grid sx={{display: 'flex', order: '1', flexDirection: 'column' , gap: '10px',borderRadius: '.5rem', color: 'black', fontWeight: '700', border: `${theme ? '2px solid lightblue' : '1px solid transparent'}`, background: `${theme ? '#183153' : 'white'}` , padding: {xs:'10px', md:'10px 12px'}}}>
              <div className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Ticket History ({rowsNew?.length})</div>
              <Grid>
              <Box sx={{ overflow: "auto" }}>
               <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                  
                {/* @ts-ignore   */}
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                  <TableHead sx={{ background: '#673ab7', color: 'white' }}>
                    <TableRow className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                      {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      width="220"
                      style={{ padding: '12px', background: '#8657E5', color: 'white' }}
                    >
                      {column.label}
                    </TableCell>
                    ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? rowsNew.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : rowsNew
                    ).map((row:any) => (
                      <TableRow key={row?.createdAt}>
                        <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                          {row?.ticketid}
                        </TableCell>
                        <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                          {moment(row?.createdAt).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                         {row?.subject}
                        </TableCell>
                        <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                          {row?.message?.length > 20 ? row?.message?.substring(0,30)+'...' : row?.message}
                        </TableCell>
                        <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                          {row?.status == "close" && <Chip label="Close" sx={{ background: `${theme ? 'green' : ''}`, color: `${theme ? 'white' : 'green'}`, border: `${theme ? '1px solid green': '1px solid green'}` }} variant="outlined" />}
                          {row?.status == "open" && <Chip label="Open" sx={{ background: `${theme ? 'blue' : ''}`, color: `${theme ? 'white' : 'blue'}`, border: `${theme ? '1px solid blue': '1px solid blue'}` }} variant="outlined" />}
                          {row?.status == "pending" && <Chip label="Pending" sx={{ background: `${theme ? 'red' : ''}`, color: `${theme ? 'white' : 'red'}`, border: `${theme ? '1px solid red': '1px solid red'}` }} variant="outlined" />}
                        </TableCell>
                        <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                          <Colorbtn onClick={() => handleClickOpenreply(row?.id)}>View</Colorbtn>
                          {
                            ticketUserNotify.includes(row?.id) ?
                            <Badge badgeContent={"New"} color="success"></Badge>
                              :
                              null
                          }
                         </TableCell>
                        </TableRow>
                       ))}
                       {rowsNew?.length == 0 && (
                         <TableRow>
                           <TableCell colSpan={5}>
                             <CustomNoRowsOverlay />
                           </TableCell>
                         </TableRow>
                       )}
                  </TableBody>
                  <TableFooter sx={{ background: `${theme ? 'white': ''}` }}>
                    <TableRow>
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
                        sx={{ color: 'black' }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
                </TableContainer>
                </Box>
                </Box>
              </Grid>
            </Grid>
          </>
          :
          null
        }

        {/* Ticket Chat History */}
        {
          displayChat ?
          <Grid sx={{display: 'flex', marginTop: '20px', flexDirection: 'column', justifyContent: 'normal', gap: '20px'}}>
            <Grid onClick={() => setDisplayChat(!displayChat)}>
              <Colorbtn startIcon={<KeyboardBackspaceIcon />}>
              </Colorbtn>
            </Grid>
            <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'normal', gap: '12px'}}>
              <Grid>Chat History ({listDetails?.[0]?.subject})  
              {
                ticketUserNotify.includes(listDetails?.[0]?._id) ?
                <Successbtn onClick={() => getById(listDetails?.[0]?._id,'1')} sx={{ marginLeft: '12px' }} endIcon={<ArrowDownwardIcon />}>New Unread Message</Successbtn>
                :
                null
              }
              </Grid>
              <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid silver', padding: '16px 12px' , borderRadius: '12px', height: '410px', overflowY: 'scroll'}}>
              {
                listDetails?.[0]?.chat?.map((item:any,index:number) => (
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
                          <Grid sx={{border: '1px solid silver', color: 'white', background:'silver', padding: '12px 14px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px'  }}>
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
                      <Grid sx={{border: '1px solid silver', color: 'black', background:'silver', padding:'6px', height: '20px', width: '12px',  borderBottomRightRadius: '100%'}}></Grid>
                      </Grid>
    
                      <Grid>
                        <Avatar>U</Avatar>
                      </Grid>
                      
                    </Grid>
                  ))
                }
                
                {/* {
                  ticketUserNotify == listDetails?.[0]?.user ?
                  <>
                    <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Successbtn onClick={() => getById(listDetails?.[0]?._id,'1')}>New Unread Message</Successbtn>
                    </Grid>
                  </>
                  :
                  null
                } */}
                
                <div ref={messagesEndRef} />
                {/* <Divider /> */}

                {/* Chat Input Box */}
               

              </Grid>
              
              {
                listDetails?.[0]?.status == "open" ?
                <>
                  {/* <Grid sx={{ border: '2px solid black'}}> */}
                    <Grid container sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Grid item xs={12} md={10} sx={{ marginTop: {xs: "15px", md: '0px' } }}>
                        <TextField sx={{ width: '100%', background: `${theme ? '#183153': 'white'}`, border: '1px solid white' }} value={message} onKeyDownCapture= {(e) => HandleMessage(e,listDetails?.[0]?._id,listDetails?.[0]?.user)} onChange={(e) => HandleMessage(e,'','')} placeholder='Enter Message...' />
                      </Grid>
                      <Grid item xs={12} md={2} sx={{marginTop: {xs: "15px", md: '0px' } , width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '6px', padding: '12px 14px'}}>
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
                          <Colorbtn sx={{ height: '53px', marginTop: '-12px' }} onClick={() => HandleReplySupport(listDetails?.[0]?._id,listDetails?.[0]?.user)}><SendIcon /></Colorbtn>
                        </Grid>
                      </Grid>
                    </Grid>
                  {/* </Grid> */}
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

      {/* This modal box is used for Create new support ticket */}

      <Dialog
        open={open}
        fullWidth
        onClose={handleClose}
      >
        <DialogTitle sx={{ color: `${theme ? 'white': 'black'}` }}>Create Ticket</DialogTitle>
        <DialogContent>
          <Grid sx={{display: 'flex',flexDirection: 'row' , background: `${theme ? '#183153': 'white'}` , padding: '10px 12px'}}>
            <form>
              <label style={{ color: `${theme ? 'white': 'black'}`  }}>Subject</label>
              <TextField
                name='subject'
                type="text"
                InputLabelProps={{
                 shrink: true,
                }}
                sx={{ border: `${theme ? '1px solid white': ''}` }}
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onBlur={handleBlur}
                error={!!errors.subject}
                helperText={errors.subject}
              />
              <FormControl fullWidth error={!!errors.message} >
              <BaseTextareaAutosize 
                aria-label="minimum height" 
                minRows={10} 
                name='message'
                value={message}
                placeholder="Message" 
                style={{ background: `${theme ? '#183153': 'white'}` , color: `${theme ? 'white': 'black'}` , width: '100%' , marginTop: '10px',borderColor: errors.message ? '#d32f2f' : '#c4c4c4'}}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={handleBlur}
              />
              {errors.message && <FormHelperText>{errors.message}</FormHelperText>}
              </FormControl>
              <Colorbtn onClick={() => HandleSupport()} sx={{marginTop: '12px', marginRight: '12px'}}>Post Ticket</Colorbtn>
              <Closebtn onClick={() => handleClose()} sx={{marginTop: '12px'}}>Close</Closebtn>
            </form>
          </Grid>
        </DialogContent>
      </Dialog>   

    </>
  )
}
