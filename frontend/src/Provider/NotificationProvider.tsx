import io from 'socket.io-client';
import React, { createContext, useEffect, useState , useRef } from 'react';

const NotificationContext = createContext<string | null>(null);

export const NotificationProvider = ({ children }:any) => {
 
  const [notifications, setNotifications] = useState<any>([]);
  const [adminNotifications, setAdminNotifications] = useState<any>([]);

  const [ticketUserNotify, setUserTicketNotify] = useState<any>([]);
  const [adminTickNotify, setAdminTicketNotify] = useState<any>([]);

  let socket = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    // @ts-ignore
    socket.current = io(import.meta.env.VITE_SOCKET_URL);  
    // @ts-ignore
    socket.current.on('newNotification', (notification) => {
      // @ts-ignore
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    });
    // @ts-ignore
    socket.current.on('adminNotification', (notification) => {
    // @ts-ignore
    setAdminNotifications((prevNotifications) => [...prevNotifications, notification]);
   });

   // @ts-ignore
   socket.current.on('notifyToUserNewMsg', (notification) => {
    // @ts-ignore
    setUserTicketNotify((prevNotifications) => [...prevNotifications, notification]);
   });

   // @ts-ignore
   socket.current.on('notifyToAdminNewMsg', (notification) => {
    // @ts-ignore
    setAdminTicketNotify((prevNotifications) => [...prevNotifications, notification]);
   });

   return () => {
    // @ts-ignore
    socket.current.disconnect();
   };

  }, [socket.current]);

  return (
    // @ts-ignore
    <NotificationContext.Provider value={{ notifications , adminNotifications , ticketUserNotify , adminTickNotify , setAdminTicketNotify , setUserTicketNotify }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;