import React, { useContext } from 'react';
import NotificationContext from '../Provider/NotificationProvider';

const NotificationList = () => {

  const { notifications }:any = useContext(NotificationContext);

  return (
   <div>
     <h2>Notifications</h2>
     <ul>
     {
       notifications?.map((notification:any,index:any) => (
        <li key={index}>
          <div
            className={'html'}
            style={{ lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{
             __html: notification?.info,
            }}
          />
        </li>
       ))
     }
    </ul>
   </div>
  );
};

export default NotificationList;