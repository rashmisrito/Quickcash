// TechWizard Code
import axios from 'axios';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import React , {useEffect} from 'react';
import { Grid, MenuItem, Select, TextField, Card, CardHeader, CardContent, Divider  } from '@mui/material';
import { Colorbtn } from '../../Component/Button/ColorButton';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
// Download Liberary
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Email } from '@mui/icons-material';

export default function AdminKycDetails() {
  
  const [theme]:any = useOutletContext();
  const [details,setDetails] = React.useState<any>([]);
  const [currentWalletId,setCurrentWallletId] = React.useState<any>('');
  const [currentWalletRequestStatus,setcurrentWalletRequestStatus] = React.useState<any>('');
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [comment,setComment] = React.useState<any>('');
  const { id } = useParams();

  useEffect(() => {
    getKycData(id);
    setCurrentWallletId(id);
  },[id]);

  const getKycData = async (userid:any): Promise<any> => {
    await axios.get(`/${url}/v1/kyc/admingetData/${userid}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      console.log(result?.data?.data?.[0]?.documentType);
      if(result.data.status == 201) {
        setDetails(result?.data?.data);
        return result.data.data; 
      }
    })
    .catch(error => {
      console.log("error", error);
      return null;
    })
  }

  const HandleUpdateStatus = async(id:any) => {
    await axios.patch(`/${url}/v1/kyc/updateStatus/${id}`,{
      comment: comment,
      status: currentWalletRequestStatus,
    }, 
    {
      headers: 
      {
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
        navigate('/admin/kyc');
        alertnotify(result.data.message, "Success");
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message, "error");
    })
  }

  const handleDownload = async () => {
    getKycData(id);
    // Create PDF
    const pdf = new jsPDF();
    const margin = 10; 
    const pageWidth = pdf.internal.pageSize.getWidth();
    const fontSize = 10; 
    const rowHeight = 10; 
    const columnWidths = [50, 100];
    const tableStartY = 30; //

    const addTable = (startY: number) => {
      let y = startY;

      // Draw table header
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Field', margin, y);
      pdf.text('Details', margin + columnWidths[0], y);
      y += rowHeight;

      // Draw table rows
      pdf.setFont('helvetica', 'normal');
      const rows = [
        ['Email:', details?.[0]?.email?.toString() || ''],
        ['Primary Phone Number:', details?.[0]?.primaryPhoneNumber?.toString() || ''],
        ['Secondary Phone Number:', details?.[0]?.secondaryPhoneNumber?.toString() || ''],
        ['Document Type:', details?.[0]?.documentType?.toString() || ''],
        ['Document Number:', details?.[0]?.documentNumber?.toString() || ''],
        ['Address Document Type:', details?.[0]?.addressDocumentType?.toString() || '']
      ];

      rows.forEach(row => {
       pdf.text(row[0], margin, y);
       pdf.text(row[1], margin + columnWidths[0], y);
       y += rowHeight;
      });

      // Draw table borders
      const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, tableStartY, margin + tableWidth, tableStartY); // Top border
      pdf.line(margin, tableStartY, margin, y); // Left border
      pdf.line(margin + tableWidth, tableStartY, margin + tableWidth, y); // Right border
      pdf.line(margin, y, margin + tableWidth, y); // Bottom border

      // Draw horizontal lines between rows
      for (let i = 1; i < rows.length; i++) {
        pdf.line(margin, tableStartY + i * rowHeight, margin + tableWidth, tableStartY + i * rowHeight);
      }
    };

    // Set heading and add table
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    const headingText = 'KYC Details';
    const headingTextWidth = pdf.getStringUnitWidth(headingText) * 14 / pdf.internal.scaleFactor;
    const xPosition = (pageWidth - headingTextWidth) / 2;
    pdf.text(headingText, xPosition, margin + 14);

    addTable(margin + 14 + 10); // Add table below the heading
    // PDF Of Document Text
    const pdfBlob = pdf.output('blob');
    // Image Handler
    const zip = new JSZip();
    const documentImageFrontUrl = `${import.meta.env.VITE_PUBLIC_URL}/kyc/${details?.[0]?.documentPhotoFront}`;
    const documentImageBackUrl = `${import.meta.env.VITE_PUBLIC_URL}/kyc/${details?.[0]?.documentPhotoBack}`;
    const addressProofImageUrl = `${import.meta.env.VITE_PUBLIC_URL}/kyc/${details?.[0]?.addressProofPhoto}`;

    const documentImageFrontBloob = await axios.get(documentImageFrontUrl,{responseType:'blob'}).then(res =>res.data);
    zip.file(details?.[0]?.documentPhotoFront, documentImageFrontBloob);
    const documentImageBackBloob = await axios.get(documentImageBackUrl,{responseType:'blob'}).then(res =>res.data);
    zip.file(details?.[0]?.documentPhotoBack, documentImageBackBloob);
    const addressProofImageBloob = await axios.get(addressProofImageUrl,{responseType:'blob'}).then(res =>res.data);
    zip.file(details?.[0]?.addressProofPhoto, addressProofImageBloob);
    zip.file('document.pdf', pdfBlob);
    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    // Save the ZIP file
    saveAs(zipBlob, 'images.zip');
    console.log(details?.[0]?.email);
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

  const navigate = useNavigate(); 
      
  return(
  <>
    <Grid sx={{marginBottom: '12px'}}>
      <Colorbtn onClick={() => navigate(`/admin/kyc`)}>Back</Colorbtn>
    </Grid>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ color: `${theme ? 'white': 'black'}` }}>
          <CardHeader title={`Contact Details`}
            titleTypographyProps={{fontWeight: 'bold',color:'white'}}
            style={{background:"#673ab7"}}/>
           <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                          <label htmlFor="Email" style={{ color: `${theme ? 'white':'black'}` }}>Email</label>
                          <TextField fullWidth value={details?.[0]?.email} sx={{ border: `${theme ? '1px solid white':''}`, color: `${theme ? 'white': 'black'}` }} />
              </Grid>
              <Grid item xs={12} md={6}>
                          <label htmlFor="phone1">Contact Number</label>
                          <TextField fullWidth value={details?.[0]?.primaryPhoneNumber} sx={{ border: `${theme ? '1px solid white':''}` }} />
              </Grid>
              <Grid item xs={12} md={6}>
                          <label htmlFor="phone2">Secondary phone number</label>
                          <TextField fullWidth value={details?.[0]?.secondaryPhoneNumber} sx={{ border: `${theme ? '1px solid white':''}` }} />
              </Grid>
            </Grid>
           </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
                <CardHeader title={`Document Details`}
                  titleTypographyProps={{fontWeight: 'bold',color:'white'}}
                  style={{background:"#673ab7"}}/>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <label htmlFor="type of document" style={{ color: `${theme ? 'white': 'black'}` }}>Type of document</label>
                      <br />
                      <TextField fullWidth value={details?.[0]?.documentType} sx={{ border: `${theme ? '1px solid white': '1px solid black'}` }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <label htmlFor="Selected document number" style={{ color: `${theme ? 'white': 'black'}` }}>Selected document number</label>
                      <TextField fullWidth value={details?.[0]?.documentNumber} sx={{ border: `${theme ? '1px solid white': '1px solid black'}` }}/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <label htmlFor="Selected document number" style={{ color: `${theme ? 'white': 'black'}` }}>Upload document photo (FRONT)</label>
                      <br />
                      {/* @ts-ignore */} 
                      {
                        details?.[0]?.documentPhotoFront.includes("pdf") ?
                        <img className="zoomable-image" crossOrigin="anonymous" src={`${import.meta.env.VITE_APP_URL}/pdf.png`} width="120px" height="120px"/>
                        :
                        <>
                          <img 
                            className="zoomable-image"
                            src={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${details?.[0]?.documentPhotoFront}`}
                              width="100%" 
                              onError={({ currentTarget }) => {
                               currentTarget.onerror = null; // prevents looping
                               currentTarget.src=`${import.meta.env.VITE_APP_URL}/no-image.png`;
                              }}
                          />
                        </> 
                       }
                       {
                        details?.[0]?.documentPhotoFront?.includes("pdf") ?
                        <>
                          <Colorbtn sx={{cursor: 'pointer'}} fullWidth>
                            <a href={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${details?.[0]?.documentPhotoFront}`} target='_blank' style={{textDecoration: 'none', color: 'white'}} download>View Document</a>
                          </Colorbtn>
                        </>
                         :
                         null
                       }
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <label htmlFor="Selected document number" style={{ color: `${theme ? 'white': 'black'}` }}>Upload document photo (BACK)</label>
                        <br />
                        {/* @ts-ignore */} 
                        {
                          details?.[0]?.documentPhotoBack.includes("pdf") ?
                          <img className="zoomable-image" crossOrigin="anonymous" src={`${import.meta.env.VITE_APP_URL}/pdf.png`} width="120px" height="120px"/>
                          :
                          <>
                            <img 
                              className="zoomable-image"
                              src={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${details?.[0]?.documentPhotoBack}`}
                              width="100%" 
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src=`${import.meta.env.VITE_APP_URL}/no-image.png`;
                              }}
                            />
                          </> 
                        }
                        {
                          details?.[0]?.documentPhotoBack?.includes("pdf") ?
                          <>
                            <Colorbtn sx={{cursor: 'pointer'}} fullWidth>
                              <a href={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${details?.[0]?.documentPhotoBack}`} target='_blank' style={{textDecoration: 'none', color: 'white'}} download>View Document</a>
                            </Colorbtn>
                          </>
                          :
                          null
                        } 
                       </Grid>
                      </Grid>
                    </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
                <Card>
                    <CardHeader title={`Residential Address`}
                       titleTypographyProps={{fontWeight: 'bold',color:'white'}}
                       style={{background:"#673ab7"}}/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <label htmlFor="type of document" style={{ color: `${theme ? 'white': 'black'}` }}>Type of document</label>
                                <br />
                                <TextField fullWidth value={details?.[0]?.addressDocumentType} sx={{ border: `${theme ? '1px solid white': '1px solid black'}` }} />
                            </Grid>
                            <Grid item xs={12} md={6.1}>
                                <label htmlFor="Document">Document</label>
                                {/* @ts-ignore */} 
                                    <br />
                                {/* @ts-ignore */} 
                                {
                                    details?.[0]?.addressProofPhoto.includes("pdf") ?
                                    <img className="zoomable-image" crossOrigin="anonymous" src={`${import.meta.env.VITE_APP_URL}/pdf.png`} width="120px" height="120px"/>
                                    :
                                    <>
                                    <img 
                                    className="zoomable-image"
                                    src={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${details?.[0]?.addressProofPhoto}`}
                                    width="100%" 
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src=`${import.meta.env.VITE_APP_URL}/no-image.png`;
                                    }}
                                    />
                                </> 
                                }
                                {
                                    details?.[0]?.addressProofPhoto?.includes("pdf") ?
                                    <>
                                    <Colorbtn sx={{cursor: 'pointer'}} fullWidth>
                                        <a href={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${details?.[0]?.addressProofPhoto}`} target='_blank' style={{textDecoration: 'none', color: 'white'}} download>View Document</a>
                                    </Colorbtn>
                                    </>
                                    :
                                    null
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
      </Grid>
            
      <Grid item xs={12}>
              <Card>
                <CardHeader title={`${ details?.[0]?.primaryPhoneNumber && details?.[0]?.status != "completed" ? 'Update Section' : ''}`}
                  titleTypographyProps={{fontWeight: 'bold',color:'white'}}
                  style={{background:"#673ab7"}} />
                <CardContent>
                  <Grid container spacing={2}> 
                  {
                    details?.[0]?.primaryPhoneNumber && details?.[0]?.status != "completed" ?
                    <>
                      <Grid item xs={12}>
                        <label className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Status</label>
                        <Select fullWidth value={currentWalletRequestStatus} style={{border: '1px solid silver'}} onChange={(e) => setcurrentWalletRequestStatus(e.target.value)} placeholder="Select Status">
                           <MenuItem value="completed" sx={{ color: `${theme ? 'white': 'black'}` }}>Complete</MenuItem>
                           <MenuItem value="declined" sx={{ color: `${theme ? 'white': 'black'}` }}>Decline</MenuItem>
                        </Select>
                        <label className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Reason</label>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="email"
                            type="email"
                            placeholder='Reason'
                            fullWidth
                            sx={{border: '1px solid silver', color: `${theme ? 'white': 'black'}`}}
                            className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}
                            onChange={(e) => setComment(e.target.value)}
                            multiline={true}
                            rows={6}
                          />
                      </Grid>
                    </> 
                    :
                     null
                    }
                    <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row', gap: '12px'}}>
                    { details?.[0]?.primaryPhoneNumber && details?.[0]?.status != "completed" ?
                      <Grid>
                        <Colorbtn type="button" onClick={() => HandleUpdateStatus(currentWalletId)}>Save</Colorbtn>
                      </Grid>
                      :
                      null
                    }
                    <Grid>
                      <Colorbtn type="button" onClick={() => handleDownload()}>Download</Colorbtn>
                    </Grid>
                   </Grid>
                  </Grid>
                </CardContent>
              </Card>
      </Grid>

    </Grid>      
  </>
  );
}