import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import React, { useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useOutletContext } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { Colorbtn } from '../../Component/Button/ColorButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Box, Chip, Grid, Menu, MenuItem, TextField } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Paper, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../../Hooks/Admin/useUser';
import ListItemText from '@mui/material/ListItemText';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
    { id: 'date', label: 'Date', minWidth: 170 },
    { id: 'message', label: 'Message', minWidth: 100 },
    { id: 'notifytype', label: 'Type', minWidth: 100 },
    { id: 'action', label: 'Actions', minWidth: 120}
  ];
  
  function createData(id:any,date:any,message:String,notifyType:any) {
    return { id,date,message,notifyType };
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

export default function AdminNotifications() {

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const { userList } = useUser();

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      // ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }], 
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
    ],
  };

  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();
  const [status,setStatus] = React.useState<any>('all');
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  useEffect(() => {
   getListData(status);
  },[status]);

  const [value, setValue] = React.useState('');

  const getListData = async(status:any) => {
    const stsUpdated = status == "all" ? '' : status;
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    await axios.get(`/${url}/v1/admin/notification/list/${accountId?.data?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  let rows = [];
  rows = [
    list?.map((item:any) => (
     createData(item?._id,item?.createdAt,item?.message,item?.notifyType)
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

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id:any) => {
   setOpen(true);
   getKycData(id);
  };

   const [user,setUser] = React.useState<any>('');
   const [tags,setTags] = React.useState<any>('');
   const [title,setTitle] = React.useState<any>('');
   const [details,setDetails] = React.useState<any>([]);
   const [attachment,setAttachment] = React.useState<any>({ preview: "", raw: "" });

   const getKycData = async (userid:any) => {
    await axios.get(`/${url}/v1/admin/notification//admingetData/${userid}`, {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
     }
    })
    .then(result => {
     console.log(result?.data?.data?.[0]?.documentType);
     if(result.data.status == 201) {
      setDetails(result?.data?.data);
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

  const [displayNotificationScreen,setDisplayNotificationScreen] = React.useState<boolean>(false);

  const HandleSaveNotification = async () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    await axios.post(`/${url}/v1/admin/notification/add`, 
    {
      user: user ? user : accountId?.data?.id,
      title: title,
      tags: tags,
      attachment: attachment?.raw,
      message: value,
      notifyFrom: 'admin',
      notifyType: user ? 'user' : 'all',
    },
    {
      headers: {
        'Content-Type':  'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result?.data?.status == 201) {
       setTitle('');
       setTags('');
       setValue("");
       setUser('');
       setDisplayNotificationScreen(false);
       setAttachment({preview: "", raw: ""});
       alertnotify(result?.data?.message,"Success");
       getListData(status);
      }
    })
    .catch(error => {
      console.log(error);
      alertnotify(error.response.data.message, "error");
    })
  }

  const handleChangeImageBack = (e:any) => {
    if(e.target.files.length) {
      setAttachment({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  function getDetails(val:any) {
    if(val) {
      var newVal = val[0].split(',');
      return newVal
    }
  }

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <Box sx={{ marginLeft: {md: '7%'} ,background: `${theme ? '#183153' : 'white'}`, color: `${theme ? 'white' : 'black'}`, padding: {xs:'0px',md:'12px 14px'}, marginTop: {xs:'-12px',md:'12px'} , fontSize: '15px', width: {md: '91%'}}}>
        <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',  gap: '12px'}}>
          <Grid>
          {
            !displayNotificationScreen ?
            <Colorbtn onClick={() => setDisplayNotificationScreen(!displayNotificationScreen)}>Create Notification</Colorbtn>
            :
            <Colorbtn onClick={() => setDisplayNotificationScreen(!displayNotificationScreen)}>Back</Colorbtn>
          }
          </Grid>
        </Grid>
        {
          !displayNotificationScreen ?
          <>
            <Grid sx={{display: 'flex',flexDirection: 'column',gap: '20px',borderRadius: '.5rem',color: 'black',fontWeight: '700',padding: '3px 3px'}}>
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
                    <Tr key={row?.date}>
                      <Td scope="row">
                        {moment(row?.date).format("YYYY-MM-DD")}
                      </Td>
                        <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                          <div
                            className={'html'}
                            style={{ lineHeight: 1.6 }}
                            dangerouslySetInnerHTML={{
                              __html: row?.message,
                            }}
                          />
                        </Td>
                        <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                          {(row?.notifyType === 'general') || (row?.notifyType == 'all') && <span style={{ border: `${theme ? '1px solid green' : '1px solid green'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'green' : ''}` }}>General</span> }
                          {(row?.notifyType === 'user') && <span style={{ border: `${theme ? '1px solid green' : '1px solid green'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'green' : ''}` }}>User Wise</span>}
                          {(row?.notifyType === 'cancelled') && <span style={{ border: `${theme ? '1px solid red' : '1px solid red'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'red' : ''}` }}>Cancelled</span> }
                          {(row?.notifyType === 'declined') && <span style={{ border: `${theme ? '1px solid red' : '1px solid red'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'red' : ''}` }}>Decline</span> }
                          {(row?.notifyType === 'transaction') && <span style={{ border: `${theme ? '1px solid green' : '1px solid green'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'green' : ''}` }}>Transaction</span> }
                          {(row?.notifyType === 'pending' || row?.notifyType == "Pending") && <span style={{ border: `${theme ? '1px solid orange' : '1px solid orange'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'orange' : ''}` }}>Pending</span> }
                        </Td>
                        <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                          <IconButton
                            aria-label="more"
                            value={`${row?.id}-${row?.status}-${row?.recurring}-${row?.invoice_number}`}
                            id={`long-button${row?.id}`}
                            aria-controls={open ? `long-menu${row?.id}` : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            sx={{ color: `${theme ? 'white': 'black'}` }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            key={row?.id}
                            id={`long-menu${row?.id}`}
                            MenuListProps={{
                            'aria-labelledby': `long-button${row?.id}`,
                            }}
                            anchorEl={anchorEl}
                            open={open2}
                            onClose={handleClose2}
                          >
                            <MenuItem onClick={() => handleClickOpen(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>View</span></MenuItem>
                          </Menu>
                        </Td>
                       </Tr>
                      ))}
                        {rowsNew?.length == 0 && (
                          <Tr>
                            <Td colSpan={5}>
                              <CustomNoRowsOverlay />
                            </Td>
                          </Tr>
                        )}
                      </TableBody>
                      <TableFooter sx={{ background: `${theme ? 'white': ''}`, color: 'black' }}>
                        <Tr>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={5}
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
                        </Tr>
                      </TableFooter>
                    </Table>
            </Grid>
          </>
          :
          <>
            <Box sx={{marginTop: '12px'}}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <label>User (Optional)</label>
                  <Select fullWidth name="user" sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => setUser(e.target.value)}>
                  {
                    userList?.map((item:any,index:number) => (
                      <MenuItem key={index} value={item?._id} sx={{ color: `${theme ? 'white': ''}` }}>
                        {item?.name}
                      </MenuItem> 
                    ))
                  }
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <label>Title</label>
                  <TextField fullWidth value={title} sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => setTitle(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <label>Tags</label>
                  <TextField fullWidth value={tags} sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => setTags(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <label>Upload Image</label>
                  <TextField type='file' name="files[]" fullWidth onChange={handleChangeImageBack} />
                  {
                    attachment?.preview ? (
                    <img 
                      src={attachment.preview} 
                      alt="dummy" 
                      width="300px" 
                      height="200px"
                      style={{marginBottom: "12px"}}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src=`${import.meta.env.VITE_APP_URL}/otherdocs.png`;
                      }}
                    />
                    )
                    :
                    null
                  }
                </Grid>
                <Grid item xs={12}>
                  <label>Content</label>
                  <ReactQuill value={value} onChange={ setValue } modules={modules} style={{ color: 'black' }} />
                </Grid>
                <Grid item xs={12}>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', gap: '12px', justifyContent: 'space-between' }}>
                    <Grid><Colorbtn onClick={() => HandleSaveNotification()}>Send</Colorbtn></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </>
        }
     </Box> 

      <Dialog
        fullWidth
        maxWidth={'xl'}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle sx={{ color: `${theme ? 'white': 'black'}` }}>Notification Details</DialogTitle>
        <DialogContent sx={{ color: `${theme ? 'white': 'black'}` }}>
         <table border={1} width="100%" style={{borderCollapse: 'collapse'}}>
           <tbody>
            <tr>
              <td style={{ padding: '12px 14px' }}>Date</td><td style={{ padding: '12px 14px' }}>{moment(details?.[0]?.createdAt).format("YYYY-MM-DD hh:mm:ss A")}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px 14px' }}>Title</td><td style={{ padding: '12px 14px' }}>{details?.[0]?.title}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px 14px' }}>Message</td><td style={{ padding: '12px 14px' }}>
                <div
                  className={'html'}
                  style={{ lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{
                   __html: details?.[0]?.message,
                  }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px 14px' }}>Message Type</td><td style={{ padding: '12px 14px' }}>{details?.[0]?.notifyType}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px 14px' }}>Tags</td><td style={{ padding: '12px 14px' }}>
              {getDetails(details?.[0]?.tags)?.map((item:any,indx:any) => (
                <span key={indx} style={{ background: '#0288D1', color: 'white', padding: '6px', marginLeft: '2px' }}>#{item}</span>
              ))}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px 14px' }}>Attachment</td>
              <td style={{ padding: '12px 14px' }}>
              <>
              {
                details?.[0]?.attachment ?
                <>
                  <Grid sx={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {
                    !details?.[0]?.attachment.includes("pdf") ?
                    <>
                      <Grid>
                      {
                        !details?.[0]?.attachment.includes("doc") ?
                        !details?.[0]?.attachment.includes("xlsx") ?
                        <img 
                          src={`${import.meta.env.VITE_PUBLIC_URL}/notifications/${details?.[0]?.attachment}`} 
                          alt={details?.[0]?.title} 
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
                          alt={details?.[0]?.title} 
                          height="100" 
                          width="100" 
                       />
                        :
                       <img 
                         src={`${import.meta.env.VITE_APP_URL}/docx.png`} 
                         alt={details?.[0]?.title} 
                         height="100" 
                         width="100" 
                       />
                      } 
                    </Grid>
                   </>
                    :
                   <>
                    <Grid>
                      <img src={`${import.meta.env.VITE_APP_URL}/pdf.png`} alt={details?.[0]?.title} height="100" width="100" />
                    </Grid>
                  </>
                  }
                  <Grid>
                    <a target='_blank' href={`${import.meta.env.VITE_PUBLIC_URL}/notifications/${details?.[0]?.attachment}`} style={{ textDecoration: 'none', color: 'white', background: 'purple',cursor: 'pointer',padding: '12px 12px'}}>View</a>
                  </Grid>
                 </Grid>
                </>
                  :
                  "N/A"
                }
               </> 
              </td>
            </tr>
           </tbody>
         </table>
        </DialogContent>
        <DialogActions>
          <Colorbtn onClick={handleClose}>Close</Colorbtn>
        </DialogActions>
      </Dialog>

    </>
  )
}
