import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const navigate = useNavigate();
  
  const HandleNavigate = () => {
    if(localStorage.getItem('admintoken')) {
      navigate(`/admin/dashboard`);
    } else if(localStorage.getItem('token')) {
      navigate(`/home`);
    } else {
      navigate(`/`);
    }
  }

  return (
    <div id="main">
      <div className="box">
        <div className="box__ghost">
          <div className="symbol"></div>
          <div className="symbol"></div>
          <div className="symbol"></div>
          <div className="symbol"></div>
          <div className="symbol"></div>
          <div className="symbol"></div>
               
          <div className="box__ghost-container">
          <div className="box__ghost-eyes">
          <div className="box__eye-left"></div>
          <div className="box__eye-right"></div>
        </div>
        <div className="box__ghost-bottom">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
    </div>
    <div className="box__ghost-shadow"></div>
  </div>
  
    <div className="box__description">
      <div className="box__description-container">
       <div className="box__description-title">Whoops!</div>
       <div>Error 404</div>
       <div className="box__description-text">It seems like we couldn't find the page you were looking for</div>
      </div>
      <Button onClick={() => HandleNavigate()} className="box__button">Go back</Button>  
      </div>
    </div>
    </div>
  )
}
