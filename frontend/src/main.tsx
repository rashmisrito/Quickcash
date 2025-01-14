import './index.css';
import React, { Suspense } from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
const App = React.lazy(() => import('./App.tsx'));
import { NotificationProvider } from './Provider/NotificationProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename='/'>
  <div>
    <Suspense fallback={<div id="loader"></div>}>
      <NotificationProvider><App /></NotificationProvider>
    </Suspense>
  </div>
  </BrowserRouter>,
)
