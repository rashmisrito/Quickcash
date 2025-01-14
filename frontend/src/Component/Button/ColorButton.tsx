import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

const Colorbtn = styled(Button)<ButtonProps>(({ theme }) => ({
 color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#8657E5",
   '&:hover': {
  backgroundColor: "#8657E5",
 },
}));

const LandingLoginbtn = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
   borderRadius: '12px',
   fontSize: '12px',
   fontWeight: '600',
   backgroundColor: "#483594",
    '&:hover': {
      backgroundColor: "#483594",
    },
 }));

//  @ts-ignore
 const SpeaktoSalesbtn = styled(Button)<ButtonProps>(({ theme }) => ({
   borderRadius: '12px',
   fontSize: '12px',
   fontWeight: '600',
   color: '#4D3696',
   border: "1px solid #4E3696",
   background: "#FFFFFF",
    '&:hover': {
   backgroundColor: "#4D3696",
   color: 'white'
  },
 }));

const Closebtn = styled(Button)<ButtonProps>(({ theme }) => ({
 color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "black",
   '&:hover': {
  backgroundColor: "black",
 },
}));

const Successbtn = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
   backgroundColor: "#229954",
    '&:hover': {
   backgroundColor: "#52BE80",
  },
}));

const Dangerbtn = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
   backgroundColor: "red",
    '&:hover': {
   backgroundColor: "red",
  },
}));

const Processingbtn = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
   backgroundColor: "#81D4FA",
    '&:hover': {
   backgroundColor: "#81D4FA",
  },
}));

const DashboardItemBtn = styled(Button)<ButtonProps>(({}) => ({
  color: '#1111c6',
  backgroundColor: "#0c75e92b",
    '&:hover': {
   backgroundColor: "#1111c6",
   color: 'white'
  },
 }));

 const DisabledBtn = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
   backgroundColor: "silver",
    '&:hover': {
   backgroundColor: "silver",
  },
}));

export { Colorbtn , Closebtn, Successbtn, Dangerbtn , Processingbtn , DashboardItemBtn ,LandingLoginbtn,SpeaktoSalesbtn ,DisabledBtn }
