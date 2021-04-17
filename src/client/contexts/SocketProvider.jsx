import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import env from '../environment.js';
import { useDataStore } from './DataStoreProvider.jsx';
import { useApi } from './ApiProvider.jsx';
import { useToast } from './ToastProvider.jsx';

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const { data } = useDataStore();
  const [socketAccessToken, setSocketAccessToken] = useState();
  const { toast } = useToast();

  const history = useHistory();
  const { refreshAccessToken } = useApi();

  useEffect(() => {
    setSocketAccessToken(data.accessToken);
  }, []);

  useEffect(() => {
    const newSocket = io(
      env.hostUrl,
      {
        extraHeaders: {
          Authorization: `Bearer ${socketAccessToken}`
        }
      }
    );
    console.log(`Socket connecting to ${env.hostUrl}`);
    setSocket(newSocket);
    newSocket.on('connect', (...args) => console.log('Socket connect', args));
    newSocket.io.on('reconnect', (retryCount) => {
      console.log('io reconnect', retryCount);
      data.toasts = data.toasts.filter(x => x.title !== 'Real-time connection lost');
      if (data.classroomMeta) {
        newSocket.emit(
          'join classroom',
          { classroomId: data.classroomMeta.id },
          (response) => {
            if (response.error) {
              console.log('Auto-rejoin classroom failed', response);
              toast('error', 'Failed to rejoin classroom automatically', response.error);
              data.classroomMeta = null;
              data.participants = [];
              data.messages = [];
              history.push('/classroom');
            }
          }
        );
        console.log('Attempting to reconnect to classroom');
      }
    });
    newSocket.io.on('reconnect_error', (...args) => {
      console.log('io reconnect error', args);
      toast('error', 'Real-time connection lost', "Can't connect to server. Please check your Internet connection.", true, true);
    });
    newSocket.on('disconnect', (...args) => console.log('Socket disconnect', args));
    newSocket.on('error', (err) => {
      toast('error', 'Error from server', err.message);
    });
    newSocket.on('connect_error', async (error) => {
      console.log('Socket connection error ', error);
      if (error.message === 'Email address not verified') {
        data.classroomMeta = null;
        data.participants = [];
        data.messages = [];
        toast('error', 'Connection failed', 'You need to verify your email address before joining or creating any classrooms');
        return history.push('/account');
      }
      if (error.message === 'jwt expired') {
        console.log('Refreshing jwt token for socket connection');
        const response = await refreshAccessToken();
        if (response.success) return setSocketAccessToken(response.response.data.accessToken);
        toast('error', 'Error when requsting for permission', response.response.message);
        data.classroomMeta = null;
        data.participants = [];
        data.messages = [];
        data.rememberMe = true;
        data.refreshToken = null;
        data.accessToken = null;
        data.user = null;
        return history.push('/auth');
      }
      if (error.message === 'jwt malformed') {
        data.classroomMeta = null;
        data.participants = [];
        data.messages = [];
        data.rememberMe = true;
        data.refreshToken = null;
        data.accessToken = null;
        data.user = null;
        return history.push('/auth');
      }
      return null;
    });

    return () => newSocket.close();
  }, [data.user, socketAccessToken]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
